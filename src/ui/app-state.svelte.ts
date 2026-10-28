// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
// Copyright (C) 2026 John Briggs
//
// This file is part of Collage Creator, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-26:
// it holds the state and the actions of the browser UI that replaces the GTK window
// of photocollage/gtkgui.py (add images, regenerate, settings for size and border,
// save, swap photos by clicking two cells). The Svelte components only show it.
// The default border is 0.5 % white with square corners (the original used 1 % black).
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import {
  BOOK_MAX_PAGES,
  BookPage,
  bookFileNames,
  countsPerPage,
  generateBestBook,
  generateBook,
  movedPageOf,
  normalisePageCount,
  PAGE_GAP,
  PER_PAGE_DEFAULT,
  pageLayout,
  pagesWithPhotos,
  removedPageOf,
  shuffleAcrossPages,
  spreadEvenly,
} from "../core/book";
import { clampCrop, isDefaultCrop, MAX_ZOOM, panCrop, zoomCrop } from "../core/crop";
import { normaliseColumns } from "../core/layout";
import { randomSeed, seededRng } from "../core/rng";
import {
  DEFAULT_TRIES,
  GALLERY_TRIES,
  generateBestPage,
  generatePage,
  scoreLayout,
} from "../core/search";
import {
  normaliseSplit,
  SPLIT_DEFAULT,
  SPLIT_MAX,
  SPLIT_MIN,
  SPLIT_SIDE_DEFAULT,
  SPLIT_SIDE_MIN,
  splitFileNames,
} from "../core/split";
import {
  type Layout,
  type LayoutPage,
  type LayoutStyle,
  NO_CROP,
  NO_SPAN,
  type PhotoCrop,
  type PhotoSpan,
  type PosterSettings,
} from "../core/types";
import { getLanguage, preferredLanguage, resolveLanguage, setLanguage, t } from "../i18n";
import {
  fileKey,
  type ImportedPhoto,
  type ImportMessage,
  importFiles,
  type SkippedFile,
} from "../io/import";
import { loadSession, saveSession } from "../io/session";
import { isZip, unzipImages } from "../io/unzip";
import { zipBlob } from "../io/zip";
import { type CanvasLimits, clampSize, detectLimits, FALLBACK_LIMITS } from "../platform/limits";
import { exportCollage, exportPieces } from "../render/export";
import { WorkerPool } from "../render/pool";
import { fitSize } from "../render/preview";
import { SPLIT_MARGIN } from "../render/splitmarks";
import { FIT_VIEW, isFit, panBy, type Size, type View, zoomAt, zoomPercent } from "../render/view";
import { findChoice, orientationOf, SIZE_CHOICES, sizeOf } from "./presets";
import { parseSeed, withSeed } from "./url";

/** Room (in CSS pixels) kept above a book's pages for their pills, and below for the add button. */
export const PAGE_PILL_ROOM = 48;

export type Tab = "photos" | "poster" | "style" | "save";
export type Mode = "pan" | "swap" | "select";
/** Which dialog is open, if any. */
export type DialogName = "help" | "about" | "progress" | "confirm";

/** What the confirm dialog asks, and what its main button does. */
export interface Confirmation {
  title: string;
  text: string;
  action: string;
  run: () => void;
}

const LANG_KEY = "collage-creator.language";
/** What the key was called before the app was renamed, still read so a saved choice is kept. */
const OLD_LANG_KEY = "collage-web.language";

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANG_KEY) ?? localStorage.getItem(OLD_LANG_KEY);
  } catch {
    return null;
  }
}

/** The browser's language preferences, most preferred first; empty if it does not say. */
function browserLanguages(): readonly string[] {
  try {
    const list = navigator.languages;
    return list?.length ? list : navigator.language ? [navigator.language] : [];
  } catch {
    return [];
  }
}

function storeLanguage(code: string): void {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    // storage may be unavailable (private mode); the choice just isn't remembered
  }
}

/** How long a notice about already-added photos stays before it goes by itself. */
const DUPLICATE_NOTICE_MS = 10_000;
/** How long a status line replaces the hint in the pill over the preview. */
const STATUS_MS = 6000;

/** What was skipped while adding photos, for the notice in the Photos step. */
export interface Notice {
  summary: string;
  /** Why, by reason: "3 already added, 1 not an image". */
  reasons: string;
  items: string[];
  kind: "info" | "error";
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Describe a photo's requested size for the list ("" when it asks for nothing). */
export function describeSpan(span: PhotoSpan | undefined): string {
  const parts: string[] = [];
  if (span?.columns === 2) parts.push(t("wider"));
  if (span && span.rows > 1) parts.push(`${t("taller")} ×${span.rows}`);
  return parts.join(" · ");
}

export class AppState {
  // ------------------------------------------------------------------ the collage
  /** Photos in the order they were added. Replaced, never changed in place. */
  photos = $state.raw<ImportedPhoto[]>([]);
  /** A seed in the address (a shared link, or back/forward) decides the first arrangement. */
  seed = $state(parseSeed(location.search) ?? randomSeed());
  /** Chosen number of columns (Mosaic only); undefined lets the original heuristic decide. */
  columns = $state<number | undefined>(undefined);
  layoutStyle = $state<LayoutStyle>("mosaic");
  /** How many pages there are (1 to 20), empty ones included. A collage is one page. */
  pageCount = $state(1);
  /** More than one page: the pages are shown in a row, each with its own controls. */
  book = $derived(this.pageCount > 1);
  /** Where the poster is in the preview area, in CSS pixels (set by the preview each draw). */
  posterBox = $state.raw<{ x: number; y: number; w: number; h: number } | null>(null);
  /** The arrangement. It is changed in place by swaps and resizes, which bump `pageRev`. */
  page = $state.raw<LayoutPage | null>(null);
  pageRev = $state(0);
  settings = $state<PosterSettings>({
    width: 1600,
    height: 1200,
    borderWidth: 0.005,
    borderColor: "#ffffff",
    cornerStyle: "none",
    outerBorder: true,
    splitImages: 0,
    format: "png",
    jpegQuality: 0.92,
  });
  /** True once the user typed a size or picked Custom, until a named size is chosen again. */
  customSize = $state(false);
  /** The orientation last chosen; a square keeps it so the buttons do not jump. */
  portrait = $state(false);
  limits = $state.raw<CanvasLimits>(FALLBACK_LIMITS);
  sizeNote = $state("");
  /** Bumped when the size fields must show the stored size again, even if it did not change. */
  sizeEpoch = $state(0);
  /** Bumped when saved settings are put back, so sliders show them. */
  restoreEpoch = $state(0);

