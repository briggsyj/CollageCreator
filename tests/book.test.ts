// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  BOOK_MAX_PAGES,
  bookFileNames,
  countsPerPage,
  fillPage,
  generateBestBook,
  generateBook,
  movedPageOf,
  normalisePerPage,
  PAGE_GAP,
  pageLayout,
  pageSeed,
  pagesWithPhotos,
  removedPageOf,
  shuffleAcrossPages,
  spreadEvenly,
} from "../src/core/book";
import { seededRng } from "../src/core/rng";
import type { LayoutPhoto } from "../src/core/types";

const photos = (n: number): LayoutPhoto[] =>
  Array.from({ length: n }, (_, i) => ({ width: 300 + 50 * (i % 4), height: 200 + 40 * (i % 3) }));

describe("book pages", () => {
  it("the first page uses the book's own seed", () => {
    expect(pageSeed(123, 0)).toBe(123);
    expect(pageSeed(123, 1)).not.toBe(123);
    expect(pageSeed(0xffffffff, 3)).toBeGreaterThanOrEqual(0);
  });

  it("fills the first page with room, then adds a page, up to the limit", () => {
    expect(fillPage([], 6)).toBe(0);
    expect(fillPage([6], 6)).toBe(1);
    expect(fillPage([6, 2], 6)).toBe(1);
    expect(fillPage([6, 6], 6)).toBe(2);
    // A blank page added by hand takes the next photos.
    expect(fillPage([6, 0, 6], 6)).toBe(1);
    // At the limit the last page takes the rest.
    expect(fillPage(new Array(BOOK_MAX_PAGES).fill(6), 6)).toBe(BOOK_MAX_PAGES - 1);
  });

  it("spreads photos in order, as evenly as possible, onto at least the pages there are", () => {
    expect(spreadEvenly(7, 3, 6)).toEqual({ pageOf: [0, 0, 0, 1, 1, 2, 2], pages: 3 });
    expect(spreadEvenly(0, 2, 6)).toEqual({ pageOf: [], pages: 2 });
    // More photos than the pages hold at the setting: pages are added.
    expect(spreadEvenly(13, 1, 6).pages).toBe(3);
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 120 }),
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 1, max: 20 }),
        (n, pages, per) => {
          const out = spreadEvenly(n, pages, per);
          expect(out.pageOf).toHaveLength(n);
          expect(out.pageOf).toEqual([...out.pageOf].sort((a, b) => a - b));
          const counts = countsPerPage(out.pageOf, out.pages);
          expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
          expect(out.pages).toBeGreaterThanOrEqual(Math.min(pages, BOOK_MAX_PAGES));
        },
      ),
    );
  });

  it("shuffling between pages keeps how many photos each page has", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 5 }), { maxLength: 40 }),
        fc.integer(),
        (pageOf, seed) => {
          const mixed = shuffleAcrossPages(pageOf, seededRng(seed >>> 0));
          expect(countsPerPage(mixed, 6)).toEqual(countsPerPage(pageOf, 6));
        },
      ),
    );
  });

  it("moving a page keeps every photo with its page", () => {
    // Pages A B C D with photos 0 1 2 3; move A to the end: B C D A.
    expect(movedPageOf([0, 1, 2, 3], 0, 3)).toEqual([3, 0, 1, 2]);
    expect(movedPageOf([0, 1, 2, 3], 3, 0)).toEqual([1, 2, 3, 0]);
    expect(movedPageOf([0, 1, 2, 3], 1, 1)).toEqual([0, 1, 2, 3]);
  });

  it("removing a page sends its photos to the prior page, or the next for the first", () => {
    expect(removedPageOf([0, 1, 1, 2, 3], 2)).toEqual([0, 1, 1, 1, 2]);
    expect(removedPageOf([0, 0, 1, 2], 0)).toEqual([0, 0, 0, 1]);
  });

  it("clamps photos per page", () => {
    expect(normalisePerPage(0)).toBe(1);
    expect(normalisePerPage(99)).toBe(20);
    expect(normalisePerPage(Number.NaN)).toBe(6);
    expect(normalisePerPage(4.9)).toBe(4);
  });

  it("names the saved pages in order, padded from ten on", () => {
    expect(bookFileNames("book-7", 3, "png")).toEqual([
      "book-7_1.png",
      "book-7_2.png",
      "book-7_3.png",
    ]);
    expect(bookFileNames("b", 10, "jpg")[0]).toBe("b_01.jpg");
  });
});

