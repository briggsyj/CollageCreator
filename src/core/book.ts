// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { LayoutOptions } from "./layout";
import { type Rng, seededRng } from "./rng";
import { generatePage, isBetter, scoreLayout } from "./search";
import type { Layout, LayoutPage, LayoutPhoto, LayoutStyle, PhotoSize, Placement } from "./types";

/**
 * A book: several pages side by side, each arranged on its own and saved as its own image.
 * Every page has the same shape. In the layout the pages sit in one row with a small gap,
 * which is only shown on screen.
 */

export const BOOK_MIN_PAGES = 1;
export const BOOK_MAX_PAGES = 20;
export const PER_PAGE_DEFAULT = 6;
export const PER_PAGE_MIN = 1;
export const PER_PAGE_MAX = 20;
/** The gap between pages in the preview, as a share of a page's width. */
export const PAGE_GAP = 0.04;

export function normalisePerPage(value: number | undefined | null): number {
  if (value === undefined || value === null || !Number.isFinite(value)) return PER_PAGE_DEFAULT;
  return Math.min(PER_PAGE_MAX, Math.max(PER_PAGE_MIN, Math.floor(value)));
}

export function normalisePageCount(value: number | undefined | null): number {
  if (value === undefined || value === null || !Number.isFinite(value)) return BOOK_MIN_PAGES;
  return Math.min(BOOK_MAX_PAGES, Math.max(BOOK_MIN_PAGES, Math.floor(value)));
}

/** The seed of page `page`: the book's own seed for the first, so a one-page book is a plain collage. */
export function pageSeed(seed: number, page: number): number {
  return (seed + Math.imul(page, 0x9e3779b1)) >>> 0;
}

/** How many photos each of `pages` pages holds. */
export function countsPerPage(pageOf: readonly number[], pages: number): number[] {
  const counts = new Array<number>(pages).fill(0);
  for (const p of pageOf) {
    const page = Math.min(pages - 1, Math.max(0, p));
    counts[page] = (counts[page] ?? 0) + 1;
  }
  return counts;
}

/**
 * The page the next photo goes to: the first page with room, else a new page after the last
 * (until the limit, then the last page).
 */
export function fillPage(counts: readonly number[], perPage: number): number {
  const room = counts.findIndex((n) => n < perPage);
  if (room >= 0) return room;
  return Math.min(counts.length, BOOK_MAX_PAGES - 1);
}

/**
 * Share `count` photos, in order, across the pages as evenly as possible. There are at least
 * `pages` pages, and more when `perPage` photos a page would not be enough.
 */
export function spreadEvenly(
  count: number,
  pages: number,
  perPage: number,
): { pageOf: number[]; pages: number } {
  const total = normalisePageCount(Math.max(pages, Math.ceil(count / Math.max(1, perPage))));
  const base = Math.floor(count / total);
  const extra = count % total;
  const pageOf: number[] = [];
  for (let page = 0; page < total; page++) {
    const n = base + (page < extra ? 1 : 0);
    for (let k = 0; k < n; k++) pageOf.push(page);
  }
  return { pageOf, pages: total };
}

/** Mix the photos between the pages, keeping how many each page has. */
export function shuffleAcrossPages(pageOf: readonly number[], rng: Rng): number[] {
  const out = [...pageOf];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [out[i], out[j]] = [out[j] as number, out[i] as number];
  }
  return out;
}

/** Where each page goes after page `from` is moved to place `to`. */
export function movedPageOf(pageOf: readonly number[], from: number, to: number): number[] {
  return pageOf.map((p) => {
    if (p === from) return to;
    if (from < to && p > from && p <= to) return p - 1;
    if (from > to && p >= to && p < from) return p + 1;
    return p;
  });
}

/** Where each photo goes after page `page` is removed: onto the prior page (the next for the first). */
export function removedPageOf(pageOf: readonly number[], page: number): number[] {
  const target = page > 0 ? page - 1 : 0;
  return pageOf.map((p) => {
    if (p === page) return page > 0 ? target : 0;
    return p > page ? p - 1 : p;
  });
}

/** A book arrangement: one arrangement per page (null for an empty page) over its own photos. */
export class BookPage implements LayoutPage {
  constructor(
    private subs: (LayoutPage | null)[],
    /** For each page, the photo indexes (in the whole list) of its arrangement's photos. */
    private maps: number[][],
    private ratio: number,
  ) {}

  get pageCount(): number {
    return this.subs.length;
  }

  /** The page a photo is on, or -1. */
  pageOfPhoto(photoIndex: number): number {
    return this.maps.findIndex((m) => m.includes(photoIndex));
  }

  setTargetRatio(ratio: number): void {
    this.ratio = ratio;
    for (const sub of this.subs) sub?.setTargetRatio(ratio);
  }

