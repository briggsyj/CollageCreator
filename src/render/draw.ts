// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Web, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it re-implements, for the HTML canvas, the drawing rules of
// photocollage/render.py: photos are scaled to cover their cell and centred
// (crop to fill, resize_photo), borders are a frame around the poster plus
// seams centred on cell edges (draw_borders), the border thickness is a
// fraction of the longer poster side, and the background is white.
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

import type { CornerStyle, Layout, Rect } from "../core/types";

export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Layout cells in whole pixels. Shared edges are rounded once, so neighbours never overlap or leave seams. */
export function cellPixelRects(layout: Layout, width: number, height: number): Rect[] {
  return layout.placements.map(({ cell }) => {
    const x0 = Math.round((cell.x / layout.width) * width);
    const y0 = Math.round((cell.y / layout.height) * height);
    const x1 = Math.round(((cell.x + cell.w) / layout.width) * width);
    const y1 = Math.round(((cell.y + cell.h) / layout.height) * height);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  });
}

/** Border thickness in pixels for a poster of this size. */
export function borderPixels(fraction: number, width: number, height: number): number {
  if (fraction <= 0) return 0;
  return Math.max(1, Math.round(fraction * Math.max(width, height)));
}

/**
 * Size a photo must be scaled to so it covers `cell` completely
 * (the image is cropped, never letter-boxed), never enlarging past its own size.
 */
export function coverSize(
  photoW: number,
  photoH: number,
  cellW: number,
  cellH: number,
): { width: number; height: number } {
  const scale = Math.min(1, Math.max(cellW / photoW, cellH / photoH));
  return {
    width: Math.max(1, Math.ceil(photoW * scale)),
    height: Math.max(1, Math.ceil(photoH * scale)),
  };
}

/** How the frame between and around the photos is drawn. */
export interface Frame {
  corners: CornerStyle;
  /** Border thickness in pixels. */
  border: number;
  color: string;
  /** Also draw the border around the whole collage, not only between photos. */
  outer: boolean;
}

/**
 * Corner radius as a fraction of a photo's shorter side, for the two rounded
 * styles. The "circle" style is not a radius: it is an ellipse touching all four
 * sides (like CSS `border-radius: 100%`), a circle for a square photo.
 */
export const CORNER_RADIUS = { slight: 0.08, rounded: 0.25 } as const;

/** Corner radius in pixels for a photo of this size (0 for square and for the ellipse). */
export function cornerRadius(style: CornerStyle, width: number, height: number): number {
  if (style === "slight" || style === "rounded") {
    return Math.min(width, height) * CORNER_RADIUS[style];
  }
  return 0;
}

/**
 * The part of a cell a photo occupies once the border is taken out: the border
 * thickness at the poster's edge (nothing there when there is no outer border),
 * and half of it (split so the two halves add up exactly) on each side of an edge
 * shared with a neighbour. Photos therefore never touch, and the gap between any
 * two is exactly `border` pixels.
 */
export function insetCell(
  cell: Rect,
  width: number,
  height: number,
  border: number,
  outer = true,
): Rect {
  const lo = Math.floor(border / 2);
  const hi = border - lo;
  const edge = outer ? border : 0;
  const left = cell.x <= 0 ? edge : hi;
  const top = cell.y <= 0 ? edge : hi;
  const right = cell.x + cell.w >= width ? edge : lo;
  const bottom = cell.y + cell.h >= height ? edge : lo;
  // A border wider than the cell leaves nothing: collapse to its centre, still inside the cell.
  const w = cell.w - left - right;
  const h = cell.h - top - bottom;
  return {
    x: w > 0 ? cell.x + left : cell.x + cell.w / 2,
    y: h > 0 ? cell.y + top : cell.y + cell.h / 2,
    w: Math.max(0, w),
    h: Math.max(0, h),
  };
}

/** Trace the outline of a photo of this style in `r`. */
function tracePhotoShape(ctx: Ctx2D, r: Rect, style: CornerStyle): void {
  ctx.beginPath();
  if (style === "circle") {
    ctx.ellipse(r.x + r.w / 2, r.y + r.h / 2, r.w / 2, r.h / 2, 0, 0, Math.PI * 2);
    return;
  }
  const radius = cornerRadius(style, r.w, r.h);
  if (radius <= 0) {
    ctx.rect(r.x, r.y, r.w, r.h);
    return;
  }
  ctx.moveTo(r.x + radius, r.y);
  ctx.arcTo(r.x + r.w, r.y, r.x + r.w, r.y + r.h, radius);
  ctx.arcTo(r.x + r.w, r.y + r.h, r.x, r.y + r.h, radius);
  ctx.arcTo(r.x, r.y + r.h, r.x, r.y, radius);
  ctx.arcTo(r.x, r.y, r.x + r.w, r.y, radius);
  ctx.closePath();
}

