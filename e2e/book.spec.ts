// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Specs 014 to 016: a collage is a book of one page; more pages, each saved as its own image.

import { expect, type Page, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  COLORS,
  clickPhoto,
  makeImages,
  near,
  pngSize,
  posterPoint,
  posterRect,
  previewColor,
  previewIdle,
  readZip,
  saveAndRead,
  savedWork,
  setSize,
  settle,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  await page.goto("./");
});

const names = (n: number, color: keyof typeof COLORS = "red") =>
  Array.from({ length: n }, (_, i) => ({
    name: `p${String(i + 1).padStart(2, "0")}.png`,
    w: 400,
    h: 300,
    color,
  }));

const COLOUR_ORDER = ["red", "green", "blue", "yellow", "magenta", "cyan"] as const;
const colourful = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    name: `c${i + 1}.png`,
    w: 400,
    h: 300,
    color: COLOUR_ORDER[i % COLOUR_ORDER.length] as (typeof COLOUR_ORDER)[number],
  }));

/** Photo names on each page, from the Photos step. */
async function pagesOfNames(page: Page): Promise<string[][]> {
  await page.click("#tab-photos");
  return page
    .locator("#photo-list .page-group")
    .evaluateAll((groups) =>
      groups.map((g) =>
        Array.from(g.querySelectorAll(".name")).map((n) => n.textContent?.trim() ?? ""),
      ),
    );
}

/** Add pages with the button under the last page until there are `count`. */
async function addPages(page: Page, count: number) {
  const have = await page.locator("#photo-list .page-group").count();
  for (let i = Math.max(1, have); i < count; i++) {
    await page.click("#add-page-tile");
    await expect(page.locator("#photo-list .page-group")).toHaveCount(i + 1);
  }
}

/** Set the page count in the Style step; the photos are shared evenly across the pages. */
async function setPages(page: Page, count: number) {
  await page.click("#tab-style");
  await page.fill("#pages", String(count));
  await page.locator("#pages").press("Tab");
  await expect(page.locator("#photo-list .page-group")).toHaveCount(count);
}

async function posterRatio(page: Page): Promise<number> {
  await previewIdle(page);
  const poster = (await page.locator("#preview").getAttribute("data-poster")) ?? "";
  const [, , w, h] = poster.split(",").map(Number) as number[];
  return (w as number) / (h as number);
}

test.describe("A collage is a book of one page", () => {
  test("with one page there are no page controls, and every photo is on it", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(9)));
    await expect(page.locator("#layout-book")).toHaveCount(0);
    await expect(page.locator("#pages-block")).toBeHidden();
    await expect(page.locator(".page-pill")).toHaveCount(0);
    await expect(page.locator("#add-page-tile")).toBeVisible();
    await page.click("#tab-photos");
    await expect(page.locator("#photo-list .page-group")).toHaveCount(1);
    await expect(page.locator("#photo-list .page-head")).toHaveCount(0);
    await page.click("#tab-style");
    await expect(page.locator("#shuffle-pages")).toBeHidden();
    // One page is the plain collage: its shape is the output shape.
    expect(await posterRatio(page)).toBeCloseTo(320 / 240, 1);
  });

  test("Add page makes a second, blank page and the page controls appear", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await page.click("#add-page-tile");
    expect(await pagesOfNames(page)).toEqual([["p01.png", "p02.png", "p03.png", "p04.png"], []]);
    await expect(page.locator(".page-pill")).toHaveCount(2);
    await page.click("#tab-style");
    await expect(page.locator("#pages")).toHaveValue("2");
    await expect(page.locator("#shuffle-pages")).toBeVisible();
    expect(await posterRatio(page)).toBeCloseTo((2 + 0.04) * (320 / 240), 1);
  });

  test("removing pages down to one gives the plain collage back", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await addPages(page, 2);
    await page.locator(".page-remove").nth(1).click();
    await page.click("#remove-page-confirm");
    await expect(page.locator(".page-pill")).toHaveCount(0);
    expect(await posterRatio(page)).toBeCloseTo(320 / 240, 1);
  });

  test("removing a page asks first, and Cancel keeps it", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await addPages(page, 2);
    await page.locator(".page-remove").nth(1).click();
    await expect(page.locator("#remove-page-dialog")).toBeVisible();
    await page.click("#remove-page-cancel");
    await expect(page.locator(".page-pill")).toHaveCount(2);
  });

  test("Add page sits under the last page and stays under the pointer, so clicking again and again adds a page each time", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(3)));
    const at = await page.locator("#add-page-tile").boundingBox();
    const sheet = await posterRect(page);
    const canvas = await page.locator("#preview").boundingBox();
    // Right-aligned with the last page, just below it.
    expect(
      Math.abs((at?.x ?? 0) + (at?.width ?? 0) - ((canvas?.x ?? 0) + sheet.x + sheet.w)),
    ).toBeLessThan(2);
    expect(at?.y ?? 0).toBeGreaterThan((canvas?.y ?? 0) + sheet.y + sheet.h);
    for (let n = 2; n <= 5; n++) {
      await page.click("#add-page-tile");
      await expect(page.locator("#photo-list .page-group")).toHaveCount(n);
      await previewIdle(page);
      expect(await page.locator("#add-page-tile").boundingBox()).toEqual(at);
    }
  });
});

