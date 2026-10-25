// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  COLORS,
  makeImages,
  makeOrientedJpeg,
  near,
  previewColor,
  previewDifference,
  SIX,
  saveAndRead,
  setSeed,
  setSize,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
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
    await page.locator("#photo-list li button").first().click();
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await page.locator("#photo-list li button").first().click();
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

test.describe("Photos are shown the right way up", () => {
  test("EXIF orientation 6 (rotate 90 degrees clockwise)", async ({ page }) => {
    const photo = await makeOrientedJpeg(page, "turned.jpg", 6);
    await setSize(page, 100, 200);
    await page.fill("#border-width", "0");
    await addPhotos(page, [photo]);
    const png = await saveAndRead(page);
    const { colors } = await analyse(page, png, [
      [0.5, 0.15],
      [0.5, 0.85],
    ]);
    // Upright, the red left half is on top and the blue right half is at the bottom.
    expect(near(colors[0]!, COLORS.red, 60)).toBe(true);
    expect(near(colors[1]!, COLORS.blue, 60)).toBe(true);
  });

  test("a photo with no orientation data is left as it is", async ({ page }) => {
    const photo = await makeOrientedJpeg(page, "plain.jpg", 1);
    await setSize(page, 200, 100);
    await page.fill("#border-width", "0");
    await addPhotos(page, [photo]);
    const png = await saveAndRead(page);
    const { colors } = await analyse(page, png, [
      [0.15, 0.5],
      [0.85, 0.5],
    ]);
    expect(near(colors[0]!, COLORS.red, 60)).toBe(true);
    expect(near(colors[1]!, COLORS.blue, 60)).toBe(true);
  });
});

test.describe("Collage editing: borders and swapping", () => {
  test("the border colour and thickness show in the saved image", async ({ page }) => {
    await setSize(page, 400, 300);
    await page.fill("#border-width", "5");
    await page.locator("#border-color").fill("#00ff00");
    await addPhotos(
      page,
      await makeImages(page, [{ name: "a.png", w: 400, h: 300, color: "red" }]),
    );
    const png = await saveAndRead(page);
    const { colors } = await analyse(page, png, [
      [0.005, 0.5],
      [0.5, 0.5],
    ]);
    expect(near(colors[0]!, [0, 255, 0], 20)).toBe(true);
    expect(near(colors[1]!, COLORS.red, 30)).toBe(true);
  });

  test("preview and saved image match, with a border", async ({ page }) => {
    await setSize(page, 640, 480);
    await page.fill("#border-width", "2");
    await page.locator("#border-color").fill("#202020");
    await addPhotos(page, await makeImages(page, SIX));
    const png = await saveAndRead(page);
    expect(await previewDifference(page, png)).toBeLessThan(6);
  });

  test("clicking two photos swaps them, in preview and in the saved image", async ({ page }) => {
    await setSize(page, 400, 400);
    await page.fill("#border-width", "0");
    const four = await makeImages(page, [
      { name: "r.png", w: 400, h: 400, color: "red" },
      { name: "g.png", w: 400, h: 400, color: "green" },
      { name: "b.png", w: 400, h: 400, color: "blue" },
      { name: "y.png", w: 400, h: 400, color: "yellow" },
    ]);
    await addPhotos(page, four);
    await setSeed(page, 1);

    // Find two points in different cells.
    const canvas = page.locator("#preview");
    const box = (await canvas.boundingBox())!;
    const candidates: [number, number][] = [
      [0.1, 0.1],
      [0.9, 0.1],
      [0.1, 0.9],
      [0.9, 0.9],
      [0.5, 0.5],
      [0.3, 0.7],
      [0.7, 0.3],
    ];
    const before = await Promise.all(candidates.map(([x, y]) => previewColor(page, x, y)));
    const a = 0;
    const b = before.findIndex((c, i) => i > a && !near(c, before[a]!, 40));
    expect(b).toBeGreaterThan(0);
    const click = async (i: number) =>
      page.mouse.click(
        box.x + candidates[i]![0] * box.width,
        box.y + candidates[i]![1] * box.height,
      );
    await click(a);
    await click(b);
    await expect(page.locator("#messages")).toContainText("Swapped");

    const afterA = await previewColor(page, candidates[a]![0], candidates[a]![1]);
    const afterB = await previewColor(page, candidates[b]![0], candidates[b]![1]);
    expect(near(afterA, before[b]!, 30)).toBe(true);
    expect(near(afterB, before[a]!, 30)).toBe(true);

    const png = await saveAndRead(page);
    const saved = await analyse(page, png, [candidates[a]!, candidates[b]!]);
    expect(near(saved.colors[0]!, before[b]!, 40)).toBe(true);
    expect(near(saved.colors[1]!, before[a]!, 40)).toBe(true);
  });

  test("swapping works from the keyboard alone", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX.slice(0, 4)));
    await page.locator("#preview").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#messages")).toContainText("Selected");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page.locator("#messages")).toContainText("Swapped");
  });

  test("changing the poster size keeps the same photos in the same order", async ({ page }) => {
    await page.fill("#border-width", "0");
    await setSize(page, 400, 300);
    await addPhotos(page, await makeImages(page, SIX));
    await setSeed(page, 3);
    const png1 = await saveAndRead(page);
    await setSize(page, 400, 330);
    const png2 = await saveAndRead(page);
    // Row-major sample of colours on a coarse grid should name the same photos.
    const pts: [number, number][] = [
      [0.1, 0.1],
      [0.9, 0.1],
      [0.5, 0.5],
      [0.1, 0.9],
      [0.9, 0.9],
    ];
    const a = await analyse(page, png1, pts);
    const b = await analyse(page, png2, pts);
    let same = 0;
    a.colors.forEach((c, i) => {
      if (near(c, b.colors[i]!, 40)) same++;
    });
    expect(same).toBeGreaterThanOrEqual(3);
  });
});

