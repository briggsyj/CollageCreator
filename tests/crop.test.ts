// SPDX-License-Identifier: GPL-2.0-or-later

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { clampCrop, coverGeometry, MAX_ZOOM, panCrop, zoomCrop } from "../src/core/crop";
import { NO_CROP, type PhotoCrop } from "../src/core/types";

/** Left, top, right and bottom edge of the photo relative to the cell, as drawn. */
function edges(crop: PhotoCrop, pw: number, ph: number, cw: number, ch: number) {
  const g = coverGeometry(pw, ph, cw, ch, crop.zoom);
  const left = -g.spareX * crop.x;
  const top = -g.spareY * crop.y;
  return { left, top, right: left + g.w, bottom: top + g.h };
}

const size = fc.integer({ min: 20, max: 4000 });
const cropArb = fc.record({
  zoom: fc.double({ min: 0.1, max: 20, noNaN: true }),
  x: fc.double({ min: -3, max: 4, noNaN: true }),
  y: fc.double({ min: -3, max: 4, noNaN: true }),
});

describe("crop", () => {
  it("the default crop is the centred cover fit", () => {
    const g = coverGeometry(400, 300, 100, 100);
    expect(g.h).toBeCloseTo(100);
    expect(g.w).toBeCloseTo(133.33, 1);
    expect(edges(NO_CROP, 400, 300, 100, 100).left).toBeCloseTo(-16.67, 1);
  });

  it("clamps to a zoom from 1 to the maximum and a window inside the photo", () => {
    expect(clampCrop({ zoom: 0.2, x: -1, y: 9 })).toEqual({ zoom: 1, x: 0, y: 1 });
    expect(clampCrop({ zoom: 99, x: 0.3, y: 0.7 }).zoom).toBe(MAX_ZOOM);
    expect(clampCrop({ zoom: Number.NaN, x: Number.NaN, y: 0.2 })).toEqual({
      zoom: 1,
      x: 0.5,
      y: 0.2,
    });
  });

  it("never leaves a gap, however it is panned or zoomed", () => {
    fc.assert(
      fc.property(
        size,
        size,
        size,
        size,
        cropArb,
        fc.double({ min: -5000, max: 5000, noNaN: true }),
        fc.double({ min: -5000, max: 5000, noNaN: true }),
        fc.double({ min: 0.1, max: 20, noNaN: true }),
        (pw, ph, cw, ch, crop, dx, dy, zoom) => {
          let c = panCrop(clampCrop(crop), dx, dy, pw, ph, cw, ch);
          c = zoomCrop(c, zoom, pw, ph, cw, ch);
          const e = edges(c, pw, ph, cw, ch);
          expect(e.left).toBeLessThanOrEqual(1e-6);
          expect(e.top).toBeLessThanOrEqual(1e-6);
          expect(e.right).toBeGreaterThanOrEqual(cw - 1e-6);
          expect(e.bottom).toBeGreaterThanOrEqual(ch - 1e-6);
        },
      ),
    );
  });

  it("dragging the photo right shows more of its left side, by exactly the drag", () => {
    // 2:1 photo in a square cell at zoom 1: 100 px of spare width.
    const start = { zoom: 1, x: 0.5, y: 0.5 };
    const moved = panCrop(start, 10, 0, 200, 100, 100, 100);
    expect(
      edges(moved, 200, 100, 100, 100).left - edges(start, 200, 100, 100, 100).left,
    ).toBeCloseTo(10);
    // No spare height, so a vertical drag does nothing.
    expect(panCrop(start, 0, 40, 200, 100, 100, 100).y).toBe(0.5);
  });

  it("zooming keeps the middle of the view where it was", () => {
    const start = { zoom: 2, x: 0.2, y: 0.8 };
    const mid = (c: PhotoCrop) => {
      const g = coverGeometry(300, 200, 120, 90, c.zoom);
      return [(g.spareX * c.x + 60) / g.w, (g.spareY * c.y + 45) / g.h];
    };
    const zoomed = zoomCrop(start, 3, 300, 200, 120, 90);
    expect(mid(zoomed)[0]).toBeCloseTo(mid(start)[0] as number, 5);
    expect(mid(zoomed)[1]).toBeCloseTo(mid(start)[1] as number, 5);
  });
});
