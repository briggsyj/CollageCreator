// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import type { Layout, PhotoSize, Rect } from "../src/core/types";

const EPS = 1e-6;

const photoArb = fc.record({
  width: fc.integer({ min: 100, max: 8000 }),
  height: fc.integer({ min: 100, max: 8000 }),
});
const photosArb = fc.array(photoArb, { minLength: 1, maxLength: 60 });
const ratioArb = fc.double({ min: 0.3, max: 3, noNaN: true });
const seedArb = fc.integer({ min: 0, max: 0xffffffff });

function build(photos: PhotoSize[], ratio: number, seed: number) {
  return generateLayout(photos, ratio, seededRng(seed));
}

function overlap(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Rectangles tile the page exactly: inside it, no overlap, and total area equals page area. */
function expectExactTiling(layout: Layout): void {
  const rects = layout.placements.map((p) => p.cell);
  let area = 0;
  for (const r of rects) {
    expect(r.w).toBeGreaterThan(0);
    expect(r.h).toBeGreaterThan(0);
    expect(r.x).toBeGreaterThanOrEqual(-EPS);
    expect(r.y).toBeGreaterThanOrEqual(-EPS);
    expect(r.x + r.w).toBeLessThanOrEqual(layout.width + EPS);
    expect(r.y + r.h).toBeLessThanOrEqual(layout.height + EPS);
    area += r.w * r.h;
  }
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      expect(overlap(rects[i] as Rect, rects[j] as Rect)).toBeLessThan(EPS);
    }
  }
  expect(Math.abs(area - layout.width * layout.height)).toBeLessThan(1e-6);
}

describe("layout core properties", () => {
  it("rectangles exactly tile the poster", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        expectExactTiling(build(photos, ratio, seed).toLayout());
      }),
      { numRuns: 300 },
    );
  });

  it("every photo appears exactly once", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const indexes = build(photos, ratio, seed)
          .toLayout()
          .placements.map((p) => p.photoIndex)
          .sort((a, b) => a - b);
        expect(indexes).toEqual(photos.map((_, i) => i));
      }),
      { numRuns: 300 },
    );
  });

  it("the same seed gives the same layout", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        expect(build(photos, ratio, seed).toLayout()).toEqual(
          build(photos, ratio, seed).toLayout(),
        );
      }),
      { numRuns: 100 },
    );
  });

  it("different seeds usually give different layouts", () => {
    const photos = Array.from({ length: 12 }, (_, i) => ({ width: 1000 + i * 37, height: 800 }));
    const layouts = new Set(
      Array.from({ length: 10 }, (_, seed) => JSON.stringify(build(photos, 0.75, seed).toLayout())),
    );
    expect(layouts.size).toBeGreaterThan(5);
  });

  it("changing the poster ratio keeps the arrangement and still tiles", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, ratioArb, seedArb, (photos, r1, r2, seed) => {
        const page = build(photos, r1, seed);
        const before = page.toLayout().placements.map((p) => p.photoIndex);
        page.setTargetRatio(r2);
        const after = page.toLayout();
        expect(after.placements.map((p) => p.photoIndex)).toEqual(before);
        expect(after.height).toBeCloseTo(r2, 9);
        expectExactTiling(after);
      }),
      { numRuns: 200 },
    );
  });

  it("swapping two photos exchanges their cells and keeps the tiling", () => {
    const photos = Array.from({ length: 9 }, (_, i) => ({ width: 1200 + i * 50, height: 900 }));
    const page = build(photos, 0.75, 7);
    const before = page.toLayout();
    page.swapPhotos(2, 5);
    const after = page.toLayout();
    const cellOf = (l: Layout, i: number) => l.placements.find((p) => p.photoIndex === i)?.cell;
    expect(cellOf(after, 2)).toEqual(cellOf(before, 5));
    expect(cellOf(after, 5)).toEqual(cellOf(before, 2));
    expectExactTiling(after);
  });
});

describe("layout edge cases", () => {
  const cases: Record<string, PhotoSize[]> = {
    "a single photo": [{ width: 4000, height: 3000 }],
    "two photos with very different aspect ratios": [
      { width: 6000, height: 1000 },
      { width: 1000, height: 6000 },
    ],
    "a very wide panorama among portraits": [
      { width: 12000, height: 1500 },
      ...Array.from({ length: 6 }, () => ({ width: 3000, height: 4000 })),
    ],
    "square photos": Array.from({ length: 5 }, () => ({ width: 2000, height: 2000 })),
  };

  for (const [name, photos] of Object.entries(cases)) {
    it(`tiles exactly with ${name}`, () => {
      for (let seed = 0; seed < 200; seed++) {
        for (const ratio of [0.5, 0.75, 1, 1.41, 2.5]) {
          const layout = build(photos, ratio, seed).toLayout();
          expect(layout.placements).toHaveLength(photos.length);
          expectExactTiling(layout);
        }
      }
    });
  }

  it("handles a very tall poster with one photo (the original divides by zero here)", () => {
    const layout = build([{ width: 100, height: 100 }], 10, 1).toLayout();
    expect(layout.placements).toHaveLength(1);
  });

  it("handles zero photos", () => {
    const layout = build([], 0.75, 1).toLayout();
    expect(layout.placements).toEqual([]);
  });

  it("handles 100 photos quickly", () => {
    const photos = Array.from({ length: 100 }, (_, i) => ({
      width: 3000 + (i % 7) * 400,
      height: 2000 + (i % 5) * 500,
    }));
    const start = performance.now();
    const layout = build(photos, 0.75, 3).toLayout();
    const elapsed = performance.now() - start;
    expect(layout.placements).toHaveLength(100);
    expectExactTiling(layout);
    expect(elapsed).toBeLessThan(200);
  });
});
