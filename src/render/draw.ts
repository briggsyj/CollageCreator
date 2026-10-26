// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Creator, a modified version of PhotoCollage
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

import { coverGeometry } from "../core/crop";
import type { CornerStyle, Layout, PhotoCrop, Rect } from "../core/types";

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
 * Corner radius as a fraction of a photo's shorter side, for the two rounded styles.
 */
export const CORNER_RADIUS = { slight: 0.08, rounded: 0.25 } as const;

/** Corner radius in pixels for a photo of this size (0 for square photos). */
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

/** Which corners of a photo are left square. */
export interface SquareCorners {
  topLeft: boolean;
  topRight: boolean;
  bottomRight: boolean;
  bottomLeft: boolean;
}

const ALL_ROUND: SquareCorners = {
  topLeft: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
};

/**
 * The corners to leave square. With a border around the whole collage every corner is rounded.
 * Without it the photos at the poster's edge run right up to that edge, so a corner on the edge
 * stays square: rounding it would open a gap there, which would look like a border around the
 * collage again. Corners that face another photo are rounded either way, so the gaps between
 * photos look the same whether or not the outer border is on.
 */
export function squareCorners(
  cell: Rect,
  width: number,
  height: number,
  outer: boolean,
): SquareCorners {
  if (outer) return ALL_ROUND;
  const left = cell.x <= 0;
  const top = cell.y <= 0;
  const right = cell.x + cell.w >= width;
  const bottom = cell.y + cell.h >= height;
  return {
    topLeft: left || top,
    topRight: right || top,
    bottomRight: right || bottom,
    bottomLeft: left || bottom,
  };
}

/** Trace the outline of a photo of this style in `r`. */
function tracePhotoShape(
  ctx: Ctx2D,
  r: Rect,
  style: CornerStyle,
  square: SquareCorners = ALL_ROUND,
): void {
  ctx.beginPath();
  const radius = cornerRadius(style, r.w, r.h);
  if (radius <= 0) {
    ctx.rect(r.x, r.y, r.w, r.h);
    return;
  }
  const tl = square.topLeft ? 0 : radius;
  const tr = square.topRight ? 0 : radius;
  const br = square.bottomRight ? 0 : radius;
  const bl = square.bottomLeft ? 0 : radius;
  const right = r.x + r.w;
  const bottom = r.y + r.h;
  ctx.moveTo(r.x + tl, r.y);
  ctx.lineTo(right - tr, r.y);
  if (tr > 0) ctx.arcTo(right, r.y, right, r.y + tr, tr);
  else ctx.lineTo(right, r.y);
  ctx.lineTo(right, bottom - br);
  if (br > 0) ctx.arcTo(right, bottom, right - br, bottom, br);
  else ctx.lineTo(right, bottom);
  ctx.lineTo(r.x + bl, bottom);
  if (bl > 0) ctx.arcTo(r.x, bottom, r.x, bottom - bl, bl);
  else ctx.lineTo(r.x, bottom);
  ctx.lineTo(r.x, r.y + tl);
  if (tl > 0) ctx.arcTo(r.x, r.y, r.x + tl, r.y, tl);
  else ctx.lineTo(r.x, r.y);
  ctx.closePath();
}

/**
 * Fill the poster. With square photos it is plain white and the border is drawn
 * over the photos afterwards. With shaped photos the gaps between them (and around
 * them, when there is an outer border) are the border, so the poster starts as the
 * border colour, whatever the thickness. The outer border switch only moves the photos at the poster's edge
 * out to it (see `insetCell`); it never changes the gaps between photos.
 */
export function drawBackground(ctx: Ctx2D, width: number, height: number, frame?: Frame): void {
  // Even with no border the gaps left by rounded corners are the border colour, so the
  // photos stay flush and what shows between them reflects the colour that was chosen.
  const shaped = frame !== undefined && frame.corners !== "none";
  ctx.fillStyle = shaped ? frame.color : "#ffffff";
  ctx.fillRect(0, 0, width, height);
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
  crop?: PhotoCrop,
): void {
  if (frame.corners === "none") {
    drawPhotoCover(ctx, source, sourceW, sourceH, cell, crop);
    return;
  }
  const inner = insetCell(cell, width, height, frame.border, frame.outer);
  if (inner.w <= 0 || inner.h <= 0) return;
  ctx.save();
  tracePhotoShape(ctx, inner, frame.corners, squareCorners(cell, width, height, frame.outer));
  ctx.clip();
  drawPhotoCover(ctx, source, sourceW, sourceH, inner, crop);
  ctx.restore();
}

/**
 * Draw `source` so it covers `cell`, cropped to it: centred, or as `crop` says (zoomed in and
 * slid within the room the photo has to spare, so it never leaves a gap).
 */
export function drawPhotoCover(
  ctx: Ctx2D,
  source: CanvasImageSource,
  sourceW: number,
  sourceH: number,
  cell: Rect,
  crop?: PhotoCrop,
): void {
  if (cell.w <= 0 || cell.h <= 0) return;
  const { w, h, spareX, spareY } = coverGeometry(sourceW, sourceH, cell.w, cell.h, crop?.zoom);
  ctx.save();
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, cell.w, cell.h);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    source,
    cell.x - spareX * (crop?.x ?? 0.5),
    cell.y - spareY * (crop?.y ?? 0.5),
    w,
    h,
  );
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
