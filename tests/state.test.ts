// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import type { PosterSettings } from "../src/core/types";
import type { ImportedPhoto } from "../src/io/import";
import { describeSpan, summariseSkipped } from "../src/ui/state/notices";
import { toSavedSession, withSavedDetails } from "../src/ui/state/saved-work";

const SETTINGS: PosterSettings = {
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

function photo(name: string, extra: Partial<ImportedPhoto> = {}): ImportedPhoto {
  return {
    id: name,
    name,
    width: 400,
    height: 300,
    span: { columns: 1, rows: 1 },
    file: new File(["x"], name, { lastModified: 1 }),
    thumb: {} as ImageBitmap,
    colour: "#000",
    ...extra,
  };
}

describe("the notice for skipped files", () => {
  it("is nothing when nothing was skipped", () => {
    expect(summariseSkipped([])).toBeNull();
  });

  it("counts by reason; only already-added photos make a quiet notice", () => {
    const dup = summariseSkipped([{ reason: "duplicate", name: "a.png" }]);
    expect(dup?.kind).toBe("info");
    expect(dup?.summary).toBe("1 file was not added");
    const mixed = summariseSkipped([
      { reason: "duplicate", name: "a.png" },
      { reason: "not-image", name: "b.txt" },
      { reason: "not-image", name: "c.txt" },
    ]);
    expect(mixed?.kind).toBe("error");
    expect(mixed?.summary).toBe("3 files were not added");
    expect(mixed?.reasons).toBe("1 already added, 2 not an image");
    expect(mixed?.items).toEqual([
      "a.png: already added",
      "b.txt: not an image",
      "c.txt: not an image",
    ]);
  });

  it("describes a size request", () => {
    expect(describeSpan(undefined)).toBe("");
    expect(describeSpan({ columns: 2, rows: 3 })).toBe("wider · taller ×3");
  });
});

describe("saved work", () => {
  const work = {
    seed: 7,
    columns: 3,
    layoutStyle: "mosaic" as const,
    settings: SETTINGS,
  };

  it("keeps pages only for a book of two or more pages", () => {
    const photos = [photo("a.png", { bookPage: 1, crop: { zoom: 2, x: 0.5, y: 0.5 } })];
    const one = toSavedSession({ ...work, photos, pageCount: 1 });
    expect(one.book).toBeUndefined();
    expect(one.photos[0]?.page).toBeUndefined();
    expect(one.photos[0]?.crop).toEqual({ zoom: 2, x: 0.5, y: 0.5 });
    const two = toSavedSession({ ...work, photos, pageCount: 2 });
    expect(two.book?.pages).toBe(2);
    expect(two.photos[0]?.page).toBe(1);
  });

  it("gives photos read back their size, crop and page", () => {
    const photos = [photo("a.png"), photo("b.png")];
    const saved = toSavedSession({
      ...work,
      photos: [photo("a.png", { span: { columns: 2, rows: 1 }, bookPage: 1 }), photo("b.png")],
      pageCount: 2,
    });
    const back = withSavedDetails(photos, saved.photos);
    expect(back[0]?.span).toEqual({ columns: 2, rows: 1 });
    expect(back[0]?.bookPage).toBe(1);
    expect(back[1]?.span).toEqual({ columns: 1, rows: 1 });
  });
});