  // --------------------------------------------------------------------- the editor
  tab = $state<Tab>("photos");
  /** On narrow screens: a step is open as a sheet. */
  sheetOpen = $state(false);
  menuOpen = $state(false);
  /** Counts the times a sheet should rise from the bottom (see the stylesheet). */
  riseToken = $state(0);
  narrow = $state(false);
  mode = $state<Mode>("pan");
  selected = $state<number | null>(null);
  /**
   * Photos were swapped or moved between pages by hand since the arrangement was last made.
   * Shuffling would undo that, so it asks first; a fresh arrangement clears it.
   */
  arrangedByHand = $state(false);
  /**
   * Photos selected as well as `selected` (by id), from Shift-click in the Photos step or with
   * the Select tool. Only what works on many photos at once is offered then: size, page, remove.
   */
  alsoSelected = $state.raw<ReadonlySet<string>>(new Set());
  /** The photo whose crop is being adjusted; only counts while it is also the selected one. */
  cropFor = $state<number | null>(null);
  /** Counts the times the selected photo should be scrolled into view in the Photos step. */
  revealToken = $state(0);
  focused = $state(0);
  /** Zoom and pan of the preview; FIT_VIEW shows the whole poster. */
  view = $state.raw<View>(FIT_VIEW);
  /** The size of the preview area, in CSS pixels. */
  viewport = $state<Size>({ w: 0, h: 0 });
  /** True while Space is held over the preview: dragging then pans instead of picking photos. */
  spaceHeld = $state(false);
  canvasFocused = $state(false);
  /** Show the orange keyboard ring on the focused photo: only once the keyboard is in use. */
  focusRing = $state(false);
  /** What the last removal took out and where, so it can be undone. */
  removed = $state.raw<{ photo: ImportedPhoto; index: number }[] | null>(null);
  /** The page count before Remove all, so Undo remove can bring the pages back too. */
  private removedPageCount: number | null = null;

  // -------------------------------------------------------------------- messages
  /** The line in the pill over the preview, and in the live region for screen readers. */
  status = $state("");
  messages = $state.raw<ImportMessage[]>([]);
  notice = $state.raw<Notice | null>(null);
  noticeDetailsOpen = $state(false);
  /** Saved work being brought back: how many photos are done, of how many. */
  restoring = $state<{ done: number; total: number } | null>(null);
  /** The language in use. Reading it makes `tr` re-run when the language changes. */
  lang = $state(getLanguage());
  dialog = $state<DialogName | null>(null);
  /** What the confirm dialog is asking. */
  confirming = $state.raw<Confirmation | null>(null);
  progress = $state(0);
  /** Becomes true once saved work has been restored; nothing is saved before. */
  persistReady = $state(false);

  // Created up front so the worker script is fetched while the network is
  // still there; the app then keeps working offline.
  importPool = new WorkerPool(2);
  exportPool = new WorkerPool();

  // ------------------------------------------------------------------- derived
  hasPhotos = $derived(this.photos.length > 0);
  layout = $derived.by<Layout | null>(() => {
    void this.pageRev;
    return this.page ? this.page.toLayout() : null;
  });
  columnsInUse = $derived.by(() => {
    void this.pageRev;
    return this.page?.noCols;
  });
  cropPercent = $derived(
    this.layout ? Math.round(scoreLayout(this.layout, this.photos).cutOff * 100) : 0,
  );
  selectedPhoto = $derived(this.selected === null ? undefined : this.photos[this.selected]);
  isSplit = $derived(this.settings.splitImages > 1);
  /** The page of the selected photo (a book), if there is one. */
  selectedPage = $derived(this.selectedPhoto?.bookPage ?? 0);
  /** Every selected photo by index, the main one first. */
  selection = $derived.by(() => {
    if (this.selected === null) return [];
    const also = this.alsoSelected;
    const rest = this.photos.flatMap((p, i) => (i !== this.selected && also.has(p.id) ? [i] : []));
    return [this.selected, ...rest];
  });
  /** More than one photo is selected. */
  multiSelected = $derived(this.selection.length > 1);
  /** How many photos each page of the book holds. */
  pageCounts = $derived(
    countsPerPage(
      this.photos.map((p) => p.bookPage ?? 0),
      this.pageCount,
    ),
  );
  /** The size button that is on: a named size, the multi-image post, or Custom. */
  activeSize = $derived.by(() => {
    if (this.isSplit) return "post";
    const match = findChoice(this.settings.width, this.settings.height);
    return this.customSize || !match ? "custom" : match.choice.id;
  });
  /** The tool that is on: Space held makes it Pan for as long as it is held. */
  activeMode = $derived<Mode>(this.spaceHeld ? "pan" : this.mode);
  /** The cells' colours behind the glass: the photos' own average colours. */
  photoColours = $derived(this.photos.map((p) => p.colour));

  private statusTimer: ReturnType<typeof setTimeout> | undefined;
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;
  private sizeTimer: ReturnType<typeof setTimeout> | undefined;
  private pendingSize: { width: number; height: number } | null = null;
  /** Saved work being brought back; adding photos waits for it. */
  private restoringDone: Promise<void> = Promise.resolve();
  /** The hidden file input, set by the page; Add images opens it. */
  fileInput: HTMLInputElement | null = null;
  /** True while the address may be rewritten in place instead of adding a history entry. */
  private replaceUrl = true;
  private persistWarned = false;

  get ratio(): number {
    return this.settings.height / this.settings.width;
  }

  // ------------------------------------------------------------------ messages

  addMessage(m: ImportMessage): void {
    this.messages = [...this.messages, m].slice(-8);
  }

  clearMessages(): void {
    this.messages = [];
  }

  /** Show a status line (for screen readers, and in the pill over the preview for a while). */
  setStatus(text: string): void {
    this.status = text;
    clearTimeout(this.statusTimer);
    if (text) {
      this.statusTimer = setTimeout(() => {
        this.status = "";
      }, STATUS_MS);
    }
  }

  hideNotice(): void {
    clearTimeout(this.noticeTimer);
    this.notice = null;
    this.noticeDetailsOpen = false;
  }

