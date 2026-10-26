// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { seededRng } from "../src/core/rng";
import { GALLERY_TRIES, generateBestPage, generatePage, scoreLayout } from "../src/core/search";
import { generateSlicingLayout } from "../src/core/slicing";
import type { Layout, LayoutPhoto, Rect } from "../src/core/types";

const photosArb = fc.array(
  fc.record({
    width: fc.integer({ min: 200, max: 6000 }),
    height: fc.integer({ min: 200, max: 6000 }),
  }),
  { minLength: 1, maxLength: 40 },
);
const ratioArb = fc.double({ min: 0.4, max: 2.5, noNaN: true });
const seedArb = fc.integer({ min: 0, max: 0xffffffff });

const area = (r: Rect) => r.w * r.h;
const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

function layoutOf(photos: LayoutPhoto[], ratio: number, seed: number): Layout {
  return generateSlicingLayout(photos, ratio, seededRng(seed)).toLayout();
}

describe("Gallery layout (slicing tree)", () => {
  it("is empty without photos and one full-page panel with one photo", () => {
    expect(layoutOf([], 0.75, 1).placements).toEqual([]);
    const one = layoutOf([{ width: 400, height: 300 }], 0.75, 1);
    expect(one.placements).toHaveLength(1);
    expect(one.placements[0]?.cell).toEqual({ x: 0, y: 0, w: 1, h: 0.75 });
  });

  it("tiles the poster exactly: panels inside the page, no gaps, no overlaps", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const layout = layoutOf(photos, ratio, seed);
        const cells = layout.placements.map((p) => p.cell);
        const total = cells.reduce((sum, c) => sum + area(c), 0);
        expect(total).toBeCloseTo(layout.width * layout.height, 9);
        for (const c of cells) {
          expect(c.x).toBeGreaterThanOrEqual(-1e-12);
          expect(c.y).toBeGreaterThanOrEqual(-1e-12);
          expect(c.x + c.w).toBeLessThanOrEqual(1 + 1e-9);
          expect(c.y + c.h).toBeLessThanOrEqual(layout.height + 1e-9);
          expect(c.w).toBeGreaterThan(0);
          expect(c.h).toBeGreaterThan(0);
        }
        // Equal total area plus no overlap means no gaps.
        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            expect(overlap(cells[i] as Rect, cells[j] as Rect)).toBeLessThan(1e-9);
          }
        }
      }),
      { numRuns: 60 },
    );
  });

  it("places every photo exactly once", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        const shown = layoutOf(photos, ratio, seed)
          .placements.map((p) => p.photoIndex)
          .sort((a, b) => a - b);
        expect(shown).toEqual(photos.map((_, i) => i));
      }),
      { numRuns: 60 },
    );
  });

  it("gives the same arrangement for the same photos, shape and seed", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (photos, ratio, seed) => {
        expect(layoutOf(photos, ratio, seed)).toEqual(layoutOf(photos, ratio, seed));
      }),
      { numRuns: 30 },
    );
  });

  it("gives a photo that asks for more room a larger panel", () => {
    const same = { width: 400, height: 300 };
    for (const span of [
      { columns: 2, rows: 1 },
      { columns: 1, rows: 3 },
    ] as const) {
      const layout = layoutOf([{ ...same, span }, same], 0.75, 5);
      const asked = layout.placements.find((p) => p.photoIndex === 0)?.cell as Rect;
      const other = layout.placements.find((p) => p.photoIndex === 1)?.cell as Rect;
      expect(area(asked)).toBeGreaterThan(area(other));
    }
  });

  it("swaps two photos without moving any panel", () => {
    const photos = Array.from({ length: 6 }, (_, i) => ({ width: 300 + 50 * i, height: 300 }));
    const page = generateSlicingLayout(photos, 0.75, seededRng(3));
    const before = page.toLayout();
    page.swapPhotos(1, 4);
    const after = page.toLayout();
    const cellOf = (layout: Layout, index: number) =>
      layout.placements.find((p) => p.photoIndex === index)?.cell;
    expect(cellOf(after, 1)).toEqual(cellOf(before, 4));
    expect(cellOf(after, 4)).toEqual(cellOf(before, 1));
    expect(cellOf(after, 2)).toEqual(cellOf(before, 2));
  });

  it("keeps the same arrangement when the poster shape changes", () => {
    const photos = Array.from({ length: 8 }, () => ({ width: 400, height: 300 }));
    const page = generateSlicingLayout(photos, 0.75, seededRng(9));
    const order = (layout: Layout) => layout.placements.map((p) => p.photoIndex);
    const before = order(page.toLayout());
    page.setTargetRatio(1.5);
    const after = page.toLayout();
    expect(order(after)).toEqual(before);
    expect(after.height).toBe(1.5);
    const total = after.placements.reduce((sum, p) => sum + area(p.cell), 0);
    expect(total).toBeCloseTo(1.5, 9);
  });
});

describe("generatePage and generateBestPage", () => {
  const photos = Array.from({ length: 12 }, (_, i) => ({
    width: i % 3 === 0 ? 300 : 400,
    height: i % 3 === 0 ? 400 : 300,
  }));

  it("make Mosaic or Gallery arrangements on request", () => {
    const mosaic = generatePage("mosaic", photos, 0.75, seededRng(2));
    const gallery = generatePage("gallery", photos, 0.75, seededRng(2));
    expect(mosaic.noCols).toBeGreaterThan(0);
    expect(gallery.noCols).toBeUndefined();
    expect(gallery.toLayout().placements).toHaveLength(photos.length);
  });

  it("keep the best of several Gallery tries, and the winner's seed reproduces it", () => {
    const best = generateBestPage("gallery", photos, 0.75, 77);
    expect(best.tried).toBe(GALLERY_TRIES);
    const again = generatePage("gallery", photos, 0.75, seededRng(best.seed));
    expect(again.toLayout()).toEqual(best.page.toLayout());
  });

  it("are never worse than a single try", () => {
    fc.assert(
      fc.property(photosArb, ratioArb, seedArb, (list, ratio, seed) => {
        const best = generateBestPage("gallery", list, ratio, seed);
        const single = generatePage("gallery", list, ratio, seededRng(best.seed));
        const singleScore = scoreLayout(single.toLayout(), list);
        expect(best.score.cutOff).toBeLessThanOrEqual(singleScore.cutOff + 1e-9);
        expect(best.score.uncovered).toBeLessThan(1e-9);
      }),
      { numRuns: 20 },
    );
  });

  it("crop less than a single random try on average", () => {
    const sample = Array.from({ length: 20 }, (_, i) => ({
      width: 300 + ((i * 97) % 500),
      height: 300 + ((i * 53) % 500),
    }));
    const best = generateBestPage("gallery", sample, 0.75, 4);
    let total = 0;
    for (let seed = 1; seed <= 20; seed++) {
      total += scoreLayout(
        generatePage("gallery", sample, 0.75, seededRng(seed)).toLayout(),
        sample,
      ).cutOff;
    }
    expect(best.score.cutOff).toBeLessThan(total / 20);
  });
});
