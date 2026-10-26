// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import {
  normaliseSplit,
  SPLIT_MAX,
  sliceRects,
  splitBoundaries,
  splitFileNames,
  splitSize,
} from "../src/core/split";
import { crc32, zipBytes } from "../src/io/zip";

describe("split collage", () => {
  it("accepts 2 to 20 images and treats anything else as not split", () => {
    expect(normaliseSplit(3)).toBe(3);
    expect(normaliseSplit(3.9)).toBe(3);
    expect(normaliseSplit(2)).toBe(2);
    expect(normaliseSplit(99)).toBe(SPLIT_MAX);
    for (const v of [1, 0, -4, Number.NaN, undefined, null]) expect(normaliseSplit(v)).toBe(0);
  });

  it("makes the collage as wide as the squares side by side", () => {
    expect(splitSize(3, 1080)).toEqual({ width: 3240, height: 1080 });
  });

  it("cuts into equal parts, one fewer cut than images", () => {
    expect(splitBoundaries(3000, 3)).toEqual([1000, 2000]);
    expect(splitBoundaries(500, 2)).toEqual([250]);
    expect(splitBoundaries(500, 1)).toEqual([]);
  });

  it("takes each image from its own square, left to right, with nothing left over", () => {
    const rects = sliceRects(4, 100);
    expect(rects.map((r) => r.x)).toEqual([0, 100, 200, 300]);
    expect(rects.every((r) => r.w === 100 && r.h === 100 && r.y === 0)).toBe(true);
  });

  it("numbers files from 1 in order, padding when there are ten or more", () => {
    expect(splitFileNames("collage-7", 3, "png")).toEqual([
      "collage-7_1.png",
      "collage-7_2.png",
      "collage-7_3.png",
    ]);
    const many = splitFileNames("c", 12, "jpg");
    expect(many[0]).toBe("c_01.jpg");
    expect(many[11]).toBe("c_12.jpg");
    expect([...many].sort()).toEqual(many);
  });
});

describe("zip writer", () => {
  it("computes the standard CRC-32", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
    expect(crc32(new Uint8Array())).toBe(0);
  });

  it("writes a readable archive: entries in order, names, sizes and contents intact", () => {
    const a = new TextEncoder().encode("hello");
    const b = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const zip = zipBytes(
      [
        { name: "x_1.png", data: a },
        { name: "x_2.png", data: b },
      ],
      new Date(2026, 9, 25, 12, 0, 0),
    );
    const view = new DataView(zip.buffer);
    // End of central directory
    const end = zip.length - 22;
    expect(view.getUint32(end, true)).toBe(0x06054b50);
    expect(view.getUint16(end + 10, true)).toBe(2);
    // Walk the central directory
    let at = view.getUint32(end + 16, true);
    const seen: { name: string; size: number; crc: number; offset: number }[] = [];
    for (let i = 0; i < 2; i++) {
      expect(view.getUint32(at, true)).toBe(0x02014b50);
      const nameLen = view.getUint16(at + 28, true);
      seen.push({
        name: new TextDecoder().decode(zip.subarray(at + 46, at + 46 + nameLen)),
        size: view.getUint32(at + 24, true),
        crc: view.getUint32(at + 16, true),
        offset: view.getUint32(at + 42, true),
      });
      at += 46 + nameLen;
    }
    expect(seen.map((s) => s.name)).toEqual(["x_1.png", "x_2.png"]);
    expect(seen.map((s) => s.size)).toEqual([5, 6]);
    // The stored data sits right after each local header, and matches its CRC.
    for (const [i, data] of [a, b].entries()) {
      const s = seen[i];
      expect(s).toBeDefined();
      const o = (s as (typeof seen)[number]).offset;
      expect(view.getUint32(o, true)).toBe(0x04034b50);
      const start = o + 30 + view.getUint16(o + 26, true);
      expect([...zip.subarray(start, start + data.length)]).toEqual([...data]);
      expect((s as (typeof seen)[number]).crc).toBe(crc32(data));
    }
  });
});
