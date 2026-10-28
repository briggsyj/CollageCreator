// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * The "pressed in" look of a selected photo in the preview: its middle is drawn a little
 * smaller, easing out to no change at all at its edges, as if a round button were pushed in.
 * The edges stay exactly where they are, so neighbouring photos and the frame are untouched.
 */

/** How much smaller the very middle is drawn (0.12 = 12% smaller). */
export const PRESS_STRENGTH = 0.12;

/**
 * Where to read from for the pixel at (x, y), both in -1..1 across the photo. The pull
 * (1 - x²)(1 - y²) is 1 in the middle and 0 on every edge, so edges map to themselves.
 * For strength below 0.5 the mapping keeps its order (no folding).
 */
export function pressSource(x: number, y: number, strength = PRESS_STRENGTH): [number, number] {
  const pull = 1 + strength * (1 - x * x) * (1 - y * y);
  return [x * pull, y * pull];
}

/**
 * Warp RGBA pixels of a `width` × `height` photo with the pressed-in look. `src` is left as it
 * is; the result is a new array of the same size. Nearest-pixel sampling keeps it fast enough to
 * run on every redraw of the preview.
 */
export function pressPixels(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  strength = PRESS_STRENGTH,
): Uint8ClampedArray<ArrayBuffer> {
  const out = new Uint8ClampedArray(src.length);
  const hw = width / 2;
  const hh = height / 2;
  for (let py = 0; py < height; py++) {
    const y = (py + 0.5 - hh) / hh;
    for (let px = 0; px < width; px++) {
      const x = (px + 0.5 - hw) / hw;
      const [sx, sy] = pressSource(x, y, strength);
      const qx = Math.min(width - 1, Math.max(0, Math.floor(sx * hw + hw)));
      const qy = Math.min(height - 1, Math.max(0, Math.floor(sy * hh + hh)));
      const from = (qy * width + qx) * 4;
      const to = (py * width + px) * 4;
      out[to] = src[from] as number;
      out[to + 1] = src[from + 1] as number;
      out[to + 2] = src[from + 2] as number;
      out[to + 3] = src[from + 3] as number;
    }
  }
  return out;
}
