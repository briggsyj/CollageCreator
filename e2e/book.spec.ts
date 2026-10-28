// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Specs 014 to 016: a collage is a book of one page; more pages, each saved as its own image.

import { expect, type Page, test } from "@playwright/test";
import { zipBytes } from "../src/io/zip";
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

/** Set the page count in the Poster step; the photos are shared evenly across the pages. */
async function setPages(page: Page, count: number) {
  await page.click("#tab-poster");
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
    await page.click("#confirm-ok");
    await expect(page.locator(".page-pill")).toHaveCount(0);
    expect(await posterRatio(page)).toBeCloseTo(320 / 240, 1);
  });

  test("removing a page asks first, and Cancel keeps it", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await addPages(page, 2);
    await page.locator(".page-remove").nth(1).click();
    await expect(page.locator("#confirm-dialog")).toBeVisible();
    await page.click("#confirm-cancel");
    await expect(page.locator(".page-pill")).toHaveCount(2);
  });

  test("Remove all asks first, then empties every page and goes back to one page; Undo brings the pages back", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#remove-all");
    await expect(page.locator("#confirm-dialog")).toBeVisible();
    await page.click("#confirm-cancel");
    await expect(page.locator("#photo-list li")).toHaveCount(4);
    await page.click("#remove-all");
    await page.click("#confirm-ok");
    await expect(page.locator("#photo-list li")).toHaveCount(0);
    await expect(page.locator("#pages")).toHaveValue("1");
    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(4);
    await expect(page.locator(".page-pill")).toHaveCount(2);
  });

  test("the drop area before any photos is one page, whatever the page count", async ({ page }) => {
    await setSize(page, 320, 240);
    const before = await page.locator("#empty-state").boundingBox();
    await setPages(page, 3);
    expect(await page.locator("#empty-state").boundingBox()).toEqual(before);
  });

  test("a zipped folder of photos adds the images inside it", async ({ page }) => {
    const images = await makeImages(page, names(3));
    const zip = zipBytes([
      ...images.map((f) => ({ name: `Holiday/${f.name}`, data: new Uint8Array(f.buffer) })),
      { name: "Holiday/readme.txt", data: new TextEncoder().encode("hi") },
      { name: "__MACOSX/Holiday/._p01.png", data: new Uint8Array([0]) },
    ]);
    await addPhotos(
      page,
      [{ name: "Holiday.zip", mimeType: "application/zip", buffer: Buffer.from(zip) }],
      3,
    );
    await expect(page.locator("#notices-summary")).toContainText("1 file was not added");
    await page.click("#notices-details");
    await expect(page.locator("#notices-list")).toContainText("readme.txt");
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
    for (let n = 2; n <= 3; n++) {
      await page.click("#add-page-tile");
      await expect(page.locator("#photo-list .page-group")).toHaveCount(n);
      await previewIdle(page);
      expect(await page.locator("#add-page-tile").boundingBox()).toEqual(at);
    }
  });

  test("Add page hides with the page pills when the pages are small on screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(3)));
    await addPages(page, 2);
    await expect(page.locator(".page-pill")).toHaveCount(2);
    await expect(page.locator("#add-page-tile")).toBeVisible();
    // A third page makes every page too small on screen for its pill, and Add page goes too.
    await page.click("#add-page-tile");
    await expect(page.locator("#photo-list .page-group")).toHaveCount(3);
    await expect(page.locator(".page-pill")).toHaveCount(0);
    await expect(page.locator("#add-page-tile")).toHaveCount(0);
    // Zoomed in, both come back.
    await page.click("#zoom-in");
    await page.click("#zoom-in");
    await expect(page.locator("#add-page-tile")).toBeVisible();
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
    await page.click("#confirm-ok");
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

test.describe("Add page while zoomed in", () => {
  test("the view zooms out to show the new page", async ({ page }) => {
    await addPhotos(page, await makeImages(page, names(3)));
    await page.click("#zoom-in");
    await page.click("#zoom-in");
    await expect(page.locator("#reset-view")).toBeEnabled();
    await page.click("#add-page-tile");
    await expect(page.locator(".page-pill")).toHaveCount(2);
    await expect(page.locator("#reset-view")).toBeDisabled();
  });
});

test.describe("Tooltips", () => {
  test("every button has a title, shown as a tooltip on hover", async ({ page }) => {
    await addPhotos(page, await makeImages(page, names(3)));
    await page.click("#add-page-tile");
    await clickPhoto(page, 0.2, 0.5);
    const untitled = await page
      .locator("button:not([title]), button[title='']")
      .evaluateAll((all) => all.map((b) => b.id || b.className || b.textContent?.trim()));
    expect(untitled).toEqual([]);
  });
});

test.describe("Selecting several photos", () => {
  test("Shift-click in the Photos step selects several; size and remove work on all, crop is off", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, names(5)));
    await page.click("#tab-photos");
    const tiles = page.locator("#photo-list .tile");
    await tiles.nth(0).click();
    await tiles.nth(2).click({ modifiers: ["Shift"] });
    await tiles.nth(3).click({ modifiers: ["Shift"] });
    await expect(page.locator("#photo-list .tile[aria-pressed='true']")).toHaveCount(3);
    await expect(page.locator("#dock-name")).toHaveText("3 photos selected");
    await expect(page.locator("#crop-toggle")).toBeDisabled();
    await page.click("#span-wider");
    await expect(page.locator("#photo-list .tag")).toHaveCount(3);
    // Shift-click again takes one out.
    await tiles.nth(2).click({ modifiers: ["Shift"] });
    await expect(page.locator("#dock-name")).toHaveText("2 photos selected");
    await page.click("#remove-selected");
    await page.click("#confirm-ok");
    await expect(page.locator("#photo-list li")).toHaveCount(3);
    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
  });

  test("Shift-click with the Select tool adds to the selection, shown in the Photos step", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, colourful(4)));
    await page.click("#mode-select");
    const a = await posterPoint(page, 0.1, 0.5);
    const b = await posterPoint(page, 0.9, 0.5);
    await page.mouse.click(a.x, a.y);
    await page.keyboard.down("Shift");
    await page.mouse.click(b.x, b.y);
    await page.keyboard.up("Shift");
    await expect(page.locator("#photo-list .tile[aria-pressed='true']")).toHaveCount(2);
    await expect(page.locator("#dock-name")).toHaveText("2 photos selected");
    // A plain click narrows it to one again.
    await page.mouse.click(a.x, a.y);
    await expect(page.locator("#photo-list .tile[aria-pressed='true']")).toHaveCount(1);
  });

  test("several selected photos move to another page together", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#tab-photos");
    const tiles = page.locator("#photo-list .tile");
    await tiles.nth(0).click();
    await tiles.nth(1).click({ modifiers: ["Shift"] });
    await page.selectOption("#move-page", "1");
    expect(await pagesOfNames(page)).toEqual([[], ["p03.png", "p04.png", "p01.png", "p02.png"]]);
    await expect(page.locator("#dock-name")).toHaveText("2 photos selected");
  });
});

