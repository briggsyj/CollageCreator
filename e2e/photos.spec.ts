// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// The selected photo: crop, size, removal; touch, HEIC and orientation.

import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  COLORS,
  clickPhoto,
  makeImages,
  makeOrientedJpeg,
  near,
  posterPoint,
  previewColor,
  previewDifference,
  previewIdle,
  removeFromList,
  SIX,
  saveAndRead,
  savedWork,
  setSize,
  settle,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  // Relative, so the suite also works against a site served under a sub-path (GitHub Pages).
  await page.goto("./");
});

test.describe("Cropping the selected photo", () => {
  /** A 200 x 100 photo, red on the left and blue on the right, in a square poster with no border. */
  async function setUp(page: import("@playwright/test").Page) {
    await setSize(page, 400, 400);
    await page.fill("#border-width", "0");
    await addPhotos(page, [await makeOrientedJpeg(page, "halves.jpg", 1)]);
    await settle(page);
    await clickPhoto(page, 0.5, 0.5);
    await expect(page.locator("#span-group")).toBeVisible();
    await page.click("#crop-toggle");
    await expect(page.locator("#crop-tools")).toBeVisible();
  }

  test("zooming in and dragging changes which part shows, and never leaves a gap", async ({
    page,
  }) => {
    await setUp(page);
    // Plain fit: the middle of the photo, red on the left of the cell and blue on the right.
    await settle(page);
    expect(near(await previewColor(page, 0.1, 0.5), COLORS.red, 60)).toBe(true);
    expect(near(await previewColor(page, 0.9, 0.5), COLORS.blue, 60)).toBe(true);

    await page.locator("#crop-zoom").fill("3");
    await expect(page.locator("#preview")).toHaveAttribute("data-crop", /^3\.000,/);
    await settle(page);
    // Drag the photo far to the right: its left side (red) fills the cell.
    // Start near the poster's left edge so the whole drag stays inside the window.
    const from = await posterPoint(page, 0.05, 0.5);
    await page.evaluate(() => {
      const log: number[][] = [];
      (window as unknown as { __moves: number[][] }).__moves = log;
      document
        .getElementById("preview")
        ?.addEventListener("pointermove", (e) => log.push([e.clientX, e.buttons]));
    });
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x + 600, from.y, { steps: 12 });
    await page.mouse.up();
    // It moved a good way towards the photo's left edge (x is 0.5 when centred, 0 at the edge).
    const seen = async () =>
      page.evaluate(() => ({
        crop: document.getElementById("preview")?.dataset.crop,
        moves: (window as unknown as { __moves: number[][] }).__moves,
      }));
    await expect
      .poll(
        async () => {
          const info = await seen();
          return Number((info.crop ?? "").split(",")[1]);
        },
        { message: "crop x after the drag" },
      )
      .toBeLessThan(0.4)
      .catch(async (err) => {
        throw new Error(`${err.message}\n${JSON.stringify(await seen())}`);
      });
    await settle(page);
    expect(near(await previewColor(page, 0.9, 0.5), COLORS.red, 60)).toBe(true);
    // It stopped at the photo's edge: the corners are the photo, not the white page or the border.
    for (const [x, y] of [
      [0.01, 0.01],
      [0.99, 0.01],
      [0.01, 0.99],
      [0.99, 0.99],
    ] as const) {
      expect(near(await previewColor(page, x, y), COLORS.red, 60), `${x},${y}`).toBe(true);
    }

    // The saved image shows the same crop.
    const png = await saveAndRead(page);
    expect(await previewDifference(page, png)).toBeLessThan(8);

    await page.click("#crop-reset");
    await settle(page);
    expect(near(await previewColor(page, 0.9, 0.5), COLORS.blue, 60)).toBe(true);
  });

  test("choosing another photo accepts the crop and selects that photo", async ({ page }) => {
    await setSize(page, 400, 800);
    await page.fill("#border-width", "0");
    await page.fill("#columns", "1");
    await addPhotos(
      page,
      await makeImages(page, [
        { name: "r.png", w: 400, h: 400, color: "red" as const },
        { name: "b.png", w: 400, h: 400, color: "blue" as const },
      ]),
    );
    await page.fill("#columns", "1");
    await settle(page);
    await clickPhoto(page, 0.5, 0.25);
    await expect(page.locator("#span-group")).toBeVisible();
    const first = await page.locator("#dock-name").textContent();
    await page.click("#crop-toggle");
    await expect(page.locator("#crop-tools")).toBeVisible();
    const bottom = await posterPoint(page, 0.5, 0.75);
    await page.mouse.click(bottom.x, bottom.y);
    // The other photo is now the selected one: the dock is still there, showing its name.
    await expect(page.locator("#span-group")).toBeVisible();
    await expect(page.locator("#dock-name")).not.toHaveText(first ?? "");
    await expect(page.locator("#dock-name")).toHaveText(/\.png$/);
    await expect(page.locator("#crop-tools")).toBeHidden();
    await expect(page.locator("#crop-toggle")).toHaveAttribute("aria-pressed", "false");
  });

  test("the crop is kept after a refresh", async ({ page }) => {
    await setUp(page);
    await page.locator("#crop-zoom").fill("3");
    await settle(page);
    const before = await previewColor(page, 0.5, 0.5);
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(1, { timeout: 20_000 });
    await expect(page.locator("#preview")).toHaveAttribute("data-poster", /.+/);
    await settle(page);
    expect(near(await previewColor(page, 0.5, 0.5), before, 20)).toBe(true);
    // Zoomed 3x on the centre of the photo, so the red half's edge is far from the cell's edge.
    expect(near(await previewColor(page, 0.05, 0.5), COLORS.red, 60)).toBe(true);
  });
});

