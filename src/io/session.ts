// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { BOOK_MAX_PAGES, normalisePageCount, normalisePerPage } from "../core/book";
import { clampCrop, isDefaultCrop } from "../core/crop";
import { normaliseSplit } from "../core/split";
import {
  type LayoutStyle,
  NO_SPAN,
  type PhotoCrop,
  type PhotoSpan,
  type PosterSettings,
} from "../core/types";

/**
 * Keeps the editor's state in this browser (IndexedDB), so a refresh brings back the
 * photos, their requested sizes and the settings. Nothing leaves the device. Photos are
 * stored as files, which `localStorage` (about 5 MB, text only) cannot hold.
 */

export interface SavedPhoto {
  /** `fileKey()` of the stored file. */
  key: string;
  span: PhotoSpan;
  /** Absent for a photo shown the plain way. */
  crop?: PhotoCrop;
  /** In a book: the page the photo is on (0 for the first). */
  page?: number;
}

export interface SavedSession {
  v: 1;
  /** In the order they were added, which the layout depends on. */
  photos: SavedPhoto[];
  seed: number;
  columns: number | undefined;
  /** Mosaic or Gallery; absent in work saved before Gallery existed (that was Mosaic). */
  layoutStyle?: LayoutStyle;
  /** Present when the work is a book: how many pages, and how many photos a page takes. */
  book?: { pages: number; perPage: number };
  settings: PosterSettings;
}

const DB_NAME = "collage-creator";
const FILES = "files";
const META = "meta";
const SESSION_KEY = "session";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(FILES);
      request.result.createObjectStore(META);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("could not open storage"));
  });
}

function wait<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("storage request failed"));
  });
}

function finished(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("storage transaction failed"));
    tx.onabort = () => reject(tx.error ?? new Error("storage transaction aborted"));
  });
}

/**
 * A stored photo. The bytes are kept as a plain buffer, not as a `File`: some browsers (Safari in
 * private windows, and the WebKit used in tests) refuse to store files in IndexedDB.
 */
interface StoredFile {
  name: string;
  type: string;
  lastModified: number;
  data: ArrayBuffer;
}

/** Store the session. Files already stored are left alone; files no longer used are deleted. */
export async function saveSession(
  session: SavedSession,
  files: ReadonlyMap<string, File>,
): Promise<void> {
  const db = await open();
  try {
    const stored = new Set(
      (await wait(db.transaction(FILES, "readonly").objectStore(FILES).getAllKeys())).map(String),
    );
    // Read the new files first: a transaction closes if it waits on anything but its own requests.
    const added: [string, StoredFile][] = [];
    for (const [key, file] of files) {
      if (stored.has(key)) continue;
      added.push([
        key,
        {
          name: file.name,
          type: file.type,
          lastModified: file.lastModified,
          data: await file.arrayBuffer(),
        },
      ]);
    }
    const tx = db.transaction([FILES, META], "readwrite");
    const store = tx.objectStore(FILES);
    for (const key of stored) if (!files.has(key)) store.delete(key);
    for (const [key, record] of added) store.put(record, key);
    tx.objectStore(META).put(session, SESSION_KEY);
    await finished(tx);
  } finally {
    db.close();
  }
}

/** The stored session and its files, or null if there is none. */
export async function loadSession(defaults: PosterSettings): Promise<{
  session: SavedSession;
  files: Map<string, File>;
} | null> {
  const db = await open();
  try {
    const tx = db.transaction([FILES, META], "readonly");
    const raw = await wait(tx.objectStore(META).get(SESSION_KEY));
    const session = checkSession(raw, defaults);
    if (!session) return null;
    const files = new Map<string, File>();
    for (const { key } of session.photos) {
      const record = (await wait(tx.objectStore(FILES).get(key))) as
        | Partial<StoredFile>
        | undefined;
      if (record?.data instanceof ArrayBuffer && typeof record.name === "string") {
        files.set(
          key,
          new File([record.data], record.name, {
            type: record.type ?? "",
            lastModified: record.lastModified ?? 0,
          }),
        );
      }
    }
    return { session, files };
  } finally {
    db.close();
  }
}