test.describe("Hand edits and shuffling", () => {
  test("photos can be dragged onto another page in the Photos step", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#tab-photos");
    await page
      .locator("#photo-list .tile")
      .first()
      .dragTo(page.locator("#photo-list .page-group").nth(1));
    expect(await pagesOfNames(page)).toEqual([["p02.png"], ["p03.png", "p04.png", "p01.png"]]);
  });

  test("dropping photos on the new page target after the last page makes a page for them", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#tab-photos");
    await page.locator("#photo-list .new-page").scrollIntoViewIfNeeded();
    await page
      .locator("#photo-list .tile")
      .first()
      .dragTo(page.locator("#photo-list .new-page .page-empty"));
    await expect(page.locator("#photo-list .page-group")).toHaveCount(3);
    expect(await pagesOfNames(page)).toEqual([["p02.png"], ["p03.png", "p04.png"], ["p01.png"]]);
  });

  test("on a touch screen, press and hold a photo, then drag it onto another page", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#tab-photos");
    const tile = page.locator("#photo-list .tile").first();
    const from = await tile.boundingBox();
    const to = await page.locator("#photo-list .page-group").nth(1).boundingBox();
    if (!from || !to) throw new Error("no layout");
    const touch = (type: string, x: number, y: number) =>
      tile.evaluate(
        (el, a) => {
          const target = a.type === "pointerdown" ? el : window;
          target.dispatchEvent(
            new PointerEvent(a.type, {
              pointerId: 7,
              pointerType: "touch",
              clientX: a.x,
              clientY: a.y,
              bubbles: true,
            }),
          );
        },
        { type, x, y },
      );
    await touch("pointerdown", from.x + 20, from.y + 20);
    // Held still long enough, the drag begins and a label follows the finger.
    await page.waitForTimeout(500);
    await touch("pointermove", to.x + 40, to.y + to.height / 2);
    await expect(page.locator(".drag-ghost")).toContainText("Moving 1 photo");
    await touch("pointerup", to.x + 40, to.y + to.height / 2);
    await expect(page.locator(".drag-ghost")).toHaveCount(0);
    expect(await pagesOfNames(page)).toEqual([["p02.png"], ["p03.png", "p04.png", "p01.png"]]);
  });

  test("shuffling asks first after a hand edit, and not again until the next one", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, names(4)));
    await setPages(page, 2);
    await page.click("#tab-style");
    await page.click("#shuffle-pages");
    await expect(page.locator("#confirm-dialog")).toBeHidden();
    await page.click("#tab-photos");
    await page.locator("#photo-list .tile").first().click();
    await page.selectOption("#move-page", "1");
    await page.click("#tab-style");
    await page.click("#regenerate");
    await expect(page.locator("#confirm-dialog")).toBeVisible();
    await page.click("#confirm-ok");
    await page.click("#shuffle-pages");
    await expect(page.locator("#confirm-dialog")).toBeHidden();
  });
});

