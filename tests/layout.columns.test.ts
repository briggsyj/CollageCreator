// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { autoColumns, generateLayout, MAX_COLUMNS, normaliseColumns } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import type { PhotoSize } from "../src/core/types";

const photosArb = fc.array(
  fc.record({
    width: fc.integer({ min: 100, max: 8000 }),
    height: fc.integer({ min: 100, max: 8000 }),
  }),
  { minLength: 1, maxLength: 40 },
);
const ratioArb = fc.double({ min: 0.3, max: 3, noNaN: true });
const seedArb = fc.integer({ min: 0, max: 0xffffffff });

const sample: PhotoSize[] = Array.from({ length: 12 }, (_, i) => ({
  width: 3000 + (i % 4) * 500,
  height: 2000 + (i % 3) * 700,
}));

describe("normaliseColumns", () => {
  it("keeps whole numbers in range and rounds down", () => {
    expect(normaliseColumns(4)).toBe(4);
    expect(normaliseColumns(4.9)).toBe(4);
  });

  it("clamps to 1..MAX_COLUMNS", () => {
    expect(normaliseColumns(0)).toBe(1);
    expect(normaliseColumns(-7)).toBe(1);
    expect(normaliseColumns(1e9)).toBe(MAX_COLUMNS);
  });

  it("treats anything that is not a number as automatic", () => {
    expect(normaliseColumns(undefined)).toBeUndefined();
    expect(normaliseColumns(null)).toBeUndefined();
    expect(normaliseColumns(Number.NaN)).toBeUndefined();
    expect(normaliseColumns(Number.POSITIVE_INFINITY)).toBeUndefined();
  });
});

describe("autoColumns", () => {
  it("is at least 1, including for no photos", () => {
    expect(autoColumns([], 0.75)).toBe(1);
    expect(autoColumns([{ width: 100, height: 100 }], 10)).toBe(1);
  });

  it("grows with the number of photos", () => {
    const few = autoColumns(sample.slice(0, 2), 0.75);
    const many = autoColumns(
      Array.from({ length: 80 }, () => ({ width: 3000, height: 2000 })),
      0.75,
    );
    expect(many).toBeGreaterThan(few);
  });
});

describe("generateLayout with a chosen number of columns", () => {
  it("asking for the automatic number gives exactly the automatic layout", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const automatic = generateLayout(photos, ratio, seededRng(seed)).toLayout();
        const explicit = generateLayout(photos, ratio, seededRng(seed), {
          columns: autoColumns(photos, ratio),
        }).toLayout();
        expect(explicit).toEqual(automatic);
      }),
      { numRuns: 100 },
    );
  });

  it("one column stacks every photo full width, and tiles the poster exactly", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const layout = generateLayout(photos, ratio, seededRng(seed), { columns: 1 }).toLayout();
        let area = 0;
        for (const { cell } of layout.placements) {
          expect(cell.x).toBeCloseTo(0, 9);
          expect(cell.w).toBeCloseTo(1, 9);
          area += cell.w * cell.h;
        }
        expect(area).toBeCloseTo(layout.height, 6);
      }),
      { numRuns: 100 },
    );
  });

  it("uses no more columns than asked for, and shows every photo once", () => {
    fc.assert(
      fc.property(
        photosArb,
        ratioArb,
        seedArb,
        fc.integer({ min: 1, max: 12 }),
        (photos, ratio, seed, columns) => {
          const page = generateLayout(photos, ratio, seededRng(seed), { columns });
          expect(page.noCols).toBeLessThanOrEqual(columns);
          const shown = page
            .toLayout()
            .placements.map((p) => p.photoIndex)
            .sort((a, b) => a - b);
          expect(shown).toEqual(photos.map((_, i) => i));
        },
      ),
      { numRuns: 150 },
    );
  });

  it("more columns than photos still shows every photo, with the empty columns dropped", () => {
    const photos = sample.slice(0, 3);
    const page = generateLayout(photos, 0.75, seededRng(1), { columns: 40 });
    // A photo can span two columns, so up to twice the photo count stay in use.
    expect(page.noCols).toBeLessThanOrEqual(2 * photos.length);
    expect(page.noCols).toBeLessThan(40);
    expect(page.toLayout().placements).toHaveLength(3);
  });

  it("the same seed and column count give the same layout", () => {
    const a = generateLayout(sample, 0.75, seededRng(9), { columns: 3 }).toLayout();
    const b = generateLayout(sample, 0.75, seededRng(9), { columns: 3 }).toLayout();
    expect(a).toEqual(b);
  });

  it("different column counts give different layouts", () => {
    const layouts = new Set(
      [1, 2, 3, 4, 5, 6].map((columns) =>
        JSON.stringify(generateLayout(sample, 0.75, seededRng(9), { columns }).toLayout()),
      ),
    );
    expect(layouts.size).toBe(6);
  });

  it("does not fail on unusable values", () => {
    for (const columns of [0, -3, 2.7, Number.NaN, Number.POSITIVE_INFINITY, 1e9]) {
      const layout = generateLayout(sample, 0.75, seededRng(2), { columns }).toLayout();
      expect(layout.placements).toHaveLength(sample.length);
    }
  });

  it("changing the poster shape afterwards keeps the chosen columns", () => {
    const page = generateLayout(sample, 0.75, seededRng(4), { columns: 3 });
    const before = page.noCols;
    page.setTargetRatio(1.4);
    expect(page.noCols).toBe(before);
  });
});