test.describe("Book: pages", () => {
  test("the page count shares the photos evenly; new photos go on the last page", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(6)));
    await setPages(page, 2);
    expect(await pagesOfNames(page)).toEqual([
      ["p01.png", "p02.png", "p03.png"],
      ["p04.png", "p05.png", "p06.png"],
    ]);
    await addPhotos(page, await makeImages(page, names(7).slice(6)));
    expect(await pagesOfNames(page)).toEqual([
      ["p01.png", "p02.png", "p03.png"],
      ["p04.png", "p05.png", "p06.png", "p07.png"],
    ]);
    await setPages(page, 3);
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([3, 2, 2]);
    await setPages(page, 1);
    await expect(page.locator(".page-pill")).toHaveCount(0);
  });

  test("photos added later go on the last page, even a blank one", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(6)));
    await setPages(page, 2);
    await page.click("#add-page-tile");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([3, 3, 0]);
    await addPhotos(page, await makeImages(page, names(8).slice(6)));
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([3, 3, 2]);
  });

  test("a page's pill moves it left and right, with its photos", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await expect(page.locator(".page-left").first()).toBeDisabled();
    await expect(page.locator(".page-right").nth(1)).toBeDisabled();
    await page.locator(".page-right").first().click();
    expect(await pagesOfNames(page)).toEqual([
      ["p03.png", "p04.png"],
      ["p01.png", "p02.png"],
    ]);
    await page.locator(".page-left").nth(1).click();
    expect(await pagesOfNames(page)).toEqual([
      ["p01.png", "p02.png"],
      ["p03.png", "p04.png"],
    ]);
  });

  test("a page's pill removes it, sending its photos to the prior page", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(6)));
    await setPages(page, 3);
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
    await page.locator(".page-remove").nth(1).click();
    await page.click("#remove-page-confirm");
    // Page 2's photos went to page 1.
    const after = await pagesOfNames(page);
    expect(after).toHaveLength(2);
    expect(after[0]).toEqual(["p01.png", "p02.png", "p03.png", "p04.png"]);
    expect(after[1]).toEqual(["p05.png", "p06.png"]);
  });

  test("Swap trades two photos between pages; Move to page moves one", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, colourful(4)));
    await setPages(page, 2);
    await settle(page);
    const before = await pagesOfNames(page);
    expect(before.map((p) => p.length)).toEqual([2, 2]);
    await page.click("#mode-swap");
    const left = await posterPoint(page, 0.2, 0.5);
    const right = await posterPoint(page, 0.8, 0.5);
    await page.mouse.click(left.x, left.y);
    await page.mouse.click(right.x, right.y);
    await previewIdle(page);
    const swapped = await pagesOfNames(page);
    expect(swapped.map((p) => p.length)).toEqual([2, 2]);
    expect(swapped[0]?.filter((n) => before[1]?.includes(n))).toHaveLength(1);
    expect(swapped[1]?.filter((n) => before[0]?.includes(n))).toHaveLength(1);

    await clickPhoto(page, 0.2, 0.5);
    await expect(page.locator("#move-page")).toBeVisible();
    await page.selectOption("#move-page", "1");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([1, 3]);
  });

  test("Spread evenly shares the photos; Shuffle between pages keeps each page's count", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(6)));
    await setPages(page, 3);
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
    await page.click("#tab-style");
    await page.click("#shuffle-pages");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
  });

  test("editing works on any page: Wider on one page leaves the others as they are", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, colourful(6)));
    await setPages(page, 3);
    await settle(page);
    const rest = async () => {
      const grid: number[][] = [];
      for (const y of [0.2, 0.5, 0.8]) {
        for (const x of [0.55, 0.75, 0.9]) grid.push(await previewColor(page, x, y));
      }
      return JSON.stringify(grid);
    };
    const before = await rest();
    await clickPhoto(page, 0.1, 0.5);
    await expect(page.locator("#span-group")).toBeVisible();
    await page.locator("#span-wider").click();
    await settle(page);
    expect(await rest()).toBe(before);
  });

  test("changing the output size reshapes every page without moving photos between them", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    const before = await pagesOfNames(page);
    await setSize(page, 200, 300);
    await settle(page);
    expect(await pagesOfNames(page)).toEqual(before);
    expect(await posterRatio(page)).toBeCloseTo((2 + 0.04) * (200 / 300), 1);
  });

  test("the pages are kept over a refresh", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(5)));
    await setPages(page, 2);
    const before = await pagesOfNames(page);
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(5, { timeout: 20_000 });
    expect(await pagesOfNames(page)).toEqual(before);
    await expect(page.locator(".page-pill")).toHaveCount(2);
  });

  test("a blank page is kept over a refresh", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(2)));
    await page.click("#add-page-tile");
    await expect(page.locator(".page-pill")).toHaveCount(2);
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(2, { timeout: 20_000 });
    await expect(page.locator(".page-pill")).toHaveCount(2);
  });
});

