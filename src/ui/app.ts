// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
// Copyright (C) 2026 briggsyj and contributors
//
// This file is part of Collage Web, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it replaces the GTK window of photocollage/gtkgui.py (add images,
// regenerate, settings for size and border, save, swap photos by clicking two
// cells) with a browser UI. The defaults (1 % black border) follow the original.
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

import { generateLayout, type Page } from "../core/layout";
import { randomSeed, seededRng } from "../core/rng";
import type { Layout, PosterSettings, Rect } from "../core/types";
import { getLanguage, languages, resolveLanguage, setLanguage, t } from "../i18n";
import { importFiles, type ImportedPhoto, type ImportMessage } from "../io/import";
import { CanvasLimits, clampSize, detectLimits, FALLBACK_LIMITS } from "../platform/limits";
import { drawCollage, drawSelection, fitSize } from "../render/preview";
import { drawPhotoCover } from "../render/draw";
import { exportCollage } from "../render/export";
import { WorkerPool } from "../render/pool";
import { findPreset, PRESETS } from "./presets";

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
    regenerate: el<HTMLButtonElement>("regenerate"),
    seed: el<HTMLInputElement>("seed"),
    preset: el<HTMLSelectElement>("preset"),
    width: el<HTMLInputElement>("width"),
    height: el<HTMLInputElement>("height"),
    borderWidth: el<HTMLInputElement>("border-width"),
    borderColor: el<HTMLInputElement>("border-color"),
    format: el<HTMLSelectElement>("format"),
    qualityField: el<HTMLElement>("quality-field"),
    quality: el<HTMLInputElement>("quality"),
    save: el<HTMLButtonElement>("save"),
    emptyHint: el<HTMLElement>("empty-hint"),
    photoList: el<HTMLUListElement>("photo-list"),
    messages: el<HTMLElement>("messages"),
    box: el<HTMLElement>("canvas-box"),
    canvas: el<HTMLCanvasElement>("preview"),
    sizeNote: el<HTMLElement>("size-note"),
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
    seed: randomSeed(),
    page: null as Page | null,
    settings: {
      width: 1600,
      height: 1200,
      borderWidth: 0.01,
      borderColor: "#000000",
      format: "png",
      jpegQuality: 0.92,
    } as PosterSettings,
    limits: FALLBACK_LIMITS as CanvasLimits,
    selected: null as number | null,
    focused: 0,
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
    if (!statusEl || !statusEl.isConnected) {
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
      const key = node.dataset["i18n"];
      if (key) node.textContent = t(key);
    }
    renderPhotoList();
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
    const initial = resolveLanguage(readStoredLanguage() ?? navigator.language);
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

  function relayout(): void {
    state.selected = null;
    state.focused = 0;
    state.page =
      state.photos.length === 0
        ? null
        : generateLayout(state.photos, ratio(), seededRng(state.seed));
    ui.seed.value = String(state.seed);
    ui.save.disabled = state.photos.length === 0;
    ui.emptyHint.hidden = state.photos.length > 0;
    draw();
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

  function draw(): void {
    const box = ui.box.getBoundingClientRect();
    const fit = fitSize(
      state.settings.width,
      state.settings.height,
      Math.max(160, box.width - 24),
      Math.max(160, box.height - 24),
    );
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.round(fit.width * dpr);
    const bh = Math.round(fit.height * dpr);
    ui.canvas.width = bw;
    ui.canvas.height = bh;
    ui.canvas.style.width = `${fit.width}px`;
    ui.canvas.style.height = `${fit.height}px`;
    const ctx = ui.canvas.getContext("2d");
    if (!ctx) return;

    const layout = currentLayout();
    if (!layout) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, bw, bh);
      ctx.fillStyle = "#777777";
      ctx.font = `${Math.round(bh / 20)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t("Add images..."), bw / 2, bh / 2, bw * 0.9);
      lastRects = [];
      return;
    }
    const thumbs = state.photos.map((p) => p.thumb);
    lastRects = drawCollage(ctx, bw, bh, { layout, thumbs, settings: state.settings });

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

  // ------------------------------------------------------------------ photos

  function renderPhotoList(): void {
    ui.photoList.replaceChildren();
    for (const photo of state.photos) {
      const li = document.createElement("li");
      const thumb = document.createElement("canvas");
      thumb.width = 80;
      thumb.height = 80;
      thumb.setAttribute("aria-hidden", "true");
      const tctx = thumb.getContext("2d");
      if (tctx) {
        drawPhotoCover(tctx, photo.thumb, photo.thumb.width, photo.thumb.height, {
          x: 0,
          y: 0,
          w: 80,
          h: 80,
        });
      }
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = photo.name;
      name.title = photo.name;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = t("Remove");
      remove.setAttribute("aria-label", `${t("Remove")}: ${photo.name}`);
      remove.addEventListener("click", () => {
        state.photos = state.photos.filter((p) => p.id !== photo.id);
        photo.thumb.close();
        relayout();
        renderPhotoList();
      });
      li.append(thumb, name, remove);
      ui.photoList.append(li);
    }
  }

  async function addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    clearMessages();
    setStatus(t("Please wait"));
    const added = await importFiles(files, state.photos, state.importPool, addMessage);
    if (statusEl) statusEl.remove();
    statusEl = null;
    if (added.length > 0) {
      state.photos = [...state.photos, ...added];
      relayout();
      renderPhotoList();
    }
  }

  // ---------------------------------------------------------------- settings

  function syncSizeFields(): void {
    ui.width.value = String(state.settings.width);
    ui.height.value = String(state.settings.height);
    const index = findPreset(state.settings.width, state.settings.height);
    ui.preset.value = index >= 0 ? String(index) : "custom";
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
    ui.borderColor.value = state.settings.borderColor;

    ui.preset.addEventListener("change", () => {
      const p = PRESETS[Number(ui.preset.value)];
      if (p) applySize(p.width, p.height);
    });
    for (const field of [ui.width, ui.height]) {
      field.addEventListener("input", commitSize);
      field.addEventListener("change", commitSize);
    }
    ui.borderWidth.addEventListener("input", () => {
      const pct = Number(ui.borderWidth.value);
      state.settings.borderWidth = Number.isFinite(pct) ? Math.min(20, Math.max(0, pct)) / 100 : 0;
      draw();
    });
    ui.borderColor.addEventListener("input", () => {
      state.settings.borderColor = ui.borderColor.value;
      draw();
    });
    ui.format.addEventListener("change", () => {
      state.settings.format = ui.format.value === "jpeg" ? "jpeg" : "png";
      ui.qualityField.hidden = state.settings.format !== "jpeg";
    });
    ui.quality.addEventListener("input", () => {
      state.settings.jpegQuality = Number(ui.quality.value) / 100;
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
    ui.regenerate.addEventListener("click", () => {
      state.seed = randomSeed();
      relayout();
    });
  }

  // -------------------------------------------------------------------- swap

  function cellAt(clientX: number, clientY: number): number {
    const box = ui.canvas.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * ui.canvas.width;
    const y = ((clientY - box.top) / box.height) * ui.canvas.height;
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

  function initPreview(): void {
    let dragFrom = -1;
    ui.canvas.addEventListener("pointerdown", (e) => {
      dragFrom = cellAt(e.clientX, e.clientY);
      ui.canvas.focus();
    });
    ui.canvas.addEventListener("pointerup", (e) => {
      const to = cellAt(e.clientX, e.clientY);
      if (to < 0) return;
      if (dragFrom >= 0 && dragFrom !== to && state.selected === null) {
        pick(dragFrom);
      }
      pick(to);
      dragFrom = -1;
    });
    ui.canvas.addEventListener("keydown", (e) => {
      const layout = currentLayout();
      if (!layout) return;
      const order = readingOrder(layout);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        state.focused = (state.focused + 1) % order.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        state.focused = (state.focused - 1 + order.length) % order.length;
      } else if (e.key === "Enter" || e.key === " ") {
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
    document.documentElement.dataset["workersReady"] = "true";
  });

  initLanguages();
  initSettings();
  initPreview();
  initInput();
  relayout();
  void detectLimits().then((limits) => {
    state.limits = limits;
    applySize(state.settings.width, state.settings.height);
  });
}
