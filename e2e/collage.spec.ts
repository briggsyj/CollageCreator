// SPDX-License-Identifier: GPL-2.0-or-later

import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  COLORS,
  makeImages,
  makeOrientedJpeg,
  near,
  openTechnical,
  posterPoint,
  posterRect,
  previewColor,
  previewDifference,
  removeFromList,
  SIX,
  saveAndRead,
  setSeed,
  setSize,
  swapMode,
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
    await swapMode(page);

    // Find two points in different cells.
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
    const click = async (i: number) => {
      const point = await posterPoint(page, candidates[i]![0], candidates[i]![1]);
      await page.mouse.click(point.x, point.y);
    };
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

test.describe("Choosing the number of columns", () => {
  const FOUR = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "g.png", w: 400, h: 400, color: "green" as const },
    { name: "b.png", w: 400, h: 400, color: "blue" as const },
    { name: "y.png", w: 400, h: 400, color: "yellow" as const },
  ];
  const BANDS = [0.12, 0.37, 0.62, 0.87];

  /** Colours down the left and right edges of the preview, at the middle of four equal bands. */
  async function bandColours(page: import("@playwright/test").Page) {
    const left = await Promise.all(BANDS.map((y) => previewColor(page, 0.1, y)));
    const right = await Promise.all(BANDS.map((y) => previewColor(page, 0.9, y)));
    return { left, right };
  }

  test("starts on automatic", async ({ page }) => {
    await expect(page.locator("#columns")).toHaveValue("");
    await expect(page.locator("#columns")).toHaveAttribute("placeholder", "Auto");
  });

  test("one column stacks the photos full width, in the preview and the saved image", async ({
    page,
  }) => {
    await setSize(page, 400, 400);
    await page.fill("#border-width", "0");
    await addPhotos(page, await makeImages(page, FOUR));

    await page.fill("#columns", "1");
    await expect(page.locator("#columns-note")).toContainText("1");

    // A single column means the same colour at the left and the right of every band,
    // and four different bands from top to bottom.
    const { left, right } = await bandColours(page);
    for (let i = 0; i < left.length; i++) {
      expect(near(left[i] as number[], right[i] as number[], 30)).toBe(true);
    }
    for (let i = 0; i < left.length; i++) {
      for (let j = i + 1; j < left.length; j++) {
        expect(near(left[i] as number[], left[j] as number[], 40)).toBe(false);
      }
    }

    const png = await saveAndRead(page);
    expect(await previewDifference(page, png)).toBeLessThan(6);
    const saved = await analyse(page, png, [
      [0.1, 0.12],
      [0.9, 0.12],
      [0.1, 0.87],
      [0.9, 0.87],
    ]);
    expect(near(saved.colors[0] as number[], saved.colors[1] as number[], 30)).toBe(true);
    expect(near(saved.colors[2] as number[], saved.colors[3] as number[], 30)).toBe(true);
  });

  test("the choice is kept when generating a new arrangement", async ({ page }) => {
    await setSize(page, 400, 400);
    await page.fill("#border-width", "0");
    await addPhotos(page, await makeImages(page, FOUR));
    await page.fill("#columns", "1");
    for (let i = 0; i < 3; i++) {
      await page.click("#regenerate");
      const { left, right } = await bandColours(page);
      for (let k = 0; k < left.length; k++) {
        expect(near(left[k] as number[], right[k] as number[], 30)).toBe(true);
      }
    }
    await expect(page.locator("#columns")).toHaveValue("1");
  });

  test("shows how many columns are in use, and returns to automatic when cleared", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.fill("#columns", "2");
    await expect(page.locator("#columns-note")).toHaveText(/Columns in use: [12]$/);
    const forced = await page.locator("#columns-note").textContent();

    await page.fill("#columns", "");
    await expect(page.locator("#columns-note")).toHaveText(/Columns in use: \d+$/);
    // Automatic picks more than two columns for six photos on a 4:3 poster.
    expect(await page.locator("#columns-note").textContent()).not.toBe(forced);
  });

  test("the same seed with the same columns gives the same layout", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const grid = async () => {
      const out: number[][] = [];
      for (const y of [0.15, 0.5, 0.85]) {
        for (const x of [0.15, 0.5, 0.85]) out.push(await previewColor(page, x, y));
      }
      return JSON.stringify(out);
    };
    await setSeed(page, 21);
    await page.fill("#columns", "3");
    const first = await grid();
    await page.fill("#columns", "2");
    const other = await grid();
    await page.fill("#columns", "3");
    expect(await grid()).toBe(first);
    expect(other).not.toBe(first);
  });

  test("out-of-range values are tidied to the allowed range", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.fill("#columns", "500");
    await page.locator("#columns").press("Tab");
    await expect(page.locator("#columns")).toHaveValue("100");
    await page.fill("#columns", "0");
    await page.locator("#columns").press("Tab");
    await expect(page.locator("#columns")).toHaveValue("1");
    await page.fill("#columns", "3.9");
    await page.locator("#columns").press("Tab");
    await expect(page.locator("#columns")).toHaveValue("3");
  });

  test("works before any photos are added", async ({ page }) => {
    await page.fill("#columns", "4");
    await expect(page.locator("#columns-note")).toHaveText("");
    await addPhotos(page, await makeImages(page, SIX));
    await expect(page.locator("#columns-note")).toContainText("Columns in use");
  });
});

