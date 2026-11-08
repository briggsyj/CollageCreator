// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import type { Layout, LayoutPhoto, PhotoSize, Rect } from "../src/core/types";

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

describe("no holes or squeezed cells (T062)", () => {
  const spanArb = fc.option(
    fc.record({
      columns: fc.constantFrom(1 as const, 2 as const),
      rows: fc.constantFrom(1 as const, 2 as const, 3 as const),
    }),
    { nil: undefined },
  );
  it("tiles exactly with size requests and any number of columns", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            width: fc.integer({ min: 100, max: 8000 }),
            height: fc.integer({ min: 100, max: 8000 }),
            span: spanArb,
          }),
          { minLength: 1, maxLength: 40 },
        ),
        ratioArb,
        seedArb,
        fc.option(fc.integer({ min: 1, max: 12 }), { nil: undefined }),
        (photos, ratio, seed, columns) => {
          const page = generateLayout(photos, ratio, seededRng(seed), { columns });
          expect(page.tiles()).toBe(true);
          expectExactTiling(page.toLayout());
        },
      ),
      { numRuns: 1000 },
    );
  });

  it("tiles exactly with many photos on a tall poster, where the original left holes most", () => {
    fc.assert(
      fc.property(photosArb, seedArb, (photos, seed) => {
        expectExactTiling(build(photos, Math.SQRT2, seed).toLayout());
      }),
      { numRuns: 300 },
    );
  });

  // Arrangements the original got wrong: a squeezed cell, or a hole.
  const known: {
    name: string;
    photos: PhotoSize[];
    ratio: number;
    seed: number;
    columns?: number;
  }[] = [
    {
      name: "a cell squeezed to nothing at the bottom (CI, November 2026)",
      photos: [
        { width: 548, height: 100 },
        { width: 100, height: 158 },
        { width: 103, height: 100 },
        { width: 401, height: 100 },
        { width: 7159, height: 5659 },
        { width: 100, height: 109 },
        { width: 2106, height: 2943 },
      ],
      ratio: 0.4436075309959165,
      seed: 18,
    },
    {
      name: "a hole of 3% of the page in three columns",
      photos: [
        { width: 3900, height: 100 },
        { width: 3000, height: 4000 },
        { width: 3300, height: 200 },
        { width: 1200, height: 800 },
      ],
      ratio: 0.75,
      seed: 177,
      columns: 3,
    },
  ];
  for (const k of known) {
    it(`tiles exactly: ${k.name}`, () => {
      const page = generateLayout(k.photos, k.ratio, seededRng(k.seed), { columns: k.columns });
      expect(page.toLayout().placements).toHaveLength(k.photos.length);
      expectExactTiling(page.toLayout());
    });
  }

  it("still gives the same layout for the same seed when it had to try again", () => {
    const k = known[0] as (typeof known)[number];
    const a = generateLayout(k.photos, k.ratio, seededRng(k.seed)).toLayout();
    const b = generateLayout(k.photos, k.ratio, seededRng(k.seed)).toLayout();
    expect(a).toEqual(b);
  });

  it("keeps a requested Wider when it can", () => {
    for (let seed = 0; seed < 300; seed++) {
      const photos: LayoutPhoto[] = Array.from({ length: 8 }, (_, i) => ({
        width: 1500 + i * 120,
        height: 1000 + ((i * 7) % 5) * 300,
        ...(i === 3 ? { span: { columns: 2 as const, rows: 1 as const } } : {}),
      }));
      const page = generateLayout(photos, 0.75, seededRng(seed), { columns: 3 });
      const cell = page.toLayout().placements.find((p) => p.photoIndex === 3)?.cell;
      expect(cell?.w ?? 0, `seed ${seed}`).toBeGreaterThan(1.5 / page.noCols);
      expectExactTiling(page.toLayout());
    }
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