  /** Summarise what was not added: counts by reason, with the file names under Details. */
  showNotice(skipped: readonly SkippedFile[]): void {
    this.hideNotice();
    if (skipped.length === 0) return;
    const count = (reason: SkippedFile["reason"]) =>
      skipped.filter((s) => s.reason === reason).length;
    const duplicates = count("duplicate");
    const notImages = count("not-image");
    const unreadable = count("unreadable");
    const parts: string[] = [];
    if (duplicates) parts.push(t("%(n)s already added", { n: duplicates }));
    if (notImages) parts.push(t("%(n)s not an image", { n: notImages }));
    if (unreadable) parts.push(t("%(n)s could not be opened", { n: unreadable }));
    const onlyDuplicates = duplicates === skipped.length;
    this.notice = {
      summary:
        skipped.length === 1
          ? t("1 file was not added")
          : t("%(n)s files were not added", { n: skipped.length }),
      reasons: parts.join(", "),
      items: skipped.map((s) => {
        const why =
          s.reason === "duplicate"
            ? t("already added")
            : s.reason === "not-image"
              ? t("not an image")
              : t("could not be opened");
        return `${s.name}: ${why}`;
      }),
      kind: onlyDuplicates ? "info" : "error",
    };
    if (onlyDuplicates) this.noticeTimer = setTimeout(() => this.hideNotice(), DUPLICATE_NOTICE_MS);
  }

  // ------------------------------------------------------------------ language

  /** A language chosen earlier wins; otherwise the browser's own preferences, then English. */
  initLanguage(): void {
    const stored = readStoredLanguage();
    const initial = stored ? resolveLanguage(stored) : preferredLanguage(browserLanguages());
    this.lang = setLanguage(initial);
    document.documentElement.lang = this.lang.replace("_", "-");
  }

  chooseLanguage(code: string): void {
    this.lang = setLanguage(code);
    storeLanguage(this.lang);
    document.documentElement.lang = this.lang.replace("_", "-");
  }

  // ---------------------------------------------------------------------- tabs

  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Show a step. On wide screens exactly one step is always shown. On narrow screens a step
   * is a sheet over the collage: choosing the open one again (or Close) puts it away.
   * `toggle` is true when the person pressed a tab or Close.
   */
  setTab(requested: Tab, toggle: boolean): void {
    const narrow = this.narrow;
    const tab: Tab = !narrow && requested === "save" ? "photos" : requested;
    const wasOpen = this.sheetOpen;
    const previous = this.tab;
    const closing = narrow && toggle && wasOpen && this.tab === tab;
    const open = narrow && !closing && (toggle || wasOpen);
    this.tab = tab;
    this.sheetOpen = open;
    if (open) {
      this.closeMenu();
      if (tab !== previous || !wasOpen) this.riseToken++;
    }
  }

  // -------------------------------------------------------------------- layout

  /**
   * Make a new arrangement.
   * - "search": try several and keep the one that crops the photos least. Used when the
   *   set of photos changes, so the first thing shown is the best we can do. The seed
   *   shown is the winner's, so typing it back gives the same layout in one generation.
   * - "single": one generation from the current seed. Used for Regenerate, a typed
   *   seed, the number of columns and a photo's size.
   * `keepSelection` leaves the selected photo selected (its place in the list is unchanged).
   */
  relayout(mode: "search" | "single" = "single", keepSelection = false): void {
    if (!keepSelection) this.clearSelection();
    this.arrangedByHand = false;
    this.focused = 0;
    if (this.photos.length === 0) {
      this.page = null;
    } else if (this.book) {
      const pageOf = this.photos.map((p) => p.bookPage ?? 0);
      if (mode === "search") {
        const tries = this.layoutStyle === "gallery" ? GALLERY_TRIES : DEFAULT_TRIES;
        const best = generateBestBook(
          this.layoutStyle,
          this.photos,
          pageOf,
          this.pageCount,
          this.ratio,
          randomSeed(),
          tries,
          { columns: this.columns },
        );
        this.page = best.page;
        this.seed = best.seed;
      } else {
        this.page = generateBook(
          this.layoutStyle,
          this.photos,
          pageOf,
          this.pageCount,
          this.ratio,
          this.seed,
          { columns: this.columns },
        );
      }
    } else if (mode === "search") {
      const best = generateBestPage(this.layoutStyle, this.photos, this.ratio, randomSeed(), {
        columns: this.columns,
      });
      this.page = best.page;
      this.seed = best.seed;
    } else {
      this.page = generatePage(this.layoutStyle, this.photos, this.ratio, seededRng(this.seed), {
        columns: this.columns,
      });
    }
    this.pageRev++;
    this.status = "";
    this.syncUrl();
  }

  /** Change the poster's shape without changing which photo is where. */
  private reshape(): void {
    this.page?.setTargetRatio(this.ratio);
    this.pageRev++;
  }

  shuffle(): void {
    this.seed = randomSeed();
    this.relayout();
  }

  /** Shuffle the layout within the pages, or every photo between them; asks after hand edits. */
  askShuffle(between: boolean): void {
    const run = () => (between ? this.shufflePages() : this.shuffle());
    if (!this.arrangedByHand) {
      run();
      return;
    }
    this.confirm({
      title: t("Shuffle and lose your changes?"),
      text: t("You swapped or moved photos by hand. Shuffling arranges them again."),
      action: t("Shuffle"),
      run,
    });
  }

  setSeed(value: number): boolean {
    const seed = Math.floor(value);
    if (!Number.isFinite(seed) || seed < 0 || seed > 0xffffffff) return false;
    this.seed = seed;
    this.relayout();
    return true;
  }

  chooseLayout(style: LayoutStyle): void {
    if (this.layoutStyle === style) return;
    this.layoutStyle = style;
    this.relayout("search");
  }

  // ----------------------------------------------------------------------- book

  /** The size of the whole row of pages, for fitting it on screen. */
  get rowSize(): Size {
    if (!this.book) return { w: this.settings.width, h: this.settings.height };
    const n = this.pageCount;
    return { w: (n + (n - 1) * PAGE_GAP) * this.settings.width, h: this.settings.height };
  }

  /** Give the photos that have no page (or one that no longer exists) the next page with room. */
  private withPages(
    photos: readonly ImportedPhoto[],
    keep: readonly ImportedPhoto[],
  ): ImportedPhoto[] {
    const counts = countsPerPage(
      keep.map((p) => p.bookPage ?? 0),
      Math.max(1, this.pageCount),
    );
    return photos.map((photo) => {
      if (photo.bookPage !== undefined && photo.bookPage < this.pageCount) {
        counts[photo.bookPage] = (counts[photo.bookPage] ?? 0) + 1;
        return photo;
      }
      const page = Math.max(0, this.pageCount - 1);
      counts[page] = (counts[page] ?? 0) + 1;
      return { ...photo, bookPage: page };
    });
  }

  get maxPages(): number {
    return BOOK_MAX_PAGES;
  }