  /** Swap two photos' places, on one page or across pages; each cell keeps its shape. */
  swapPhotos(a: number, b: number): void {
    const pa = this.pageOfPhoto(a);
    const pb = this.pageOfPhoto(b);
    if (pa < 0 || pb < 0) return;
    const ma = this.maps[pa] as number[];
    const mb = this.maps[pb] as number[];
    const la = ma.indexOf(a);
    const lb = mb.indexOf(b);
    if (pa === pb) {
      this.subs[pa]?.swapPhotos(la, lb);
      return;
    }
    ma[la] = b;
    mb[lb] = a;
  }

  /** A new empty page after the last. */
  addPage(): void {
    this.subs.push(null);
    this.maps.push([]);
  }

  /** Move page `from` to place `to`; each page keeps its arrangement. */
  movePage(from: number, to: number): void {
    const [sub] = this.subs.splice(from, 1);
    const [map] = this.maps.splice(from, 1);
    this.subs.splice(to, 0, sub ?? null);
    this.maps.splice(to, 0, map ?? []);
  }

  toLayout(): Layout {
    const n = this.subs.length;
    const total = n + (n - 1) * PAGE_GAP;
    const placements: Placement[] = [];
    const pages: { x: number; w: number }[] = [];
    this.subs.forEach((sub, k) => {
      const offset = k * (1 + PAGE_GAP);
      pages.push({ x: offset / total, w: 1 / total });
      if (!sub) return;
      const map = this.maps[k] as number[];
      for (const p of sub.toLayout().placements) {
        const { x, y, w, h } = p.cell;
        placements.push({
          photoIndex: map[p.photoIndex] as number,
          cell: { x: (offset + x) / total, y: y / total, w: w / total, h: h / total },
          page: k,
        });
      }
    });
    return { width: 1, height: this.ratio / total, placements, pages };
  }
}

/** One arrangement of a book. `pageOf[i]` is the page of photo `i`. */
export function generateBook(
  style: LayoutStyle,
  photos: readonly LayoutPhoto[],
  pageOf: readonly number[],
  pageCount: number,
  pageRatio: number,
  seed: number,
  options: LayoutOptions = {},
): BookPage {
  const pages = normalisePageCount(pageCount);
  const subs: (LayoutPage | null)[] = [];
  const maps: number[][] = [];
  for (let k = 0; k < pages; k++) {
    const indexes = photos
      .map((_, i) => i)
      .filter((i) => Math.min(pages - 1, Math.max(0, pageOf[i] ?? 0)) === k);
    maps.push(indexes);
    subs.push(
      indexes.length === 0
        ? null
        : generatePage(
            style,
            indexes.map((i) => photos[i] as LayoutPhoto),
            pageRatio,
            seededRng(pageSeed(seed, k)),
            options,
          ),
    );
  }
  return new BookPage(subs, maps, pageRatio);
}

/**
 * Try several seeds and keep the book that crops the photos least; the seed returned gives
 * the same book again from `generateBook`.
 */
export function generateBestBook(
  style: LayoutStyle,
  photos: readonly (LayoutPhoto & PhotoSize)[],
  pageOf: readonly number[],
  pageCount: number,
  pageRatio: number,
  masterSeed: number,
  tries: number,
  options: LayoutOptions = {},
): { page: BookPage; seed: number } {
  const master = seededRng(masterSeed);
  let best: { page: BookPage; seed: number; score: ReturnType<typeof scoreLayout> } | undefined;
  for (let i = 0; i < Math.max(1, tries); i++) {
    const seed = Math.floor(master.random() * 2 ** 32) >>> 0;
    const page = generateBook(style, photos, pageOf, pageCount, pageRatio, seed, options);
    const score = scoreLayout(page.toLayout(), photos);
    if (!best || isBetter(score, best.score)) best = { page, seed, score };
  }
  const winner = best as NonNullable<typeof best>;
  return { page: winner.page, seed: winner.seed };
}

/** The layout of one page of a book, as if it were a collage on its own (photo indexes unchanged). */
export function pageLayout(layout: Layout, page: number): Layout {
  const rect = layout.pages?.[page];
  if (!rect) return layout;
  return {
    width: 1,
    height: layout.height / rect.w,
    placements: layout.placements
      .filter((p) => p.page === page)
      .map((p) => ({
        photoIndex: p.photoIndex,
        cell: {
          x: (p.cell.x - rect.x) / rect.w,
          y: p.cell.y / rect.w,
          w: p.cell.w / rect.w,
          h: p.cell.h / rect.w,
        },
      })),
  };
}

/** Which pages hold at least one photo, in order. */
export function pagesWithPhotos(layout: Layout): number[] {
  const pages = layout.pages ?? [];
  return pages.map((_, k) => k).filter((k) => layout.placements.some((p) => p.page === k));
}

/** File names for the pages saved: `<base>_1.png`, ... numbered in page order, padded from ten on. */
export function bookFileNames(base: string, count: number, extension: string): string[] {
  const width = String(count).length;
  return Array.from(
    { length: count },
    (_, k) => `${base}_${String(k + 1).padStart(width, "0")}.${extension}`,
  );
}
