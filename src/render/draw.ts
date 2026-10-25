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

import type { Layout, Rect } from "../core/types";

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

export function drawBackground(ctx: Ctx2D, width: number, height: number): void {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
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

/** The poster frame, plus a seam on every edge shared by two cells. */
export function drawBorders(
  ctx: Ctx2D,
  rects: readonly Rect[],
  width: number,
  height: number,
  border: number,
  color: string,
): void {
  if (border <= 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, border);
  ctx.fillRect(0, height - border, width, border);
  ctx.fillRect(0, 0, border, height);
  ctx.fillRect(width - border, 0, border, height);

  const lo = Math.floor(border / 2);
  for (const r of rects) {
    if (r.x > 0) ctx.fillRect(r.x - lo, r.y - lo, border, r.h + border);
    if (r.y > 0) ctx.fillRect(r.x - lo, r.y - lo, r.w + border, border);
    if (r.x + r.w < width) ctx.fillRect(r.x + r.w - lo, r.y - lo, border, r.h + border);
    if (r.y + r.h < height) ctx.fillRect(r.x - lo, r.y + r.h - lo, r.w + border, border);
  }
}
