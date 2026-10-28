// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { pressPixels, pressSource } from "../src/render/press";

describe("pressed-in look", () => {
  it("leaves every edge where it is and pulls the middle in", () => {
    for (const t of [-1, -0.5, 0, 0.5, 1]) {
      expect(pressSource(1, t)).toEqual([1, t]);
      expect(pressSource(t, -1)).toEqual([t, -1]);
    }
    const [sx] = pressSource(0.2, 0);
    expect(sx).toBeGreaterThan(0.2);
  });

  it("keeps the order of pixels along a line (nothing folds over)", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1, max: 1, noNaN: true }),
        fc.double({ min: -1, max: 1, noNaN: true }),
        fc.double({ min: -1, max: 1, noNaN: true }),
        (a, b, y) => {
          const [sa] = pressSource(Math.min(a, b), y);
          const [sb] = pressSource(Math.max(a, b), y);
          expect(sb).toBeGreaterThanOrEqual(sa - 1e-12);
        },
      ),
    );
  });

  it("keeps the edge pixels of an image unchanged", () => {
    const w = 9;
    const h = 7;
    const src = new Uint8ClampedArray(w * h * 4).map((_, i) => (i * 37) % 256);
    const out = pressPixels(src, w, h);
    for (let x = 0; x < w; x++) {
      for (const y of [0, h - 1]) {
        const i = (y * w + x) * 4;
        expect([...out.slice(i, i + 4)]).toEqual([...src.slice(i, i + 4)]);
      }
    }
  });
});