test.describe("Touch", () => {
  test.use({ hasTouch: true });

  test("a finger tap in Pan mode does not pick a photo; the Select tool does", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "firefox", "Playwright's Firefox has no touch screen to tap");
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    const p = await posterPoint(page, 0.5, 0.5);
    await page.touchscreen.tap(p.x, p.y);
    await previewIdle(page);
    await expect(page.locator("#span-group")).toBeHidden();
    await page.click("#mode-select");
    await page.touchscreen.tap(p.x, p.y);
    await expect(page.locator("#span-group")).toBeVisible();
  });
});

test.describe("Quick taps", () => {
  test("buttons and the page opt out of double-tap zoom, so fast presses count", async ({
    page,
  }) => {
    for (const selector of ["#mode-swap", "#tab-style", "body", "#preview"]) {
      const touchAction = await page
        .locator(selector)
        .evaluate((el) => getComputedStyle(el).touchAction);
      // The preview handles every touch itself ("none"); everything else only gives up double-tap zoom.
      expect(touchAction, selector).toBe(selector === "#preview" ? "none" : "manipulation");
    }
  });
});

test.describe("HEIC photos", () => {
  test("are added and saved with the right colours, whichever decoder the browser uses", async ({
    page,
  }) => {
    await setSize(page, 320, 240);
    await page.fill("#border-width", "0");
    await addPhotos(page, ["e2e/fixtures/rb.heic"]);
    await expect(page.locator("#photo-list li")).toContainText("rb.heic");
    const png = await saveAndRead(page);
    const { colors } = await analyse(page, png, [
      [0.15, 0.5],
      [0.85, 0.5],
    ]);
    expect(near(colors[0]!, COLORS.red, 60)).toBe(true);
    expect(near(colors[1]!, COLORS.blue, 60)).toBe(true);
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

test.describe("Removing photos", () => {
  const names = async (page: import("@playwright/test").Page) =>
    page.locator("#photo-list .name").allTextContents();

  test("selecting a photo in the list and pressing Remove selected photo takes it out, and Undo remove brings it back in place", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const all = await names(page);
    await expect(page.locator("#undo-remove")).toBeHidden();

    await removeFromList(page, 2);
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await expect(page.locator("#messages")).toContainText("Removed");
    expect(await names(page)).toEqual(all.filter((_, i) => i !== 2));

    await page.click("#undo-remove");
    await expect(page.locator("#photo-list li")).toHaveCount(6);
    expect(await names(page)).toEqual(all);
    await expect(page.locator("#undo-remove")).toBeHidden();
  });

  test("the orange keyboard ring shows only once the keyboard is used", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    const orange = () =>
      page.evaluate(() => {
        const c = document.getElementById("preview") as HTMLCanvasElement;
        const d = (c.getContext("2d") as CanvasRenderingContext2D).getImageData(
          0,
          0,
          c.width,
          c.height,
        ).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (
            (d[i] as number) > 240 &&
            Math.abs((d[i + 1] as number) - 157) < 20 &&
            (d[i + 2] as number) < 40
          )
            n++;
        }
        return n;
      });
    // A click selects a photo (blue ring) and does not draw the orange one on the first photo.
    await clickPhoto(page, 0.5, 0.5);
    const p = await posterPoint(page, 0.5, 0.5);
    await expect(page.locator("#span-group")).toBeVisible();
    await previewIdle(page);
    expect(await orange()).toBe(0);
    // Arrow keys show the ring.
    await page.keyboard.press("ArrowRight");
    await previewIdle(page);
    expect(await orange()).toBeGreaterThan(50);
    // Clicking again hides it.
    await page.mouse.click(p.x, p.y);
    await previewIdle(page);
    expect(await orange()).toBe(0);
  });

  test("Delete on the preview removes the photo with the focus ring", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await page.locator("#preview").focus();
    await page.keyboard.press("Delete");
    // It asks first; Enter confirms.
    await expect(page.locator("#confirm-dialog")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    await expect(page.locator("#messages")).toContainText("Removed");
    // The focus goes back to the preview, so the next Delete works too.
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Enter");
    await expect(page.locator("#photo-list li")).toHaveCount(4);
  });

  test("a photo picked by clicking can be removed with the Remove selected photo button", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await expect(page.locator("#remove-selected")).toBeHidden();
    await clickPhoto(page, 0.5, 0.5);
    await expect(page.locator("#remove-selected")).toBeVisible();
    const picked = /Selected (.+?)\./.exec(
      (await page.locator("#messages").textContent()) ?? "",
    )?.[1];
    expect(picked).toBeTruthy();

    await page.click("#remove-selected");
    await page.click("#confirm-ok");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    expect(await names(page)).not.toContain(picked);
    await expect(page.locator("#remove-selected")).toBeHidden();
  });

  test("Delete removes the clicked photo rather than the focused one", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await clickPhoto(page, 0.5, 0.5);
    const picked = /Selected (.+?)\./.exec(
      (await page.locator("#messages").textContent()) ?? "",
    )?.[1];
    await page.keyboard.press("Delete");
    await page.keyboard.press("Enter");
    await expect(page.locator("#photo-list li")).toHaveCount(5);
    expect(await names(page)).not.toContain(picked);
  });

  test("Remove all clears the collage, disables Save, and Undo remove restores everything", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    const all = await names(page);
    await page.click("#remove-all");
    await page.click("#confirm-ok");
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
    await page.keyboard.press("Enter");
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

test.describe("Asking for a photo to be bigger", () => {
  const THREE = [
    { name: "r.png", w: 400, h: 400, color: "red" as const },
    { name: "g.png", w: 400, h: 400, color: "green" as const },
    { name: "b.png", w: 400, h: 400, color: "blue" as const },
  ];

  /** Click the photo whose colour is `rgb` (found by scanning the preview). */
  async function selectPhoto(page: import("@playwright/test").Page, rgb: readonly number[]) {
    await settle(page);
    for (let y = 0.05; y < 1; y += 0.1) {
      for (let x = 0.05; x < 1; x += 0.1) {
        if (near(await previewColor(page, x, y), rgb, 40)) {
          await clickPhoto(page, x, y);
          await expect(page.locator("#span-group")).toBeVisible();
          return;
        }
      }
    }
    throw new Error("no photo of that colour on the poster");
  }

  /** The share of the poster's height, down its middle, that is `rgb`. */
  async function shareDown(page: import("@playwright/test").Page, rgb: readonly number[]) {
    await settle(page);
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
    await expect(page.getByRole("button", { name: "Default size" })).toBeDisabled();
    await page.keyboard.press("Escape");
    await page.locator("#preview").focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#span-group")).toBeHidden();
  });

  test("Taller gives a photo more of the height, in steps, and Default size takes it back", async ({
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
    await page.getByRole("button", { name: "Default size" }).click();
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
    await page.locator("#span-wider").click();
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

    await page.locator("#span-wider").click();
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
