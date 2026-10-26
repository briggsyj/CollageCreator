// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Creator, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it replaces the GTK window of photocollage/gtkgui.py (add images,
// regenerate, settings for size and border, save, swap photos by clicking two
// cells) with a browser UI. The default border is 0.5 % white with square corners (the original used 1 % black).
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

import { MAX_COLUMNS, normaliseColumns } from "../core/layout";
import { randomSeed, seededRng } from "../core/rng";
import { generateBestPage, generatePage, scoreLayout } from "../core/search";
import {
  normaliseSplit,
  SPLIT_DEFAULT,
  SPLIT_MAX,
  SPLIT_MIN,
  SPLIT_SIDE_DEFAULT,
  SPLIT_SIDE_MIN,
} from "../core/split";
import {
  type CornerStyle,
  type Layout,
  type LayoutPage,
  type LayoutStyle,
  NO_SPAN,
  type PhotoSpan,
  type PosterSettings,
  type Rect,
} from "../core/types";
import {
  getLanguage,
  languages,
  preferredLanguage,
  resolveLanguage,
  setLanguage,
  t,
} from "../i18n";
import {
  fileKey,
  type ImportedPhoto,
  type ImportMessage,
  importFiles,
  type SkippedFile,
} from "../io/import";
import { loadSession, saveSession } from "../io/session";
import { type CanvasLimits, clampSize, detectLimits, FALLBACK_LIMITS } from "../platform/limits";
import { drawPhotoCover } from "../render/draw";
import { exportCollage } from "../render/export";
import { WorkerPool } from "../render/pool";
import { drawCollage, drawSelection, fitSize } from "../render/preview";
import { drawSplitMarks, SPLIT_MARGIN } from "../render/splitmarks";
import {
  FIT_VIEW,
  isFit,
  panBy,
  posterOrigin,
  posterSize,
  type Size,
  type View,
  zoomAt,
  zoomPercent,
} from "../render/view";
import { createBackdrop, updateBackdrop } from "./backdrop";
import {
  findChoice,
  findPreset,
  type Orientation,
  orientationOf,
  PRESETS,
  SIZE_CHOICES,
  type SizeGroup,
  sizeOf,
} from "./presets";
import { parseSeed, withSeed } from "./url";

function el<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing #${id}`);
  return found as T;
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

type Tab = "photos" | "poster" | "style" | "save";
type Mode = "pan" | "swap";

const TAB_TITLES: Record<Tab, string> = {
  photos: "Photos",
  poster: "Poster",
  style: "Style",
  save: "Save image",
};

const GROUP_TITLES: Record<SizeGroup, string> = {
  screen: "Screen",
  print: "Print",
  social: "Social",
};

const SWATCHES: { name: string; color: string }[] = [
  { name: "White", color: "#ffffff" },
  { name: "Black", color: "#111111" },
  { name: "Cream", color: "#f1e7d0" },
  // Muted, so the photos stay the focus: a green, a cool blue and a warm clay.
  { name: "Sage", color: "#a3b18a" },
  { name: "Dusty blue", color: "#8aa1b5" },
  { name: "Terracotta", color: "#c8785a" },
];

const CORNER_LABELS: { value: CornerStyle; label: string }[] = [
  { value: "none", label: "Square" },
  { value: "slight", label: "Slight" },
  { value: "rounded", label: "Rounded" },
];

/** How long a notice about already-added photos stays before it goes by itself. */
const DUPLICATE_NOTICE_MS = 10_000;
/** How long a status line replaces the hint in the pill over the preview. */
const STATUS_MS = 6000;
const THUMB_SIZE = 160;

