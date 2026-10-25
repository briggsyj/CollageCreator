// SPDX-License-Identifier: GPL-2.0-or-later

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  clampPan,
  clampZoom,
  FIT_VIEW,
  isFit,
  MAX_ZOOM,
  MIN_ZOOM,
  panBy,
  posterOrigin,
  posterSize,
  type View,
  zoomAt,
  zoomPercent,
} from "../src/render/view";

const viewport = { w: 900, h: 600 };
const fit = { w: 600, h: 450 };

describe("fit view", () => {
  it("centres the poster", () => {
    expect(posterOrigin(viewport, fit, FIT_VIEW)).toEqual({ x: 150, y: 75 });
    expect(posterSize(fit, FIT_VIEW)).toEqual(fit);
    expect(isFit(FIT_VIEW)).toBe(true);
    expect(zoomPercent(FIT_VIEW)).toBe(100);
  });
});

describe("clampZoom", () => {
  it("keeps zoom in range and ignores nonsense", () => {
    expect(clampZoom(100)).toBe(MAX_ZOOM);
    expect(clampZoom(0.01)).toBe(MIN_ZOOM);
    expect(clampZoom(Number.NaN)).toBe(1);
  });
});

describe("zoomAt", () => {
  const view = fc.record({
    zoom: fc.double({ min: MIN_ZOOM, max: MAX_ZOOM, noNaN: true }),
    panX: fc.double({ min: -200, max: 200, noNaN: true }),
    panY: fc.double({ min: -200, max: 200, noNaN: true }),
  });

  it("keeps the point under the cursor in place", () => {
    fc.assert(
      fc.property(
        view,
        fc.double({ min: 0.7, max: 1.4, noNaN: true }),
        fc.double({ min: 0.1, max: 0.9, noNaN: true }),
        fc.double({ min: 0.1, max: 0.9, noNaN: true }),
        (v, factor, u, w) => {
          const clamped = clampPan(v, viewport, fit);
          // A cursor over the poster, as a fraction of it.
          const size = posterSize(fit, clamped);
          const origin = posterOrigin(viewport, fit, clamped);
          const cursor = { x: origin.x + u * size.w, y: origin.y + w * size.h };
          // Only consider cursors that are inside the viewport.
          fc.pre(
            cursor.x >= 0 && cursor.x <= viewport.w && cursor.y >= 0 && cursor.y <= viewport.h,
          );

          const next = zoomAt(clamped, factor, cursor, viewport, fit);
          const nextSize = posterSize(fit, next);
          const nextOrigin = posterOrigin(viewport, fit, next);
          expect((cursor.x - nextOrigin.x) / nextSize.w).toBeCloseTo(u, 6);
          expect((cursor.y - nextOrigin.y) / nextSize.h).toBeCloseTo(w, 6);
        },
      ),
      { numRuns: 300 },
    );
  });

  it("zooms in and out by the factor, within limits", () => {
    const centre = { x: viewport.w / 2, y: viewport.h / 2 };
    expect(zoomAt(FIT_VIEW, 2, centre, viewport, fit).zoom).toBe(2);
    expect(zoomAt(FIT_VIEW, 1000, centre, viewport, fit).zoom).toBe(MAX_ZOOM);
    expect(zoomAt(FIT_VIEW, 0.0001, centre, viewport, fit).zoom).toBe(MIN_ZOOM);
  });

  it("zooming around the centre does not move the poster", () => {
    const centre = { x: viewport.w / 2, y: viewport.h / 2 };
    const next = zoomAt(FIT_VIEW, 2, centre, viewport, fit);
    expect(next.panX).toBeCloseTo(0, 9);
    expect(next.panY).toBeCloseTo(0, 9);
  });

  it("zooming in then out by the inverse returns to where it was", () => {
    const cursor = { x: 300, y: 200 };
    const zoomed = zoomAt(FIT_VIEW, 2, cursor, viewport, fit);
    const back = zoomAt(zoomed, 0.5, cursor, viewport, fit);
    expect(back.zoom).toBeCloseTo(1, 9);
    expect(back.panX).toBeCloseTo(0, 6);
    expect(back.panY).toBeCloseTo(0, 6);
  });
});

describe("panBy and clampPan", () => {
  it("moves the poster by the drag", () => {
    const v: View = { zoom: 2, panX: 0, panY: 0 };
    const moved = panBy(v, 30, -20, viewport, fit);
    expect(moved.panX).toBe(30);
    expect(moved.panY).toBe(-20);
  });

  it("never lets the poster leave the window completely", () => {
    fc.assert(
      fc.property(
        fc.double({ min: MIN_ZOOM, max: MAX_ZOOM, noNaN: true }),
        fc.double({ min: -1e6, max: 1e6, noNaN: true }),
        fc.double({ min: -1e6, max: 1e6, noNaN: true }),
        (zoom, dx, dy) => {
          const v = panBy({ zoom, panX: 0, panY: 0 }, dx, dy, viewport, fit);
          const size = posterSize(fit, v);
          const origin = posterOrigin(viewport, fit, v);
          // At least a strip of the poster is still on screen in both directions.
          expect(origin.x + size.w).toBeGreaterThan(0);
          expect(origin.x).toBeLessThan(viewport.w);
          expect(origin.y + size.h).toBeGreaterThan(0);
          expect(origin.y).toBeLessThan(viewport.h);
        },
      ),
    );
  });

  it("is not fit once moved or zoomed", () => {
    expect(isFit({ zoom: 1, panX: 5, panY: 0 })).toBe(false);
    expect(isFit({ zoom: 1.5, panX: 0, panY: 0 })).toBe(false);
  });
});