  private setPages(pageOf: readonly number[], pageCount = this.pageCount): void {
    this.pageCount = pageCount;
    this.photos = this.photos.map((p, i) => ({ ...p, bookPage: pageOf[i] ?? 0 }));
  }

  /** A new blank page after the last. The first time, the collage becomes page one of a book. */
  addPage(): void {
    if (this.pageCount >= BOOK_MAX_PAGES) return;
    if (this.page && !this.book) {
      this.page = BookPage.wrap(this.page, this.photos.length, this.ratio);
      this.photos = this.photos.map((p) => ({ ...p, bookPage: 0 }));
    }
    this.pageCount++;
    (this.page as BookPage | null)?.addPage();
    this.pageRev++;
    // Zoomed in, the new page would land out of sight: show every page.
    if (!this.isFit) this.fitView();
    this.setStatus(t("Added page %(n)s.", { n: this.pageCount }));
  }

  /** Ask before taking a page out. */
  askRemovePage(page: number): void {
    if (!this.book || page < 0 || page >= this.pageCount) return;
    this.confirm({
      title: t("Remove page %(n)s?", { n: page + 1 }),
      text: this.pageCounts[page]
        ? t("Its photos move to a neighbouring page. The page's own arrangement is lost.")
        : t("This page is empty."),
      action: t("Remove page"),
      run: () => this.removePage(page),
    });
  }

  /** Ask before doing something that is hard to take back. */
  confirm(question: Confirmation): void {
    this.confirming = question;
    this.dialog = "confirm";
  }

  /** The confirm dialog's main button. */
  confirmed(): void {
    const run = this.confirming?.run;
    this.dialog = null;
    this.confirming = null;
    run?.();
  }

  /** Take a page out: its photos go to the prior page (the next one for the first). */
  removePage(page: number): void {
    if (!this.book || this.pageCount <= 1 || page < 0 || page >= this.pageCount) return;
    const pageOf = removedPageOf(
      this.photos.map((p) => p.bookPage ?? 0),
      page,
    );
    this.setPages(pageOf, this.pageCount - 1);
    this.relayout("single", false);
    this.setStatus(
      t("Removed page %(n)s; its photos moved to a neighbouring page.", { n: page + 1 }),
    );
  }

  /** Move a page one place left or right; each page keeps its arrangement. */
  movePage(page: number, by: -1 | 1): void {
    const to = page + by;
    if (!this.book || page < 0 || to < 0 || page >= this.pageCount || to >= this.pageCount) return;
    this.setPages(
      movedPageOf(
        this.photos.map((p) => p.bookPage ?? 0),
        page,
        to,
      ),
    );
    (this.page as BookPage | null)?.movePage(page, to);
    this.pageRev++;
    this.setStatus(t("Moved page %(a)s to place %(b)s.", { a: page + 1, b: to + 1 }));
  }

  /** Set the number of pages; the photos are shared evenly across them, in order. */
  setPageCount(value: number): void {
    const pages = normalisePageCount(value);
    if (pages === this.pageCount) return;
    if (pages > 1 && !this.book) this.addPage();
    const spread = spreadEvenly(this.photos.length, pages);
    this.setPages(spread.pageOf, pages);
    this.relayout("search");
    this.setStatus(t("Photos shared evenly across %(n)s page(s).", { n: pages }));
  }

  /** Mix the photos between the pages, keeping how many each page has. */
  shufflePages(): void {
    if (!this.book) return;
    const mixed = shuffleAcrossPages(
      this.photos.map((p) => p.bookPage ?? 0),
      seededRng(randomSeed()),
    );
    this.setPages(mixed);
    this.relayout("search");
    this.setStatus(t("Photos shuffled between pages."));
  }

  /** Move the selected photos to another page; they go last there, in their order. */
  moveSelectedToPage(page: number): void {
    const ids = this.selection.flatMap((i) => this.photos[i]?.id ?? []);
    this.movePhotosToPage(ids, page);
  }

  /**
   * Move photos (by id) to another page, last there and in their order; used by Move to page
   * and by dragging photos onto a page in the Photos step. Selected photos stay selected.
   */
  movePhotosToPage(photoIds: readonly string[], page: number): void {
    if (!this.book || page < 0 || page >= this.pageCount) return;
    const ids = new Set(photoIds);
    const selectedIds = this.selection.flatMap((i) => this.photos[i]?.id ?? []);
    const mainId = this.selectedPhoto?.id;
    const moving = this.photos
      .filter((p) => ids.has(p.id) && (p.bookPage ?? 0) !== page)
      .map((p) => ({ ...p, bookPage: page }));
    if (moving.length === 0) return;
    const moved = new Set(moving.map((p) => p.id));
    const rest = this.photos.filter((p) => !moved.has(p.id));
    // After the last photo on that page or an earlier one.
    let at = 0;
    rest.forEach((p, i) => {
      if ((p.bookPage ?? 0) <= page) at = i + 1;
    });
    rest.splice(at, 0, ...moving);
    this.photos = rest;
    this.relayout("single", false);
    this.arrangedByHand = true;
    // Keep the same photos selected at their new places.
    if (mainId !== undefined) {
      const main = rest.findIndex((p) => p.id === mainId);
      this.selected = main >= 0 ? main : null;
      this.alsoSelected = new Set(selectedIds.filter((id) => id !== mainId));
    }
    this.setStatus(
      moving.length === 1
        ? t("Moved %(name)s to page %(n)s.", { name: moving[0]?.name ?? "", n: page + 1 })
        : t("Moved %(count)s photos to page %(n)s.", { count: moving.length, n: page + 1 }),
    );
  }

  /** Empty means automatic. Apply while typing; the field is tidied once the edit is done. */
  setColumns(columns: number | undefined): void {
    if (columns === this.columns) return;
    this.columns = columns;
    this.relayout();
  }

  stepColumns(by: number): void {
    const current = this.columns ?? this.page?.noCols ?? 1;
    this.setColumns(normaliseColumns(current + by));
  }

  // ------------------------------------------------------- address and storage

  /**
   * Keep the seed in the address, so the browser's back and forward buttons step through
   * earlier arrangements. A new arrangement adds a history entry; startup and restoring
   * saved work rewrite the current one.
   */
  private syncUrl(): void {
    try {
      const next = withSeed(location.href, this.seed);
      if (next === location.href) return;
      if (this.replaceUrl) history.replaceState(null, "", next);
      else history.pushState(null, "", next);
    } catch {
      // history can be unavailable (sandboxed frames); the seed field still works
    }
  }

