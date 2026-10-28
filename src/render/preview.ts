// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { pageLayout } from "../core/book";
import type { Layout, PhotoCrop, PosterSettings, Rect } from "../core/types";
import {
  borderPixels,
  type Ctx2D,
  cellPixelRects,
  drawBackground,
  drawBorders,
  drawPhoto,
  type Frame,
} from "./draw";

export interface PreviewInput {
  layout: Layout;
  /** Thumbnails indexed like `layout.placements[].photoIndex`. */
  thumbs: readonly (ImageBitmap | undefined)[];
  /** Crops indexed like `thumbs`; a photo without one is centred. */
  crops?: readonly (PhotoCrop | undefined)[];
  settings: Pick<PosterSettings, "borderWidth" | "borderColor" | "cornerStyle" | "outerBorder">;
}

/** Fit the poster inside a box, keeping its shape. */
export function fitSize(
  posterW: number,
  posterH: number,
  boxW: number,
  boxH: number,
): { width: number; height: number } {
  const scale = Math.min(boxW / posterW, boxH / posterH);
  return {
    width: Math.max(1, Math.floor(posterW * scale)),
    height: Math.max(1, Math.floor(posterH * scale)),
  };
}

/**
 * Draw the collage at `width` x `height` pixels with the same drawing code the
 * export uses, so what is previewed is what is saved.
 */
export function drawCollage(
  ctx: Ctx2D,
  width: number,
  height: number,
  input: PreviewInput,
): Rect[] {
  const { layout } = input;
  if (layout.pages) return drawBook(ctx, width, height, input);
  return drawPage(ctx, width, height, input);
}

/**
 * A book: each page is drawn on its own, as a collage of that page's size, in its place in the
 * row. The gaps between the pages are left as they are (the backdrop shows). The rectangles
 * returned follow `layout.placements`, in the row's own pixels.
 */
function drawBook(ctx: Ctx2D, width: number, height: number, input: PreviewInput): Rect[] {
  const { layout } = input;
  const rects: Rect[] = new Array(layout.placements.length);
  (layout.pages ?? []).forEach((page, k) => {
    const x = Math.round(page.x * width);
    const w = Math.max(1, Math.round((page.x + page.w) * width) - x);
    const indexes = layout.placements.flatMap((p, i) => (p.page === k ? [i] : []));
    ctx.save();
    ctx.translate(x, 0);
    ctx.beginPath();
    ctx.rect(0, 0, w, height);
    ctx.clip();
    const local = drawPage(ctx, w, height, { ...input, layout: pageLayout(layout, k) });
    ctx.restore();
    local.forEach((r, j) => {
      const at = indexes[j];
      if (at !== undefined) rects[at] = { x: r.x + x, y: r.y, w: r.w, h: r.h };
    });
  });
  return rects;
}

function drawPage(
  ctx: Ctx2D,
  width: number,
  height: number,
  { layout, thumbs, crops, settings }: PreviewInput,
): Rect[] {
  const frame: Frame = {
    corners: settings.cornerStyle,
    border: borderPixels(settings.borderWidth, width, height),
    color: settings.borderColor,
    outer: settings.outerBorder,
  };
  const rects = cellPixelRects(layout, width, height);
  drawBackground(ctx, width, height, frame);
  layout.placements.forEach((placement, i) => {
    const thumb = thumbs[placement.photoIndex];
    const rect = rects[i];
    const crop = crops?.[placement.photoIndex];
    if (thumb && rect) {
      drawPhoto(ctx, thumb, thumb.width, thumb.height, rect, width, height, frame, crop);
    }
  });
  drawBorders(ctx, rects, width, height, frame);
  return rects;
}

/** Outline a cell on the on-screen preview (never part of an export). */
export function drawSelection(ctx: Ctx2D, rect: Rect, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(rect.x + 2, rect.y + 2, rect.w - 4, rect.h - 4);
  ctx.restore();
}