test.describe("Privacy note at the upload controls", () => {
  const NOTE = /never uploaded/;

  test("is shown in the drop area before any photo is added", async ({ page }) => {
    const note = page.locator("#empty-state");
    await expect(note).toBeVisible();
    await expect(note).toContainText("Everything runs in your browser");
    await expect(note).toContainText("never uploaded");
  });

  test("is announced with the Add images button", async ({ page }) => {
    await expect(page.locator("#add")).toHaveAccessibleDescription(NOTE);
  });

  test("is still announced with Add images after photos are added, when the drop area is gone", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX.slice(0, 2)));
    await expect(page.locator("#empty-state")).toBeHidden();
    await expect(page.locator("#add")).toHaveAccessibleDescription(NOTE);
  });

  test("is true: adding and saving photos sends nothing anywhere", async ({ page }) => {
    const sent: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      const sameOrigin = url.origin === new URL(page.url()).origin;
      // Loading the app's own files (GET) is fine; nothing may be posted, and nothing may leave.
      if (request.method() !== "GET" || !sameOrigin || request.postData()) {
        sent.push(`${request.method()} ${request.url()}`);
      }
    });
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, SIX));
    await saveAndRead(page);
    expect(sent).toEqual([]);
  });

  test("is translated when the language has the text, otherwise shown in English", async ({
    page,
  }) => {
    await page.selectOption("#language", "fr");
    // No translation exists yet for this new sentence, so the English text is kept.
    await expect(page.locator("#privacy-note")).toContainText("never uploaded");
  });
});

test.describe("Preview area, zoom and pan", () => {
  const FOUR = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "g.png", w: 400, h: 400, color: "green" as const },
    { name: "b.png", w: 400, h: 400, color: "blue" as const },
    { name: "y.png", w: 400, h: 400, color: "yellow" as const },
  ];

  /** Put the mouse at a fraction of the poster. */
  async function hover(page: import("@playwright/test").Page, fx: number, fy: number) {
    const p = await posterPoint(page, fx, fy);
    await page.mouse.move(p.x, p.y);
    return p;
  }

  test("has a plain background, not a checkerboard", async ({ page }) => {
    const style = await page.locator("#canvas-box").evaluate((el) => {
      const s = getComputedStyle(el);
      return { image: s.backgroundImage, page: getComputedStyle(document.body).backgroundColor };
    });
    expect(style.image).toBe("none");
    // The glass backdrop shows through the preview area; behind it the page has a plain colour.
    expect(style.page).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("scrolling zooms in and out, and Fit to window brings it back", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    const fit = await posterRect(page);
    await expect(page.locator("#reset-view")).toBeDisabled();

    await hover(page, 0.5, 0.5);
    await page.mouse.wheel(0, -400);
    await expect.poll(async () => (await posterRect(page)).w).toBeGreaterThan(fit.w * 1.2);
    await expect(page.locator("#reset-view")).toBeEnabled();
    await expect(page.locator("#view-zoom")).toContainText("Zoom:");

    await page.mouse.wheel(0, 1200);
    await expect.poll(async () => (await posterRect(page)).w).toBeLessThan(fit.w);

    await page.click("#reset-view");
    await expect.poll(async () => (await posterRect(page)).w).toBeCloseTo(fit.w, 0);
    await expect(page.locator("#reset-view")).toBeDisabled();
    await expect(page.locator("#view-zoom")).toHaveText("");
  });

  test("zooming keeps the point under the mouse in place", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    const before = await hover(page, 0.25, 0.3);
    const start = await posterRect(page);
    await page.mouse.wheel(0, -500);
    await expect.poll(async () => (await posterRect(page)).w).toBeGreaterThan(start.w * 1.3);
    const after = await posterRect(page);
    const box = (await page.locator("#preview").boundingBox()) as { x: number; y: number };
    // The poster point that was under the mouse is still under it.
    expect((before.x - box.x - after.x) / after.w).toBeCloseTo(0.25, 1);
    expect((before.y - box.y - after.y) / after.h).toBeCloseTo(0.3, 1);
  });

  test("zoom stops at 800 %", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    await hover(page, 0.5, 0.5);
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, -600);
    await expect(page.locator("#view-zoom")).toHaveText("Zoom: 800%");
  });

  test("holding Space and dragging moves the collage", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    const start = await posterRect(page);
    const from = await hover(page, 0.5, 0.5);

    await page.keyboard.down("Space");
    await page.mouse.down();
    await page.mouse.move(from.x + 80, from.y + 40, { steps: 4 });
    await page.mouse.up();
    await page.keyboard.up("Space");

    await expect.poll(async () => (await posterRect(page)).x).toBeCloseTo(start.x + 80, 0);
    expect((await posterRect(page)).y).toBeCloseTo(start.y + 40, 0);
    // The size is unchanged and no photo got picked by the drag.
    expect((await posterRect(page)).w).toBeCloseTo(start.w, 0);
    await expect(page.locator("#messages")).not.toContainText("Selected");
  });

  test("in Swap mode, dragging without Space does not move the collage", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    await swapMode(page);
    const start = await posterRect(page);
    const from = await hover(page, 0.5, 0.5);
    await page.mouse.down();
    await page.mouse.move(from.x + 80, from.y + 40, { steps: 4 });
    await page.mouse.up();
    expect(await posterRect(page)).toEqual(start);
  });

  test("Space no longer picks a photo from the keyboard; Enter does", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    await page.locator("#preview").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("#messages")).not.toContainText("Selected");
    await page.keyboard.press("Enter");
    await expect(page.locator("#messages")).toContainText("Selected");
  });

  test("works from the keyboard: plus and minus zoom, shift and arrows pan, zero fits", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    const fit = await posterRect(page);
    await page.locator("#preview").focus();

    await page.keyboard.press("+");
    await expect.poll(async () => (await posterRect(page)).w).toBeGreaterThan(fit.w * 1.2);
    await page.keyboard.press("-");
    await expect.poll(async () => (await posterRect(page)).w).toBeCloseTo(fit.w, 0);

    const before = await posterRect(page);
    await page.keyboard.press("Shift+ArrowLeft");
    await expect.poll(async () => (await posterRect(page)).x).toBeCloseTo(before.x + 40, 0);

    await page.keyboard.press("0");
    await expect.poll(async () => (await posterRect(page)).x).toBeCloseTo(fit.x, 0);
  });

  test("photos can still be picked and swapped while zoomed in", async ({ page }) => {
    await addPhotos(page, await makeImages(page, FOUR));
    await hover(page, 0.5, 0.5);
    await page.mouse.wheel(0, -300);
    await expect(page.locator("#reset-view")).toBeEnabled();
    const p = await posterPoint(page, 0.5, 0.5);
    await page.mouse.click(p.x, p.y);
    await expect(page.locator("#messages")).toContainText("Selected");
  });

  test("zooming the preview does not change the saved image", async ({ page }) => {
    await setSize(page, 320, 240);
    await addPhotos(page, await makeImages(page, FOUR));
    await hover(page, 0.5, 0.5);
    await page.mouse.wheel(0, -500);
    await expect(page.locator("#reset-view")).toBeEnabled();
    const png = await saveAndRead(page);
    const result = await analyse(page, png);
    expect([result.width, result.height]).toEqual([320, 240]);
  });
});