  /** The browser's back or forward button: show that address's arrangement. */
  onPopState(): void {
    const seed = parseSeed(location.search);
    if (seed === undefined || seed === this.seed) return;
    this.seed = seed;
    this.relayout();
  }

  /** Save the photos and settings in this browser. Called shortly after the last change. */
  async persist(): Promise<void> {
    const files = new Map(this.photos.map((p) => [fileKey(p.file), p.file]));
    try {
      await saveSession(
        {
          v: 1,
          photos: this.photos.map((p) => ({
            key: fileKey(p.file),
            span: p.span ?? { ...NO_SPAN },
            ...(p.crop ? { crop: p.crop } : {}),
            ...(this.book && p.bookPage !== undefined ? { page: p.bookPage } : {}),
          })),
          seed: this.seed,
          columns: this.columns,
          layoutStyle: this.layoutStyle,
          ...(this.pageCount > 1
            ? { book: { pages: this.pageCount, perPage: PER_PAGE_DEFAULT } }
            : {}),
          settings: $state.snapshot(this.settings),
        },
        files,
      );
    } catch {
      if (this.persistWarned) return;
      this.persistWarned = true;
      this.addMessage({
        kind: "error",
        text: t(
          "Your work could not be kept for next time: browser storage is unavailable or full.",
        ),
      });
    }
  }

  /** Bring back the photos and settings kept by an earlier visit. */
  async restore(): Promise<void> {
    this.restoring = { done: 0, total: 0 };
    try {
      const saved = await loadSession(this.settings);
      if (saved) {
        Object.assign(this.settings, saved.session.settings);
        this.columns = saved.session.columns;
        this.layoutStyle = saved.session.layoutStyle ?? "mosaic";
        const book = saved.session.book;
        this.pageCount = book?.pages ?? 1;
        this.restoreEpoch++;
        const files = saved.session.photos
          .map((p) => saved.files.get(p.key))
          .filter((f): f is File => f !== undefined);
        this.restoring = { done: 0, total: files.length };
        const photos = await importFiles(
          files,
          [],
          this.importPool,
          (m) => this.addMessage(m),
          (done, total) => {
            this.restoring = { done, total };
          },
        );
        const saves = new Map(saved.session.photos.map((p) => [p.key, p]));
        this.photos = photos.map((photo) => {
          const saved = saves.get(fileKey(photo.file));
          return {
            ...photo,
            span: { ...(saved?.span ?? NO_SPAN) },
            ...(saved?.crop ? { crop: saved.crop } : {}),
            ...(saved?.page !== undefined ? { bookPage: saved.page } : {}),
          };
        });
        // An address with a seed wins over the stored one.
        this.seed = parseSeed(location.search) ?? saved.session.seed;
        this.applySize(this.settings.width, this.settings.height);
        this.relayout();
      }
    } catch {
      // nothing usable stored (or storage is unavailable): start empty
    } finally {
      this.restoring = null;
      this.persistReady = true;
      this.replaceUrl = false;
    }
  }

  /** Start the app: language, saved work and the canvas limits. */
  start(): void {
    this.initLanguage();
    this.relayout();
    this.restoringDone = this.restore();
    void Promise.all([this.importPool.ready, this.exportPool.ready]).then(() => {
      document.documentElement.dataset.workersReady = "true";
    });
    void detectLimits().then((limits) => {
      this.limits = limits;
      this.applySize(this.settings.width, this.settings.height);
    });
  }

  // ------------------------------------------------------------------- the view

  /**
   * The poster's size on screen when the view is "fit", in CSS pixels. Room is left for the
   * tools on the right and the pill on the top (wide screens), or for the bars (phones).
   */
  fitPoster(viewport: Size = this.viewport, onePage = false): Size {
    const padX = this.narrow ? 12 : 88;
    const padY = this.narrow ? 104 : 72;
    // A collage for a multi-image post keeps room above and below for the cut marks, and a
    // book room below its pages for their labels.
    const marks =
      (this.settings.splitImages > 1 ? 2 * SPLIT_MARGIN : 0) +
      (this.book && !onePage ? 2 * PAGE_PILL_ROOM : 0);
    const row = onePage ? { w: this.settings.width, h: this.settings.height } : this.rowSize;
    const fit = fitSize(
      row.w,
      row.h,
      Math.max(160, viewport.w - 2 * padX),
      Math.max(160, viewport.h - 2 * padY - marks),
    );
    return { w: fit.width, h: fit.height };
  }

  get isFit(): boolean {
    return isFit(this.view);
  }

  get zoomPercent(): number {
    return zoomPercent(this.view);
  }

  zoomAtCentre(factor: number): void {
    const viewport = this.viewport;
    const centre = { x: viewport.w / 2, y: viewport.h / 2 };
    this.view = zoomAt(this.view, factor, centre, viewport, this.fitPoster(viewport));
  }

  zoomAtPoint(factor: number, cursor: { x: number; y: number }): void {
    this.view = zoomAt(this.view, factor, cursor, this.viewport, this.fitPoster(this.viewport));
  }

  panBy(dx: number, dy: number): void {
    this.view = panBy(this.view, dx, dy, this.viewport, this.fitPoster(this.viewport));
  }

  fitView(): void {
    this.view = FIT_VIEW;
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    this.status = "";
    clearTimeout(this.statusTimer);
  }

  setSpaceHeld(held: boolean): void {
    this.spaceHeld = held;
  }

  // -------------------------------------------------------------------- photos

  /** Select a photo (or unselect it when it already is) from the list or the preview. */
  selectPhoto(photoIndex: number): void {
    const photo = this.photos[photoIndex];
    if (!photo) return;
    if (this.multiSelected) {
      // A plain click on one of several selected photos narrows the selection to it.
      this.alsoSelected = new Set();
      this.selected = photoIndex;
      this.setStatus(t("Selected %(name)s.", { name: photo.name }));
    } else if (this.selected === photoIndex) {
      this.selected = null;
      this.setStatus("");
    } else {
      this.selected = photoIndex;
      this.setStatus(t("Selected %(name)s.", { name: photo.name }));
    }
  }

  /** Add a photo to the selection, or take it out (Shift-click). */
  toggleSelected(photoIndex: number): void {
    const photo = this.photos[photoIndex];
    if (!photo) return;
    if (this.selected === null) {
      this.selectPhoto(photoIndex);
      return;
    }
    this.cropFor = null;
    const also = new Set(this.alsoSelected);
    if (photoIndex === this.selected) {
      // The main photo leaves; the next selected one takes its place.
      const next = this.selection[1];
      this.selected = next ?? null;
      const nextPhoto = next === undefined ? undefined : this.photos[next];
      if (nextPhoto) also.delete(nextPhoto.id);
    } else if (also.has(photo.id)) {
      also.delete(photo.id);
    } else {
      also.add(photo.id);
    }
    this.alsoSelected = also;
    const n = this.selection.length;
    this.setStatus(n > 1 ? t("%(n)s photos selected.", { n }) : "");
  }

