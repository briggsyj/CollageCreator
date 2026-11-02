// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { readingOrder } from "../core/reading";
import type { AppState } from "../ui/app-state.svelte";
import type { PageIndex } from "./args";
import { orientationOf, type PhotoInfo, type ReportInput } from "./report";

/**
 * Photo indexes by page then position: reading order within each page, with any photo the
 * arrangement does not show yet (still loading) after those, in the order they were added.
 */
export function pageIndex(app: AppState): PageIndex {
  const pages: number[][] = Array.from({ length: app.pageCount }, () => []);
  const layout = app.layout;
  const seen = new Set<number>();
  if (layout) {
    for (const i of readingOrder(layout)) {
      const placement = layout.placements[i];
      if (!placement || seen.has(placement.photoIndex)) continue;
      seen.add(placement.photoIndex);
      const page = app.book ? (app.photos[placement.photoIndex]?.bookPage ?? 0) : 0;
      pages[Math.min(page, pages.length - 1)]?.push(placement.photoIndex);
    }
  }
  app.photos.forEach((p, i) => {
    if (seen.has(i)) return;
    const page = app.book ? (p.bookPage ?? 0) : 0;
    pages[Math.min(page, pages.length - 1)]?.push(i);
  });
  return pages;
}

/** The plain copy of the app's state that `buildReport` turns into the assistant's report. */
export function snapshotOf(app: AppState): ReportInput {
  const pages = pageIndex(app);
  const selection = new Set(app.selection);
  const photos: PhotoInfo[] = [];
  pages.forEach((indices, k) => {
    indices.forEach((index, n) => {
      const p = app.photos[index];
      if (!p) return;
      photos.push({
        name: p.name,
        width: p.width,
        height: p.height,
        page: k + 1,
        position: n + 1,
        selected: selection.has(index),
        wider: (p.span?.columns ?? 1) > 1,
        taller: (p.span?.rows ?? 1) > 1,
        cropped: p.crop !== undefined,
      });
    });
  });
  const s = app.settings;
  return {
    photos,
    layout: {
      style: app.layoutStyle,
      columns: app.columns ?? "auto",
      columnsInUse: app.columnsInUse ?? null,
      seed: app.seed,
    },
    style: {
      borderWidth: s.borderWidth,
      borderColor: s.borderColor,
      corners: s.cornerStyle,
      outerBorder: s.outerBorder,
    },
    size: {
      width: s.width,
      height: s.height,
      portrait: orientationOf(s.width, s.height) === "portrait",
      named: app.activeSize,
      postImages: s.splitImages,
    },
    pageCount: app.pageCount,
    pageCounts: [...app.pageCounts],
    view: {
      tab: app.tab,
      tool: app.activeMode,
      zoomPercent: app.zoomPercent,
      fit: app.isFit,
    },
    save: {
      format: s.format,
      quality: Math.round(s.jpegQuality * 100),
      saving: app.dialog === "progress",
      progress: Math.round(app.progress),
      last: app.lastSave,
    },
    ui: {
      language: app.lang,
      dialog: app.dialog,
      pendingQuestion: app.pendingQuestion,
      confirmationOutcome: app.confirmationOutcome,
      notices: [app.notice?.summary, ...app.messages.map((m) => m.text)]
        .filter((x): x is string => typeof x === "string")
        .slice(0, 5),
    },
    canUndoRemove: app.removed !== null,
  };
}