test.describe("Border default and corner style", () => {
  const RED = [{ name: "a.png", w: 400, h: 300, color: "red" as const }];

  test("defaults to a 0.5 % white border and square corners", async ({ page }) => {
    await expect(page.locator("#border-width")).toHaveValue("0.5");
    await expect(page.locator("#border-color")).toHaveValue("#ffffff");
    await expect(page.locator("#corner-style")).toHaveValue("none");
  });

  test("offers none, slightly rounded and rounded", async ({ page }) => {
    const options = await page.locator("#corner-style option").allTextContents();
    expect(options).toEqual(["None", "Slightly rounded", "Rounded"]);
  });

  test("with a border, rounded corners are cut out of each photo and filled with the border colour", async ({
    page,
  }) => {
    await setSize(page, 400, 300);
    await page.fill("#border-width", "5");
    await page.locator("#border-color").fill("#00ff00");
    await addPhotos(page, await makeImages(page, RED));

    // Just inside the corner of the area the photo occupies (5 % of 400 px is 20 px in).
    const point: [number, number] = [0.055, 0.0733];

    // Square: the border is drawn over the photo's edge only, so this spot is still photo.
    expect(near(await previewColor(page, ...point), COLORS.red, 30)).toBe(true);

    for (const style of ["slight", "rounded"]) {
      await page.selectOption("#corner-style", style);
      expect(near(await previewColor(page, ...point), [0, 255, 0], 30), style).toBe(true);
      // The middle is still the photo, and the outer edge is still the border.
      expect(near(await previewColor(page, 0.5, 0.5), COLORS.red, 30), style).toBe(true);
      expect(near(await previewColor(page, 0.005, 0.5), [0, 255, 0], 20), style).toBe(true);
    }

    const png = await saveAndRead(page);
    const saved = await analyse(page, png, [point, [0.5, 0.5]]);
    expect(near(saved.colors[0] as number[], [0, 255, 0], 30)).toBe(true);
    expect(near(saved.colors[1] as number[], COLORS.red, 30)).toBe(true);
  });

  test("the saved image matches the preview for every corner style", async ({ page }) => {
    await setSize(page, 480, 360);
    await page.fill("#border-width", "2");
    await page.locator("#border-color").fill("#202020");
    await addPhotos(page, await makeImages(page, SIX));
    for (const style of ["none", "slight", "rounded"]) {
      await page.selectOption("#corner-style", style);
      const png = await saveAndRead(page);
      expect(await previewDifference(page, png), style).toBeLessThan(8);
    }
  });
});

