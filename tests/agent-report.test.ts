// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import { buildReport, type PhotoInfo, type ReportInput } from "../src/agent/report";

function input(photos: PhotoInfo[], pageCount = 1): ReportInput {
  return {
    photos,
    layout: { style: "mosaic", columns: "auto", columnsInUse: 3, seed: 7 },
    style: { borderWidth: 0.05, borderColor: "#ffffff", corners: "none", outerBorder: true },
    size: { width: 1600, height: 1200, portrait: false, named: "screen", postImages: 0 },
    pageCount,
    pageCounts: Array.from({ length: pageCount }, () => 0),
    view: { tab: "photos", tool: "pan", zoomPercent: 100, fit: true },
    save: { format: "png", quality: 92, saving: false, progress: 0, last: null },
    ui: {
      language: "en",
      dialog: null,
      pendingQuestion: null,
      confirmationOutcome: null,
      notices: [],
    },
    canUndoRemove: false,
  };
}

const photo = (page: number, position: number, extra: Partial<PhotoInfo> = {}): PhotoInfo => ({
  name: `IMG_${String(page * 1000 + position).padStart(4, "0")}.jpg`,
  width: 4000,
  height: 3000,
  page,
  position,
  selected: false,
  wider: false,
  taller: false,
  cropped: false,
  ...extra,
});

describe("buildReport", () => {
  it("groups photos by page and position, counting from 1", () => {
    const report = buildReport(input([photo(2, 1), photo(1, 2), photo(1, 1)], 2));
    expect(report.pages.map((p) => [p.page, p.photos.map((x) => x.position)])).toEqual([
      [1, [1, 2]],
      [2, [1]],
    ]);
  });

  it("lists the selection by page and position, and flags only what is set", () => {
    const report = buildReport(input([photo(1, 1, { selected: true, wider: true }), photo(1, 2)]));
    expect(report.selection).toEqual([{ page: 1, position: 1 }]);
    expect(report.pages[0]?.photos[0]).toMatchObject({ selected: true, wider: true });
    expect(report.pages[0]?.photos[1]).not.toHaveProperty("selected");
  });

  it("shows the border as the slider's percentage", () => {
    expect(buildReport(input([])).style.borderPercent).toBe(50);
  });

  it("reports a post only when there is one", () => {
    expect(buildReport(input([])).size.instagramPostImages).toBeNull();
    const post = input([]);
    post.size.postImages = 5;
    expect(buildReport(post).size.instagramPostImages).toBe(5);
  });

  it("keeps 100 photos on 5 pages under 12 KB (SC-006)", () => {
    const photos = Array.from({ length: 100 }, (_, i) =>
      photo((i % 5) + 1, Math.floor(i / 5) + 1, { selected: i === 0, wider: i % 7 === 0 }),
    );
    const text = JSON.stringify(buildReport(input(photos, 5)));
    expect(text.length).toBeLessThan(12_000);
  });
});
