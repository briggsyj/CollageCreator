// SPDX-License-Identifier: GPL-2.0-or-later

import type { Rect } from "./types";

/**
 * A collage made for a multi-image post (an Instagram carousel): one wide picture that is
 * cut into `count` squares when it is saved, left to right.
 */

/** Instagram allows between 2 and 20 images in one post. */
export const SPLIT_MIN = 2;
export const SPLIT_MAX = 20;
export const SPLIT_DEFAULT = 3;
/** Instagram's recommended size for a square post image. */
export const SPLIT_SIDE_DEFAULT = 1080;
export const SPLIT_SIDE_MIN = 16;

/** A usable number of images (whole, within the limits), or 0 for "not a split collage". */
export function normaliseSplit(value: number | undefined | null): number {
  if (value === undefined || value === null || !Number.isFinite(value)) return 0;
  const n = Math.floor(value);
  if (n < SPLIT_MIN) return 0;
  return Math.min(SPLIT_MAX, n);
}

/** Size of the whole collage for `count` squares of `side` pixels. */
export function splitSize(count: number, side: number): { width: number; height: number } {
  return { width: count * side, height: side };
}

/** Where the collage is cut, as distances from its left edge (one fewer than the images). */
export function splitBoundaries(width: number, count: number): number[] {
  const cuts: number[] = [];
  for (let k = 1; k < count; k++) cuts.push((width * k) / count);
  return cuts;
}

/** The square each saved image is taken from, left to right. */
export function sliceRects(count: number, side: number): Rect[] {
  return Array.from({ length: count }, (_, k) => ({ x: k * side, y: 0, w: side, h: side }));
}

/**
 * File names for the images, numbered from the leftmost: `<base>_1.png`, `<base>_2.png`, ...
 * With ten or more images the numbers are padded (`_01`), so they sort in order everywhere.
 */
export function splitFileNames(base: string, count: number, extension: string): string[] {
  const width = String(count).length;
  return Array.from(
    { length: count },
    (_, k) => `${base}_${String(k + 1).padStart(width, "0")}.${extension}`,
  );
}