test.describe("Removing photos", () => {
  const names = async (page: import("@playwright/test").Page) =>
    page.locator("#photo-list .name").allTextContents();

  test("selecting a photo in the list and pressing Remove selected photo takes it out, and Undo remove brings it back in place", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const all = await names(page);
    await expect(page.locator("#undo-remove")).toBeDisabled();

    await removeFromList(page, 2);
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await expect(page.locator("#messages")).toContainText("Removed");
    expect(await names(page)).toEqual(all.filter((_, i) => i !== 2));

    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(6);
    expect(await names(page)).toEqual(all);
    await expect(page.locator("#undo-remove")).toBeDisabled();
  });

  test("Delete on the preview removes the photo with the focus ring", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.locator("#preview").focus();
    await page.keyboard.press("Delete");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await expect(page.locator("#messages")).toContainText("Removed");
    // The focus stays on the preview, so the next Delete works too.
    await page.keyboard.press("Backspace");
    await expect(page.locator("#photo-list li")).toHaveCount(4);
  });

  test("a photo picked by clicking can be removed with the Remove selected photo button", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await expect(page.locator("#remove-selected")).toBeHidden();
    const p = await posterPoint(page, 0.5, 0.5);
    await page.mouse.click(p.x, p.y);
    await expect(page.locator("#remove-selected")).toBeVisible();
    const picked = /Selected (.+?)\./.exec(
      (await page.locator("#messages").textContent()) ?? "",
    )?.[1];
    expect(picked).toBeTruthy();

    await page.click("#remove-selected");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    expect(await names(page)).not.toContain(picked);
    await expect(page.locator("#remove-selected")).toBeHidden();
  });

  test("Delete removes the clicked photo rather than the focused one", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const p = await posterPoint(page, 0.5, 0.5);
    await page.mouse.click(p.x, p.y);
    const picked = /Selected (.+?)\./.exec(
      (await page.locator("#messages").textContent()) ?? "",
    )?.[1];
    await page.keyboard.press("Delete");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    expect(await names(page)).not.toContain(picked);
  });

  test("Remove all clears the collage, disables Save, and Undo remove restores everything", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const all = await names(page);
    await page.click("#remove-all");
    await expect(page.locator("#photo-list li")).toHaveCount(0);
    await expect(page.locator("#save")).toBeDisabled();
    await expect(page.locator("#remove-all")).toBeDisabled();

    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(6);
    expect(await names(page)).toEqual(all);
    await expect(page.locator("#save")).toBeEnabled();
  });

  test("Ctrl+Z on the preview undoes a removal", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.locator("#preview").focus();
    await page.keyboard.press("Delete");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await page.keyboard.press("Control+z");
    await expect(page.locator("#photo-list li")).toHaveCount(6);
  });

  test("undoing does not duplicate a photo that was added again meanwhile", async ({
    page,
  }, testInfo) => {
    const [one] = await makeImages(page, [{ name: "again.png", w: 100, h: 100, color: "blue" }]);
    const path = testInfo.outputPath("again.png");
    await writeFile(path, one!.buffer);
    await addPhotos(page, [path]);
    await removeFromList(page, 0);
    await expect(page.locator("#photo-list li")).toHaveCount(0);
    await addPhotos(page, [path]);
    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(1);
  });

  test("a new removal replaces what Undo remove would restore", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const all = await names(page);
    await removeFromList(page, 0);
    await removeFromList(page, 0);
    await page.click("#undo-remove");
    // Only the second removal comes back.
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    expect(await names(page)).toEqual(all.slice(1));
  });
});

test.describe("The poster's edge", () => {
  test("border seams stay inside the poster", async ({ page }) => {
    await setSize(page, 480, 360);
    await page.fill("#border-width", "5");
    await page.locator("#border-color").fill("#000000");
    await addPhotos(page, await makeImages(page, SIX));

    // Look at a thin strip all around, just outside the poster. The page shows through there
    // (transparent) with a faint shadow, so an opaque dark pixel can only be a stray border seam.
    const strayPixels = await page.evaluate(() => {
      const c = document.getElementById("preview") as HTMLCanvasElement;
      const scale = c.width / c.clientWidth;
      const [px, py, pw, ph] = (c.dataset.poster ?? "0,0,1,1").split(",").map(Number);
      const x0 = Math.round((px as number) * scale);
      const y0 = Math.round((py as number) * scale);
      const w = Math.round((pw as number) * scale);
      const h = Math.round((ph as number) * scale);
      const ctx = c.getContext("2d") as CanvasRenderingContext2D;
      const ring = 5;
      const strips: [number, number, number, number][] = [
        [x0, y0 - ring, w, ring],
        [x0, y0 + h, w, ring],
        [x0 - ring, y0, ring, h],
        [x0 + w, y0, ring, h],
      ];
      let count = 0;
      for (const [x, y, sw, sh] of strips) {
        const data = ctx.getImageData(x, y, sw, sh).data;
        for (let i = 0; i < data.length; i += 4) {
          if ((data[i + 3] as number) > 128 && (data[i] as number) < 60) count++;
        }
      }
      return count;
    });
    expect(strayPixels).toBe(0);
  });
});

test.describe("Technical configuration", () => {
  test("the seed is tucked away in a collapsed section", async ({ page }) => {
    await expect(page.locator("#technical summary")).toHaveText("Technical configuration");
    await expect(page.locator("#technical")).not.toHaveAttribute("open", "");
    await expect(page.locator("#seed")).toBeHidden();
    await page.locator("#technical summary").click();
    await expect(page.locator("#seed")).toBeVisible();
    await page.locator("#technical summary").click();
    await expect(page.locator("#seed")).toBeHidden();
  });

  test("the first arrangement is the best of 30 tries, and its seed gives the same layout again", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await openTechnical(page);
    const grid = async () => {
      const out: number[][] = [];
      for (const y of [0.12, 0.38, 0.62, 0.88]) {
        for (const x of [0.12, 0.38, 0.62, 0.88]) out.push(await previewColor(page, x, y));
      }
      return JSON.stringify(out);
    };
    const seed = await page.inputValue("#seed");
    expect(seed).toMatch(/^\d+$/);
    const first = await grid();
    const note = await page.locator("#crop-note").textContent();
    expect(note).toMatch(/^\d+% of each photo is trimmed to fit\.$/);

    // Another seed gives another arrangement; the first one's seed brings the first one back.
    await setSeed(page, Number(seed) === 5 ? 6 : 5);
    expect(await grid()).not.toBe(first);
    await setSeed(page, Number(seed));
    expect(await grid()).toBe(first);
    expect(await page.locator("#crop-note").textContent()).toBe(note);
  });

  test("Regenerate makes one new arrangement with a new seed", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await openTechnical(page);
    const before = await page.inputValue("#seed");
    await page.click("#regenerate");
    await expect(page.locator("#seed")).not.toHaveValue(before);
    // One generation: the shown seed is simply the new one, and typing it back changes nothing.
    const after = await page.inputValue("#seed");
    const crop = await page.locator("#crop-note").textContent();
    await setSeed(page, Number(after));
    expect(await page.locator("#crop-note").textContent()).toBe(crop);
  });

  test("adding photos picks the best arrangement for the new set", async ({ page }) => {
    const all = await makeImages(page, SIX);
    await addPhotos(page, all.slice(0, 3));
    await openTechnical(page);
    const first = await page.inputValue("#seed");
    await addPhotos(page, all.slice(3));
    expect(await page.inputValue("#seed")).not.toBe(first);
    await expect(page.locator("#crop-note")).toContainText("of each photo is trimmed to fit");
  });
});

