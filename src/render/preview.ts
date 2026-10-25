// SPDX-License-Identifier: GPL-2.0-or-later

import type { Layout, PosterSettings, Rect } from "../core/types";
import {
  borderPixels,
  type Ctx2D,
  cellPixelRects,
  drawBackground,
  drawBorders,
  drawPhotoCover,
} from "./draw";

export interface PreviewInput {
  layout: Layout;
  /** Thumbnails indexed like `layout.placements[].photoIndex`. */
  thumbs: readonly (ImageBitmap | undefined)[];
  settings: Pick<PosterSettings, "borderWidth" | "borderColor">;
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
  { layout, thumbs, settings }: PreviewInput,
): Rect[] {
  drawBackground(ctx, width, height);
  const rects = cellPixelRects(layout, width, height);
  layout.placements.forEach((placement, i) => {
    const thumb = thumbs[placement.photoIndex];
    const rect = rects[i];
    if (thumb && rect) drawPhotoCover(ctx, thumb, thumb.width, thumb.height, rect);
  });
  drawBorders(
    ctx,
    rects,
    width,
    height,
    borderPixels(settings.borderWidth, width, height),
    settings.borderColor,
  );
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
