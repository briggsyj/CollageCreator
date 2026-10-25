// SPDX-License-Identifier: GPL-2.0-or-later

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import type { Rect } from "../src/core/types";
import { CORNER_RADIUS, cellPixelRects, cornerRadius, insetCell } from "../src/render/draw";

const overlaps = (a: Rect, b: Rect) =>
  Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) &&
  Math.min(a.y + a.h, b.y + b.h) > Math.max(a.y, b.y);

describe("cornerRadius", () => {
  it("is 0 for square photos and for the circle (which is an ellipse, not a radius)", () => {
    expect(cornerRadius("none", 200, 100)).toBe(0);
    expect(cornerRadius("circle", 200, 100)).toBe(0);
  });

  it("scales with the shorter side, rounded more than slightly rounded", () => {
    expect(cornerRadius("slight", 200, 100)).toBeCloseTo(100 * CORNER_RADIUS.slight);
    expect(cornerRadius("rounded", 200, 100)).toBeCloseTo(100 * CORNER_RADIUS.rounded);
    expect(cornerRadius("rounded", 100, 200)).toBeCloseTo(cornerRadius("rounded", 200, 100));
    expect(cornerRadius("rounded", 200, 100)).toBeGreaterThan(cornerRadius("slight", 200, 100));
  });

  it("never exceeds half the shorter side, so corners cannot overlap", () => {
    for (const style of ["slight", "rounded"] as const) {
      expect(cornerRadius(style, 40, 90)).toBeLessThanOrEqual(20);
    }
  });
});

describe("insetCell", () => {
  const poster = { width: 1000, height: 800 };

  it("insets by the full border at the poster's edge", () => {
    const r = insetCell({ x: 0, y: 0, w: 500, h: 800 }, poster.width, poster.height, 10);
    expect(r.x).toBe(10);
    expect(r.y).toBe(10);
    expect(r.y + r.h).toBe(800 - 10);
  });

  it("leaves a gap of exactly the border width between neighbours, odd or even", () => {
    for (const border of [1, 2, 7, 10, 11]) {
      const left = insetCell({ x: 0, y: 0, w: 400, h: 800 }, poster.width, poster.height, border);
      const right = insetCell(
        { x: 400, y: 0, w: 600, h: 800 },
        poster.width,
        poster.height,
        border,
      );
      expect(right.x - (left.x + left.w)).toBe(border);
      const top = insetCell({ x: 0, y: 0, w: 1000, h: 300 }, poster.width, poster.height, border);
      const bottom = insetCell(
        { x: 0, y: 300, w: 1000, h: 500 },
        poster.width,
        poster.height,
        border,
      );
      expect(bottom.y - (top.y + top.h)).toBe(border);
    }
  });

  it("without an outer border, leaves the poster's edge alone but still separates neighbours", () => {
    for (const border of [1, 2, 7, 10, 11]) {
      const left = insetCell(
        { x: 0, y: 0, w: 400, h: 800 },
        poster.width,
        poster.height,
        border,
        false,
      );
      const right = insetCell(
        { x: 400, y: 0, w: 600, h: 800 },
        poster.width,
        poster.height,
        border,
        false,
      );
      expect(left.x).toBe(0);
      expect(left.y).toBe(0);
      expect(left.y + left.h).toBe(800);
      expect(right.x + right.w).toBe(1000);
      expect(right.x - (left.x + left.w)).toBe(border);
    }
  });

  it("with an outer border (the default) insets the edge by the border", () => {
    const withOuter = insetCell(
      { x: 0, y: 0, w: 400, h: 800 },
      poster.width,
      poster.height,
      10,
      true,
    );
    const byDefault = insetCell({ x: 0, y: 0, w: 400, h: 800 }, poster.width, poster.height, 10);
    expect(withOuter).toEqual(byDefault);
    expect(withOuter.x).toBe(10);
  });

  it("with no border changes nothing", () => {
    const cell = { x: 100, y: 50, w: 300, h: 200 };
    expect(insetCell(cell, poster.width, poster.height, 0)).toEqual(cell);
  });

  it("never goes negative, even for a border bigger than the cell", () => {
    const r = insetCell({ x: 10, y: 10, w: 4, h: 4 }, poster.width, poster.height, 50);
    expect(r.w).toBe(0);
    expect(r.h).toBe(0);
  });

  it("keeps the photos of a real layout inside their cells and apart from each other", () => {
    const photosArb = fc.array(
      fc.record({
        width: fc.integer({ min: 100, max: 6000 }),
        height: fc.integer({ min: 100, max: 6000 }),
      }),
      { minLength: 1, maxLength: 30 },
    );
    fc.assert(
      fc.property(
        photosArb,
        fc.integer({ min: 0, max: 0xffffffff }),
        fc.integer({ min: 1, max: 40 }),
        (photos, seed, border) => {
          const layout = generateLayout(photos, 0.75, seededRng(seed)).toLayout();
          const rects = cellPixelRects(layout, 800, 600);
          const inner = rects.map((r) => insetCell(r, 800, 600, border));
          inner.forEach((r, i) => {
            const cell = rects[i] as Rect;
            expect(r.x).toBeGreaterThanOrEqual(cell.x);
            expect(r.y).toBeGreaterThanOrEqual(cell.y);
            expect(r.x + r.w).toBeLessThanOrEqual(cell.x + cell.w);
            expect(r.y + r.h).toBeLessThanOrEqual(cell.y + cell.h);
          });
          for (let i = 0; i < inner.length; i++) {
            for (let j = i + 1; j < inner.length; j++) {
              if (inner[i]?.w && inner[i]?.h && inner[j]?.w && inner[j]?.h) {
                expect(overlaps(inner[i] as Rect, inner[j] as Rect)).toBe(false);
              }
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
