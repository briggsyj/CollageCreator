// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { numberIn, resolvePhoto, resolvePhotos, wholeIn } from "../src/agent/args";

const pages = [[4, 2, 7], [], [0]];

describe("resolvePhoto", () => {
  it("counts page and position from 1, in the order given", () => {
    expect(resolvePhoto({ page: 1, position: 1 }, pages)).toEqual({ ok: true, index: 4 });
    expect(resolvePhoto({ page: 1, position: 3 }, pages)).toEqual({ ok: true, index: 7 });
    expect(resolvePhoto({ page: 3, position: 1 }, pages)).toEqual({ ok: true, index: 0 });
  });

  it("refuses a page or position that does not exist, with a reason", () => {
    expect(resolvePhoto({ page: 4, position: 1 }, pages)).toMatchObject({
      ok: false,
      code: "no-such-page",
    });
    expect(resolvePhoto({ page: 2, position: 1 }, pages)).toMatchObject({
      ok: false,
      code: "no-such-photo",
    });
    expect(resolvePhoto({ page: 1, position: 4 }, pages)).toMatchObject({
      ok: false,
      code: "no-such-photo",
    });
  });

  it("refuses values that are not whole numbers", () => {
    for (const bad of [
      null,
      undefined,
      {},
      { page: "1", position: 1 },
      { page: 1.5, position: 1 },
    ]) {
      expect(resolvePhoto(bad, pages)).toMatchObject({ ok: false, code: "bad-value" });
    }
  });

  it("finds exactly the photo at that place, for any layout of pages", () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.nat(50), { maxLength: 6 }), { minLength: 1, maxLength: 5 }),
        (grid) => {
          grid.forEach((row, p) => {
            row.forEach((index, n) => {
              expect(resolvePhoto({ page: p + 1, position: n + 1 }, grid)).toEqual({
                ok: true,
                index,
              });
            });
            expect(resolvePhoto({ page: p + 1, position: row.length + 1 }, grid).ok).toBe(false);
          });
        },
      ),
    );
  });
});

describe("resolvePhotos", () => {
  it("drops repeats and reports the first problem", () => {
    expect(
      resolvePhotos(
        [
          { page: 1, position: 1 },
          { page: 1, position: 1 },
        ],
        pages,
      ),
    ).toEqual({ ok: true, indices: [4] });
    expect(
      resolvePhotos(
        [
          { page: 1, position: 1 },
          { page: 2, position: 1 },
        ],
        pages,
      ),
    ).toMatchObject({ ok: false, code: "no-such-photo" });
    expect(resolvePhotos([], pages)).toMatchObject({ ok: false });
  });
});

describe("limits", () => {
  it("accepts whole numbers and numbers only inside their range", () => {
    expect(wholeIn(3, 1, 20)).toBe(3);
    expect(wholeIn(0, 1, 20)).toBeUndefined();
    expect(wholeIn(21, 1, 20)).toBeUndefined();
    expect(wholeIn(2.5, 1, 20)).toBeUndefined();
    expect(wholeIn("3", 1, 20)).toBeUndefined();
    expect(numberIn(1.5, 1, 4)).toBe(1.5);
    expect(numberIn(Number.NaN, 1, 4)).toBeUndefined();
  });
});