  /** Nothing selected. */
  private clearSelection(): void {
    this.selected = null;
    if (this.alsoSelected.size > 0) this.alsoSelected = new Set();
  }

  /**
   * The Select tool: choose a photo on the preview and show it in the Photos step (on wide
   * screens), where Wider, Taller and Remove are. On phones the action bar appears instead.
   */
  selectInPhotos(photoIndex: number, add = false): void {
    if (add) this.toggleSelected(photoIndex);
    else this.selectPhoto(photoIndex);
    if (!this.selection.includes(photoIndex) || this.narrow) return;
    this.setTab("photos", false);
    this.revealToken++;
  }

  /** Select a photo, or swap it with the one already selected. */
  pick(cellIndex: number): void {
    const placement = this.layout?.placements[cellIndex];
    if (!this.page || !placement) return;
    const photoIndex = placement.photoIndex;
    // Swapping is one photo for another: a selection of several starts again.
    if (this.multiSelected) this.clearSelection();
    if (this.selected === null) {
      this.selected = photoIndex;
      this.setStatus(
        t("Selected %(name)s. Choose another photo to swap, or press Escape.", {
          name: this.photos[photoIndex]?.name ?? "",
        }),
      );
    } else if (this.selected === photoIndex) {
      this.selected = null;
      this.setStatus("");
    } else {
      this.page.swapPhotos(this.selected, photoIndex);
      if (this.book) {
        // The photos traded places, so they traded pages too.
        const a = this.selected;
        const pa = this.photos[a]?.bookPage ?? 0;
        const pb = this.photos[photoIndex]?.bookPage ?? 0;
        this.photos = this.photos.map((p, i) =>
          i === a ? { ...p, bookPage: pb } : i === photoIndex ? { ...p, bookPage: pa } : p,
        );
      }
      this.pageRev++;
      this.arrangedByHand = true;
      this.setStatus(
        t("Swapped %(a)s and %(b)s.", {
          a: this.photos[this.selected]?.name ?? "",
          b: this.photos[photoIndex]?.name ?? "",
        }),
      );
      this.selected = null;
    }
  }

  /** True while dragging and zooming on the preview moves the selected photo inside its cell. */
  get cropping(): boolean {
    return this.cropFor !== null && this.cropFor === this.selected;
  }

  /** Turn adjusting the selected photo's crop on or off. */
  toggleCrop(): void {
    if (this.selected === null || this.multiSelected) return;
    this.cropFor = this.cropping ? null : this.selected;
    this.setStatus(this.cropping ? t("Drag the photo to move it, scroll to zoom.") : "");
  }

  /** The selected photo's cell in layout units (the page is 1 wide), if it has one. */
  private selectedCell(): { w: number; h: number } | undefined {
    const index = this.selected;
    return index === null
      ? undefined
      : this.layout?.placements.find((p) => p.photoIndex === index)?.cell;
  }

  private writeCrop(photoIndex: number, crop: PhotoCrop): void {
    const next = isDefaultCrop(crop) ? undefined : clampCrop(crop);
    this.photos = this.photos.map((p, i) => {
      if (i !== photoIndex) return p;
      const { crop: _old, ...rest } = p;
      return next ? { ...rest, crop: next } : rest;
    });
  }

  /** Slide the selected photo within its cell by a share of the poster's width. */
  panSelectedCrop(dx: number, dy: number): void {
    const index = this.selected;
    const photo = index === null ? undefined : this.photos[index];
    const cell = this.selectedCell();
    if (index === null || !photo || !cell) return;
    this.writeCrop(
      index,
      panCrop(photo.crop ?? NO_CROP, dx, dy, photo.width, photo.height, cell.w, cell.h),
    );
  }

  /** Set the selected photo's zoom (1 to MAX_ZOOM), keeping what is in the middle in the middle. */
  zoomSelectedCrop(zoom: number): void {
    const index = this.selected;
    const photo = index === null ? undefined : this.photos[index];
    const cell = this.selectedCell();
    if (index === null || !photo || !cell) return;
    this.writeCrop(
      index,
      zoomCrop(photo.crop ?? NO_CROP, zoom, photo.width, photo.height, cell.w, cell.h),
    );
  }

  zoomSelectedCropBy(factor: number): void {
    const zoom = this.selectedPhoto?.crop?.zoom ?? 1;
    this.zoomSelectedCrop(zoom * factor);
  }

  resetCrop(): void {
    if (this.selected === null) return;
    this.writeCrop(this.selected, NO_CROP);
    this.setStatus(
      t("%(name)s is back to its default crop.", { name: this.selectedPhoto?.name ?? "" }),
    );
  }

  readonly maxZoom = MAX_ZOOM;

  deselect(): void {
    this.clearSelection();
    this.setStatus("");
  }

  chooseFiles(): void {
    this.fileInput?.click();
  }

  async addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    if (this.restoring) {
      this.setStatus(t("Your new photos are added once your saved ones are back."));
    }
    await this.restoringDone;
    this.clearMessages();
    this.hideNotice();
    this.setStatus(t("Please wait"));
    const skipped: SkippedFile[] = [];
    const added = await importFiles(
      await this.openZips(files, skipped),
      this.photos,
      this.importPool,
      (m) => this.addMessage(m),
      undefined,
      (s) => skipped.push(s),
    );
    this.setStatus("");
    this.showNotice(skipped);
    if (added.length > 0) {
      const placed = this.book ? this.withPages(added, this.photos) : added;
      this.photos = [...this.photos, ...placed];
      this.relayout("search");
    }
  }

  /** Swap each ZIP (such as a zipped folder of photos) for the images inside it. */
  private async openZips(files: readonly File[], skipped: SkippedFile[]): Promise<File[]> {
    const out: File[] = [];
    for (const file of files) {
      if (!isZip(file)) {
        out.push(file);
        continue;
      }
      try {
        const inside = await unzipImages(file);
        out.push(...inside.files);
        for (const name of inside.others) skipped.push({ reason: "not-image", name });
        for (const name of inside.unreadable) skipped.push({ reason: "unreadable", name });
      } catch {
        skipped.push({ reason: "unreadable", name: file.name });
      }
    }
    return out;
  }

