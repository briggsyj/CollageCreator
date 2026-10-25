// SPDX-License-Identifier: GPL-2.0-or-later

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import { DEFAULT_TRIES, generateBest, isBetter, scoreLayout } from "../src/core/search";
import type { Layout, LayoutPhoto } from "../src/core/types";

const photosArb = fc.array(
  fc.record({
    width: fc.integer({ min: 200, max: 6000 }),
    height: fc.integer({ min: 200, max: 6000 }),
  }),
  { minLength: 1, maxLength: 25 },
);
const ratioArb = fc.double({ min: 0.4, max: 2.5, noNaN: true });
const seedArb = fc.integer({ min: 0, max: 0xffffffff });

const layoutOf = (
  cells: { photoIndex: number; w: number; h: number }[],
  height: number,
): Layout => ({
  width: 1,
  height,
  placements: cells.map((c) => ({
    photoIndex: c.photoIndex,
    cell: { x: 0, y: 0, w: c.w, h: c.h },
  })),
});

describe("scoreLayout", () => {
  it("is zero when every cell has exactly its photo's shape", () => {
    const photos = [{ width: 400, height: 300 }];
    const score = scoreLayout(layoutOf([{ photoIndex: 0, w: 1, h: 0.75 }], 0.75), photos);
    expect(score.cutOff).toBeCloseTo(0, 9);
    expect(score.uncovered).toBeCloseTo(0, 9);
  });

  it("measures the share cropped away, the same whether the photo is too wide or too tall", () => {
    const photo = { width: 400, height: 300 }; // ratio 0.75
    // A cell half as tall as the photo's shape: half of the picture is cut off.
    const wideCell = scoreLayout(layoutOf([{ photoIndex: 0, w: 1, h: 0.375 }], 0.375), [photo]);
    expect(wideCell.cutOff).toBeCloseTo(0.5, 9);
    // A cell twice as tall: cut off by the same share, from the sides.
    const tallCell = scoreLayout(layoutOf([{ photoIndex: 0, w: 1, h: 1.5 }], 1.5), [photo]);
    expect(tallCell.cutOff).toBeCloseTo(0.5, 9);
  });

  it("averages over the photos", () => {
    const photos = [
      { width: 100, height: 100 },
      { width: 100, height: 100 },
    ];
    const score = scoreLayout(
      layoutOf(
        [
          { photoIndex: 0, w: 1, h: 1 },
          { photoIndex: 1, w: 1, h: 0.5 },
        ],
        1.5,
      ),
      photos,
    );
    expect(score.cutOff).toBeCloseTo(0.25, 9);
  });

  it("counts gaps, and treats a collapsed cell as a photo that is gone", () => {
    const photos = [{ width: 100, height: 100 }];
    expect(
      scoreLayout(layoutOf([{ photoIndex: 0, w: 1, h: 0.5 }], 1), photos).uncovered,
    ).toBeCloseTo(0.5, 9);
    expect(scoreLayout(layoutOf([{ photoIndex: 0, w: 0, h: 1 }], 1), photos).cutOff).toBe(1);
  });

  it("is always within 0 to 1", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const layout = generateLayout(photos, ratio, seededRng(seed)).toLayout();
        const score = scoreLayout(layout, photos);
        expect(score.cutOff).toBeGreaterThanOrEqual(0);
        expect(score.cutOff).toBeLessThanOrEqual(1);
        expect(score.uncovered).toBeGreaterThanOrEqual(0);
        expect(score.uncovered).toBeLessThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });
});

describe("isBetter", () => {
  it("prefers fewer gaps over less cropping", () => {
    expect(isBetter({ uncovered: 0, cutOff: 0.5 }, { uncovered: 0.05, cutOff: 0.1 })).toBe(true);
    expect(isBetter({ uncovered: 0.05, cutOff: 0.1 }, { uncovered: 0, cutOff: 0.5 })).toBe(false);
  });

  it("uses cropping to choose between layouts with the same gaps", () => {
    expect(isBetter({ uncovered: 0, cutOff: 0.1 }, { uncovered: 0, cutOff: 0.2 })).toBe(true);
    expect(isBetter({ uncovered: 0, cutOff: 0.2 }, { uncovered: 0, cutOff: 0.1 })).toBe(false);
  });
});

describe("generateBest", () => {
  const photos: LayoutPhoto[] = Array.from({ length: 14 }, (_, i) => ({
    width: 3000 + (i % 5) * 600,
    height: 2000 + (i % 4) * 900,
  }));

  it("tries 30 candidates by default", () => {
    expect(DEFAULT_TRIES).toBe(30);
    expect(generateBest(photos, 0.75, 1).tried).toBe(30);
  });

  it("is repeatable from its master seed", () => {
    const a = generateBest(photos, 0.75, 77);
    const b = generateBest(photos, 0.75, 77);
    expect(a.seed).toBe(b.seed);
    expect(a.page.toLayout()).toEqual(b.page.toLayout());
  });

  it("returns a seed that gives the same layout again from a single generation", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (list, ratio, master) => {
        const best = generateBest(list, ratio, master, { tries: 8 });
        const again = generateLayout(list, ratio, seededRng(best.seed)).toLayout();
        expect(again).toEqual(best.page.toLayout());
      }),
      { numRuns: 60 },
    );
  });

  it("is never worse than any single candidate it considered", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (list, ratio, master) => {
        const best = generateBest(list, ratio, master, { tries: 10 });
        // The first candidate uses the master generator's first value as its seed.
        const first = Math.floor(seededRng(master).random() * 2 ** 32) >>> 0;
        const single = scoreLayout(generateLayout(list, ratio, seededRng(first)).toLayout(), list);
        expect(isBetter(single, best.score)).toBe(false);
      }),
      { numRuns: 60 },
    );
  });

  it("crops less, on average, than a single generation", () => {
    let single = 0;
    let best = 0;
    const runs = 25;
    for (let seed = 0; seed < runs; seed++) {
      const first = scoreLayout(generateLayout(photos, 0.75, seededRng(seed)).toLayout(), photos);
      single += first.cutOff + first.uncovered;
      const searched = generateBest(photos, 0.75, seed).score;
      best += searched.cutOff + searched.uncovered;
    }
    expect(best / runs).toBeLessThan(single / runs);
  });

  it("copes with no photos and with one", () => {
    expect(generateBest([], 0.75, 1).page.toLayout().placements).toEqual([]);
    expect(
      generateBest([{ width: 400, height: 300 }], 0.75, 1).page.toLayout().placements,
    ).toHaveLength(1);
  });

  it("respects a chosen number of columns", () => {
    const best = generateBest(photos, 0.75, 5, { columns: 2, tries: 6 });
    expect(best.page.noCols).toBeLessThanOrEqual(2);
  });

  it("is fast enough to run when photos are added (100 photos, 30 candidates)", () => {
    const many = Array.from({ length: 100 }, (_, i) => ({
      width: 3000 + (i % 7) * 400,
      height: 2000 + (i % 5) * 500,
    }));
    const start = performance.now();
    generateBest(many, 0.75, 3);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});