test.describe("Sidebar fits its bounds", () => {
  for (const width of [1280, 1000, 820, 760, 420, 340]) {
    test(`nothing sticks out of the sidebar at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("./");
      await openTechnical(page);
      const longName = `${"a-very-long-photo-file-name-".repeat(3)}.png`;
      await addPhotos(
        page,
        await makeImages(page, [{ name: longName, w: 100, h: 100, color: "red" }]),
      );

      if (width <= 760) {
        // Narrow: the controls are floating panels over the collage. Nothing may stick out of the
        // window, and the page itself must not scroll sideways.
        await page.click("#tab-photos");
        const outside = await page.evaluate(() => {
          const found: string[] = [];
          for (const el of document.querySelectorAll<HTMLElement>(
            ".brand, .tabs, .sheet, .dock, .tools, .hint-pill, .shuffle",
          )) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right > window.innerWidth + 1 || r.left < -1) found.push(el.className);
          }
          return found;
        });
        expect(outside).toEqual([]);
        const scrolls = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        expect(scrolls).toBe(false);
        return;
      }
      const overflow = await page.evaluate(() => {
        const panel = document.querySelector("aside.panel") as HTMLElement;
        const box = panel.getBoundingClientRect();
        const outside: string[] = [];
        for (const el of panel.querySelectorAll<HTMLElement>("*")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > box.right + 1 || r.left < box.left - 1) {
            outside.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}`);
          }
        }
        return { outside, scrolls: panel.scrollWidth > panel.clientWidth + 1 };
      });
      expect(overflow.outside).toEqual([]);
      expect(overflow.scrolls).toBe(false);
      // And the page itself does not scroll sideways.
      const pageScrolls = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(pageScrolls).toBe(false);
    });
  }

  test("the width and height fields share the row evenly and stay inside it", async ({ page }) => {
    await page.click("#tab-poster");
    const [w, h, panel] = await Promise.all([
      page.locator("#width").boundingBox(),
      page.locator("#height").boundingBox(),
      page.locator("aside.panel").boundingBox(),
    ]);
    expect(w && h && panel).toBeTruthy();
    expect(h!.x + h!.width).toBeLessThanOrEqual(panel!.x + panel!.width);
    expect(Math.abs(w!.width - h!.width)).toBeLessThan(2);
  });
});

test.describe("Border around the whole collage", () => {
  const TWO = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "b.png", w: 400, h: 400, color: "blue" as const },
  ];

  test("is on by default", async ({ page }) => {
    await expect(page.locator("#outer-border")).toBeChecked();
  });

  test("off: the border stays between photos but not around the collage", async ({ page }) => {
    await setSize(page, 400, 800);
    await page.fill("#border-width", "5");
    await page.locator("#border-color").fill("#00ff00");
    await page.fill("#columns", "1");
    await addPhotos(page, await makeImages(page, TWO));
    await page.fill("#columns", "1");

    // Whichever photo is on top, its edge and its middle are the same colour once the frame is off.
    const edge = () => previewColor(page, 0.004, 0.25);
    const middle = () => previewColor(page, 0.5, 0.25);
    const seam = () => previewColor(page, 0.5, 0.5);
    // On: green all round and between.
    expect(near(await edge(), [0, 255, 0], 30)).toBe(true);
    expect(near(await seam(), [0, 255, 0], 30)).toBe(true);

    await page.uncheck("#outer-border");
    // Off: the photo reaches the edge, and the line between the two photos is still there.
    expect(near(await edge(), [0, 255, 0], 60)).toBe(false);
    expect(near(await edge(), await middle(), 30)).toBe(true);
    expect(near(await seam(), [0, 255, 0], 30)).toBe(true);

    const png = await saveAndRead(page);
    const saved = await analyse(page, png, [
      [0.004, 0.25],
      [0.5, 0.25],
      [0.5, 0.5],
    ]);
    expect(near(saved.colors[0] as number[], [0, 255, 0], 60)).toBe(false);
    expect(near(saved.colors[0] as number[], saved.colors[1] as number[], 30)).toBe(true);
    expect(near(saved.colors[2] as number[], [0, 255, 0], 30)).toBe(true);
  });

  test("off, with rounded photos: gaps between them keep the colour, the outer corners do not", async ({
    page,
  }) => {
    await setSize(page, 400, 800);
    await page.fill("#border-width", "5");
    await page.locator("#border-color").fill("#00ff00");
    await addPhotos(page, await makeImages(page, TWO));
    await page.fill("#columns", "1");
    await page.selectOption("#corner-style", "rounded");

    // On: the whole poster behind the photos is the border colour.
    expect(near(await previewColor(page, 0.003, 0.003), [0, 255, 0], 30)).toBe(true);
    await page.uncheck("#outer-border");
    // Off: the poster's corner is plain white, but the gap between the two photos is still green.
    expect(near(await previewColor(page, 0.003, 0.003), [255, 255, 255], 15)).toBe(true);
    expect(near(await previewColor(page, 0.5, 0.5), [0, 255, 0], 30)).toBe(true);
  });

  test("the saved image matches the preview with it off, for every corner style", async ({
    page,
  }) => {
    await setSize(page, 480, 360);
    await page.fill("#border-width", "2");
    await page.locator("#border-color").fill("#202020");
    await addPhotos(page, await makeImages(page, SIX));
    await page.uncheck("#outer-border");
    for (const style of ["none", "slight", "rounded"]) {
      await page.selectOption("#corner-style", style);
      const png = await saveAndRead(page);
      expect(await previewDifference(page, png), style).toBeLessThan(8);
    }
  });
});