export function isSpan(value: unknown): value is PhotoSpan {
  const s = value as Partial<PhotoSpan> | null;
  return (
    typeof s === "object" &&
    s !== null &&
    (s.columns === 1 || s.columns === 2) &&
    (s.rows === 1 || s.rows === 2 || s.rows === 3)
  );
}

function isBookState(value: unknown): value is { pages: number; perPage: number } {
  const b = value as { pages?: unknown; perPage?: unknown } | null;
  return (
    typeof b === "object" &&
    b !== null &&
    typeof b.pages === "number" &&
    typeof b.perPage === "number"
  );
}

export function isCrop(value: unknown): value is PhotoCrop {
  const c = value as Partial<PhotoCrop> | null;
  return (
    typeof c === "object" &&
    c !== null &&
    [c.zoom, c.x, c.y].every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

/** A stored split count, kept only if it still matches the stored size (width = count × height). */
function splitOf(count: unknown, width: unknown, height: unknown): number {
  const n = normaliseSplit(typeof count === "number" ? count : undefined);
  return n > 0 && typeof width === "number" && typeof height === "number" && width === n * height
    ? n
    : 0;
}

/** Accept only values of the right type and range from storage; anything else keeps its default. */
export function checkSettings(raw: unknown, defaults: PosterSettings): PosterSettings {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const num = (v: unknown, min: number, max: number, fallback: number): number =>
    typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : fallback;
  return {
    width: Math.round(num(r.width, 1, 1e6, defaults.width)),
    height: Math.round(num(r.height, 1, 1e6, defaults.height)),
    borderWidth: num(r.borderWidth, 0, 0.2, defaults.borderWidth),
    borderColor:
      typeof r.borderColor === "string" && /^#[0-9a-f]{6}$/i.test(r.borderColor)
        ? r.borderColor
        : defaults.borderColor,
    cornerStyle: r.cornerStyle === "slight" || r.cornerStyle === "rounded" ? r.cornerStyle : "none",
    outerBorder: typeof r.outerBorder === "boolean" ? r.outerBorder : defaults.outerBorder,
    splitImages: splitOf(r.splitImages, r.width, r.height),
    format: r.format === "jpeg" ? "jpeg" : "png",
    jpegQuality: num(r.jpegQuality, 0.1, 1, defaults.jpegQuality),
  };
}

export function checkSession(raw: unknown, defaults: PosterSettings): SavedSession | null {
  const r = raw as Partial<SavedSession> | null;
  if (typeof r !== "object" || r === null || r.v !== 1 || !Array.isArray(r.photos)) return null;
  const photos: SavedPhoto[] = [];
  for (const p of r.photos as Partial<SavedPhoto>[]) {
    if (typeof p?.key !== "string") continue;
    const photo: SavedPhoto = { key: p.key, span: isSpan(p.span) ? p.span : { ...NO_SPAN } };
    if (isCrop(p.crop) && !isDefaultCrop(p.crop)) photo.crop = clampCrop(p.crop);
    if (typeof p.page === "number" && Number.isInteger(p.page) && p.page >= 0) {
      photo.page = Math.min(BOOK_MAX_PAGES - 1, p.page);
    }
    photos.push(photo);
  }
  const seed = r.seed;
  return {
    v: 1,
    photos,
    seed:
      typeof seed === "number" && Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff
        ? seed
        : 0,
    columns: typeof r.columns === "number" && r.columns >= 1 ? Math.floor(r.columns) : undefined,
    layoutStyle: r.layoutStyle === "gallery" ? "gallery" : "mosaic",
    ...(isBookState(r.book)
      ? {
          book: {
            pages: normalisePageCount(r.book.pages),
            perPage: normalisePerPage(r.book.perPage),
          },
        }
      : {}),
    settings: checkSettings(r.settings, defaults),
  };
}