test.describe("Letting go of the selection", () => {
  test("a click beside the photos, a click between tiles, or another tool deselects", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, colourful(3)));
    await page.click("#mode-select");
    const on = await posterPoint(page, 0.2, 0.5);
    await page.mouse.click(on.x, on.y);
    await expect(page.locator("#selected-dock")).toBeVisible();
    // Beside the collage.
    const off = await posterPoint(page, -0.04, 0.5);
    await page.mouse.click(off.x, off.y);
    await expect(page.locator("#selected-dock")).toBeHidden();
    // Another tool.
    await page.mouse.click(on.x, on.y);
    await expect(page.locator("#selected-dock")).toBeVisible();
    await page.click("#mode-swap");
    await expect(page.locator("#selected-dock")).toBeHidden();
    // Between the tiles in the Photos step.
    await page.click("#tab-photos");
    await page.locator("#photo-list .tile").first().click();
    await expect(page.locator("#selected-dock")).toBeVisible();
    await page.locator("#photo-list").click({ position: { x: 2, y: 2 } });
    await expect(page.locator("#selected-dock")).toBeHidden();
  });
});

test.describe("Touch", () => {
  test("two fingers pinch to zoom the preview, also with the Pan tool", async ({ page }) => {
    await addPhotos(page, await makeImages(page, names(3)));
    await page.click("#mode-pan");
    const before = (await posterRect(page)).w;
    await page.locator("#preview").evaluate((canvas) => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const send = (type: string, id: number, x: number) =>
        canvas.dispatchEvent(
          new PointerEvent(type, {
            pointerId: id,
            pointerType: "touch",
            clientX: x,
            clientY: cy,
            bubbles: true,
            isPrimary: id === 1,
          }),
        );
      send("pointerdown", 1, cx - 40);
      send("pointerdown", 2, cx + 40);
      for (let d = 40; d <= 120; d += 10) {
        send("pointermove", 1, cx - d);
        send("pointermove", 2, cx + d);
      }
      send("pointerup", 2, cx + 120);
      send("pointerup", 1, cx - 120);
    });
    await expect.poll(async () => (await posterRect(page)).w).toBeGreaterThan(before * 2);
  });
});