test.describe("Asking for a photo to be bigger", () => {
  const THREE = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "g.png", w: 400, h: 400, color: "green" as const },
    { name: "b.png", w: 400, h: 400, color: "blue" as const },
  ];

  /** Click the photo whose colour is `rgb` (found by scanning the preview). */
  async function selectPhoto(page: import("@playwright/test").Page, rgb: readonly number[]) {
    for (let y = 0.05; y < 1; y += 0.1) {
      for (let x = 0.05; x < 1; x += 0.1) {
        if (near(await previewColor(page, x, y), rgb, 40)) {
          const p = await posterPoint(page, x, y);
          await page.mouse.click(p.x, p.y);
          await expect(page.locator("#span-group")).toBeVisible();
          return;
        }
      }
    }
    throw new Error("no photo of that colour on the poster");
  }

  /** The share of the poster's height, down its middle, that is `rgb`. */
  async function shareDown(page: import("@playwright/test").Page, rgb: readonly number[]) {
    let hits = 0;
    const n = 40;
    for (let i = 0; i < n; i++) {
      if (near(await previewColor(page, 0.5, (i + 0.5) / n), rgb, 40)) hits++;
    }
    return hits / n;
  }

  test("the size buttons appear only while a photo is selected", async ({ page }) => {
    await addPhotos(page, await makeImages(page, THREE));
    await expect(page.locator("#span-group")).toBeHidden();
    await selectPhoto(page, COLORS.red);
    await expect(page.getByRole("button", { name: "Wider" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Taller" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Normal size" })).toBeDisabled();
    await page.keyboard.press("Escape");
    await page.locator("#preview").focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#span-group")).toBeHidden();
  });

  test("Taller gives a photo more of the height, in steps, and Normal size takes it back", async ({
    page,
  }) => {
    await setSize(page, 400, 400);
    await page.fill("#border-width", "0");
    await addPhotos(page, await makeImages(page, THREE));
    await page.fill("#columns", "1");
    const normal = await shareDown(page, COLORS.red);
    expect(normal).toBeGreaterThan(0.25);
    expect(normal).toBeLessThan(0.42);

    await selectPhoto(page, COLORS.red);
    await page.getByRole("button", { name: "Taller" }).click();
    await expect(page.locator("#span-taller")).toHaveText("Taller ×2");
    const two = await shareDown(page, COLORS.red);
    expect(two).toBeGreaterThan(normal + 0.1);
    await expect(page.locator("#photo-list li").first()).toContainText("taller ×2");

    await page.locator("#span-taller").click();
    await expect(page.locator("#span-taller")).toHaveText("Taller ×3");
    expect(await shareDown(page, COLORS.red)).toBeGreaterThan(two + 0.05);

    // A third press goes back round to normal.
    await page.locator("#span-taller").click();
    await expect(page.locator("#span-taller")).toHaveText("Taller");
    expect(await shareDown(page, COLORS.red)).toBeCloseTo(normal, 1);

    await page.locator("#span-taller").click();
    await page.getByRole("button", { name: "Normal size" }).click();
    await expect(page.locator("#span-taller")).toHaveText("Taller");
    await expect(page.locator("#photo-list li").first()).not.toContainText("taller");
    expect(await shareDown(page, COLORS.red)).toBeCloseTo(normal, 1);
  });

  test("Wider makes a photo span two columns, and the photo stays selected", async ({ page }) => {
    await setSize(page, 400, 300);
    await page.fill("#border-width", "0");
    await addPhotos(page, await makeImages(page, THREE));
    await page.fill("#columns", "2");

    await selectPhoto(page, COLORS.red);
    await page.getByRole("button", { name: "Wider" }).click();
    await expect(page.locator("#span-wider")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#photo-list li").first()).toContainText("wider");
    // Still selected, so the buttons are still there.
    await expect(page.locator("#span-group")).toBeVisible();

    // Somewhere down the poster the red photo covers both the left and the right edge.
    const bothSides = async () => {
      for (let y = 0.04; y < 1; y += 0.04) {
        const left = await previewColor(page, 0.05, y);
        const right = await previewColor(page, 0.95, y);
        if (near(left, COLORS.red, 40) && near(right, COLORS.red, 40)) return true;
      }
      return false;
    };
    expect(await bothSides()).toBe(true);

    await page.getByRole("button", { name: "Wider" }).click();
    await expect(page.locator("#span-wider")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#photo-list li").first()).not.toContainText("wider");
  });

  test("a requested size is kept when the collage is regenerated, resized or changed", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.fill("#columns", "3");
    await selectPhoto(page, COLORS.red);
    await page.getByRole("button", { name: "Wider" }).click();
    await page.locator("#span-taller").click();
    const tag = page.locator("#photo-list li").first();
    await expect(tag).toContainText("wider · taller ×2");

    for (let i = 0; i < 3; i++) await page.click("#regenerate");
    await expect(tag).toContainText("wider · taller ×2");

    await setSize(page, 300, 400);
    await expect(tag).toContainText("wider · taller ×2");

    // Removing a different photo (a search for a new arrangement) keeps it too.
    await removeFromList(page, 3);
    await expect(page.locator("#photo-list li").first()).toContainText("wider · taller ×2");
    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li").first()).toContainText("wider · taller ×2");
  });

  test("redrawing does not replace the Taller button's text while it is pressed", async ({
    page,
  }) => {
    // WebKit drops a click when the button's text node is replaced between press and release,
    // and the preview redraws (and refreshes this label) when it loses focus on that press.
    await addPhotos(page, await makeImages(page, SIX));
    await selectPhoto(page, COLORS.red);
    const kept = await page.evaluate(() => {
      const button = document.getElementById("span-taller") as HTMLButtonElement;
      const before = button.firstChild;
      const canvas = document.getElementById("preview") as HTMLCanvasElement;
      canvas.focus();
      canvas.blur();
      return button.firstChild === before;
    });
    expect(kept).toBe(true);
  });

  test("several photos can each keep their own size", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await selectPhoto(page, COLORS.red);
    await page.getByRole("button", { name: "Wider" }).click();
    await page.keyboard.press("Escape");
    await page.locator("#preview").focus();
    await page.keyboard.press("Escape");
    await selectPhoto(page, COLORS.blue);
    await page.locator("#span-taller").click();

    await expect(page.locator("#photo-list li", { hasText: "red.png" })).toContainText("wider");
    await expect(page.locator("#photo-list li", { hasText: "blue.png" })).toContainText(
      "taller ×2",
    );
    await expect(page.locator("#photo-list li", { hasText: "blue.png" })).not.toContainText(
      "wider",
    );
  });

  test("the saved image shows the same arrangement as the preview", async ({ page }) => {
    await setSize(page, 480, 360);
    await addPhotos(page, await makeImages(page, SIX));
    await selectPhoto(page, COLORS.green);
    await page.getByRole("button", { name: "Wider" }).click();
    await page.locator("#span-taller").click();
    const png = await saveAndRead(page);
    expect(await previewDifference(page, png)).toBeLessThan(6);
  });
});

