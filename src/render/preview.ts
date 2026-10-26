// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

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