  /** Close the thumbnails of photos that can no longer be brought back. */
  private discardRemoved(): void {
    for (const { photo } of this.removed ?? []) photo.thumb.close();
    this.removed = null;
  }

  /** Take photos out of the collage. The last removal can be undone. */
  removePhotos(ids: ReadonlySet<string>, message: string): void {
    const items = this.photos
      .map((photo, index) => ({ photo, index }))
      .filter((entry) => ids.has(entry.photo.id));
    if (items.length === 0) return;
    this.discardRemoved();
    this.removed = items;
    this.removedPageCount = null;
    this.photos = this.photos.filter((p) => !ids.has(p.id));
    this.relayout("search");
    this.setStatus(`${message} ${t("Undo remove brings it back.")}`);
  }

  removeSelected(): void {
    const photos = this.selection.flatMap((i) => this.photos[i] ?? []);
    const first = photos[0];
    if (!first) return;
    this.removePhotos(
      new Set(photos.map((p) => p.id)),
      photos.length === 1
        ? t("Removed %(name)s.", { name: first.name })
        : t("Removed %(n)s photos.", { n: photos.length }),
    );
  }

  /** Ask, then take every photo out and go back to one page. Undo remove brings them back. */
  askRemoveAll(): void {
    const n = this.photos.length;
    if (n === 0) return;
    this.confirm({
      title: t("Remove all photos?"),
      text:
        this.pageCount > 1
          ? t("All %(n)s photos are taken out and the book goes back to one page.", { n })
          : t("All %(n)s photos are taken out.", { n }),
      action: t("Remove all"),
      run: () => this.removeAll(),
    });
  }

  removeAll(): void {
    const n = this.photos.length;
    const pages = this.pageCount;
    this.pageCount = 1;
    this.removePhotos(new Set(this.photos.map((p) => p.id)), t("Removed all %(n)s photos.", { n }));
    this.removedPageCount = pages;
  }

  /** Put the last removed photos back where they were. */
  undoRemove(): void {
    const removed = this.removed;
    if (!removed) return;
    // Skip any photo that was added again in the meantime, so none appears twice.
    const have = new Set(this.photos.map((p) => fileKey(p.file)));
    const restored = removed.filter((entry) => !have.has(fileKey(entry.photo.file)));
    for (const entry of removed) {
      if (!restored.includes(entry)) entry.photo.thumb.close();
    }
    // Entries are in their original order, so inserting each at its old index restores it.
    const photos = [...this.photos];
    for (const entry of restored) {
      photos.splice(Math.min(entry.index, photos.length), 0, entry.photo);
    }
    if (this.removedPageCount !== null) {
      this.pageCount = Math.max(this.pageCount, this.removedPageCount);
      this.removedPageCount = null;
    }
    this.photos = photos;
    this.removed = null;
    this.relayout("search");
    this.setStatus(t("Restored %(n)s photo(s).", { n: restored.length }));
  }

  /**
   * Ask for a photo to get more room, or go back to its normal size. The photo keeps the
   * request through new arrangements, resizing and adding photos; the rest of the
   * collage is recalculated around it from the same seed.
   */
  setSpan(photoIndex: number, change: Partial<PhotoSpan> | "reset"): void {
    this.setSpans([photoIndex], change);
  }

  /** The same size request for several photos at once, with one new arrangement. */
  private setSpans(indices: readonly number[], change: Partial<PhotoSpan> | "reset"): void {
    const first = this.photos[indices[0] ?? -1];
    if (!first) return;
    const wanted = new Set(indices);
    const spanOf = (photo: ImportedPhoto): PhotoSpan =>
      change === "reset" ? { ...NO_SPAN } : { ...(photo.span ?? NO_SPAN), ...change };
    this.photos = this.photos.map((p, i) => (wanted.has(i) ? { ...p, span: spanOf(p) } : p));
    this.relayout("single", true);
    const description = describeSpan(spanOf(first));
    const name = indices.length === 1 ? first.name : t("%(n)s photos", { n: indices.length });
    this.setStatus(
      description
        ? t("%(name)s: %(what)s.", { name, what: description })
        : t("%(name)s is back to its normal size.", { name }),
    );
  }

  /** Wider for every selected photo, or back to one column when the main one is already wide. */
  toggleWider(): void {
    const index = this.selected;
    if (index === null) return;
    const wide = this.photos[index]?.span?.columns === 2;
    this.setSpans(this.selection, { columns: wide ? 1 : 2 });
  }

  /** Taller in steps (2 rows, 3 rows, back to 1), following the main selected photo. */
  cycleTaller(): void {
    const index = this.selected;
    if (index === null) return;
    const rows = this.photos[index]?.span?.rows ?? 1;
    this.setSpans(this.selection, { rows: rows === 1 ? 2 : rows === 2 ? 3 : 1 });
  }

  resetSpan(): void {
    if (this.selected !== null) this.setSpans(this.selection, "reset");
  }

  // ---------------------------------------------------------------------- size

  /** Choose an ordinary poster size (leaving any multi-image post). */
  chooseSize(width: number, height: number): void {
    this.settings.splitImages = 0;
    this.applySize(width, height);
  }

  chooseNamedSize(id: string): void {
    this.customSize = false;
    const choice = SIZE_CHOICES.find((c) => c.id === id);
    if (!choice) return;
    const size = sizeOf(choice, this.portrait ? "portrait" : "landscape");
    this.chooseSize(size.width, size.height);
  }

  chooseCustomSize(): void {
    this.customSize = true;
    this.sizeEpoch++;
  }

  chooseInstagramPost(): void {
    this.customSize = false;
    this.setSplit(SPLIT_DEFAULT, SPLIT_SIDE_DEFAULT, true);
  }

  turn(portrait: boolean): void {
    this.portrait = portrait;
    const { width, height } = this.settings;
    if ((portrait && height < width) || (!portrait && width < height)) {
      this.applySize(height, width);
    } else {
      this.sizeEpoch++;
    }
  }

  /** A square keeps the last orientation chosen so the buttons do not jump. */
  private syncOrientation(): void {
    const orientation = orientationOf(this.settings.width, this.settings.height);
    if (orientation !== "square") this.portrait = orientation === "portrait";
  }