describe("a book's layout", () => {
  const ratio = 0.75;
  const list = photos(11);
  const pageOf = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2];

  it("puts every photo on exactly one page, in a row with gaps", () => {
    const layout = generateBook("mosaic", list, pageOf, 3, ratio, 5).toLayout();
    expect(layout.pages).toHaveLength(3);
    expect(layout.placements.map((p) => p.photoIndex).sort((a, b) => a - b)).toEqual(
      list.map((_, i) => i),
    );
    for (const p of layout.placements) expect(p.page).toBe(pageOf[p.photoIndex]);
    const [a, b, c] = layout.pages as { x: number; w: number }[];
    expect(a?.x).toBe(0);
    expect((b?.x ?? 0) - ((a?.x ?? 0) + (a?.w ?? 0))).toBeCloseTo(PAGE_GAP * (a?.w ?? 0), 9);
    expect((c?.x ?? 0) + (c?.w ?? 0)).toBeCloseTo(1, 9);
    // Each page is as high as the row and the pages are all one shape.
    expect(layout.height * (a?.w ?? 1) ** -1).toBeCloseTo(ratio, 9);
  });

  it("is the same again from the same seed, and the first page matches a plain collage", () => {
    const a = generateBook("gallery", list, pageOf, 3, ratio, 99).toLayout();
    const b = generateBook("gallery", list, pageOf, 3, ratio, 99).toLayout();
    expect(a).toEqual(b);
    const one = generateBook("mosaic", photos(4), [0, 0, 0, 0], 1, ratio, 7).toLayout();
    expect(one.pages).toEqual([{ x: 0, w: 1 }]);
    expect(one.height).toBeCloseTo(ratio, 9);
  });

  it("an empty page has no cells but still takes its place", () => {
    const layout = generateBook("mosaic", photos(3), [0, 0, 2], 3, ratio, 1).toLayout();
    expect(layout.pages).toHaveLength(3);
    expect(pagesWithPhotos(layout)).toEqual([0, 2]);
  });

  it("a page's own layout fills the page, with the photos' own indexes", () => {
    const layout = generateBook("mosaic", list, pageOf, 3, ratio, 5).toLayout();
    const second = pageLayout(layout, 1);
    expect(second.width).toBe(1);
    expect(second.height).toBeCloseTo(ratio, 9);
    expect(second.placements.map((p) => p.photoIndex).sort()).toEqual([4, 5, 6]);
    for (const { cell } of second.placements) {
      expect(cell.x).toBeGreaterThanOrEqual(-1e-9);
      expect(cell.x + cell.w).toBeLessThanOrEqual(1 + 1e-9);
      expect(cell.y + cell.h).toBeLessThanOrEqual(second.height + 1e-9);
    }
  });

  it("swapping across pages moves each photo into the other's cell", () => {
    const book = generateBook("mosaic", list, pageOf, 3, ratio, 5);
    const before = book.toLayout();
    const cellOf = (layout: typeof before, photo: number) =>
      layout.placements.find((p) => p.photoIndex === photo)?.cell;
    const a = cellOf(before, 0);
    const b = cellOf(before, 8);
    book.swapPhotos(0, 8);
    const after = book.toLayout();
    expect(cellOf(after, 0)).toEqual(b);
    expect(cellOf(after, 8)).toEqual(a);
    expect(after.placements.find((p) => p.photoIndex === 0)?.page).toBe(2);
    expect(book.pageOfPhoto(8)).toBe(0);
  });

  it("pages can be added and moved without re-arranging the others", () => {
    const book = generateBook("mosaic", list, pageOf, 3, ratio, 5);
    const cells = (layout: ReturnType<typeof book.toLayout>, photo: number) =>
      layout.placements.find((p) => p.photoIndex === photo)?.cell;
    const before0 = cells(book.toLayout(), 0);
    book.addPage();
    expect(book.pageCount).toBe(4);
    expect(book.toLayout().pages).toHaveLength(4);
    book.movePage(0, 2);
    const moved = book.toLayout();
    expect(book.pageOfPhoto(0)).toBe(2);
    // Page width changes with the number of pages, so compare within the page.
    const page = pageLayout(moved, 2);
    const original = pageLayout(generateBook("mosaic", list, pageOf, 3, ratio, 5).toLayout(), 0);
    expect(page.placements.find((p) => p.photoIndex === 0)?.cell.w).toBeCloseTo(
      original.placements.find((p) => p.photoIndex === 0)?.cell.w ?? -1,
      9,
    );
    expect(before0).toBeDefined();
  });

  it("the best of several books gives its seed back", () => {
    const best = generateBestBook("mosaic", list, pageOf, 3, ratio, 42, 6);
    const again = generateBook("mosaic", list, pageOf, 3, ratio, best.seed).toLayout();
    expect(best.page.toLayout()).toEqual(again);
  });
});