test.describe("Progress, cancel, offline and language", () => {
  test("cancelling an export closes the dialog and saves nothing", async ({ page }) => {
    // Importing 24 large photos is slow on a busy machine; the default 30 s is too tight.
    test.setTimeout(120_000);
    await setSize(page, 3000, 2250);
    const files = await makeImages(
      page,
      Array.from({ length: 24 }, (_, i) => ({
        name: `p${i}.jpg`,
        w: 1500,
        h: 1000,
        color: "blue" as const,
        type: "jpeg" as const,
      })),
    );
    await addPhotos(page, files);
    let downloaded = false;
    page.on("download", () => {
      downloaded = true;
    });
    // Save and Cancel in one task, so the cancel always lands before the export can finish
    // (a separate click can lose the race on a fast machine and find the dialog already gone).
    await page.evaluate(() => {
      (document.getElementById("save") as HTMLButtonElement).click();
      (document.getElementById("cancel") as HTMLButtonElement).click();
    });
    await expect(page.locator("#progress-dialog")).not.toBeVisible();
    await expect(page.locator("#save")).toBeEnabled();
    await expect(page.locator("#messages .error")).toHaveCount(0);
    expect(downloaded).toBe(false);
  });

  test("works with the network disconnected once loaded", async ({ page, context }) => {
    // "Once loaded" includes the workers' scripts; wait for them before cutting the network.
    await page.waitForSelector('html[data-workers-ready="true"]', { state: "attached" });
    await context.setOffline(true);
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    const png = await saveAndRead(page);
    const result = await analyse(page, png);
    expect(result.width).toBe(320);
  });

  test("the page makes no requests to other origins", async ({ page }) => {
    const foreign: string[] = [];
    page.on("request", (r) => {
      const url = new URL(r.url());
      if (!["localhost", ""].includes(url.hostname) && url.protocol.startsWith("http"))
        foreign.push(r.url());
    });
    await page.reload();
    await addPhotos(page, await makeImages(page, SIX.slice(0, 2)));
    await saveAndRead(page);
    expect(foreign).toEqual([]);
  });

  test("can be shown in another language", async ({ page }) => {
    await page.selectOption("#language", "fr");
    await expect(page.locator("#add")).toHaveText("Ajouter des images...");
    await expect(page.locator("#regenerate")).toHaveText("Regénérer");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });

  test("the About dialog shows credit, licence and warranty notice", async ({ page }) => {
    await page.click("#about-open");
    const dialog = page.locator("#about-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Adrien Vergé");
    await expect(dialog).toContainText("GPL-2.0-or-later");
    await expect(dialog).toContainText("NO WARRANTY");
    await expect(dialog.getByRole("link", { name: "Source code" })).toHaveAttribute(
      "href",
      "https://github.com/briggsyj/PhotoCollage",
    );
  });
});