export function startApp(): void {
  const ui = {
    app: el<HTMLElement>("app"),
    backdrop: el<HTMLElement>("backdrop"),
    tabs: el<HTMLElement>("tabs"),
    util: el<HTMLElement>("util"),
    sheet: el<HTMLElement>("sheet"),
    sheetTitle: el<HTMLElement>("sheet-title"),
    sheetClose: el<HTMLButtonElement>("sheet-close"),
    saveClose: el<HTMLButtonElement>("save-close"),
    menuOpen: el<HTMLButtonElement>("menu-open"),
    add: el<HTMLButtonElement>("add"),
    addEmpty: el<HTMLButtonElement>("add-empty"),
    fileInput: el<HTMLInputElement>("file-input"),
    regenerate: el<HTMLButtonElement>("regenerate"),
    shuffle: el<HTMLButtonElement>("shuffle"),
    seed: el<HTMLInputElement>("seed"),
    splitControls: el<HTMLElement>("split-controls"),
    splitCount: el<HTMLInputElement>("split-count"),
    splitLess: el<HTMLButtonElement>("split-less"),
    splitMore: el<HTMLButtonElement>("split-more"),
    splitSize: el<HTMLInputElement>("split-size"),
    splitHint: el<HTMLElement>("split-hint"),
    splitNote: el<HTMLElement>("split-note"),
    columns: el<HTMLInputElement>("columns"),
    columnsLess: el<HTMLButtonElement>("columns-less"),
    columnsMore: el<HTMLButtonElement>("columns-more"),
    columnsAuto: el<HTMLButtonElement>("columns-auto"),
    columnsBlock: el<HTMLElement>("columns-block"),
    columnsNote: el<HTMLElement>("columns-note"),
    galleryNote: el<HTMLElement>("gallery-note"),
    layoutMosaic: el<HTMLButtonElement>("layout-mosaic"),
    layoutGallery: el<HTMLButtonElement>("layout-gallery"),
    cropNote: el<HTMLElement>("crop-note"),
    outerBorder: el<HTMLInputElement>("outer-border"),
    dock: el<HTMLElement>("selected-dock"),
    dockName: el<HTMLElement>("dock-name"),
    dockDone: el<HTMLButtonElement>("dock-done"),
    spanWider: el<HTMLButtonElement>("span-wider"),
    spanTaller: el<HTMLButtonElement>("span-taller"),
    spanReset: el<HTMLButtonElement>("span-reset"),
    preset: el<HTMLSelectElement>("preset"),
    sizeChoices: el<HTMLElement>("size-choices"),
    orientLandscape: el<HTMLButtonElement>("orient-landscape"),
    orientPortrait: el<HTMLButtonElement>("orient-portrait"),
    width: el<HTMLInputElement>("width"),
    height: el<HTMLInputElement>("height"),
    borderWidth: el<HTMLInputElement>("border-width"),
    borderOutput: el<HTMLOutputElement>("border-output"),
    borderColor: el<HTMLInputElement>("border-color"),
    swatches: el<HTMLElement>("swatches"),
    cornerStyle: el<HTMLSelectElement>("corner-style"),
    cornerCards: el<HTMLElement>("corner-cards"),
    format: el<HTMLSelectElement>("format"),
    formatPng: el<HTMLButtonElement>("format-png"),
    formatJpeg: el<HTMLButtonElement>("format-jpeg"),
    qualityField: el<HTMLElement>("quality-field"),
    quality: el<HTMLInputElement>("quality"),
    qualityOutput: el<HTMLOutputElement>("quality-output"),
    saveSummary: el<HTMLElement>("save-summary"),
    save: el<HTMLButtonElement>("save"),
    emptyHint: el<HTMLElement>("empty-hint"),
    photoCount: el<HTMLElement>("photo-count"),
    photoList: el<HTMLUListElement>("photo-list"),
    notices: el<HTMLElement>("notices"),
    noticesSummary: el<HTMLElement>("notices-summary"),
    noticesList: el<HTMLUListElement>("notices-list"),
    noticesDetails: el<HTMLButtonElement>("notices-details"),
    noticesDismiss: el<HTMLButtonElement>("notices-dismiss"),
    messages: el<HTMLElement>("messages"),
    hint: el<HTMLElement>("hint"),
    statusLine: el<HTMLElement>("status-line"),
    box: el<HTMLElement>("canvas-box"),
    canvas: el<HTMLCanvasElement>("preview"),
    empty: el<HTMLElement>("empty-state"),
    sizeNote: el<HTMLElement>("size-note"),
    modePan: el<HTMLButtonElement>("mode-pan"),
    modeSwap: el<HTMLButtonElement>("mode-swap"),
    zoomIn: el<HTMLButtonElement>("zoom-in"),
    zoomOut: el<HTMLButtonElement>("zoom-out"),
    viewZoom: el<HTMLElement>("view-zoom"),
    resetView: el<HTMLButtonElement>("reset-view"),
    removeSelected: el<HTMLButtonElement>("remove-selected"),
    undoRemove: el<HTMLButtonElement>("undo-remove"),
    removeAll: el<HTMLButtonElement>("remove-all"),
    progressDialog: el<HTMLDialogElement>("progress-dialog"),
    progress: el<HTMLProgressElement>("progress"),
    cancel: el<HTMLButtonElement>("cancel"),
    aboutDialog: el<HTMLDialogElement>("about-dialog"),
    aboutOpen: el<HTMLButtonElement>("about-open"),
    aboutClose: el<HTMLButtonElement>("about-close"),
    language: el<HTMLSelectElement>("language"),
  };

  const narrowQuery = window.matchMedia("(max-width: 760px)");
  const backdropCells = createBackdrop(ui.backdrop);
  const isNarrow = () => narrowQuery.matches;

  const state = {
    photos: [] as ImportedPhoto[],
    // A seed in the address (a shared link, or back/forward) decides the first arrangement.
    seed: parseSeed(location.search) ?? randomSeed(),
    /** Chosen number of columns (Mosaic only); undefined lets the original heuristic decide. */
    columns: undefined as number | undefined,
    layoutStyle: "mosaic" as LayoutStyle,
    page: null as LayoutPage | null,
    settings: {
      width: 1600,
      height: 1200,
      borderWidth: 0.005,
      borderColor: "#ffffff",
      cornerStyle: "none",
      outerBorder: true,
      splitImages: 0,
      format: "png",
      jpegQuality: 0.92,
    } as PosterSettings,
    /** True once the user typed a size or picked Custom, until a named size is chosen again. */
    customSize: false,
    /** The orientation last chosen; a square keeps it so the buttons do not jump. */
    portrait: false,
    limits: FALLBACK_LIMITS as CanvasLimits,
    tab: "photos" as Tab,
    mode: "pan" as Mode,
    selected: null as number | null,
    focused: 0,
    /** Zoom and pan of the preview; FIT_VIEW shows the whole poster. */
    view: FIT_VIEW as View,
    /** True while Space is held over the preview: dragging then pans instead of picking photos. */
    spaceHeld: false,
    /** What the last removal took out and where, so it can be undone. */
    removed: null as { photo: ImportedPhoto; index: number }[] | null,
    // Created up front so the worker script is fetched while the network is
    // still there; the app then keeps working offline.
    importPool: new WorkerPool(2),
    exportPool: new WorkerPool(),
  };

  // ---------------------------------------------------------------- messages

  let statusEl: HTMLElement | null = null;
  let statusTimer: ReturnType<typeof setTimeout> | undefined;

  /** What the pill over the preview says when no status is being shown. */
  function modeHint(): string {
    if (state.photos.length === 0) {
      return t("Add photos to start. Then drag to pan or choose Swap.");
    }
    return state.mode === "pan"
      ? t("Drag to pan, scroll to zoom. Choose Swap to exchange photos.")
      : t("Click a photo, then another, to swap them. Hold Space to pan.");
  }

  function addMessage(m: ImportMessage): void {
    const div = document.createElement("div");
    div.className = m.kind;
    div.textContent = m.text;
    ui.messages.append(div);
    while (ui.messages.children.length > 8) ui.messages.firstElementChild?.remove();
  }

  /** Show a status line (for screen readers, and in the pill over the preview for a while). */
  function setStatus(text: string): void {
    if (!statusEl?.isConnected) {
      statusEl = document.createElement("div");
      statusEl.className = "status";
      ui.messages.prepend(statusEl);
    }
    statusEl.textContent = text;
    clearTimeout(statusTimer);
    ui.hint.textContent = text || modeHint();
    if (text) {
      statusTimer = setTimeout(() => {
        ui.hint.textContent = modeHint();
      }, STATUS_MS);
    }
  }

  function clearMessages(): void {
    ui.messages.replaceChildren();
    statusEl = null;
  }

  // ----------------------------------------------------------------- notices

  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  function hideNotices(): void {
    clearTimeout(noticeTimer);
    ui.notices.hidden = true;
    ui.noticesList.hidden = true;
    ui.noticesDetails.setAttribute("aria-expanded", "false");
  }

  /** Summarise what was not added: counts by reason, with the file names under Details. */
  function showNotices(skipped: readonly SkippedFile[]): void {
    hideNotices();
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
    ui.noticesSummary.textContent = t("%(n)s skipped: %(what)s", {
      n: skipped.length,
      what: parts.join(", "),
    });
    ui.noticesList.replaceChildren(
      ...skipped.map((s) => {
        const li = document.createElement("li");
        const why =
          s.reason === "duplicate"
            ? t("already added")
            : s.reason === "not-image"
              ? t("not an image")
              : t("could not be opened");
        li.textContent = `${s.name}: ${why}`;
        return li;
      }),
    );
    const onlyDuplicates = duplicates === skipped.length;
    ui.notices.dataset.kind = onlyDuplicates ? "info" : "error";
    ui.notices.hidden = false;
    if (onlyDuplicates) noticeTimer = setTimeout(hideNotices, DUPLICATE_NOTICE_MS);
  }

  // -------------------------------------------------------------------- i18n

  function applyTranslations(): void {
    document.documentElement.lang = getLanguage().replace("_", "-");
    for (const node of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
      const key = node.dataset.i18n;
      if (key) node.textContent = t(key);
    }
    renderSizeChoices();
    renderCornerCards();
    renderPhotoList();
    setTab(state.tab, false);
    ui.hint.textContent = modeHint();
    syncSizeFields();
    updateNotes(currentLayout());
  }

  function initLanguages(): void {
    for (const code of languages) {
      const option = document.createElement("option");
      option.value = code;
      let name = code;
      try {
        name =
          new Intl.DisplayNames([code.replace("_", "-")], { type: "language" }).of(
            code.replace("_", "-"),
          ) ?? code;
      } catch {
        // keep the code
      }
      option.textContent = name;
      ui.language.append(option);
    }
    // A language chosen earlier wins; otherwise the browser's own preferences, then English.
    const stored = readStoredLanguage();
    const initial = stored ? resolveLanguage(stored) : preferredLanguage(browserLanguages());
    setLanguage(initial);
    ui.language.value = initial;
    ui.language.addEventListener("change", () => {
      setLanguage(ui.language.value);
      storeLanguage(ui.language.value);
      applyTranslations();
    });
    applyTranslations();
  }

  // -------------------------------------------------------------------- tabs

  const panelOf: Record<Exclude<Tab, "save">, HTMLElement> = {
    photos: el("panel-photos"),
    poster: el("panel-poster"),
    style: el("panel-style"),
  };
  const tabButtons: Record<Tab, HTMLButtonElement> = {
    photos: el("tab-photos"),
    poster: el("tab-poster"),
    style: el("tab-style"),
    save: el("tab-save"),
  };

  function closeMenu(): void {
    ui.app.dataset.menu = "closed";
    ui.menuOpen.setAttribute("aria-expanded", "false");
  }

  /**
   * Show a step. On wide screens exactly one step is always shown. On narrow screens a step
   * is a sheet over the collage: choosing the open one again (or Close) puts it away.
   * `toggle` is true when the person pressed a tab or Close.
   */
  function setTab(requested: Tab, toggle: boolean): void {
    const narrow = isNarrow();
    const tab: Tab = !narrow && requested === "save" ? "photos" : requested;
    const wasOpen = ui.app.dataset.open === "true";
    const previousTab = state.tab;
    const closing = narrow && toggle && wasOpen && state.tab === tab;
    const open = narrow && !closing && (toggle || wasOpen);
    state.tab = tab;
    ui.app.dataset.tab = tab;
    ui.app.dataset.open = String(open);
    for (const name of Object.keys(tabButtons) as Tab[]) {
      const selected = name === tab && (!narrow || open);
      tabButtons[name].setAttribute("aria-selected", String(selected));
      tabButtons[name].tabIndex = name === tab ? 0 : -1;
    }
    for (const name of Object.keys(panelOf) as (keyof typeof panelOf)[]) {
      panelOf[name].hidden = name !== tab;
    }
    ui.sheetTitle.textContent = t(TAB_TITLES[tab]);
    if (tab !== previousTab) ui.sheet.scrollTop = 0;
    syncTabsLift();
    if (open) closeMenu();
  }

  /** On wide screens the tab bar floats over the step once it is scrolled (see .tabs.lifted). */
  function syncTabsLift(): void {
    ui.tabs.classList.toggle("lifted", ui.sheet.scrollTop > 1);
  }

  function initTabs(): void {
    ui.sheet.addEventListener("scroll", syncTabsLift, { passive: true });
    for (const name of Object.keys(tabButtons) as Tab[]) {
      tabButtons[name].addEventListener("click", () => setTab(name, true));
    }
    ui.tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const shown = (Object.keys(tabButtons) as Tab[]).filter(
        (name) => tabButtons[name].offsetParent !== null,
      );
      const at = shown.indexOf(state.tab);
      const step = e.key === "ArrowRight" ? 1 : -1;
      const next = shown[(at + step + shown.length) % shown.length];
      if (!next) return;
      e.preventDefault();
      setTab(next, false);
      tabButtons[next].focus();
    });
    ui.sheetClose.addEventListener("click", () => setTab(state.tab, true));
    ui.saveClose.addEventListener("click", () => setTab("save", true));
    ui.menuOpen.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = ui.app.dataset.menu !== "open";
      ui.app.dataset.menu = open ? "open" : "closed";
      ui.menuOpen.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (ui.app.dataset.menu !== "open") return;
      if (e.target instanceof Node && ui.util.contains(e.target)) return;
      closeMenu();
    });
    narrowQuery.addEventListener("change", () => {
      setTab(state.tab, false);
      draw();
    });
    closeMenu();
    setTab("photos", false);
  }

  // ------------------------------------------------------------------ layout

  function ratio(): number {
    return state.settings.height / state.settings.width;
  }

  /**
   * Make a new arrangement.
   * - "search": try several and keep the one that crops the photos least. Used when the
   *   set of photos changes, so the first thing shown is the best we can do. The seed
   *   shown is the winner's, so typing it back gives the same layout in one generation.
   * - "single": one generation from the current seed. Used for Regenerate, a typed
   *   seed, the number of columns and a photo's size.
   * `keepSelection` leaves the selected photo selected (its place in the list is unchanged).
   */
  function relayout(mode: "search" | "single" = "single", keepSelection = false): void {
    state.selected = keepSelection ? state.selected : null;
    state.focused = 0;
    if (state.photos.length === 0) {
      state.page = null;
    } else if (mode === "search") {
      const best = generateBestPage(state.layoutStyle, state.photos, ratio(), randomSeed(), {
        columns: state.columns,
      });
      state.page = best.page;
      state.seed = best.seed;
    } else {
      state.page = generatePage(state.layoutStyle, state.photos, ratio(), seededRng(state.seed), {
        columns: state.columns,
      });
    }
    ui.seed.value = String(state.seed);
    ui.save.disabled = state.photos.length === 0;
    ui.emptyHint.hidden = state.photos.length > 0;
    ui.hint.textContent = modeHint();
    updateBackdrop(
      backdropCells,
      state.photos.map((p) => p.colour),
    );
    syncUrl();
    persist();
    draw();
  }

  // ------------------------------------------------------- address and storage

  /** True while the address may be rewritten in place instead of adding a history entry. */
  let replaceUrl = true;

  /**
   * Keep the seed in the address, so the browser's back and forward buttons step through
   * earlier arrangements. A new arrangement adds a history entry; startup and restoring
   * saved work rewrite the current one.
   */
  function syncUrl(): void {
    try {
      const next = withSeed(location.href, state.seed);
      if (next === location.href) return;
      if (replaceUrl) history.replaceState(null, "", next);
      else history.pushState(null, "", next);
    } catch {
      // history can be unavailable (sandboxed frames); the seed field still works
    }
  }

  window.addEventListener("popstate", () => {
    const seed = parseSeed(location.search);
    if (seed === undefined || seed === state.seed) return;
    state.seed = seed;
    relayout();
  });

  /** Nothing is saved until saved work has been restored, or it would overwrite it. */
  let persistReady = false;
  let persistWarned = false;
  let persistTimer: ReturnType<typeof setTimeout> | undefined;

  /** Save the photos and settings in this browser shortly after the last change. */
  function persist(): void {
    if (!persistReady) return;
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      const files = new Map(state.photos.map((p) => [fileKey(p.file), p.file]));
      saveSession(
        {
          v: 1,
          photos: state.photos.map((p) => ({
            key: fileKey(p.file),
            span: p.span ?? { ...NO_SPAN },
          })),
          seed: state.seed,
          columns: state.columns,
          layoutStyle: state.layoutStyle,
          settings: { ...state.settings },
        },
        files,
      ).catch(() => {
        if (persistWarned) return;
        persistWarned = true;
        addMessage({
          kind: "error",
          text: t(
            "Your work could not be kept for next time: browser storage is unavailable or full.",
          ),
        });
      });
    }, 250);
  }

  /** Show the stored settings in the controls. */
  function showSettings(): void {
    const s = state.settings;
    ui.borderWidth.value = String(Math.round(s.borderWidth * 1000) / 10);
    ui.borderOutput.textContent = `${ui.borderWidth.value}%`;
    paintRange(ui.borderWidth);
    ui.borderColor.value = s.borderColor;
    ui.outerBorder.checked = s.outerBorder;
    ui.quality.value = String(Math.round(s.jpegQuality * 100));
    ui.qualityOutput.textContent = `${ui.quality.value}%`;
    paintRange(ui.quality);
    ui.columns.value = state.columns === undefined ? "" : String(state.columns);
    ui.cornerStyle.value = s.cornerStyle;
    setFormat(s.format);
    syncColourControls();
    syncCornerCards();
    syncSizeFields();
  }

  /** Bring back the photos and settings kept by an earlier visit. */
  async function restore(): Promise<void> {
    try {
      const saved = await loadSession(state.settings);
      if (saved) {
        Object.assign(state.settings, saved.session.settings);
        state.columns = saved.session.columns;
        state.layoutStyle = saved.session.layoutStyle ?? "mosaic";
        showSettings();
        const files = saved.session.photos
          .map((p) => saved.files.get(p.key))
          .filter((f): f is File => f !== undefined);
        const photos = await importFiles(files, [], state.importPool, addMessage);
        const spans = new Map(saved.session.photos.map((p) => [p.key, p.span]));
        for (const photo of photos) photo.span = { ...(spans.get(fileKey(photo.file)) ?? NO_SPAN) };
        state.photos = photos;
        // An address with a seed wins over the stored one.
        state.seed = parseSeed(location.search) ?? saved.session.seed;
        applySize(state.settings.width, state.settings.height);
        relayout();
        renderPhotoList();
      }
    } catch {
      // nothing usable stored (or storage is unavailable): start empty
    } finally {
      persistReady = true;
      replaceUrl = false;
    }
  }

  /** The notes about the layout: how many columns are in use and how much is trimmed. */
  function updateNotes(layout: Layout | null): void {
    ui.columns.placeholder = t("Auto");
    const gallery = state.layoutStyle === "gallery";
    ui.columnsBlock.hidden = gallery;
    ui.galleryNote.hidden = !gallery;
    ui.layoutMosaic.setAttribute("aria-pressed", String(!gallery));
    ui.layoutGallery.setAttribute("aria-pressed", String(gallery));
    const columns = state.page?.noCols;
    ui.columnsNote.textContent =
      columns !== undefined ? t("Columns in use: %(n)s", { n: columns }) : "";
    const pct = layout ? Math.round(scoreLayout(layout, state.photos).cutOff * 100) : 0;
    ui.cropNote.textContent = layout ? t("%(pct)s% of each photo is trimmed to fit.", { pct }) : "";
    const n = state.photos.length;
    ui.statusLine.textContent = layout
      ? [
          n === 1 ? t("1 photo") : t("%(n)s photos", { n }),
          gallery ? t("Gallery") : t("%(n)s columns", { n: columns ?? 0 }),
          t("%(pct)s% trimmed", { pct }),
        ].join(" · ")
      : t("No photos yet");
  }

  function currentLayout(): Layout | null {
    return state.page ? state.page.toLayout() : null;
  }

  /** Cells in reading order (top to bottom, left to right), for keyboard navigation. */
  function readingOrder(layout: Layout): number[] {
    return layout.placements
      .map((p, i) => ({ i, y: Math.round(p.cell.y * 1000), x: p.cell.x }))
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((e) => e.i);
  }

  let lastRects: Rect[] = [];
  /** Where the poster's top-left corner is on the canvas, in canvas pixels. */
  let lastOrigin = { x: 0, y: 0 };
  let frameRequested = false;

  function viewportSize(): Size {
    return { w: ui.box.clientWidth, h: ui.box.clientHeight };
  }

  /**
   * The poster's size on screen when the view is "fit", in CSS pixels. Room is left for the
   * tools on the right and the pill on the top (wide screens), or for the bars (phones).
   */
  function fitPoster(viewport: Size): Size {
    const padX = isNarrow() ? 12 : 88;
    const padY = isNarrow() ? 104 : 72;
    // A collage for a multi-image post keeps room above and below for the cut marks.
    const marks = state.settings.splitImages > 1 ? 2 * SPLIT_MARGIN : 0;
    const fit = fitSize(
      state.settings.width,
      state.settings.height,
      Math.max(160, viewport.w - 2 * padX),
      Math.max(160, viewport.h - 2 * padY - marks),
    );
    return { w: fit.width, h: fit.height };
  }

  /** Redraw on the next frame: wheel and drag events can arrive faster than that. */
  function requestDraw(): void {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      frameRequested = false;
      draw();
    });
  }

  function setView(view: View): void {
    state.view = view;
    requestDraw();
  }

  /** Controls that depend on the view and on what is selected. */
  function updateControls(): void {
    const none = state.photos.length === 0;
    const fit = isFit(state.view);
    ui.resetView.disabled = fit || none;
    ui.viewZoom.textContent = fit ? "" : t("Zoom: %(pct)s%", { pct: zoomPercent(state.view) });
    const n = state.photos.length;
    ui.photoCount.textContent = n === 1 ? t("1 photo") : t("%(n)s photos", { n });
    const selected = state.selected === null ? undefined : state.photos[state.selected];
    ui.dock.hidden = selected === undefined;
    ui.dockName.textContent = selected?.name ?? "";
    const span = selected?.span ?? NO_SPAN;
    ui.spanWider.setAttribute("aria-pressed", String(span.columns === 2));
    // Only touch the label when it changes: redrawing on the canvas losing focus runs this in
    // the middle of a press on this very button, and WebKit drops the click if the button's
    // text node is replaced by then.
    const taller = span.rows > 1 ? `${t("Taller")} ×${span.rows}` : t("Taller");
    if (ui.spanTaller.textContent !== taller) ui.spanTaller.textContent = taller;
    ui.spanReset.disabled = span.columns === 1 && span.rows === 1;
    ui.removeAll.disabled = none;
    ui.undoRemove.disabled = state.removed === null;
    ui.photoList.querySelectorAll("button.tile").forEach((tile, i) => {
      tile.setAttribute("aria-pressed", String(i === state.selected));
    });
    ui.modePan.setAttribute("aria-pressed", String(state.mode === "pan"));
    ui.modeSwap.setAttribute("aria-pressed", String(state.mode === "swap"));
    ui.box.classList.toggle("pan-mode", state.mode === "pan");
    for (const button of [ui.modePan, ui.modeSwap, ui.zoomIn, ui.zoomOut, ui.shuffle]) {
      button.disabled = none;
    }
    ui.app.dataset.empty = String(none);
    ui.empty.hidden = !none;
  }

  function draw(): void {
    const viewport = viewportSize();
    const fit = fitPoster(viewport);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // The canvas fills the preview area; the poster is drawn on it at the current zoom and pan.
    ui.canvas.width = Math.max(1, Math.round(viewport.w * dpr));
    ui.canvas.height = Math.max(1, Math.round(viewport.h * dpr));
    const ctx = ui.canvas.getContext("2d");
    if (!ctx) return;

    const size = posterSize(fit, state.view);
    const origin = posterOrigin(viewport, fit, state.view);
    const pw = Math.max(1, Math.round(size.w * dpr));
    const ph = Math.max(1, Math.round(size.h * dpr));
    const ox = Math.round(origin.x * dpr);
    const oy = Math.round(origin.y * dpr);
    lastOrigin = { x: ox, y: oy };
    // Where the poster is, in CSS pixels from the canvas's top-left (used by tests and tooling).
    ui.canvas.dataset.poster = [ox, oy, pw, ph].map((n) => (n / dpr).toFixed(1)).join(",");
    // The empty drop target has the poster's shape and size.
    ui.empty.style.setProperty("--empty-w", `${fit.w}px`);
    ui.empty.style.setProperty("--empty-h", `${fit.h}px`);

    const layout = currentLayout();
    updateNotes(layout);
    if (!layout) {
      lastRects = [];
      updateControls();
      return;
    }

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * dpr;
    ctx.shadowOffsetY = 2 * dpr;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(ox, oy, pw, ph);
    ctx.restore();

    ctx.save();
    ctx.translate(ox, oy);
    const thumbs = state.photos.map((p) => p.thumb);
    lastRects = drawCollage(ctx, pw, ph, { layout, thumbs, settings: state.settings });

    const order = readingOrder(layout);
    const focusCell = order[state.focused];
    if (document.activeElement === ui.canvas && focusCell !== undefined) {
      const rect = lastRects[focusCell];
      if (rect) drawSelection(ctx, rect, "#ff9d00");
    }
    if (state.selected !== null) {
      const i = layout.placements.findIndex((p) => p.photoIndex === state.selected);
      const rect = lastRects[i];
      if (rect) drawSelection(ctx, rect, "#1f5fbf");
    }
    ctx.restore();
    if (state.settings.splitImages > 1) {
      const colour =
        getComputedStyle(document.documentElement).getPropertyValue("--sub").trim() || "#3b3b37";
      drawSplitMarks(
        ctx,
        { x: ox, y: oy, w: pw, h: ph },
        state.settings.splitImages,
        dpr,
        colour,
        t("Cut along the dashed lines: the collage is split into %(n)s images for the post.", {
          n: state.settings.splitImages,
        }),
      );
    }
    updateControls();
  }

  // ------------------------------------------------------------------ photos

  function renderPhotoList(): void {
    ui.photoList.replaceChildren();
    state.photos.forEach((photo, index) => {
      const li = document.createElement("li");
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.setAttribute("aria-pressed", String(index === state.selected));
      const wanted = describeSpan(photo.span);
      tile.setAttribute("aria-label", wanted ? `${photo.name}, ${wanted}` : photo.name);
      const thumb = document.createElement("canvas");
      thumb.width = THUMB_SIZE;
      thumb.height = THUMB_SIZE;
      thumb.setAttribute("aria-hidden", "true");
      const tctx = thumb.getContext("2d");
      if (tctx) {
        drawPhotoCover(tctx, photo.thumb, photo.thumb.width, photo.thumb.height, {
          x: 0,
          y: 0,
          w: THUMB_SIZE,
          h: THUMB_SIZE,
        });
      }
      tile.append(thumb);
      if (wanted) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = wanted;
        tile.append(tag);
      }
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = photo.name;
      name.title = photo.name;
      tile.append(name);
      tile.addEventListener("click", () => selectPhoto(index));
      li.append(tile);
      ui.photoList.append(li);
    });
  }

  /** Select a photo (or unselect it when it already is) from the list or the preview. */
  function selectPhoto(photoIndex: number): void {
    const photo = state.photos[photoIndex];
    if (!photo) return;
    if (state.selected === photoIndex) {
      state.selected = null;
      setStatus("");
    } else {
      state.selected = photoIndex;
      setStatus(t("Selected %(name)s.", { name: photo.name }));
    }
    draw();
  }

  /** Saved work being brought back; adding photos waits for it. */
  let restoring: Promise<void> = Promise.resolve();

  async function addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    await restoring;
    clearMessages();
    hideNotices();
    setStatus(t("Please wait"));
    const skipped: SkippedFile[] = [];
    const added = await importFiles(
      files,
      state.photos,
      state.importPool,
      addMessage,
      undefined,
      (s) => skipped.push(s),
    );
    if (statusEl) statusEl.remove();
    statusEl = null;
    clearTimeout(statusTimer);
    ui.hint.textContent = modeHint();
    showNotices(skipped);
    if (added.length > 0) {
      state.photos = [...state.photos, ...added];
      relayout("search");
      renderPhotoList();
    }
  }

  // ----------------------------------------------------------------- removal

  /** Close the thumbnails of photos that can no longer be brought back. */
  function discardRemoved(): void {
    for (const { photo } of state.removed ?? []) photo.thumb.close();
    state.removed = null;
  }

  /** Take photos out of the collage. The last removal can be undone. */
  function removePhotos(ids: ReadonlySet<string>, message: string): void {
    const items = state.photos
      .map((photo, index) => ({ photo, index }))
      .filter((entry) => ids.has(entry.photo.id));
    if (items.length === 0) return;
    discardRemoved();
    state.removed = items;
    state.photos = state.photos.filter((p) => !ids.has(p.id));
    relayout("search");
    renderPhotoList();
    setStatus(`${message} ${t("Undo remove brings it back.")}`);
  }

  /** Put the last removed photos back where they were. */
  function undoRemove(): void {
    const removed = state.removed;
    if (!removed) return;
    // Skip any photo that was added again in the meantime, so none appears twice.
    const have = new Set(state.photos.map((p) => fileKey(p.file)));
    const restored = removed.filter((entry) => !have.has(fileKey(entry.photo.file)));
    for (const entry of removed) {
      if (!restored.includes(entry)) entry.photo.thumb.close();
    }
    // Entries are in their original order, so inserting each at its old index restores it.
    for (const entry of restored) {
      state.photos.splice(Math.min(entry.index, state.photos.length), 0, entry.photo);
    }
    state.removed = null;
    relayout("search");
    renderPhotoList();
    setStatus(t("Restored %(n)s photo(s).", { n: restored.length }));
  }

  // -------------------------------------------------------------------- size

  /** Describe a photo's requested size for the list ("" when it asks for nothing). */
  function describeSpan(span: PhotoSpan | undefined): string {
    const parts: string[] = [];
    if (span?.columns === 2) parts.push(t("wider"));
    if (span && span.rows > 1) parts.push(`${t("taller")} ×${span.rows}`);
    return parts.join(" · ");
  }

  /**
   * Ask for a photo to get more room, or go back to its normal size. The photo keeps the
   * request through new arrangements, resizing and adding photos; the rest of the
   * collage is recalculated around it from the same seed.
   */
  function setSpan(photoIndex: number, change: Partial<PhotoSpan> | "reset"): void {
    const photo = state.photos[photoIndex];
    if (!photo) return;
    photo.span = change === "reset" ? { ...NO_SPAN } : { ...(photo.span ?? NO_SPAN), ...change };
    relayout("single", true);
    renderPhotoList();
    const description = describeSpan(photo.span);
    setStatus(
      description
        ? t("%(name)s: %(what)s.", { name: photo.name, what: description })
        : t("%(name)s is back to its normal size.", { name: photo.name }),
    );
  }

  function initSpan(): void {
    ui.spanWider.addEventListener("click", () => {
      const index = state.selected;
      if (index === null) return;
      const wide = state.photos[index]?.span?.columns === 2;
      setSpan(index, { columns: wide ? 1 : 2 });
    });
    ui.spanTaller.addEventListener("click", () => {
      const index = state.selected;
      if (index === null) return;
      const rows = state.photos[index]?.span?.rows ?? 1;
      setSpan(index, { rows: rows === 1 ? 2 : rows === 2 ? 3 : 1 });
    });
    ui.spanReset.addEventListener("click", () => {
      const index = state.selected;
      if (index !== null) setSpan(index, "reset");
    });
    ui.dockDone.addEventListener("click", () => {
      state.selected = null;
      setStatus("");
      draw();
    });
  }

  // ---------------------------------------------------------------- settings

  /** The "Instagram post" size button: one wide collage cut into several square images. */
  function instagramChip(): HTMLButtonElement {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.choice = "post";
    const name = document.createElement("span");
    name.textContent = t("Instagram post");
    const small = document.createElement("small");
    small.textContent = t("Several square images");
    chip.append(name, small);
    chip.addEventListener("click", () => {
      state.customSize = false;
      setSplit(SPLIT_DEFAULT, SPLIT_SIDE_DEFAULT, true);
    });
    return chip;
  }

  /** Choose an ordinary poster size (leaving any multi-image post). */
  function chooseSize(width: number, height: number): void {
    state.settings.splitImages = 0;
    applySize(width, height);
  }

  function renderSizeChoices(): void {
    ui.sizeChoices.replaceChildren();
    let group: SizeGroup | null = null;
    for (const choice of SIZE_CHOICES) {
      if (choice.group !== group) {
        group = choice.group;
        const label = document.createElement("p");
        label.className = "group-label";
        label.textContent = t(GROUP_TITLES[group]);
        ui.sizeChoices.append(label);
        if (group === "social") ui.sizeChoices.append(instagramChip());
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.dataset.choice = choice.id;
      const name = document.createElement("span");
      name.textContent = t(choice.label);
      button.append(name, document.createElement("small"));
      button.addEventListener("click", () => {
        state.customSize = false;
        const size = sizeOf(choice, state.portrait ? "portrait" : "landscape");
        chooseSize(size.width, size.height);
      });
      ui.sizeChoices.append(button);
    }
    const custom = document.createElement("button");
    custom.type = "button";
    custom.className = "chip wide-chip";
    custom.dataset.choice = "custom";
    const name = document.createElement("span");
    name.textContent = t("Custom");
    const small = document.createElement("small");
    small.textContent = t("Set your own width and height");
    custom.append(name, small);
    custom.addEventListener("click", () => {
      state.customSize = true;
      syncSizeFields();
      ui.width.focus();
    });
    ui.sizeChoices.append(custom);
  }

  function syncSizeFields(): void {
    const { width, height } = state.settings;
    ui.width.value = String(width);
    ui.height.value = String(height);
    const index = findPreset(width, height);
    ui.preset.value = index >= 0 ? String(index) : "custom";
    const orientation = orientationOf(width, height);
    if (orientation !== "square") state.portrait = orientation === "portrait";
    ui.orientLandscape.setAttribute("aria-pressed", String(orientation === "landscape"));
    ui.orientPortrait.setAttribute("aria-pressed", String(orientation === "portrait"));
    const split = state.settings.splitImages > 1;
    const match = split ? undefined : findChoice(width, height);
    const active = split ? "post" : state.customSize || !match ? "custom" : match.choice.id;
    ui.width.disabled = split;
    ui.height.disabled = split;
    ui.orientLandscape.disabled = split;
    ui.orientPortrait.disabled = split;
    syncSplit();
    const shape: Orientation = state.portrait ? "portrait" : "landscape";
    ui.sizeChoices.querySelectorAll<HTMLButtonElement>("button.chip").forEach((button) => {
      const id = button.dataset.choice;
      button.setAttribute("aria-pressed", String(id === active));
      const choice = SIZE_CHOICES.find((c) => c.id === id);
      const small = button.querySelector("small");
      if (id === "post") return;
      if (choice && small) {
        const size = sizeOf(choice, shape);
        small.textContent = `${size.width} × ${size.height}${choice.note ? ` · ${choice.note}` : ""}`;
      }
    });
    syncSaveSummary();
  }

  function applySize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      syncSizeFields();
      return;
    }
    const clamp = clampSize(Math.round(width), Math.round(height), state.limits);
    state.settings.width = clamp.width;
    state.settings.height = clamp.height;
    ui.sizeNote.textContent = clamp.clamped
      ? t("This browser can only make images up to %(w)s × %(h)s pixels here; using that size.", {
          w: clamp.width,
          h: clamp.height,
        })
      : "";
    if (state.settings.splitImages > 1) {
      // The size of a multi-image post follows from its image count and image size.
      setSplit(state.settings.splitImages, state.settings.height, false);
      return;
    }
    syncSizeFields();
    state.page?.setTargetRatio(ratio());
    persist();
    draw();
  }

  let sizeTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * Take the size from the two fields. A size that fits is used at once; one
   * that is too large is reduced after a short pause, so typing "4000" does
   * not get cut down at "40" or while the other field still has its old value.
   */
  function commitSize(): void {
    clearTimeout(sizeTimer);
    const width = Number(ui.width.value);
    const height = Number(ui.height.value);
    if (clampSize(Math.round(width), Math.round(height), state.limits).clamped) {
      sizeTimer = setTimeout(() => applySize(width, height), 600);
    } else {
      applySize(width, height);
    }
  }

  /** Apply any size still waiting on the pause (used before saving). */
  function flushSize(): void {
    if (sizeTimer === undefined) return;
    clearTimeout(sizeTimer);
    sizeTimer = undefined;
    applySize(Number(ui.width.value), Number(ui.height.value));
  }

  function syncSaveSummary(): void {
    const kind = state.settings.format === "jpeg" ? "JPEG" : "PNG";
    const n = state.settings.splitImages;
    ui.saveSummary.textContent =
      n > 1
        ? t("ZIP of %(n)s %(kind)s images, %(px)s × %(px)s px each", {
            n,
            kind,
            px: state.settings.height,
          })
        : `${kind}, ${state.settings.width} × ${state.settings.height} px`;
  }

  /** Show or hide the controls for a multi-image post. */
  function syncSplit(): void {
    const n = state.settings.splitImages;
    const on = n > 1;
    ui.splitControls.hidden = !on;
    ui.splitNote.hidden = !on;
    if (!on) return;
    const side = state.settings.height;
    if (Number(ui.splitCount.value) !== n) ui.splitCount.value = String(n);
    if (Number(ui.splitSize.value) !== side) ui.splitSize.value = String(side);
    ui.splitLess.disabled = n <= SPLIT_MIN;
    ui.splitMore.disabled = n >= SPLIT_MAX;
    ui.splitHint.textContent = t(
      "The collage is made as one wide picture and cut into %(n)s squares when you save. Use Columns to change how it is arranged.",
      { n },
    );
    ui.splitNote.textContent = t(
      "Dashed lines mark where the collage is split into %(n)s images of %(px)s × %(px)s pixels. They are saved as a zip, numbered _1 to _%(n)s from left to right.",
      { n, px: side },
    );
  }

  /**
   * Make the collage for a post of `count` square images of `side` pixels. The shape of the
   * collage changes with the number of images, so changing it makes a new arrangement.
   */
  function setSplit(count: number, side: number, arrange: boolean): void {
    const n = normaliseSplit(count) || SPLIT_DEFAULT;
    let px = Math.max(
      SPLIT_SIDE_MIN,
      Math.round(Number.isFinite(side) ? side : SPLIT_SIDE_DEFAULT),
    );
    const fit = clampSize(n * px, px, state.limits);
    if (fit.clamped) px = Math.max(SPLIT_SIDE_MIN, Math.floor(Math.min(fit.height, fit.width / n)));
    ui.sizeNote.textContent = fit.clamped
      ? t("This browser can only make images up to %(w)s × %(h)s pixels here; using that size.", {
          w: n * px,
          h: px,
        })
      : "";
    const changed = n !== state.settings.splitImages;
    state.settings.splitImages = n;
    state.settings.width = n * px;
    state.settings.height = px;
    syncSizeFields();
    if (arrange && (changed || !state.page)) {
      relayout("search");
    } else {
      state.page?.setTargetRatio(ratio());
      persist();
      draw();
    }
  }

  /** Set the filled part of a slider's track from its value. */
  function paintRange(input: HTMLInputElement): void {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const pct = max > min ? ((Number(input.value) - min) / (max - min)) * 100 : 0;
    input.style.setProperty("--p", `${Math.min(100, Math.max(0, pct))}%`);
  }

  function setFormat(format: "png" | "jpeg"): void {
    state.settings.format = format;
    ui.format.value = format;
    ui.qualityField.hidden = format !== "jpeg";
    ui.formatPng.setAttribute("aria-pressed", String(format === "png"));
    ui.formatJpeg.setAttribute("aria-pressed", String(format === "jpeg"));
    syncSaveSummary();
    persist();
  }

  function syncColourControls(): void {
    const colour = state.settings.borderColor.toLowerCase();
    ui.swatches.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.color === colour));
    });
  }

  function syncCornerCards(): void {
    ui.cornerCards.querySelectorAll<HTMLButtonElement>("button").forEach((card) => {
      card.setAttribute("aria-pressed", String(card.dataset.corner === state.settings.cornerStyle));
    });
  }

  function setCorner(value: string): void {
    state.settings.cornerStyle = value === "slight" || value === "rounded" ? value : "none";
    ui.cornerStyle.value = state.settings.cornerStyle;
    syncCornerCards();
    persist();
    draw();
  }

  function renderCornerCards(): void {
    ui.cornerCards.replaceChildren();
    for (const { value, label } of CORNER_LABELS) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.dataset.corner = value;
      const shape = document.createElement("span");
      shape.className = `shape ${value}`;
      const text = document.createElement("span");
      text.textContent = t(label);
      card.append(shape, text);
      card.addEventListener("click", () => setCorner(value));
      ui.cornerCards.append(card);
    }
    syncCornerCards();
  }

  function initSettings(): void {
    PRESETS.forEach((p, i) => {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = p.label;
      ui.preset.append(option);
    });
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "—";
    ui.preset.append(custom);
    syncSizeFields();
    ui.borderWidth.value = String(state.settings.borderWidth * 100);
    ui.borderOutput.textContent = `${ui.borderWidth.value}%`;
    paintRange(ui.borderWidth);
    ui.borderColor.value = state.settings.borderColor;
    for (const { name, color } of SWATCHES) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.color = color;
      button.setAttribute("aria-label", name);
      button.style.background = color;
      button.addEventListener("click", () => {
        ui.borderColor.value = color;
        state.settings.borderColor = color;
        syncColourControls();
        persist();
        draw();
      });
      ui.swatches.append(button);
    }
    syncColourControls();
    paintRange(ui.quality);
    ui.qualityOutput.textContent = `${ui.quality.value}%`;

    ui.preset.addEventListener("change", () => {
      const p = PRESETS[Number(ui.preset.value)];
      state.customSize = false;
      if (p) chooseSize(p.width, p.height);
    });
    for (const field of [ui.width, ui.height]) {
      field.addEventListener("input", () => {
        state.customSize = true;
        commitSize();
      });
      field.addEventListener("change", commitSize);
    }
    const turn = (portrait: boolean) => {
      state.portrait = portrait;
      const { width, height } = state.settings;
      if ((portrait && height < width) || (!portrait && width < height)) applySize(height, width);
      else syncSizeFields();
    };
    ui.orientLandscape.addEventListener("click", () => turn(false));
    ui.orientPortrait.addEventListener("click", () => turn(true));
    ui.borderWidth.addEventListener("input", () => {
      const pct = Number(ui.borderWidth.value);
      state.settings.borderWidth = Number.isFinite(pct) ? Math.min(20, Math.max(0, pct)) / 100 : 0;
      ui.borderOutput.textContent = `${Number.isFinite(pct) ? pct : 0}%`;
      paintRange(ui.borderWidth);
      persist();
      draw();
    });
    ui.outerBorder.addEventListener("change", () => {
      state.settings.outerBorder = ui.outerBorder.checked;
      persist();
      draw();
    });
    ui.cornerStyle.addEventListener("change", () => setCorner(ui.cornerStyle.value));
    ui.borderColor.addEventListener("input", () => {
      state.settings.borderColor = ui.borderColor.value;
      syncColourControls();
      persist();
      draw();
    });
    ui.format.addEventListener("change", () => {
      setFormat(ui.format.value === "jpeg" ? "jpeg" : "png");
    });
    ui.formatPng.addEventListener("click", () => setFormat("png"));
    ui.formatJpeg.addEventListener("click", () => setFormat("jpeg"));
    ui.quality.addEventListener("input", () => {
      state.settings.jpegQuality = Number(ui.quality.value) / 100;
      ui.qualityOutput.textContent = `${ui.quality.value}%`;
      paintRange(ui.quality);
      persist();
    });
    ui.seed.addEventListener("change", () => {
      const seed = Math.floor(Number(ui.seed.value));
      if (Number.isFinite(seed) && seed >= 0 && seed <= 0xffffffff) {
        state.seed = seed;
        relayout();
      } else {
        ui.seed.value = String(state.seed);
      }
    });
    ui.columns.max = String(MAX_COLUMNS);
    // Empty means automatic. Apply while typing; tidy the field once the edit is done.
    const setColumns = (columns: number | undefined, tidy: boolean) => {
      if (tidy) ui.columns.value = columns === undefined ? "" : String(columns);
      if (columns === state.columns) return;
      state.columns = columns;
      relayout();
    };
    const applyColumns = (tidy: boolean) => {
      const raw = ui.columns.value.trim();
      setColumns(raw === "" ? undefined : normaliseColumns(Number(raw)), tidy);
    };
    ui.columns.addEventListener("input", () => applyColumns(false));
    ui.columns.addEventListener("change", () => applyColumns(true));
    const stepColumns = (by: number) => {
      const current = state.columns ?? state.page?.noCols ?? 1;
      setColumns(normaliseColumns(current + by), true);
    };
    ui.columnsLess.addEventListener("click", () => stepColumns(-1));
    ui.columnsMore.addEventListener("click", () => stepColumns(1));
    ui.columnsAuto.addEventListener("click", () => setColumns(undefined, true));
    const shuffleLayout = () => {
      state.seed = randomSeed();
      relayout();
    };
    ui.regenerate.addEventListener("click", shuffleLayout);
    ui.shuffle.addEventListener("click", shuffleLayout);
    const chooseStyle = (style: LayoutStyle) => {
      if (state.layoutStyle === style) return;
      state.layoutStyle = style;
      relayout("search");
    };
    ui.layoutMosaic.addEventListener("click", () => chooseStyle("mosaic"));
    ui.layoutGallery.addEventListener("click", () => chooseStyle("gallery"));
    ui.splitLess.addEventListener("click", () =>
      setSplit(state.settings.splitImages - 1, state.settings.height, true),
    );
    ui.splitMore.addEventListener("click", () =>
      setSplit(state.settings.splitImages + 1, state.settings.height, true),
    );
    ui.splitCount.addEventListener("change", () => {
      const n = normaliseSplit(Number(ui.splitCount.value));
      if (n === 0) ui.splitCount.value = String(state.settings.splitImages);
      else setSplit(n, state.settings.height, true);
    });
    ui.splitSize.addEventListener("change", () => {
      const side = Number(ui.splitSize.value);
      if (Number.isFinite(side) && side >= SPLIT_SIDE_MIN) {
        setSplit(state.settings.splitImages, side, true);
      } else {
        ui.splitSize.value = String(state.settings.height);
      }
    });
  }

  // -------------------------------------------------------------------- swap

  function cellAt(clientX: number, clientY: number): number {
    const box = ui.canvas.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * ui.canvas.width - lastOrigin.x;
    const y = ((clientY - box.top) / box.height) * ui.canvas.height - lastOrigin.y;
    return lastRects.findIndex((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
  }

  /** Select a photo, or swap it with the one already selected. */
  function pick(cellIndex: number): void {
    const layout = currentLayout();
    const placement = layout?.placements[cellIndex];
    if (!state.page || !placement) return;
    const photoIndex = placement.photoIndex;
    if (state.selected === null) {
      state.selected = photoIndex;
      setStatus(
        t("Selected %(name)s. Choose another photo to swap, or press Escape.", {
          name: state.photos[photoIndex]?.name ?? "",
        }),
      );
    } else if (state.selected === photoIndex) {
      state.selected = null;
      setStatus("");
    } else {
      state.page.swapPhotos(state.selected, photoIndex);
      setStatus(
        t("Swapped %(a)s and %(b)s.", {
          a: state.photos[state.selected]?.name ?? "",
          b: state.photos[photoIndex]?.name ?? "",
        }),
      );
      state.selected = null;
    }
    draw();
  }

  /** Keys that should keep working normally while a form control has the focus. */
  function isFormControl(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLButtonElement
    );
  }

  function setMode(mode: Mode): void {
    state.mode = mode;
    clearTimeout(statusTimer);
    ui.hint.textContent = modeHint();
    updateControls();
  }

  function zoomAtCentre(factor: number): void {
    const viewport = viewportSize();
    const centre = { x: viewport.w / 2, y: viewport.h / 2 };
    setView(zoomAt(state.view, factor, centre, viewport, fitPoster(viewport)));
  }

  function initPreview(): void {
    let dragFrom = -1;
    let panning: { x: number; y: number } | null = null;
    let panMoved = false;
    let pointerOver = false;
    let downAt = { x: 0, y: 0 };

    const endPan = () => {
      panning = null;
      ui.box.classList.remove("panning");
    };
    const setSpaceHeld = (held: boolean) => {
      state.spaceHeld = held;
      ui.box.classList.toggle("pan-ready", held);
      if (!held) endPan();
    };

    ui.canvas.addEventListener("pointerdown", (e) => {
      ui.canvas.focus();
      // In Pan mode a drag moves the view; in Swap mode it does so only while Space is held.
      if (state.spaceHeld || state.mode === "pan") {
        panning = { x: e.clientX, y: e.clientY };
        downAt = { x: e.clientX, y: e.clientY };
        panMoved = false;
        ui.canvas.setPointerCapture(e.pointerId);
        ui.box.classList.add("panning");
        e.preventDefault();
        return;
      }
      dragFrom = cellAt(e.clientX, e.clientY);
    });
    ui.canvas.addEventListener("pointermove", (e) => {
      if (!panning) return;
      if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 4) panMoved = true;
      const viewport = viewportSize();
      const dx = e.clientX - panning.x;
      const dy = e.clientY - panning.y;
      panning = { x: e.clientX, y: e.clientY };
      setView(panBy(state.view, dx, dy, viewport, fitPoster(viewport)));
    });
    ui.canvas.addEventListener("pointerup", (e) => {
      if (panning) {
        const click = !panMoved && !state.spaceHeld && state.mode === "pan";
        endPan();
        // A press that did not move the view selects the photo under it.
        if (click) {
          const cell = cellAt(e.clientX, e.clientY);
          const photoIndex = currentLayout()?.placements[cell]?.photoIndex;
          if (photoIndex !== undefined) selectPhoto(photoIndex);
        }
        return;
      }
      const to = cellAt(e.clientX, e.clientY);
      if (to < 0) return;
      if (dragFrom >= 0 && dragFrom !== to && state.selected === null) {
        pick(dragFrom);
      }
      pick(to);
      dragFrom = -1;
    });
    ui.canvas.addEventListener("pointercancel", endPan);

    // Scrolling over the collage zooms around the mouse (pinch gestures arrive as ctrl + wheel).
    ui.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
        const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.0015));
        const box = ui.canvas.getBoundingClientRect();
        const cursor = { x: e.clientX - box.left, y: e.clientY - box.top };
        const viewport = viewportSize();
        setView(zoomAt(state.view, factor, cursor, viewport, fitPoster(viewport)));
      },
      { passive: false },
    );

    // Holding Space over the preview makes a drag move the collage. Form controls keep their own use of Space.
    ui.box.addEventListener("pointerenter", () => {
      pointerOver = true;
    });
    ui.box.addEventListener("pointerleave", () => {
      pointerOver = false;
    });
    window.addEventListener("keydown", (e) => {
      if (e.code !== "Space") return;
      // A button that still has the focus (the Pan / Swap toggle just pressed) must not swallow
      // Space while the pointer is over the preview.
      const buttonUnderPointer = pointerOver && e.target instanceof HTMLButtonElement;
      if (isFormControl(e.target) && !buttonUnderPointer) return;
      if (!pointerOver && document.activeElement !== ui.canvas) return;
      e.preventDefault();
      if (!e.repeat) setSpaceHeld(true);
    });
    window.addEventListener("keyup", (e) => {
      if (e.code !== "Space") return;
      // Stop a focused button from taking the release as a press.
      if (state.spaceHeld) e.preventDefault();
      setSpaceHeld(false);
    });
    window.addEventListener("blur", () => setSpaceHeld(false));

    ui.resetView.addEventListener("click", () => setView(FIT_VIEW));
    ui.zoomIn.addEventListener("click", () => zoomAtCentre(1.25));
    ui.zoomOut.addEventListener("click", () => zoomAtCentre(0.8));
    ui.modePan.addEventListener("click", () => setMode("pan"));
    ui.modeSwap.addEventListener("click", () => setMode("swap"));

    ui.canvas.addEventListener("keydown", (e) => {
      // View keys and undo work whether or not there are photos.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoRemove();
        return;
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomAtCentre(1.25);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomAtCentre(0.8);
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        setView(FIT_VIEW);
        return;
      }
      if (e.shiftKey && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = 40;
        const dx = e.key === "ArrowLeft" ? step : e.key === "ArrowRight" ? -step : 0;
        const dy = e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0;
        const viewport = viewportSize();
        setView(panBy(state.view, dx, dy, viewport, fitPoster(viewport)));
        return;
      }

      const layout = currentLayout();
      if (!layout) return;
      const order = readingOrder(layout);
      if (e.key === "Delete" || e.key === "Backspace") {
        // Remove the selected photo, or else the one with the focus ring.
        const photoIndex =
          state.selected ?? layout.placements[order[state.focused] ?? -1]?.photoIndex;
        const photo = photoIndex === undefined ? undefined : state.photos[photoIndex];
        e.preventDefault();
        if (photo) removePhotos(new Set([photo.id]), t("Removed %(name)s.", { name: photo.name }));
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        state.focused = (state.focused + 1) % order.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        state.focused = (state.focused - 1 + order.length) % order.length;
      } else if (e.key === "Enter") {
        const cell = order[state.focused];
        if (cell !== undefined) pick(cell);
      } else if (e.key === "Escape") {
        state.selected = null;
        setStatus("");
      } else {
        return;
      }
      e.preventDefault();
      const name =
        state.photos[layout.placements[order[state.focused] as number]?.photoIndex ?? -1]?.name;
      if (name && e.key.startsWith("Arrow")) setStatus(name);
      draw();
    });
    ui.canvas.addEventListener("focus", draw);
    ui.canvas.addEventListener("blur", draw);
    new ResizeObserver(draw).observe(ui.box);

    ui.removeSelected.addEventListener("click", () => {
      const photo = state.selected === null ? undefined : state.photos[state.selected];
      if (photo) removePhotos(new Set([photo.id]), t("Removed %(name)s.", { name: photo.name }));
    });
    ui.removeAll.addEventListener("click", () => {
      const n = state.photos.length;
      removePhotos(new Set(state.photos.map((p) => p.id)), t("Removed all %(n)s photos.", { n }));
    });
    ui.undoRemove.addEventListener("click", undoRemove);
    ui.noticesDismiss.addEventListener("click", hideNotices);
    ui.noticesDetails.addEventListener("click", () => {
      const open = ui.noticesList.hidden;
      ui.noticesList.hidden = !open;
      ui.noticesDetails.setAttribute("aria-expanded", String(open));
    });
  }

  // ------------------------------------------------------------------ export

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

  async function save(): Promise<void> {
    const layout = currentLayout();
    if (!layout) return;
    clearMessages();
    flushSize();
    // The size was already clamped when it was entered; clamp again in case detection finished since.
    const clamp = clampSize(state.settings.width, state.settings.height, state.limits);
    if (clamp.clamped) applySize(clamp.width, clamp.height);
    const settings = { ...state.settings };
    const controller = new AbortController();
    ui.cancel.onclick = () => controller.abort();
    ui.progress.value = 0;
    ui.progressDialog.showModal();
    try {
      const blob = await exportCollage({
        layout,
        photos: state.photos,
        settings,
        pool: state.exportPool,
        signal: controller.signal,
        onProgress: (done, total) => {
          ui.progress.value = total ? (done / total) * 100 : 100;
        },
        baseName: `collage-${state.seed}`,
      });
      const stem = `collage-${state.seed}`;
      download(
        blob,
        settings.splitImages > 1
          ? `${stem}.zip`
          : `${stem}.${settings.format === "jpeg" ? "jpg" : "png"}`,
      );
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        addMessage({
          kind: "error",
          text: `${t("An error occurred while rendering image:")} ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    } finally {
      ui.progressDialog.close();
      // A cancelled export terminated its workers; get a fresh pool ready.
      if (controller.signal.aborted) state.exportPool = new WorkerPool();
    }
  }

  // -------------------------------------------------------------------- wire

  function initInput(): void {
    const chooseFiles = () => ui.fileInput.click();
    ui.add.addEventListener("click", chooseFiles);
    ui.addEmpty.addEventListener("click", chooseFiles);
    ui.fileInput.addEventListener("change", () => {
      const files = Array.from(ui.fileInput.files ?? []);
      ui.fileInput.value = "";
      void addFiles(files);
    });
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
      document.body.classList.add("dragging");
    });
    window.addEventListener("dragleave", (e) => {
      if (!e.relatedTarget) document.body.classList.remove("dragging");
    });
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      document.body.classList.remove("dragging");
      void addFiles(Array.from(e.dataTransfer?.files ?? []));
    });
    ui.save.addEventListener("click", () => void save());
    ui.aboutOpen.addEventListener("click", () => ui.aboutDialog.showModal());
    ui.aboutClose.addEventListener("click", () => ui.aboutDialog.close());
  }

  // Once every worker script is loaded the app needs no more network. Exposed for tests.
  void Promise.all([state.importPool.ready, state.exportPool.ready]).then(() => {
    document.documentElement.dataset.workersReady = "true";
  });

  initTabs();
  initLanguages();
  initSettings();
  initPreview();
  initSpan();
  initInput();
  relayout();
  restoring = restore();
  // The controls respond from here on. Exposed for tests, which must not press a tab earlier.
  document.documentElement.dataset.appReady = "true";
  void detectLimits().then((limits) => {
    state.limits = limits;
    applySize(state.settings.width, state.settings.height);
  });
}
