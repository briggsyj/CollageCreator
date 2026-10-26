// SPDX-License-Identifier: GPL-2.0-or-later

import { describe, expect, it } from "vitest";
import { averageColour } from "../src/io/colour";

describe("averageColour", () => {
  it("averages the pixels", () => {
    const data = [255, 0, 0, 255, 0, 0, 255, 255];
    expect(averageColour(data)).toBe("rgb(128, 0, 128)");
  });

  it("ignores transparent pixels", () => {
    const data = [10, 20, 30, 255, 200, 200, 200, 0];
    expect(averageColour(data)).toBe("rgb(10, 20, 30)");
  });

  it("is a neutral grey for nothing to average", () => {
    expect(averageColour([])).toBe("rgb(200, 200, 200)");
    expect(averageColour([1, 2, 3, 0])).toBe("rgb(200, 200, 200)");
  });
});