/**
 * Fill the poster. With square photos it is plain white and the border is drawn
 * over the photos afterwards. With shaped photos the gaps between and around
 * them are the border, so the poster starts as the border colour; without an outer
 * border only the gaps between photos are, so it starts white and the seams between
 * the photos are drawn now.
 */
export function drawBackground(
  ctx: Ctx2D,
  width: number,
  height: number,
  frame?: Frame,
  rects: readonly Rect[] = [],
): void {
  const shaped = frame !== undefined && frame.corners !== "none" && frame.border > 0;
  ctx.fillStyle = shaped && frame.outer ? frame.color : "#ffffff";
  ctx.fillRect(0, 0, width, height);
  if (shaped && !frame.outer) drawSeams(ctx, rects, width, height, frame.border, frame.color);
}

/**
 * Draw a photo in its cell: square photos fill the cell (the border goes over
 * them later); shaped photos are drawn inside the cell minus the border, clipped
 * to their shape.
 */
export function drawPhoto(
  ctx: Ctx2D,
  source: CanvasImageSource,
  sourceW: number,
  sourceH: number,
  cell: Rect,
  width: number,
  height: number,
  frame: Frame,
): void {
  if (frame.corners === "none") {
    drawPhotoCover(ctx, source, sourceW, sourceH, cell);
    return;
  }
  const inner = insetCell(cell, width, height, frame.border, frame.outer);
  if (inner.w <= 0 || inner.h <= 0) return;
  ctx.save();
  tracePhotoShape(ctx, inner, frame.corners);
  ctx.clip();
  drawPhotoCover(ctx, source, sourceW, sourceH, inner);
  ctx.restore();
}

/** Draw `source` so it covers `cell`, centred and cropped to it. */
export function drawPhotoCover(
  ctx: Ctx2D,
  source: CanvasImageSource,
  sourceW: number,
  sourceH: number,
  cell: Rect,
): void {
  if (cell.w <= 0 || cell.h <= 0) return;
  const scale = Math.max(cell.w / sourceW, cell.h / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, cell.w, cell.h);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, cell.x + (cell.w - w) / 2, cell.y + (cell.h - h) / 2, w, h);
  ctx.restore();
}

/** The border between photos: a seam centred on every edge shared by two cells. Clipped to the poster. */
function drawSeams(
  ctx: Ctx2D,
  rects: readonly Rect[],
  width: number,
  height: number,
  border: number,
  color: string,
): void {
  if (border <= 0) return;
  // Seams run half a border past the ends of each cell; keep that from spilling past the poster.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.clip();
  ctx.fillStyle = color;
  const lo = Math.floor(border / 2);
  for (const r of rects) {
    if (r.x > 0) ctx.fillRect(r.x - lo, r.y - lo, border, r.h + border);
    if (r.y > 0) ctx.fillRect(r.x - lo, r.y - lo, r.w + border, border);
    if (r.x + r.w < width) ctx.fillRect(r.x + r.w - lo, r.y - lo, border, r.h + border);
    if (r.y + r.h < height) ctx.fillRect(r.x - lo, r.y + r.h - lo, r.w + border, border);
  }
  ctx.restore();
}

/**
 * For square photos: the seams between photos, and (unless switched off) the
 * frame around the whole poster, drawn over the photos. Shaped photos need no
 * overlay (see drawBackground).
 */
export function drawBorders(
  ctx: Ctx2D,
  rects: readonly Rect[],
  width: number,
  height: number,
  frame: Frame,
): void {
  const { border, color } = frame;
  if (border <= 0 || frame.corners !== "none") return;
  drawSeams(ctx, rects, width, height, border, color);
  if (!frame.outer) return;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, border);
  ctx.fillRect(0, height - border, width, border);
  ctx.fillRect(0, 0, border, height);
  ctx.fillRect(width - border, 0, border, height);
}
