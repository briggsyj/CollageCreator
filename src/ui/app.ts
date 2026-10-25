// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Web, a modified version of PhotoCollage
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

import { generateLayout, MAX_COLUMNS, normaliseColumns, type Page } from "../core/layout";
import { randomSeed, seededRng } from "../core/rng";
import { generateBest, scoreLayout } from "../core/search";
import {
  type Layout,
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
import { fileKey, type ImportedPhoto, type ImportMessage, importFiles } from "../io/import";
import { loadSession, saveSession } from "../io/session";
import { type CanvasLimits, clampSize, detectLimits, FALLBACK_LIMITS } from "../platform/limits";
import { drawPhotoCover } from "../render/draw";
import { exportCollage } from "../render/export";
import { WorkerPool } from "../render/pool";
import { drawCollage, drawSelection, fitSize } from "../render/preview";
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
import { findPreset, PRESETS } from "./presets";
import { parseSeed, withSeed } from "./url";

function el<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing #${id}`);
  return found as T;
}

const LANG_KEY = "collage-web.language";

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANG_KEY);
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

/**
 * Set a node's text only when it changed. Redrawing runs while a button is being pressed (the
 * preview losing focus), and WebKit drops the click if the button's text node was replaced.
 */
function setText(node: HTMLElement, text: string): void {
  if (node.textContent !== text) node.textContent = text;
}

function storeLanguage(code: string): void {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    // storage may be unavailable (private mode); the choice just isn't remembered
  }
}

