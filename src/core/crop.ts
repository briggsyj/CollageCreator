// SPDX-License-Identifier: GPL-2.0-or-later

import { NO_CROP, type PhotoCrop } from "./types";

export const MAX_ZOOM = 5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Keep a crop inside what covers the cell: zoom 1 to MAX_ZOOM, the window within the photo. */
export function clampCrop(crop: PhotoCrop): PhotoCrop {
  const finite = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);
  return {
    zoom: clamp(finite(crop.zoom, 1), 1, MAX_ZOOM),
    x: clamp(finite(crop.x, 0.5), 0, 1),
    y: clamp(finite(crop.y, 0.5), 0, 1),
  };
}

export function isDefaultCrop(crop: PhotoCrop | undefined): boolean {
  return (
    crop === undefined ||
    (crop.zoom === NO_CROP.zoom && crop.x === NO_CROP.x && crop.y === NO_CROP.y)
  );
}

/**
 * Where the photo is drawn so that it covers a cell of `cellW` x `cellH`: its size, and how much
 * of it spills past the cell (`spareX`, `spareY`) that the window can slide over.
 */
export function coverGeometry(
  photoW: number,
  photoH: number,
  cellW: number,
  cellH: number,
  zoom = 1,
): { w: number; h: number; spareX: number; spareY: number } {
  const scale = Math.max(cellW / photoW, cellH / photoH) * Math.max(1, zoom);
  const w = photoW * scale;
  const h = photoH * scale;
  return { w, h, spareX: Math.max(0, w - cellW), spareY: Math.max(0, h - cellH) };
}

/** Move the photo by (dx, dy) cell pixels, as when dragging it with a pointer. */
export function panCrop(
  crop: PhotoCrop,
  dx: number,
  dy: number,
  photoW: number,
  photoH: number,
  cellW: number,
  cellH: number,
): PhotoCrop {
  const g = coverGeometry(photoW, photoH, cellW, cellH, crop.zoom);
  return clampCrop({
    zoom: crop.zoom,
    // Dragging the photo right shows more of its left side.
    x: g.spareX > 0 ? crop.x - dx / g.spareX : crop.x,
    y: g.spareY > 0 ? crop.y - dy / g.spareY : crop.y,
  });
}

/**
 * Change the zoom, keeping the same point of the photo in the middle of the cell, so zooming
 * in does not swing the view away from what is being looked at.
 */
export function zoomCrop(
  crop: PhotoCrop,
  zoom: number,
  photoW: number,
  photoH: number,
  cellW: number,
  cellH: number,
): PhotoCrop {
  const next = clamp(zoom, 1, MAX_ZOOM);
  const before = coverGeometry(photoW, photoH, cellW, cellH, crop.zoom);
  const after = coverGeometry(photoW, photoH, cellW, cellH, next);
  // The photo coordinate (0..1) at the middle of the cell.
  const centre = (axis: "x" | "y") => {
    const size = axis === "x" ? before.w : before.h;
    const spare = axis === "x" ? before.spareX : before.spareY;
    const cell = axis === "x" ? cellW : cellH;
    return (crop[axis] * spare + cell / 2) / size;
  };
  const place = (axis: "x" | "y") => {
    const size = axis === "x" ? after.w : after.h;
    const spare = axis === "x" ? after.spareX : after.spareY;
    const cell = axis === "x" ? cellW : cellH;
    return spare > 0 ? (centre(axis) * size - cell / 2) / spare : 0.5;
  };
  return clampCrop({ zoom: next, x: place("x"), y: place("y") });
}
