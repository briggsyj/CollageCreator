// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Borders, corners, swapping, columns, the collage's edge and the technical settings.

import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  COLORS,
  makeImages,
  near,
  openTechnical,
  posterPoint,
  previewColor,
  previewDifference,
  SIX,
  saveAndRead,
  setSeed,
  setSize,
  settle,
  swapMode,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  // Relative, so the suite also works against a site served under a sub-path (GitHub Pages).
  await page.goto("./");
});

test.describe("Collage editing: borders and swapping", () => {
  test("the border colour and thickness show in the saved image", async ({ page }) => {
    await setSize(page, 400, 300);
    await page.fill("#border-width", "50");
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
    await page.fill("#border-width", "20");
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
    // Away from the photos, so the hover shade is not read as their colour.
    await page.mouse.move(1, 1);
    await settle(page);

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
      await settle(page);
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
      await settle(page);
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

test.describe("Border default and corner style", () => {
  const RED = [{ name: "a.png", w: 400, h: 300, color: "red" as const }];

  test("defaults to a 0.5 % white border and square corners", async ({ page }) => {
    await expect(page.locator("#border-width")).toHaveValue("5");
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
    await page.fill("#border-width", "50");
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
    await page.fill("#border-width", "20");
    await page.locator("#border-color").fill("#202020");
    await addPhotos(page, await makeImages(page, SIX));
    for (const style of ["none", "slight", "rounded"]) {
      await page.selectOption("#corner-style", style);
      const png = await saveAndRead(page);
      expect(await previewDifference(page, png), style).toBeLessThan(8);
    }
  });
});

test.describe("The poster's edge", () => {
  test("border seams stay inside the poster", async ({ page }) => {
    await setSize(page, 480, 360);
    await page.fill("#border-width", "50");
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
    await page.fill("#border-width", "50");
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
    await settle(page);
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

  test("off, with rounded photos: the gaps between them stay, the outer edge has no border", async ({
    page,
  }) => {
    await setSize(page, 400, 800);
    await page.fill("#border-width", "50");
    await page.locator("#border-color").fill("#00ff00");
    await addPhotos(page, await makeImages(page, TWO));
    await page.fill("#columns", "1");
    for (const corner of ["slight", "rounded"]) {
      await page.selectOption("#corner-style", corner);
      // On: the whole poster behind the photos is the border colour, so the poster's corner is too.
      await page.check("#outer-border");
      await settle(page);
      expect(near(await previewColor(page, 0.003, 0.003), [0, 255, 0], 30), corner).toBe(true);
      const gapOn = await previewColor(page, 0.5, 0.5);
      expect(near(gapOn, [0, 255, 0], 30), corner).toBe(true);
      // Off: the photo runs to the poster's corner (square there), and the gap between the two
      // photos is exactly what it was.
      await page.uncheck("#outer-border");
      await settle(page);
      const photo = await previewColor(page, 0.5, 0.25);
      expect(near(await previewColor(page, 0.003, 0.003), photo, 30), corner).toBe(true);
      expect(near(await previewColor(page, 0.997, 0.003), photo, 30), corner).toBe(true);
      expect(near(await previewColor(page, 0.5, 0.5), gapOn, 30), corner).toBe(true);
      // The photos' corners that face the gap are still rounded: the green shows in them.
      expect(near(await previewColor(page, 0.003, 0.5 - 0.002), [0, 255, 0], 60), corner).toBe(
        true,
      );
    }
  });

  test("a border of 0%: photos stay flush, and rounded corners show the border colour", async ({
    page,
  }) => {
    await setSize(page, 400, 800);
    await page.fill("#border-width", "0");
    await page.locator("#border-color").fill("#00ff00");
    await addPhotos(page, await makeImages(page, TWO));
    await page.fill("#columns", "1");
    await page.selectOption("#corner-style", "rounded");
    // Flush: right at the join the top photo ends and the bottom photo begins, with nothing between.
    const top = await previewColor(page, 0.5, 0.25);
    const bottom = await previewColor(page, 0.5, 0.75);
    expect(near(await previewColor(page, 0.5, 0.498), top, 30)).toBe(true);
    expect(near(await previewColor(page, 0.5, 0.502), bottom, 30)).toBe(true);
    // The wedges the rounded corners leave are the border colour, not white.
    expect(near(await previewColor(page, 0.004, 0.499), [0, 255, 0], 40)).toBe(true);
    expect(near(await previewColor(page, 0.004, 0.499), [255, 255, 255], 40)).toBe(false);
  });

  test("the saved image matches the preview with it off, for every corner style", async ({
    page,
  }) => {
    await setSize(page, 480, 360);
    await page.fill("#border-width", "20");
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
