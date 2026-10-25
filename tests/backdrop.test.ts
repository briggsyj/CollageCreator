// SPDX-License-Identifier: GPL-2.0-or-later

import { describe, expect, it } from "vitest";
import { BACKDROP_CELLS, backdropColours } from "../src/ui/backdrop";

describe("backdropColours", () => {
  it("has no colours without photos, so the theme's neutrals show", () => {
    expect(backdropColours([])).toEqual(Array(BACKDROP_CELLS).fill(undefined));
  });

  it("takes the photos' colours in the order they were added, starting again when it runs out", () => {
    const colours = backdropColours(["a", "b", "c"]);
    expect(colours).toHaveLength(BACKDROP_CELLS);
    expect(colours.slice(0, 6)).toEqual(["a", "b", "c", "a", "b", "c"]);
  });

  it("uses only the first twelve photos", () => {
    const many = Array.from({ length: 30 }, (_, i) => `c${i}`);
    expect(backdropColours(many)).toEqual(many.slice(0, BACKDROP_CELLS));
  });
});
