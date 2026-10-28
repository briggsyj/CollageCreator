// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Specs 014 and 015: a book of pages, each saved as its own image.

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
  previewIdle,
  readZip,
  saveAndRead,
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

async function chooseBook(page: Page, perPage?: number) {
  await page.click("#tab-poster");
  if (perPage !== undefined) {
    // The photos-per-page field is in the book block, which shows once Book is chosen.
    await page.click("#tab-style");
    await page.click("#layout-book");
    await page.click("#tab-poster");
    await page.fill("#per-page", String(perPage));
    await page.locator("#per-page").press("Tab");
    return;
  }
  await page.click("#tab-style");
  await page.click("#layout-book");
}

test.describe("Book: pages", () => {
  test("photos fill the pages in order and a page is added when all are full", async ({ page }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 3);
    await addPhotos(page, await makeImages(page, names(7)));
    expect(await pagesOfNames(page)).toEqual([
      ["p01.png", "p02.png", "p03.png"],
      ["p04.png", "p05.png", "p06.png"],
      ["p07.png"],
    ]);
    await expect(page.locator("#pages-count")).toContainText("3 page(s), 7 photo(s)");
    // The preview is one row of three pages (with gaps): wider than three pages side by side.
    await settle(page);
    const poster = (await page.locator("#preview").getAttribute("data-poster")) ?? "";
    const [, , w, h] = poster.split(",").map(Number) as number[];
    expect((w as number) / (h as number)).toBeCloseTo((3 + 2 * 0.04) * (320 / 240), 1);
  });

  test("Add page makes a blank page, which takes the next photos once the others are full", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 3);
    await addPhotos(page, await makeImages(page, names(6)));
    await page.click("#tab-poster");
    await page.click("#add-page");
    await expect(page.locator("#pages-count")).toContainText("3 page(s), 6 photo(s)");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([3, 3, 0]);
    await addPhotos(page, await makeImages(page, names(8).slice(6)));
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([3, 3, 2]);
  });

  test("removing a page sends its photos to the prior page, and one page always stays", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 2);
    await addPhotos(page, await makeImages(page, names(6)));
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
    await page.locator(".remove-page").nth(1).click();
    // Page 2's photos went to page 1: the pages are now [p01 p02 p03 p04], [p05 p06].
    const after = await pagesOfNames(page);
    expect(after).toHaveLength(2);
    expect(after[0]).toEqual(["p01.png", "p02.png", "p03.png", "p04.png"]);
    expect(after[1]).toEqual(["p05.png", "p06.png"]);
    await page.locator(".remove-page").nth(1).click();
    await expect(page.locator("#photo-list .page-group")).toHaveCount(1);
    await expect(page.locator(".remove-page")).toBeDisabled();
  });

  test("pages can be moved left and right with their photos", async ({ page }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 2);
    await addPhotos(page, await makeImages(page, names(4)));
    await page.locator(".move-page-right").first().click();
    expect(await pagesOfNames(page)).toEqual([
      ["p03.png", "p04.png"],
      ["p01.png", "p02.png"],
    ]);
    await page.locator(".move-page-left").nth(1).click();
    expect(await pagesOfNames(page)).toEqual([
      ["p01.png", "p02.png"],
      ["p03.png", "p04.png"],
    ]);
  });

  test("Swap trades two photos between pages; Move to page moves one", async ({ page }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 2);
    await addPhotos(page, await makeImages(page, colourful(4)));
    await settle(page);
    const before = await pagesOfNames(page);
    expect(before.map((p) => p.length)).toEqual([2, 2]);
    // Swap: a photo on the first page and one on the second.
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

    // Move to page: select one by the Select tool and choose the other page.
    await clickPhoto(page, 0.2, 0.5);
    await expect(page.locator("#move-page")).toBeVisible();
    await page.selectOption("#move-page", "1");
    const moved = await pagesOfNames(page);
    expect(moved.map((p) => p.length)).toEqual([1, 3]);
  });

  test("Spread evenly shares the photos; Shuffle between pages keeps each page's count", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 6);
    await addPhotos(page, await makeImages(page, names(6)));
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([6]);
    await page.click("#tab-poster");
    await page.click("#add-page");
    await page.click("#add-page");
    await page.click("#spread-pages");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
    await page.click("#tab-style");
    await expect(page.locator("#shuffle-pages")).toBeVisible();
    await page.click("#shuffle-pages");
    expect((await pagesOfNames(page)).map((p) => p.length)).toEqual([2, 2, 2]);
  });

  test("the page-shuffle button is only there in Book mode; Instagram post and Book exclude each other", async ({
    page,
  }) => {
    await page.click("#tab-style");
    await expect(page.locator("#shuffle-pages")).toBeHidden();
    await page.click("#layout-book");
    await expect(page.locator("#shuffle-pages")).toBeVisible();
    await page.click("#tab-poster");
    await page.click('[data-choice="post"]');
    await page.click("#tab-style");
    await expect(page.locator("#layout-book")).toHaveAttribute("aria-pressed", "false");
    await page.click("#layout-book");
    await expect(page.locator("#layout-book")).toHaveAttribute("aria-pressed", "true");
    await page.click("#tab-poster");
    await expect(page.locator("#split-controls")).toBeHidden();
    await page.click("#tab-style");
    await page.click("#layout-mosaic");
    await expect(page.locator("#layout-book")).toHaveAttribute("aria-pressed", "false");
  });

  test("editing works on any page: Wider on one page leaves the others as they are", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 3);
    await addPhotos(page, await makeImages(page, colourful(6)));
    await settle(page);
    const poster = async () => {
      const grid: number[][] = [];
      for (const y of [0.2, 0.5, 0.8]) {
        for (const x of [0.55, 0.75, 0.9]) {
          grid.push((await (await import("./helpers")).previewColor(page, x, y)) as number[]);
        }
      }
      return JSON.stringify(grid);
    };
    const secondPageBefore = await poster();
    // Select a photo on the first page and make it wider.
    await clickPhoto(page, 0.1, 0.5);
    await expect(page.locator("#span-group")).toBeVisible();
    await page.locator("#span-wider").click();
    await settle(page);
    expect(await poster()).toBe(secondPageBefore);
  });

  test("changing the output size reshapes every page without moving photos between them", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 2);
    await addPhotos(page, await makeImages(page, names(4)));
    const before = await pagesOfNames(page);
    await setSize(page, 200, 300);
    await settle(page);
    expect(await pagesOfNames(page)).toEqual(before);
    const poster = (await page.locator("#preview").getAttribute("data-poster")) ?? "";
    const [, , w, h] = poster.split(",").map(Number) as number[];
    expect((w as number) / (h as number)).toBeCloseTo((2 + 0.04) * (200 / 300), 1);
  });

  test("a book is kept over a refresh", async ({ page }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 2);
    await addPhotos(page, await makeImages(page, names(5)));
    const before = await pagesOfNames(page);
    await page.waitForTimeout(700);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(5, { timeout: 20_000 });
    expect(await pagesOfNames(page)).toEqual(before);
    await page.click("#tab-style");
    await expect(page.locator("#layout-book")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Book: saving", () => {
  test("every page with photos is saved as its own image of the output size, in order", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await chooseBook(page, 1);
    // One photo per page: red, green, blue.
    await addPhotos(page, await makeImages(page, colourful(3)));
    await expect(page.locator("#save-summary")).toContainText(
      "ZIP of 3 PNG images, 320 × 240 px each",
    );
    const zip = await saveAndRead(page);
    const files = readZip(zip);
    const seed = await page.inputValue("#seed").catch(() => "");
    expect(files.map((f) => f.name)).toEqual(
      [1, 2, 3].map((n) => expect.stringMatching(new RegExp(`^book-\\d+_${n}\\.png$`))),
    );
    void seed;
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
    await chooseBook(page, 1);
    await addPhotos(page, await makeImages(page, colourful(2)));
    await page.click("#tab-poster");
    await page.click("#add-page");
    const zip = await saveAndRead(page);
    const files = readZip(zip);
    expect(files).toHaveLength(2);
    expect(files.map((f) => f.name.replace(/^book-\d+/, ""))).toEqual(["_1.png", "_2.png"]);
    await expect(page.locator("#messages")).toContainText("Skipped empty page");
  });

  test("Save this page saves only the page of the selected photo", async ({ page }) => {
    await setSize(page, 160, 120);
    await chooseBook(page, 1);
    await addPhotos(page, await makeImages(page, colourful(2)));
    // Select the second page's photo (the second in the list) and save only its page.
    await clickPhoto(page, 0.9, 0.5);
    const downloadPromise = page.waitForEvent("download");
    await page.click("#save-page");
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^book-\d+_page-2\.png$/);
  });

  test("a book with photos on only one page saves that one image, not a zip", async ({ page }) => {
    await setSize(page, 160, 120);
    await chooseBook(page, 6);
    await addPhotos(page, await makeImages(page, colourful(2)));
    await page.click("#tab-poster");
    await page.click("#add-page");
    await expect(page.locator("#save-summary")).toContainText("PNG, 160 × 120 px");
    const downloadPromise = page.waitForEvent("download");
    await page.click("#save");
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^book-\d+\.png$/);
  });
});
