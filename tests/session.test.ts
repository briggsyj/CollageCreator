// SPDX-License-Identifier: GPL-2.0-or-later

import { describe, expect, it } from "vitest";
import type { PosterSettings } from "../src/core/types";
import { checkSession, checkSettings } from "../src/io/session";

const DEFAULTS: PosterSettings = {
  width: 1600,
  height: 1200,
  borderWidth: 0.005,
  borderColor: "#ffffff",
  cornerStyle: "none",
  outerBorder: true,
  splitImages: 0,
  format: "png",
  jpegQuality: 0.92,
};

describe("checkSettings", () => {
  it("keeps good values", () => {
    const good: PosterSettings = {
      width: 800,
      height: 600,
      borderWidth: 0.02,
      borderColor: "#112233",
      cornerStyle: "rounded",
      outerBorder: false,
      splitImages: 0,
      format: "jpeg",
      jpegQuality: 0.5,
    };
    expect(checkSettings(good, DEFAULTS)).toEqual(good);
  });

  it("replaces anything out of range or of the wrong type with the default", () => {
    const bad = {
      width: -4,
      height: "tall",
      borderWidth: 5,
      borderColor: "red; background: url(x)",
      cornerStyle: "wavy",
      outerBorder: "yes",
      format: "gif",
      jpegQuality: 7,
    };
    expect(checkSettings(bad, DEFAULTS)).toEqual(DEFAULTS);
    expect(checkSettings(undefined, DEFAULTS)).toEqual(DEFAULTS);
    expect(checkSettings("nope", DEFAULTS)).toEqual(DEFAULTS);
  });
});

describe("checkSettings: split collage", () => {
  const split = { ...DEFAULTS, width: 3240, height: 1080, splitImages: 3 };

  it("keeps a split that matches its size", () => {
    expect(checkSettings(split, DEFAULTS)).toEqual(split);
  });

  it("drops a split that no longer matches its size, or is out of range", () => {
    expect(checkSettings({ ...split, width: 3000 }, DEFAULTS).splitImages).toBe(0);
    expect(checkSettings({ ...split, splitImages: 1 }, DEFAULTS).splitImages).toBe(0);
    expect(checkSettings({ ...split, splitImages: "3" }, DEFAULTS).splitImages).toBe(0);
  });
});

describe("checkSession", () => {
  const good = {
    v: 1,
    photos: [
      { key: "a.jpg|1|2", span: { columns: 2, rows: 3 } },
      { key: "b.jpg|1|2", span: { columns: 5, rows: 1 } },
      { nokey: true },
    ],
    seed: 77,
    columns: 4.7,
    settings: DEFAULTS,
  };

  it("accepts a stored session, repairing what is wrong in it", () => {
    const s = checkSession(good, DEFAULTS);
    expect(s?.photos).toEqual([
      { key: "a.jpg|1|2", span: { columns: 2, rows: 3 } },
      { key: "b.jpg|1|2", span: { columns: 1, rows: 1 } },
    ]);
    expect(s?.seed).toBe(77);
    expect(s?.columns).toBe(4);
  });

  it("rejects things that are not a session of this version", () => {
    expect(checkSession(null, DEFAULTS)).toBeNull();
    expect(checkSession({ ...good, v: 2 }, DEFAULTS)).toBeNull();
    expect(checkSession({ v: 1 }, DEFAULTS)).toBeNull();
  });

  it("falls back to automatic columns and a safe seed", () => {
    const s = checkSession({ ...good, columns: 0, seed: -3 }, DEFAULTS);
    expect(s?.columns).toBeUndefined();
    expect(s?.seed).toBe(0);
  });
});