  applySize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      this.sizeEpoch++;
      return;
    }
    const clamp = clampSize(Math.round(width), Math.round(height), this.limits);
    this.settings.width = clamp.width;
    this.settings.height = clamp.height;
    this.sizeNote = clamp.clamped
      ? t("This browser can only make images up to %(w)s × %(h)s pixels here; using that size.", {
          w: clamp.width,
          h: clamp.height,
        })
      : "";
    if (this.settings.splitImages > 1) {
      // The size of a multi-image post follows from its image count and image size.
      this.setSplit(this.settings.splitImages, this.settings.height, false);
      return;
    }
    this.syncOrientation();
    this.sizeEpoch++;
    this.reshape();
  }

  /**
   * Take the size from the two fields. A size that fits is used at once; one
   * that is too large is reduced after a short pause, so typing "4000" does
   * not get cut down at "40" or while the other field still has its old value.
   */
  commitSize(width: number, height: number): void {
    clearTimeout(this.sizeTimer);
    this.pendingSize = null;
    if (clampSize(Math.round(width), Math.round(height), this.limits).clamped) {
      this.pendingSize = { width, height };
      this.sizeTimer = setTimeout(() => this.flushSize(), 600);
    } else {
      this.applySize(width, height);
    }
  }

  /** Apply any size still waiting on the pause (used before saving). */
  flushSize(): void {
    clearTimeout(this.sizeTimer);
    const pending = this.pendingSize;
    this.pendingSize = null;
    if (pending) this.applySize(pending.width, pending.height);
  }

  /**
   * Make the collage for a post of `count` square images of `side` pixels. The shape of the
   * collage changes with the number of images, so changing it makes a new arrangement.
   */
  setSplit(count: number, side: number, arrange: boolean): void {
    const n = normaliseSplit(count) || SPLIT_DEFAULT;
    let px = Math.max(
      SPLIT_SIDE_MIN,
      Math.round(Number.isFinite(side) ? side : SPLIT_SIDE_DEFAULT),
    );
    const fit = clampSize(n * px, px, this.limits);
    if (fit.clamped) px = Math.max(SPLIT_SIDE_MIN, Math.floor(Math.min(fit.height, fit.width / n)));
    this.sizeNote = fit.clamped
      ? t("This browser can only make images up to %(w)s × %(h)s pixels here; using that size.", {
          w: n * px,
          h: px,
        })
      : "";
    const changed = n !== this.settings.splitImages;
    this.settings.splitImages = n;
    this.settings.width = n * px;
    this.settings.height = px;
    this.syncOrientation();
    this.sizeEpoch++;
    if (arrange && (changed || !this.page)) this.relayout("search");
    else this.reshape();
  }

  get splitMin(): number {
    return SPLIT_MIN;
  }

  get splitMax(): number {
    return SPLIT_MAX;
  }

  // ------------------------------------------------------------------- export

  /**
   * Save the collage. A book is saved as one image per page (a zip of them, or the one image
   * when only one page has photos); `onlyPage` saves just that page of a book.
   */
  async save(onlyPage?: number): Promise<void> {
    const layout = this.layout;
    if (!layout) return;
    this.clearMessages();
    this.flushSize();
    // The size was already clamped when it was entered; clamp again in case detection finished since.
    const clamp = clampSize(this.settings.width, this.settings.height, this.limits);
    if (clamp.clamped) this.applySize(clamp.width, clamp.height);
    const settings = $state.snapshot(this.settings);
    const controller = new AbortController();
    this.cancelExport = () => controller.abort();
    this.progress = 0;
    this.dialog = "progress";
    try {
      const ext = settings.format === "jpeg" ? "jpg" : "png";
      if (layout.pages) {
        await this.saveBook(layout, settings, ext, controller.signal, onlyPage);
        return;
      }
      const blob = await exportCollage({
        layout,
        photos: this.photos,
        settings,
        pool: this.exportPool,
        signal: controller.signal,
        onProgress: (done, total) => {
          this.progress = total ? (done / total) * 100 : 100;
        },
        baseName: `collage-${this.seed}`,
      });
      const stem = `collage-${this.seed}`;
      download(blob, settings.splitImages > 1 ? `${stem}.zip` : `${stem}.${ext}`);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        this.addMessage({
          kind: "error",
          text: `${t("An error occurred while rendering image:")} ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    } finally {
      this.dialog = null;
      // A cancelled export terminated its workers; get a fresh pool ready.
      if (controller.signal.aborted) this.exportPool = new WorkerPool();
    }
  }

  /** Make the pages one after another (one canvas at a time) and download them. */
  private async saveBook(
    layout: Layout,
    settings: PosterSettings,
    ext: string,
    signal: AbortSignal,
    onlyPage?: number,
  ): Promise<void> {
    const filled = pagesWithPhotos(layout);
    const pages = onlyPage === undefined ? filled : filled.filter((k) => k === onlyPage);
    if (pages.length === 0) {
      this.addMessage({ kind: "error", text: t("That page has no photos to save.") });
      return;
    }
    if (onlyPage === undefined && pages.length < (layout.pages?.length ?? 0)) {
      const empty = (layout.pages ?? []).map((_, k) => k).filter((k) => !filled.includes(k));
      this.addMessage({
        kind: "info",
        text: t("Skipped empty page(s): %(list)s.", { list: empty.map((k) => k + 1).join(", ") }),
      });
    }
    const stem = `book-${this.seed}`;
    const carousel = settings.splitImages > 1;
    const total = layout.pages?.length ?? 1;
    const pad = (n: number) => String(n).padStart(String(total).length, "0");
    // Each page makes one image, or for a page made for a post one image per square.
    const files: { name: string; blob: Blob }[] = [];
    for (const [i, page] of pages.entries()) {
      const pieces = await exportPieces({
        layout: pageLayout(layout, page),
        photos: this.photos,
        settings,
        pool: this.exportPool,
        signal,
        onProgress: (done, count) => {
          this.progress = ((i + (count ? done / count : 1)) / pages.length) * 100;
        },
      });
      if (carousel) {
        const names = splitFileNames(`${stem}_p${pad(page + 1)}`, pieces.length, ext);
        for (const [j, blob] of pieces.entries()) files.push({ name: names[j] as string, blob });
      } else {
        files.push({ name: "", blob: pieces[0] as Blob });
      }
    }
    if (!carousel) {
      const names = bookFileNames(stem, files.length, ext);
      files.forEach((f, i) => {
        f.name = names[i] as string;
      });
    }
    if (files.length === 1) {
      const name = onlyPage === undefined ? stem : `${stem}_page-${(pages[0] ?? 0) + 1}`;
      download((files[0] as { blob: Blob }).blob, `${name}.${ext}`);
      return;
    }
    const entries = await Promise.all(
      files.map(async (f) => ({
        name: f.name,
        data: new Uint8Array(await f.blob.arrayBuffer()),
      })),
    );
    download(zipBlob(entries), `${stem}.zip`);
  }

  cancelExport: () => void = () => {};
}

export const app = new AppState();
