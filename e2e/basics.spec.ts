// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Adding photos, seeing a collage and saving it; files that cannot be used.

import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  COLORS,
  makeImages,
  near,
  previewColor,
  removeFromList,
  SIX,
  saveAndRead,
  setSeed,
  setSize,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  // Relative, so the suite also works against a site served under a sub-path (GitHub Pages).
  await page.goto("./");
});

test.describe("User story: add photos, see a collage, save it", () => {
  test("starts empty: nothing to save", async ({ page }) => {
    await expect(page.locator("#save")).toBeDisabled();
    await expect(page.locator("#photo-list li")).toHaveCount(0);
  });

  test("adds photos, shows them in a list, and saves a PNG at the chosen size", async ({
    page,
  }) => {
    await setSize(page, 480, 360);
    await addPhotos(page, await makeImages(page, SIX));
    await expect(page.locator("#photo-list li")).toHaveCount(6);
    await expect(page.locator("#save")).toBeEnabled();

    const png = await saveAndRead(page);
    const result = await analyse(page, png);
    expect([result.width, result.height]).toEqual([480, 360]);
  });

  test("every photo appears in the saved image", async ({ page }) => {
    await setSize(page, 600, 450);
    await addPhotos(page, await makeImages(page, SIX));
    const png = await saveAndRead(page);
    // Sample a grid and check each photo's colour shows up somewhere.
    const points: [number, number][] = [];
    for (let y = 0.04; y < 1; y += 0.04) for (let x = 0.04; x < 1; x += 0.04) points.push([x, y]);
    const { colors } = await analyse(page, png, points);
    for (const name of Object.keys(COLORS) as (keyof typeof COLORS)[]) {
      expect(
        colors.some((c) => near(c, COLORS[name], 50)),
        `${name} appears`,
      ).toBe(true);
    }
  });

  test("saves a JPEG when asked", async ({ page }) => {
    await setSize(page, 320, 240);
    await page.selectOption("#format", "jpeg");
    await expect(page.locator("#quality-field")).toBeVisible();
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    const file = await saveAndRead(page);
    expect([...file.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  });

  test("a single photo fills the whole poster", async ({ page }) => {
    await setSize(page, 300, 200);
    await page.fill("#border-width", "0");
    await addPhotos(
      page,
      await makeImages(page, [{ name: "one.png", w: 900, h: 300, color: "green" }]),
    );
    const png = await saveAndRead(page);
    const { colors } = await analyse(page, png, [
      [0.02, 0.02],
      [0.98, 0.02],
      [0.5, 0.5],
      [0.02, 0.98],
      [0.98, 0.98],
    ]);
    for (const c of colors) expect(near(c, COLORS.green, 30)).toBe(true);
  });
});

test.describe("User story: choose the poster size", () => {
  test("presets fill in the pixel fields", async ({ page }) => {
    await page.selectOption("#preset", { label: "A4 portrait (300 DPI)" });
    await expect(page.locator("#width")).toHaveValue("2480");
    await expect(page.locator("#height")).toHaveValue("3508");
  });

  test("a size beyond this browser's limit is reduced, with a message", async ({ page }) => {
    await setSize(page, 400000, 300000);
    await expect(page.locator("#size-note")).not.toBeEmpty();
    const width = Number(await page.inputValue("#width"));
    const height = Number(await page.inputValue("#height"));
    expect(width).toBeLessThan(400000);
    expect(width / height).toBeCloseTo(4 / 3, 1);
  });
});

test.describe("User story: try different arrangements", () => {
  test("the same seed gives the same layout; a different seed usually does not", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const grid = async () => {
      const out: [number, number, number][] = [];
      for (const y of [0.1, 0.3, 0.5, 0.7, 0.9])
        for (const x of [0.1, 0.3, 0.5, 0.7, 0.9]) out.push(await previewColor(page, x, y));
      return JSON.stringify(out);
    };
    await setSeed(page, 11);
    const a1 = await grid();
    await setSeed(page, 12);
    const b = await grid();
    await setSeed(page, 11);
    const a2 = await grid();
    expect(a2).toBe(a1);
    expect(b).not.toBe(a1);
  });

  test("Regenerate picks a new seed", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await setSeed(page, 5);
    await page.click("#regenerate");
    await expect(page.locator("#seed")).not.toHaveValue("5");
  });

  test("removing a photo updates the collage", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await removeFromList(page, 0);
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await removeFromList(page, 0);
    await expect(page.locator("#photo-list li")).toHaveCount(4);
  });

  test("more photos can be added after the first batch", async ({ page }) => {
    const all = await makeImages(page, SIX);
    await addPhotos(page, all.slice(0, 3));
    await expect(page.locator("#photo-list li")).toHaveCount(3);
    await addPhotos(page, all.slice(3));
    await expect(page.locator("#photo-list li")).toHaveCount(6);
  });
});

test.describe("Files that cannot be used", () => {
  test("non-images and broken images are skipped with a message naming the file", async ({
    page,
  }) => {
    const [good] = await makeImages(page, [{ name: "ok.png", w: 100, h: 100, color: "red" }]);
    await addPhotos(
      page,
      [
        good!,
        { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") },
        { name: "broken.jpg", mimeType: "image/jpeg", buffer: Buffer.from("not really a jpeg") },
      ],
      1,
    );
    await expect(page.locator("#messages")).toContainText("notes.txt");
    await expect(page.locator("#messages")).toContainText("broken.jpg");
  });

  test("adding the same file twice uses it once", async ({ page }, testInfo) => {
    const [one] = await makeImages(page, [{ name: "dup.png", w: 100, h: 100, color: "blue" }]);
    // A real file on disk, so both picks have the same name, size and modification time.
    const path = testInfo.outputPath("dup.png");
    await writeFile(path, one!.buffer);
    await addPhotos(page, [path]);
    await page.setInputFiles("#file-input", [path]);
    await expect(page.locator("#messages")).toContainText("dup.png");
    await expect(page.locator("#photo-list li")).toHaveCount(1);
  });
});