test.describe("Book: saving", () => {
  test("every page with photos is saved as its own image of the output size, in order", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, colourful(3)));
    await setPages(page, 3);
    await expect(page.locator("#save-summary")).toContainText(
      "ZIP of 3 PNG images, 320 × 240 px each",
    );
    const files = readZip(await saveAndRead(page));
    expect(files.map((f) => f.name)).toEqual(
      [1, 2, 3].map((n) => expect.stringMatching(new RegExp(`^book-\\d+_${n}\\.png$`))),
    );
    const wanted = [COLORS.red, COLORS.green, COLORS.blue];
    for (const [i, file] of files.entries()) {
      expect(pngSize(file.data)).toEqual({ width: 320, height: 240 });
      const { colors } = await analyse(page, file.data, [[0.5, 0.5]]);
      expect(near(colors[0] as number[], wanted[i] as unknown as number[], 40), file.name).toBe(
        true,
      );
    }
  });

  test("empty pages are skipped and the numbers follow the pages saved", async ({ page }) => {
    await setSize(page, 160, 120);
    await addPhotos(page, await makeImages(page, colourful(2)));
    await setPages(page, 2);
    await page.click("#add-page-tile");
    const files = readZip(await saveAndRead(page));
    expect(files.map((f) => f.name.replace(/^book-\d+/, ""))).toEqual(["_1.png", "_2.png"]);
    await expect(page.locator("#messages")).toContainText("Skipped empty page");
  });

  test("a page's pill saves just that page", async ({ page }) => {
    await setSize(page, 160, 120);
    await addPhotos(page, await makeImages(page, colourful(2)));
    await setPages(page, 2);
    const downloadPromise = page.waitForEvent("download");
    await page.locator(".page-save").nth(1).click();
    expect((await downloadPromise).suggestedFilename()).toMatch(/^book-\d+_page-2\.png$/);
  });

  test("a book with photos on only one page saves that one image, not a zip", async ({ page }) => {
    await setSize(page, 160, 120);
    await addPhotos(page, await makeImages(page, colourful(2)));
    await page.click("#add-page-tile");
    await expect(page.locator("#save-summary")).toContainText("PNG, 160 × 120 px");
    const downloadPromise = page.waitForEvent("download");
    await page.click("#save");
    expect((await downloadPromise).suggestedFilename()).toMatch(/^book-\d+\.png$/);
  });
});

test.describe("Book of Instagram posts", () => {
  test("every page is a post of square images, and saving gives them all", async ({ page }) => {
    await page.click("#tab-poster");
    await page.click('[data-choice="post"]');
    await page.fill("#split-count", "2");
    await page.locator("#split-count").press("Tab");
    await page.fill("#split-size", "120");
    await page.locator("#split-size").press("Tab");
    await addPhotos(page, await makeImages(page, colourful(4)));
    await setPages(page, 2);
    await expect(page.locator(".page-pill")).toHaveCount(2);
    await expect(page.locator("#save-summary")).toContainText(
      "ZIP of 4 PNG images, 120 × 120 px each",
    );
    const files = readZip(await saveAndRead(page));
    expect(files.map((f) => f.name.replace(/^book-\d+/, ""))).toEqual([
      "_p1_1.png",
      "_p1_2.png",
      "_p2_1.png",
      "_p2_2.png",
    ]);
    for (const file of files) expect(pngSize(file.data)).toEqual({ width: 120, height: 120 });
  });
});
