// SPDX-License-Identifier: GPL-2.0-or-later

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";
import { generateBest } from "../src/core/search";
import { type LayoutPhoto, NO_SPAN, type PhotoSpan } from "../src/core/types";

const base: LayoutPhoto[] = Array.from({ length: 12 }, (_, i) => ({
  width: 3000 + (i % 4) * 500,
  height: 2000 + (i % 3) * 600,
}));

const withSpan = (list: LayoutPhoto[], at: Record<number, PhotoSpan>): LayoutPhoto[] =>
  list.map((p, i) => (at[i] ? { ...p, span: at[i] } : p));

const cellOf = (page: ReturnType<typeof generateLayout>, index: number) =>
  page.toLayout().placements.find((p) => p.photoIndex === index)?.cell;

describe("photos that ask to span two columns", () => {
  it("get a cell exactly two columns wide", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 11 }),
        fc.integer({ min: 0, max: 0xffffffff }),
        fc.integer({ min: 2, max: 6 }),
        (index, seed, columns) => {
          const photos = withSpan(base, { [index]: { columns: 2, rows: 1 } });
          const page = generateLayout(photos, 0.75, seededRng(seed), { columns });
          const cell = cellOf(page, index);
          expect(cell).toBeDefined();
          expect((cell?.w ?? 0) * page.noCols).toBeCloseTo(2, 6);
        },
      ),
      { numRuns: 120 },
    );
  });

  it("keep that when several photos ask at once", () => {
    const photos = withSpan(base, {
      1: { columns: 2, rows: 1 },
      5: { columns: 2, rows: 2 },
      9: { columns: 2, rows: 1 },
    });
    for (let seed = 0; seed < 60; seed++) {
      const page = generateLayout(photos, 0.75, seededRng(seed), { columns: 4 });
      for (const index of [1, 5, 9]) {
        expect((cellOf(page, index)?.w ?? 0) * page.noCols).toBeCloseTo(2, 6);
      }
    }
  });

  it("keep it through the best-of-30 search, and every photo still appears once", () => {
    const photos = withSpan(base, { 3: { columns: 2, rows: 1 }, 7: { columns: 2, rows: 1 } });
    const best = generateBest(photos, 0.75, 11);
    expect((cellOf(best.page, 3)?.w ?? 0) * best.page.noCols).toBeCloseTo(2, 6);
    expect((cellOf(best.page, 7)?.w ?? 0) * best.page.noCols).toBeCloseTo(2, 6);
    const shown = best.page
      .toLayout()
      .placements.map((p) => p.photoIndex)
      .sort((a, b) => a - b);
    expect(shown).toEqual(base.map((_, i) => i));
  });

  it("need at least two columns, even if one was chosen", () => {
    const photos = withSpan(base.slice(0, 4), { 0: { columns: 2, rows: 1 } });
    const page = generateLayout(photos, 0.75, seededRng(1), { columns: 1 });
    expect(page.noCols).toBeGreaterThanOrEqual(2);
    expect((cellOf(page, 0)?.w ?? 0) * page.noCols).toBeCloseTo(2, 6);
  });

  it("work for a single photo", () => {
    const page = generateLayout(
      [{ width: 400, height: 300, span: { columns: 2, rows: 1 } }],
      0.75,
      seededRng(1),
    );
    expect(page.toLayout().placements).toHaveLength(1);
  });
});

describe("photos that ask to be taller", () => {
  it("get a taller cell, on average, the more rows they ask for", () => {
    // Height over width of the photo's cell. (Not its area: a taller photo is also less likely to
    // be given a double-width cell by the layout's own rule, which would hide the effect.)
    const tallness = (rows: 1 | 2 | 3) => {
      let total = 0;
      const runs = 80;
      for (let seed = 0; seed < runs; seed++) {
        const photos = withSpan(base, { 4: { columns: 1, rows } });
        const cell = cellOf(generateLayout(photos, 0.75, seededRng(seed), { columns: 4 }), 4);
        total += (cell?.h ?? 0) / (cell?.w ?? 1);
      }
      return total / runs;
    };
    expect(tallness(2)).toBeGreaterThan(tallness(1) * 1.3);
    expect(tallness(3)).toBeGreaterThan(tallness(2) * 1.15);
    expect(tallness(3)).toBeGreaterThan(tallness(1) * 1.8);
  });

  it("keep every photo shown once", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 11 }),
        fc.constantFrom<1 | 2 | 3>(1, 2, 3),
        fc.integer({ min: 0, max: 0xffffffff }),
        (index, rows, seed) => {
          const photos = withSpan(base, { [index]: { columns: 1, rows } });
          const shown = generateLayout(photos, 0.75, seededRng(seed))
            .toLayout()
            .placements.map((p) => p.photoIndex)
            .sort((a, b) => a - b);
          expect(shown).toEqual(base.map((_, i) => i));
        },
      ),
      { numRuns: 80 },
    );
  });
});

describe("photos that ask for nothing", () => {
  it("give exactly the layout photos without any span give", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 0xffffffff }), (seed) => {
        const plain = generateLayout(base, 0.75, seededRng(seed)).toLayout();
        const explicit = generateLayout(
          base.map((p) => ({ ...p, span: NO_SPAN })),
          0.75,
          seededRng(seed),
        ).toLayout();
        expect(explicit).toEqual(plain);
      }),
      { numRuns: 60 },
    );
  });
});
