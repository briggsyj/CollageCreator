// SPDX-License-Identifier: GPL-2.0-or-later

import { describe, expect, it } from "vitest";
import {
  findChoice,
  findPreset,
  orientationOf,
  PRESETS,
  SIZE_CHOICES,
  sizeOf,
} from "../src/ui/presets";

describe("size choices", () => {
  it("turn on their side for portrait", () => {
    const a4 = SIZE_CHOICES.find((c) => c.id === "a4");
    expect(a4 && sizeOf(a4, "landscape")).toEqual({ width: 3508, height: 2480 });
    expect(a4 && sizeOf(a4, "portrait")).toEqual({ width: 2480, height: 3508 });
  });

  it("are found again from a size in either orientation", () => {
    expect(findChoice(1600, 1200)?.choice.id).toBe("screen");
    expect(findChoice(1200, 1600)).toMatchObject({
      choice: { id: "screen" },
      orientation: "portrait",
    });
    expect(findChoice(1080, 1080)).toMatchObject({
      choice: { id: "square" },
      orientation: "square",
    });
    expect(findChoice(1234, 987)).toBeUndefined();
  });

  it("describe the orientation of any size", () => {
    expect(orientationOf(300, 200)).toBe("landscape");
    expect(orientationOf(200, 300)).toBe("portrait");
    expect(orientationOf(200, 200)).toBe("square");
  });

  it("every choice in both orientations is also in the menu list", () => {
    for (const choice of SIZE_CHOICES) {
      for (const orientation of ["landscape", "portrait"] as const) {
        const size = sizeOf(choice, orientation);
        expect(
          findPreset(size.width, size.height),
          `${choice.id} ${orientation}`,
        ).toBeGreaterThanOrEqual(0);
      }
    }
    expect(PRESETS.length).toBeGreaterThan(SIZE_CHOICES.length);
  });
});