export function startApp(): void {
  const ui = {
    add: el<HTMLButtonElement>("add"),
    fileInput: el<HTMLInputElement>("file-input"),
    shuffle: el<HTMLButtonElement>("shuffle"),
    seed: el<HTMLInputElement>("seed"),
    columns: el<HTMLInputElement>("columns"),
    columnsNote: el<HTMLElement>("columns-note"),
    cropNote: el<HTMLElement>("crop-note"),
    outerBorder: el<HTMLInputElement>("outer-border"),
    dock: el<HTMLElement>("selection-dock"),
    selectionName: el<HTMLElement>("selection-name"),
    selectionDone: el<HTMLButtonElement>("selection-done"),
    widthNormal: el<HTMLButtonElement>("span-w-normal"),
    widthWider: el<HTMLButtonElement>("span-w-wider"),
    heightNormal: el<HTMLButtonElement>("span-h-normal"),
    heightTaller: el<HTMLButtonElement>("span-h-taller"),
    heightTallest: el<HTMLButtonElement>("span-h-tallest"),
    presets: el<HTMLElement>("presets"),
    columnsAuto: el<HTMLButtonElement>("columns-auto"),
    columnsCustom: el<HTMLButtonElement>("columns-custom"),
    columnsLess: el<HTMLButtonElement>("columns-less"),
    columnsMore: el<HTMLButtonElement>("columns-more"),
    borderWidthOut: el<HTMLElement>("border-width-out"),
    swatches: el<HTMLElement>("swatches"),
    customColour: el<HTMLElement>("custom-colour"),
    corners: el<HTMLElement>("corners"),
    formatPng: el<HTMLButtonElement>("format-png"),
    formatJpeg: el<HTMLButtonElement>("format-jpeg"),
    exportToggle: el<HTMLButtonElement>("export-toggle"),
    exportOptions: el<HTMLElement>("export-options"),
    outputSummary: el<HTMLElement>("output-summary"),
    photoCount: el<HTMLElement>("photo-count"),
    width: el<HTMLInputElement>("width"),
    height: el<HTMLInputElement>("height"),
    borderWidth: el<HTMLInputElement>("border-width"),
    borderColor: el<HTMLInputElement>("border-color"),
    qualityField: el<HTMLElement>("quality-field"),
    quality: el<HTMLInputElement>("quality"),
    save: el<HTMLButtonElement>("save"),
    emptyHint: el<HTMLElement>("empty-hint"),
    photoList: el<HTMLUListElement>("photo-list"),
    messages: el<HTMLElement>("messages"),
    box: el<HTMLElement>("canvas-box"),
    canvas: el<HTMLCanvasElement>("preview"),
    sizeNote: el<HTMLElement>("size-note"),
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

  const state = {
    photos: [] as ImportedPhoto[],
    // A seed in the address (a shared link, or back/forward) decides the first arrangement.
    seed: parseSeed(location.search) ?? randomSeed(),
    /** Chosen number of columns; undefined lets the original heuristic decide. */
    columns: undefined as number | undefined,
    page: null as Page | null,
    settings: {
      width: 1600,
      height: 1200,
      borderWidth: 0.005,
      borderColor: "#ffffff",
      cornerStyle: "none",
      outerBorder: true,
      format: "png",
      jpegQuality: 0.92,
    } as PosterSettings,
    limits: FALLBACK_LIMITS as CanvasLimits,
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

  function addMessage(m: ImportMessage): void {
    const div = document.createElement("div");
    div.className = m.kind;
    div.textContent = m.text;
    ui.messages.append(div);
    while (ui.messages.children.length > 8) ui.messages.firstElementChild?.remove();
  }

  function setStatus(text: string): void {
    if (!statusEl?.isConnected) {
      statusEl = document.createElement("div");
      statusEl.className = "status";
      ui.messages.prepend(statusEl);
    }
    statusEl.textContent = text;
  }

  function clearMessages(): void {
    ui.messages.replaceChildren();
    statusEl = null;
  }

  // -------------------------------------------------------------------- i18n

  function applyTranslations(): void {
    document.documentElement.lang = getLanguage().replace("_", "-");
    for (const node of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
      const key = node.dataset.i18n;
      if (key) node.textContent = t(key);
    }
    for (const node of document.querySelectorAll<HTMLElement>("[data-i18n-label]")) {
      const key = node.dataset.i18nLabel;
      if (key) node.setAttribute("aria-label", t(key));
    }
    renderPhotoList();
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

  // ------------------------------------------------------------------ layout

  function ratio(): number {
    return state.settings.height / state.settings.width;
  }

  /**
   * Make a new arrangement.
   * - "search": try several and keep the one that crops the photos least. Used when the
   *   set of photos changes, so the first thing shown is the best we can do. The seed
   *   shown is the winner's, so typing it back gives the same layout in one generation.
   * - "single": one generation from the current seed. Used for Shuffle layout, a typed
   *   seed, the number of columns and a photo's size.
   * `keepSelection` leaves the selected photo selected (its place in the list is unchanged).
   */
  function relayout(mode: "search" | "single" = "single", keepSelection = false): void {
    state.selected = keepSelection ? state.selected : null;
    state.focused = 0;
    if (state.photos.length === 0) {
      state.page = null;
    } else if (mode === "search") {
      const best = generateBest(state.photos, ratio(), randomSeed(), { columns: state.columns });
      state.page = best.page;
      state.seed = best.seed;
    } else {
      state.page = generateLayout(state.photos, ratio(), seededRng(state.seed), {
        columns: state.columns,
      });
    }
    ui.seed.value = String(state.seed);
    ui.save.disabled = state.photos.length === 0;
    ui.emptyHint.hidden = state.photos.length > 0;
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
    ui.borderColor.value = s.borderColor;
    ui.outerBorder.checked = s.outerBorder;
    ui.quality.value = String(Math.round(s.jpegQuality * 100));
    ui.columns.value = state.columns === undefined ? "" : String(state.columns);
    syncBorder();
    syncCorners();
    syncFormat();
    syncColumns();
  }

  /** Reflect the border thickness and colour in the slider's value and the swatches. */
  function syncBorder(): void {
    setText(ui.borderWidthOut, `${Math.round(state.settings.borderWidth * 1000) / 10}%`);
    const colour = state.settings.borderColor.toLowerCase();
    let known = false;
    for (const swatch of ui.swatches.querySelectorAll<HTMLButtonElement>("[data-colour]")) {
      const on = swatch.dataset.colour === colour;
      known = known || on;
      swatch.setAttribute("aria-pressed", String(on));
    }
    ui.customColour.classList.toggle("active", !known);
  }

  function syncCorners(): void {
    for (const tile of ui.corners.querySelectorAll<HTMLButtonElement>("[data-corner]")) {
      tile.setAttribute("aria-pressed", String(tile.dataset.corner === state.settings.cornerStyle));
    }
  }

  /** The file type buttons, the quality slider (JPEG only) and the one-line summary by Save. */
  function syncFormat(): void {
    const jpeg = state.settings.format === "jpeg";
    ui.formatPng.setAttribute("aria-pressed", String(!jpeg));
    ui.formatJpeg.setAttribute("aria-pressed", String(jpeg));
    ui.qualityField.hidden = !jpeg;
    setText(
      ui.outputSummary,
      `${jpeg ? "JPEG" : "PNG"}, ${state.settings.width} × ${state.settings.height} px`,
    );
  }

  /** Automatic or a chosen number; the stepper only works on a chosen number. */
  function syncColumns(): void {
    const chosen = state.columns;
    ui.columnsAuto.setAttribute("aria-pressed", String(chosen === undefined));
    ui.columnsCustom.setAttribute("aria-pressed", String(chosen !== undefined));
    ui.columnsLess.disabled = chosen === undefined || chosen <= 1;
    ui.columnsMore.disabled = chosen === undefined || chosen >= MAX_COLUMNS;
  }

  /** Bring back the photos and settings kept by an earlier visit. */
  async function restore(): Promise<void> {
    try {
      const saved = await loadSession(state.settings);
      if (saved) {
        Object.assign(state.settings, saved.session.settings);
        state.columns = saved.session.columns;
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

  /** The notes under the layout controls: how many columns are in use and how much is cropped. */
  function updateNotes(layout: Layout | null): void {
    ui.columns.placeholder = t("Auto");
    ui.columnsNote.textContent = state.page
      ? t("Columns in use: %(n)s", { n: state.page.noCols })
      : "";
    ui.cropNote.textContent = layout
      ? t("Cropped on average: %(pct)s%", {
          pct: Math.round(scoreLayout(layout, state.photos).cutOff * 100),
        })
      : "";
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

  /** The poster's size on screen when the view is "fit", in CSS pixels. */
  function fitPoster(viewport: Size): Size {
    const fit = fitSize(
      state.settings.width,
      state.settings.height,
      Math.max(160, viewport.w - 24),
      Math.max(160, viewport.h - 24),
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
    const fit = isFit(state.view);
    ui.resetView.hidden = fit;
    setText(ui.viewZoom, fit ? "" : t("Zoom: %(pct)s%", { pct: zoomPercent(state.view) }));
    const selected = state.selected === null ? undefined : state.photos[state.selected];
    ui.dock.hidden = selected === undefined;
    if (selected) setText(ui.selectionName, selected.name);
    const span = selected?.span ?? NO_SPAN;
    const press = (button: HTMLButtonElement, on: boolean) =>
      button.setAttribute("aria-pressed", String(on));
    press(ui.widthNormal, span.columns === 1);
    press(ui.widthWider, span.columns === 2);
    press(ui.heightNormal, span.rows === 1);
    press(ui.heightTaller, span.rows === 2);
    press(ui.heightTallest, span.rows === 3);
    ui.removeAll.disabled = state.photos.length === 0;
    ui.undoRemove.disabled = state.removed === null;
    setText(
      ui.photoCount,
      state.photos.length === 0 ? "" : t("%(n)s photo(s)", { n: state.photos.length }),
    );
    photoTiles.forEach((tile, i) => {
      tile.setAttribute("aria-pressed", String(i === state.selected));
    });
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

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * dpr;
    ctx.shadowOffsetY = 2 * dpr;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(ox, oy, pw, ph);
    ctx.restore();

    ctx.save();
    ctx.translate(ox, oy);
    const layout = currentLayout();
    updateNotes(layout);
    if (!layout) {
      ctx.fillStyle = "#777777";
      ctx.font = `${Math.round(ph / 20)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t("Add images..."), pw / 2, ph / 2, pw * 0.9);
      lastRects = [];
    } else {
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
    }
    ctx.restore();
    updateControls();
  }

  // ------------------------------------------------------------------ photos

  /** The tiles in the photo grid, in photo order (to show which one is selected). */
  let photoTiles: HTMLButtonElement[] = [];

  function renderPhotoList(): void {
    ui.photoList.replaceChildren();
    photoTiles = [];
    state.photos.forEach((photo, index) => {
      const li = document.createElement("li");
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.title = photo.name;
      const thumb = document.createElement("canvas");
      thumb.width = 160;
      thumb.height = 160;
      thumb.setAttribute("aria-hidden", "true");
      const tctx = thumb.getContext("2d");
      if (tctx) {
        drawPhotoCover(tctx, photo.thumb, photo.thumb.width, photo.thumb.height, {
          x: 0,
          y: 0,
          w: 160,
          h: 160,
        });
      }
      const name = document.createElement("span");
      name.className = "name sr-only";
      name.textContent = photo.name;
      tile.append(thumb, name);
      const wanted = describeSpan(photo.span);
      if (wanted) {
        const tag = document.createElement("span");
        tag.className = "badge";
        tag.textContent = wanted;
        tile.append(tag);
      }
      tile.addEventListener("click", () => selectPhoto(index));
      li.append(tile);
      photoTiles.push(tile);
      ui.photoList.append(li);
    });
    updateControls();
  }

  /** Select a photo from the grid (again to unselect); the collage shows it outlined. */
  function selectPhoto(index: number): void {
    if (state.selected === index) {
      state.selected = null;
      setStatus("");
    } else {
      state.selected = index;
      setStatus(
        t("Selected %(name)s. Choose another photo to swap, or press Escape.", {
          name: state.photos[index]?.name ?? "",
        }),
      );
    }
    draw();
  }

  async function addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    await restoring;
    clearMessages();
    setStatus(t("Please wait"));
    const added = await importFiles(files, state.photos, state.importPool, addMessage);
    if (statusEl) statusEl.remove();
    statusEl = null;
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
  function setSpan(photoIndex: number, change: Partial<PhotoSpan>): void {
    const photo = state.photos[photoIndex];
    if (!photo) return;
    const next = { ...(photo.span ?? NO_SPAN), ...change };
    if (next.columns === photo.span?.columns && next.rows === photo.span?.rows) return;
    photo.span = next;
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
    const apply = (button: HTMLButtonElement, change: Partial<PhotoSpan>) =>
      button.addEventListener("click", () => {
        if (state.selected !== null) setSpan(state.selected, change);
      });
    apply(ui.widthNormal, { columns: 1 });
    apply(ui.widthWider, { columns: 2 });
    apply(ui.heightNormal, { rows: 1 });
    apply(ui.heightTaller, { rows: 2 });
    apply(ui.heightTallest, { rows: 3 });
    ui.selectionDone.addEventListener("click", () => {
      state.selected = null;
      setStatus("");
      draw();
    });
  }

  // -------------------------------------------------------------------- tabs

  /** The sidebar's tabs: one panel at a time; arrow keys move between tabs. */
  function initTabs(): void {
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const show = (active: HTMLButtonElement, focus = false) => {
      for (const tab of tabs) {
        const on = tab === active;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
        if (panel) panel.hidden = !on;
      }
      if (focus) active.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => show(tab));
      tab.addEventListener("keydown", (e) => {
        const to =
          e.key === "ArrowRight"
            ? tabs[(i + 1) % tabs.length]
            : e.key === "ArrowLeft"
              ? tabs[(i - 1 + tabs.length) % tabs.length]
              : e.key === "Home"
                ? tabs[0]
                : e.key === "End"
                  ? tabs[tabs.length - 1]
                  : undefined;
        if (!to) return;
        e.preventDefault();
        show(to, true);
      });
    });
  }

  // ---------------------------------------------------------------- settings

  function syncSizeFields(): void {
    ui.width.value = String(state.settings.width);
    ui.height.value = String(state.settings.height);
    const index = findPreset(state.settings.width, state.settings.height);
    Array.from(ui.presets.children).forEach((chip, i) => {
      chip.setAttribute("aria-pressed", String(i === index));
    });
    syncFormat();
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

  function initSettings(): void {
    PRESETS.forEach((p) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.setAttribute("aria-pressed", "false");
      chip.append(p.label);
      if (!p.label.includes("×")) {
        const dims = document.createElement("small");
        dims.textContent = `${p.width} × ${p.height} px`;
        chip.append(dims);
      }
      chip.addEventListener("click", () => applySize(p.width, p.height));
      ui.presets.append(chip);
    });
    syncSizeFields();
    ui.borderWidth.value = String(state.settings.borderWidth * 100);
    ui.borderColor.value = state.settings.borderColor;
    syncBorder();
    syncCorners();
    syncColumns();

    for (const field of [ui.width, ui.height]) {
      field.addEventListener("input", commitSize);
      field.addEventListener("change", commitSize);
    }
    ui.borderWidth.addEventListener("input", () => {
      const pct = Number(ui.borderWidth.value);
      state.settings.borderWidth = Number.isFinite(pct) ? Math.min(20, Math.max(0, pct)) / 100 : 0;
      syncBorder();
      persist();
      draw();
    });
    ui.outerBorder.addEventListener("change", () => {
      state.settings.outerBorder = ui.outerBorder.checked;
      persist();
      draw();
    });
    for (const tile of ui.corners.querySelectorAll<HTMLButtonElement>("[data-corner]")) {
      tile.addEventListener("click", () => {
        const value = tile.dataset.corner;
        state.settings.cornerStyle =
          value === "slight" || value === "rounded" || value === "circle" ? value : "none";
        syncCorners();
        persist();
        draw();
      });
    }
    ui.borderColor.addEventListener("input", () => {
      state.settings.borderColor = ui.borderColor.value;
      syncBorder();
      persist();
      draw();
    });
    for (const swatch of ui.swatches.querySelectorAll<HTMLButtonElement>("[data-colour]")) {
      swatch.addEventListener("click", () => {
        ui.borderColor.value = swatch.dataset.colour ?? "#ffffff";
        state.settings.borderColor = ui.borderColor.value;
        syncBorder();
        persist();
        draw();
      });
    }
    const setFormat = (format: "png" | "jpeg") => {
      state.settings.format = format;
      syncFormat();
      persist();
    };
    ui.formatPng.addEventListener("click", () => setFormat("png"));
    ui.formatJpeg.addEventListener("click", () => setFormat("jpeg"));
    ui.exportToggle.addEventListener("click", () => {
      const open = ui.exportOptions.hidden;
      ui.exportOptions.hidden = !open;
      ui.exportToggle.setAttribute("aria-expanded", String(open));
    });
    ui.quality.addEventListener("input", () => {
      state.settings.jpegQuality = Number(ui.quality.value) / 100;
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
    const applyColumns = (tidy: boolean) => {
      const raw = ui.columns.value.trim();
      const columns = raw === "" ? undefined : normaliseColumns(Number(raw));
      if (tidy) ui.columns.value = columns === undefined ? "" : String(columns);
      if (columns === state.columns) return;
      state.columns = columns;
      syncColumns();
      relayout();
    };
    ui.columnsAuto.addEventListener("click", () => {
      ui.columns.value = "";
      applyColumns(true);
    });
    ui.columnsCustom.addEventListener("click", () => {
      ui.columns.value = String(state.columns ?? state.page?.noCols ?? 1);
      applyColumns(true);
    });
    const step = (by: number) => {
      ui.columns.value = String(Math.min(MAX_COLUMNS, Math.max(1, (state.columns ?? 1) + by)));
      applyColumns(true);
    };
    ui.columnsLess.addEventListener("click", () => step(-1));
    ui.columnsMore.addEventListener("click", () => step(1));
    ui.columns.addEventListener("input", () => applyColumns(false));
    ui.columns.addEventListener("change", () => applyColumns(true));
    ui.shuffle.addEventListener("click", () => {
      state.seed = randomSeed();
      relayout();
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

  function initPreview(): void {
    let dragFrom = -1;
    let panning: { x: number; y: number } | null = null;
    let pointerOver = false;

    const endPan = () => {
      panning = null;
      ui.box.classList.remove("panning");
    };
    const setSpaceHeld = (held: boolean) => {
      state.spaceHeld = held;
      ui.box.classList.toggle("pan-ready", held);
      if (!held) endPan();
    };
    const zoomAtCentre = (factor: number) => {
      const viewport = viewportSize();
      const centre = { x: viewport.w / 2, y: viewport.h / 2 };
      setView(zoomAt(state.view, factor, centre, viewport, fitPoster(viewport)));
    };

    ui.canvas.addEventListener("pointerdown", (e) => {
      ui.canvas.focus();
      if (state.spaceHeld) {
        // Space held: drag the view instead of picking a photo.
        panning = { x: e.clientX, y: e.clientY };
        ui.canvas.setPointerCapture(e.pointerId);
        ui.box.classList.add("panning");
        e.preventDefault();
        return;
      }
      dragFrom = cellAt(e.clientX, e.clientY);
    });
    ui.canvas.addEventListener("pointermove", (e) => {
      if (!panning) return;
      const viewport = viewportSize();
      const dx = e.clientX - panning.x;
      const dy = e.clientY - panning.y;
      panning = { x: e.clientX, y: e.clientY };
      setView(panBy(state.view, dx, dy, viewport, fitPoster(viewport)));
    });
    ui.canvas.addEventListener("pointerup", (e) => {
      if (panning) {
        endPan();
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
      if (e.code !== "Space" || isFormControl(e.target)) return;
      if (!pointerOver && document.activeElement !== ui.canvas) return;
      e.preventDefault();
      if (!e.repeat) setSpaceHeld(true);
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") setSpaceHeld(false);
    });
    window.addEventListener("blur", () => setSpaceHeld(false));

    ui.resetView.addEventListener("click", () => setView(FIT_VIEW));

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
      });
      download(blob, `collage-${state.seed}.${settings.format === "jpeg" ? "jpg" : "png"}`);
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
    ui.add.addEventListener("click", () => ui.fileInput.click());
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

  let restoring: Promise<void> = Promise.resolve();

  initLanguages();
  initSettings();
  initTabs();
  initPreview();
  initSpan();
  initInput();
  relayout();
  restoring = restore();
  void detectLimits().then((limits) => {
    state.limits = limits;
    applySize(state.settings.width, state.settings.height);
  });
}
