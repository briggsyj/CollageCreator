// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { percentFromBorder } from "../core/border";

/** One photo as the report needs it. */
export interface PhotoInfo {
  name: string;
  width: number;
  height: number;
  /** 1-based page and position (reading order), as an assistant names the photo. */
  page: number;
  position: number;
  selected: boolean;
  wider: boolean;
  taller: boolean;
  cropped: boolean;
}

/** A plain copy of the app's state; everything `buildReport` needs and nothing live. */
export interface ReportInput {
  photos: PhotoInfo[];
  layout: { style: string; columns: number | "auto"; columnsInUse: number | null; seed: number };
  style: { borderWidth: number; borderColor: string; corners: string; outerBorder: boolean };
  size: {
    width: number;
    height: number;
    portrait: boolean;
    named: string;
    postImages: number;
  };
  pageCount: number;
  pageCounts: number[];
  view: { tab: string; tool: string; zoomPercent: number; fit: boolean };
  save: {
    format: string;
    quality: number;
    saving: boolean;
    progress: number;
    last: { file: string; images: number } | null;
  };
  ui: {
    language: string;
    dialog: string | null;
    pendingQuestion: string | null;
    confirmationOutcome: string | null;
    notices: string[];
  };
  canUndoRemove: boolean;
  /** Names of the photos' orientation words, to keep the report short. */
}

export function orientationOf(width: number, height: number): "landscape" | "portrait" | "square" {
  return width === height ? "square" : height > width ? "portrait" : "landscape";
}

/** The state an assistant reads (see data-model.md): short, with photos grouped by page. */
export function buildReport(input: ReportInput) {
  const pages = Array.from({ length: input.pageCount }, (_, k) => ({
    page: k + 1,
    photos: input.photos
      .filter((p) => p.page === k + 1)
      .sort((a, b) => a.position - b.position)
      .map((p) => ({
        position: p.position,
        name: p.name,
        size: `${p.width}x${p.height}`,
        orientation: orientationOf(p.width, p.height),
        ...(p.selected ? { selected: true } : {}),
        ...(p.wider ? { wider: true } : {}),
        ...(p.taller ? { taller: true } : {}),
        ...(p.cropped ? { cropped: true } : {}),
      })),
  }));
  return {
    pages,
    selection: input.photos
      .filter((p) => p.selected)
      .map((p) => ({ page: p.page, position: p.position })),
    layout: input.layout,
    style: {
      borderPercent: percentFromBorder(input.style.borderWidth),
      borderColor: input.style.borderColor,
      corners: input.style.corners,
      outerBorder: input.style.outerBorder,
    },
    size: {
      width: input.size.width,
      height: input.size.height,
      orientation: input.size.portrait ? "portrait" : "landscape",
      named: input.size.named,
      instagramPostImages: input.size.postImages > 1 ? input.size.postImages : null,
    },
    pageCount: input.pageCount,
    view: input.view,
    save: input.save,
    ui: input.ui,
    canUndoRemove: input.canUndoRemove,
  };
}

export type StateReport = ReturnType<typeof buildReport>;
