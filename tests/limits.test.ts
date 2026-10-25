// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { clampSize } from "../src/platform/limits";

const limits = { maxSide: 16384, maxArea: 100_000_000 };

describe("clampSize", () => {
  it("leaves sizes that fit alone", () => {
    expect(clampSize(4961, 7016, limits)).toEqual({ width: 4961, height: 7016, clamped: false });
  });

  it("shrinks to the side limit, keeping the shape", () => {
    const r = clampSize(32768, 16384, { maxSide: 16384, maxArea: 1e12 });
    expect(r).toEqual({ width: 16384, height: 8192, clamped: true });
  });

  it("shrinks to the area limit", () => {
    const r = clampSize(20000, 20000, limits);
    expect(r.clamped).toBe(true);
    expect(r.width * r.height).toBeLessThanOrEqual(limits.maxArea);
  });

  it("always returns something that fits and is close to the requested shape", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 60000 }),
        fc.integer({ min: 1, max: 60000 }),
        (w, h) => {
          const r = clampSize(w, h, limits);
          expect(r.width).toBeLessThanOrEqual(limits.maxSide);
          expect(r.height).toBeLessThanOrEqual(limits.maxSide);
          expect(r.width * r.height).toBeLessThanOrEqual(limits.maxArea);
          expect(r.width).toBeGreaterThanOrEqual(1);
          expect(r.height).toBeGreaterThanOrEqual(1);
        },
      ),
    );
  });
});