test.describe("Small text styles", () => {
  test("the pixels label is plain hint text, with no accent bar or background", async ({
    page,
  }) => {
    await page.click("#tab-poster");
    const unit = await page.locator(".unit").evaluate((el) => {
      const s = getComputedStyle(el);
      return { bar: s.borderLeftWidth, background: s.backgroundColor };
    });
    expect(unit.bar).toBe("0px");
    expect(unit.background).toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("Collage Creator: layout, modes, sizes and notices", () => {
  const TWO = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "g.png", w: 400, h: 400, color: "green" as const },
  ];

  test("is called Collage Creator and starts with a drop target", async ({ page }) => {
    await expect(page).toHaveTitle("Collage Creator");
    await expect(page.locator("h1")).toHaveText("Collage Creator");
    await expect(page.locator("#empty-state")).toBeVisible();
    await expect(page.locator("#empty-state")).toContainText("Drop photos here");
    await expect(page.locator(".credit")).toContainText("PhotoCollage");
  });

  test("Pan is the default; Pan and Swap are exclusive", async ({ page }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#hint")).toContainText("Drag to pan");
    await page.click("#mode-swap");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#hint")).toContainText("swap them");
    await page.click("#mode-pan");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
  });

  test("in Pan mode a drag moves the collage and a click selects a photo", async ({ page }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await page.click("#zoom-in");
    await expect(page.locator("#view-zoom")).toContainText("Zoom:");
    const start = await posterRect(page);
    const from = await posterPoint(page, 0.5, 0.5);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + 30, { steps: 4 });
    await page.mouse.up();
    const moved = await posterRect(page);
    expect(moved.x).toBeGreaterThan(start.x + 20);
    await expect(page.locator("#remove-selected")).toBeHidden();
    await page.mouse.click(from.x + 40, from.y + 30);
    await expect(page.locator("#remove-selected")).toBeVisible();
  });

  test("in Swap mode, holding Space pans for as long as it is held", async ({ page }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await swapMode(page);
    await page.click("#zoom-in");
    await expect(page.locator("#view-zoom")).toContainText("Zoom:");
    const start = await posterRect(page);
    const from = await posterPoint(page, 0.5, 0.5);
    await page.mouse.move(from.x, from.y);
    await page.keyboard.down("Space");
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + 30, { steps: 4 });
    await page.mouse.up();
    await page.keyboard.up("Space");
    expect((await posterRect(page)).x).toBeGreaterThan(start.x + 20);
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "true");
  });

  test("size buttons, orientation and Custom work together", async ({ page }) => {
    await page.click("#tab-poster");
    await expect(page.locator('[data-choice="screen"]')).toHaveAttribute("aria-pressed", "true");
    await page.click('[data-choice="a4"]');
    await expect(page.locator("#width")).toHaveValue("3508");
    await expect(page.locator("#height")).toHaveValue("2480");
    await page.click("#orient-portrait");
    await expect(page.locator("#width")).toHaveValue("2480");
    await expect(page.locator("#height")).toHaveValue("3508");
    await expect(page.locator('[data-choice="a4"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#orient-portrait")).toHaveAttribute("aria-pressed", "true");

    await page.click('[data-choice="post"]');
    await expect(page.locator("#width")).toHaveValue("1080");
    await expect(page.locator("#height")).toHaveValue("1350");

    await page.click("#orient-landscape");
    await expect(page.locator("#width")).toHaveValue("1350");

    // Typing your own numbers switches to Custom.
    await page.fill("#width", "1234");
    await expect(page.locator('[data-choice="custom"]')).toHaveAttribute("aria-pressed", "true");
    await page.click('[data-choice="screen"]');
    await expect(page.locator('[data-choice="custom"]')).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#save-summary")).toContainText("1600 × 1200");
  });

  test("Gallery arranges the same photos and can be saved; Mosaic stays the default", async ({
    page,
  }) => {
    await setSize(page, 400, 300);
    await page.fill("#border-width", "0");
    await addPhotos(page, await makeImages(page, SIX));
    await page.click("#tab-poster");
    await expect(page.locator("#layout-mosaic")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#columns-block")).toBeVisible();

    await page.click("#layout-gallery");
    await expect(page.locator("#layout-gallery")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#columns-block")).toBeHidden();
    await expect(page.locator("#gallery-note")).toBeVisible();
    await expect(page.locator("#crop-note")).toContainText("of each photo is trimmed to fit");
    await expect(page.locator("#photo-list li")).toHaveCount(6);

    // The seed gives the same Gallery arrangement again.
    const first = await previewColor(page, 0.25, 0.25);
    const seed = await page.inputValue("#seed");
    await page.click("#regenerate");
    await setSeed(page, Number(seed));
    expect(near(await previewColor(page, 0.25, 0.25), first, 5)).toBe(true);

    const png = await saveAndRead(page);
    expect([...png.subarray(1, 4)]).toEqual([0x50, 0x4e, 0x47]);

    await page.click("#layout-mosaic");
    await expect(page.locator("#columns-block")).toBeVisible();
  });

  test("photos that were skipped are summarised, with the names under Details", async ({
    page,
  }, testInfo) => {
    const [one] = await makeImages(page, [{ name: "dup.png", w: 100, h: 100, color: "red" }]);
    const path = testInfo.outputPath("dup.png");
    await writeFile(path, one!.buffer);
    await addPhotos(page, [path]);
    await expect(page.locator("#notices")).toBeHidden();
    await page.setInputFiles("#file-input", [path]);
    await expect(page.locator("#notices")).toBeVisible();
    await expect(page.locator("#notices-summary")).toContainText("1 skipped: 1 already added");
    await expect(page.locator("#notices-list")).toBeHidden();
    await page.click("#notices-details");
    await expect(page.locator("#notices-list")).toContainText("dup.png");
    await page.click("#notices-dismiss");
    await expect(page.locator("#notices")).toBeHidden();
  });

  test("the backdrop takes the photos' colours in the order added and ignores the layout", async ({
    page,
  }) => {
    const cell = (n: number) =>
      page
        .locator("#backdrop i")
        .nth(n)
        .evaluate((el) => (el as HTMLElement).style.getPropertyValue("--c"));
    expect(await cell(0)).toBe("");
    await addPhotos(page, await makeImages(page, TWO));
    expect(await cell(0)).toBe("rgb(220, 30, 30)");
    expect(await cell(1)).toBe("rgb(30, 180, 60)");
    expect(await cell(2)).toBe("rgb(220, 30, 30)");
    for (let i = 0; i < 3; i++) await page.click("#regenerate");
    await setSize(page, 300, 500);
    await page.click("#layout-gallery");
    expect(await cell(0)).toBe("rgb(220, 30, 30)");
    expect(await cell(1)).toBe("rgb(30, 180, 60)");
  });
});

test.describe("Collage Creator on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the bottom bar opens each step as a sheet and Close puts it away", async ({ page }) => {
    await expect(page.locator(".brand")).toBeVisible();
    await expect(page.locator(".sheet")).toBeHidden();
    await page.click("#tab-poster");
    await expect(page.locator(".sheet")).toBeVisible();
    await expect(page.locator("#sheet-title")).toHaveText("Poster");
    await expect(page.locator("#panel-poster")).toBeVisible();
    await page.click("#sheet-close");
    await expect(page.locator(".sheet")).toBeHidden();
    await page.click("#tab-save");
    await expect(page.locator("#save-block")).toBeVisible();
    await expect(page.locator("#format-seg")).toBeVisible();
    await page.click("#tab-save");
    await expect(page.locator("#save-block")).toBeHidden();
  });

  test("the menu holds Language and About", async ({ page }) => {
    await expect(page.locator("#util")).toBeHidden();
    await page.click("#menu-open");
    await expect(page.locator("#util")).toBeVisible();
    await page.click("#about-open");
    await expect(page.locator("#about-dialog")).toBeVisible();
  });

  test("a selected photo gets an action bar above the tabs", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    await page.locator("#tab-photos").click();
    await page.locator("#photo-list li button").first().click();
    await page.click("#sheet-close");
    await expect(page.locator("#selected-dock")).toBeVisible();
    await expect(page.locator("#span-wider")).toBeVisible();
  });
});
