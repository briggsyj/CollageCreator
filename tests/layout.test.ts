// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Web, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it is a TypeScript (Vitest) port of tests/test_collage.py, with the
// patched `random` module replaced by an injected random source.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import { beforeEach, describe, expect, it } from "vitest";
import { Page, pagePhoto } from "../src/core/layout";
import type { Rng } from "../src/core/rng";

/** A random source whose answers the tests control, like the original's mock patches. */
class ForcedRng implements Rng {
  position = 0;
  extension = 0.0;
  random(): number {
    return this.extension;
  }
  choice<T>(items: readonly T[]): T {
    return items[this.position] as T;
  }
  forceCellPosition(pos: number): void {
    this.position = pos;
  }
  preventCellExtension(): void {
    this.extension = 0.0;
  }
  forceCellExtension(): void {
    this.extension = 1.0;
  }
}

/** The original's `Photo("img", 10, h)`: width 10, height h. */
const photo = (h: number) => pagePhoto(0, h / 10);

describe("collage page (ported from test_collage.py)", () => {
  let rng: ForcedRng;
  beforeEach(() => {
    rng = new ForcedRng();
  });

  it("test_next_free_col", () => {
    rng.forceCellPosition(0);
    rng.preventCellExtension();

    let page = new Page(100, 0.6, 4, rng);
    page.addCell(photo(10));
    page.addCell(photo(10));
    expect(page.toString()).toBe("[25 25] [25 25]  ");

    page = new Page(40, 0.6, 4, rng);
    for (const h of [20, 15, 10, 10, 10, 10, 22]) page.addCell(photo(h));
    expect(page.toString()).toBe(
      "[10 20] [10 15] [10 10] [10 10]\n" + "        [10 22] [10 10] [10 10]",
    );

    page = new Page(50, 0.6, 5, rng);
    rng.forceCellExtension();
    page.addCell(photo(15));
    page.addCell(photo(10));
    rng.preventCellExtension();
    page.addCell(photo(10));
    page.addCell(photo(50));
    expect(page.toString()).toBe(
      "[20 30-- ------] [20 20-- ------] [10 10]\n" + "                                  [10 50]",
    );
  });

  it("test_remove_empty_cols", () => {
    const page = new Page(1, 0.6, 100, rng);
    rng.preventCellExtension();
    for (let i = 0; i < 5; i++) page.addCell(photo(10));
    page.removeEmptyCols();
    expect(page.cols).toHaveLength(5);
  });

  it("test_bottom_hole_A1", () => {
    const page = new Page(30, 0.6, 3, rng);
    rng.forceCellPosition(0);
    rng.preventCellExtension();
    page.addCell(photo(15));
    page.addCell(photo(10));
    page.addCell(photo(10));
    rng.forceCellExtension();
    page.addCell(photo(5));
    rng.preventCellExtension();
    page.addCell(photo(15));
    page.addCell(photo(10));

    expect(page.toString()).toBe(
      "[10 15] [10 10]  [10 10]\n" + "[10 15] [20 10-- ------]\n" + "        [10 10]         ",
    );
    page.removeBottomHoles();
    expect(page.toString()).toBe(
      "[10 15] [10 10]  [10 10]\n" + "[10 15] [20 10-- ------]\n" + "        [20 10-- ------]",
    );
  });

  it("test_bottom_hole_A2", () => {
    const page = new Page(30, 0.6, 3, rng);
    rng.forceCellPosition(0);
    rng.preventCellExtension();
    page.addCell(photo(15));
    page.addCell(photo(10));
    page.addCell(photo(10));
    rng.forceCellExtension();
    page.addCell(photo(5));
    rng.preventCellExtension();
    page.addCell(photo(15));
    rng.forceCellPosition(1);
    page.addCell(photo(10));

    expect(page.toString()).toBe(
      "[10 15] [10 10]  [10 10]\n" + "[10 15] [20 10-- ------]\n" + "                 [10 10]",
    );
    page.removeBottomHoles();
    expect(page.toString()).toBe(
      "[10 15] [10 10]  [10 10]\n" + "[10 15] [20 10-- ------]\n" + "        [20 10-- ------]",
    );
  });

  it("test_bottom_hole_B2", () => {
    const page = new Page(30, 0.6, 3, rng);
    rng.forceCellPosition(0);
    rng.preventCellExtension();
    page.addCell(photo(10));
    page.addCell(photo(10));
    page.addCell(photo(10));
    rng.forceCellExtension();
    page.addCell(photo(5));
    rng.preventCellExtension();
    page.addCell(photo(10));
    rng.forceCellPosition(2);
    rng.forceCellExtension();
    page.addCell(photo(5));

    expect(page.toString()).toBe(
      "[10 10]  [10 10]  [10 10]\n" + "[20 10-- ------]  [10 10]\n" + "         [20 10-- ------]",
    );
    page.removeBottomHoles();
    expect(page.toString()).toBe(
      "[10 10]  [10 10] [10 10]\n" + "[20 10-- ------] [10 10]\n" + "[20 10-- ------]        ",
    );
  });

  it("test_bottom_hole_B1", () => {
    const page = new Page(30, 0.6, 3, rng);
    rng.forceCellPosition(0);
    rng.preventCellExtension();
    for (let i = 0; i < 4; i++) page.addCell(photo(10));
    rng.forceCellExtension();
    page.addCell(photo(5));
    page.addCell(photo(5));

    expect(page.toString()).toBe(
      "[10 10]  [10 10]  [10 10]\n" + "[10 10]  [20 10-- ------]\n" + "[20 10-- ------]         ",
    );
    page.removeBottomHoles();
    expect(page.toString()).toBe(
      "[10 10] [10 10]  [10 10]\n" + "[10 10] [20 10-- ------]\n" + "        [20 10-- ------]",
    );
  });
});
