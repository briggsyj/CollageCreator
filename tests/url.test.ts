// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import { parseSeed, withSeed } from "../src/ui/url";

describe("parseSeed", () => {
  it("reads a whole-number seed", () => {
    expect(parseSeed("?seed=42")).toBe(42);
    expect(parseSeed("?a=1&seed=0")).toBe(0);
    expect(parseSeed("?seed=4294967295")).toBe(4294967295);
  });

  it("ignores anything that is not a usable seed", () => {
    for (const search of [
      "",
      "?",
      "?seed=",
      "?seed=-1",
      "?seed=1.5",
      "?seed=abc",
      "?seed=4294967296",
      "?seed=1e3",
    ]) {
      expect(parseSeed(search), search).toBeUndefined();
    }
  });
});

describe("withSeed", () => {
  it("adds or replaces the seed and keeps the rest of the address", () => {
    expect(withSeed("https://x.test/app/", 7)).toBe("https://x.test/app/?seed=7");
    expect(withSeed("https://x.test/app/?seed=1&a=b#top", 9)).toBe(
      "https://x.test/app/?seed=9&a=b#top",
    );
  });

  it("round-trips with parseSeed", () => {
    expect(parseSeed(new URL(withSeed("https://x.test/", 123456)).search)).toBe(123456);
  });
});
