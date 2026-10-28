// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Instagram post: one collage cut into square images.

import { expect, test } from "@playwright/test";
import {
  addPhotos,
  autoReveal,
  makeImages,
  pngSize,
  posterRect,
  previewDifference,
  previewIdle,
  readZip,
  SIX,
  saveAndRead,
  savedWork,
  stitch,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  // Relative, so the suite also works against a site served under a sub-path (GitHub Pages).
  await page.goto("./");
});

test.describe("Instagram post: one collage cut into square images", () => {
  async function chooseInstagram(page: import("@playwright/test").Page) {
    await page.click("#tab-poster");
    await page.click('[data-choice="post"]');
  }

  /** How many pixels, in a thin column above the poster at `x`, differ from the plain background. */
  async function marksAbove(page: import("@playwright/test").Page, cut: number) {
    await previewIdle(page);
    return page.evaluate((fraction) => {
      const canvas = document.getElementById("preview") as HTMLCanvasElement;
      const scale = canvas.width / canvas.clientWidth;
      const [ox, oy, pw] = (canvas.dataset.poster ?? "0,0,1,1").split(",").map(Number) as number[];
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const bg = ctx.getImageData(2, 2, 1, 1).data;
      const x = Math.round(((ox as number) + (pw as number) * fraction) * scale);
      // Only the strip above the poster (not its edge shadow).
      const top = Math.max(0, Math.round(((oy as number) - 44) * scale));
      const height = Math.max(1, Math.round(((oy as number) - 6) * scale) - top);
      const column = ctx.getImageData(x - 1, top, 3, height).data;
      let differing = 0;
      for (let i = 0; i < column.length; i += 4) {
        // The preview canvas is transparent over the glass backdrop; marks are opaque, shadows are not.
        const d =
          Math.abs((column[i] as number) - (bg[0] as number)) +
          Math.abs((column[i + 1] as number) - (bg[1] as number)) +
          Math.abs((column[i + 2] as number) - (bg[2] as number));
        if ((column[i + 3] as number) > 160 && d > 60) differing++;
      }
      return differing;
    }, cut);
  }

  test("the Instagram post size makes a wide collage of square images", async ({ page }) => {
    await chooseInstagram(page);
    await expect(page.locator("#split-controls")).toBeVisible();
    await expect(page.locator("#split-count")).toHaveValue("3");
    await expect(page.locator("#split-size")).toHaveValue("1080");
    await expect(page.locator("#width")).toHaveValue("3240");
    await expect(page.locator("#height")).toHaveValue("1080");
    await expect(page.locator("#width")).toBeDisabled();
    await expect(page.locator("#height")).toBeDisabled();
    await expect(page.locator("#save-summary")).toHaveText(
      "ZIP of 3 PNG images, 1080 × 1080 px each",
    );
    await expect(page.locator("#split-note")).toContainText("numbered _1 to _3");
    // The preview is redrawn on the next frame, which WebKit on CI can be slow to reach.
    await expect
      .poll(async () => {
        const poster = await posterRect(page);
        return poster.w / poster.h;
      })
      .toBeCloseTo(3, 1);
  });

  test("the number of images and their size set the collage's size", async ({ page }) => {
    await chooseInstagram(page);
    await page.click("#split-more");
    await expect(page.locator("#split-count")).toHaveValue("4");
    await expect(page.locator("#width")).toHaveValue("4320");
    await page.fill("#split-size", "500");
    await page.locator("#split-size").press("Tab");
    await expect(page.locator("#width")).toHaveValue("2000");
    await expect(page.locator("#height")).toHaveValue("500");
    await page.fill("#split-count", "2");
    await page.locator("#split-count").press("Tab");
    await expect(page.locator("#width")).toHaveValue("1000");
    await expect(page.locator("#split-less")).toBeDisabled();
    await page.fill("#split-count", "99");
    await page.locator("#split-count").press("Tab");
    await expect(page.locator("#split-count")).toHaveValue("20");
    await expect(page.locator("#split-more")).toBeDisabled();
  });

  test("the automatic number of columns follows the shape of the collage", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const columns = async () =>
      Number(/(\d+)$/.exec((await page.locator("#columns-note").textContent()) ?? "")?.[1]);
    await chooseInstagram(page);
    await page.fill("#split-count", "2");
    await page.locator("#split-count").press("Tab");
    const few = await columns();
    await page.fill("#split-count", "10");
    await page.locator("#split-count").press("Tab");
    const many = await columns();
    expect(many).toBeGreaterThan(few);
    // The column count can still be chosen by hand.
    await page.fill("#columns", "2");
    await expect(page.locator("#columns-note")).toHaveText(/Columns in use: 2$/);
  });

  test("dashed cut marks with scissors show above and below each cut, in the preview only", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    expect(await marksAbove(page, 1 / 3)).toBe(0);
    await chooseInstagram(page);
    expect(await marksAbove(page, 1 / 3)).toBeGreaterThan(4);
    expect(await marksAbove(page, 2 / 3)).toBeGreaterThan(4);
    // Nothing is marked where there is no cut.
    expect(await marksAbove(page, 0.5)).toBe(0);
  });

  test("saving gives a zip of square images numbered from the leftmost, matching the preview", async ({
    page,
  }) => {
    await chooseInstagram(page);
    await page.fill("#split-size", "200");
    await page.locator("#split-size").press("Tab");
    await addPhotos(page, await makeImages(page, SIX));
    const zip = await saveAndRead(page);
    const files = readZip(zip);
    const seed = await page.inputValue("#seed");
    expect(files.map((f) => f.name)).toEqual([
      `collage-${seed}_1.png`,
      `collage-${seed}_2.png`,
      `collage-${seed}_3.png`,
    ]);
    for (const f of files) expect(pngSize(f.data)).toEqual({ width: 200, height: 200 });
    // Side by side in that order, the images are the collage in the preview.
    const whole = await stitch(
      page,
      files.map((f) => f.data),
    );
    expect(await previewDifference(page, whole)).toBeLessThan(6);
  });

  test("JPEG gives .jpg files, and ten or more images are numbered so they sort in order", async ({
    page,
  }) => {
    await chooseInstagram(page);
    await page.fill("#split-count", "10");
    await page.locator("#split-count").press("Tab");
    await page.fill("#split-size", "40");
    await page.locator("#split-size").press("Tab");
    await page.click("#format-jpeg");
    await addPhotos(page, await makeImages(page, SIX));
    const files = readZip(await saveAndRead(page));
    const seed = await page.inputValue("#seed");
    expect(files).toHaveLength(10);
    expect(files[0]?.name).toBe(`collage-${seed}_01.jpg`);
    expect(files[9]?.name).toBe(`collage-${seed}_10.jpg`);
    expect(files.every((f) => f.data[0] === 0xff && f.data[1] === 0xd8)).toBe(true);
    const names = files.map((f) => f.name);
    expect([...names].sort()).toEqual(names);
  });

  test("it is kept over a refresh, and any other size leaves it", async ({ page }) => {
    await chooseInstagram(page);
    await page.click("#split-more");
    await savedWork(page);
    await page.reload();
    await page.click("#tab-poster");
    await expect(page.locator("#split-count")).toHaveValue("4");
    await expect(page.locator('[data-choice="post"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#save-summary")).toContainText("ZIP of 4 PNG images");
    await page.click("#tab-poster");
    await page.click('[data-choice="a4"]');
    await expect(page.locator("#split-controls")).toBeHidden();
    await expect(page.locator("#width")).toBeEnabled();
    await expect(page.locator("#width")).toHaveValue("3508");
    await expect(page.locator("#save-summary")).toHaveText("PNG, 3508 × 2480 px");
  });
});
