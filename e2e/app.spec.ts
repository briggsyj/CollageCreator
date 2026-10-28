// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// The app around the collage: progress, language, privacy, preview zoom, sidebar, phones, saved work.

import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  addPhotos,
  analyse,
  autoReveal,
  clickPhoto,
  makeImages,
  near,
  openTechnical,
  posterPoint,
  posterRect,
  previewColor,
  previewIdle,
  removeFromList,
  SIX,
  saveAndRead,
  savedWork,
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
      "https://github.com/briggsyj/CollageCreator",
    );
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
    await expect(page.locator("#view-zoom")).toContainText("%");

    await page.mouse.wheel(0, 1200);
    await expect.poll(async () => (await posterRect(page)).w).toBeLessThan(fit.w);

    await page.click("#reset-view");
    await expect.poll(async () => (await posterRect(page)).w).toBeCloseTo(fit.w, 0);
    await expect(page.locator("#reset-view")).toBeDisabled();
    await expect(page.locator("#view-zoom")).toHaveText("100%");
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
    await expect(page.locator("#view-zoom")).toHaveText("800%");
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
    await clickPhoto(page, 0.5, 0.5);
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
            ".brand, .tabs, .sheet, .dock, .tools, .hint-pill",
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

test.describe("Small text styles", () => {
  test("hint text is plain, with no accent bar or background", async ({ page }) => {
    await page.click("#tab-poster");
    const unit = await page.locator("#size-note").evaluate((el) => {
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
    // The credit lives in the About dialog only, not in the sidebar.
    await expect(page.locator(".credit")).toHaveCount(0);
  });

  test("the tab bar floats over the step once it is scrolled", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await addPhotos(page, await makeImages(page, SIX));
    await page.click("#tab-style");
    const tabs = page.locator("#tabs");
    await expect(tabs).not.toHaveClass(/lifted/);
    const before = await tabs.boundingBox();
    await page.evaluate(() => {
      const sheet = document.getElementById("sheet") as HTMLElement;
      sheet.scrollTop = sheet.scrollHeight;
    });
    await expect(tabs).toHaveClass(/lifted/);
    expect(await tabs.boundingBox()).toEqual(before);
    await page.click("#tab-photos");
    await expect(tabs).not.toHaveClass(/lifted/);
  });

  test("Layout and Shuffle are in the Style step, and Poster is only about size", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await expect(page.locator("#panel-style #regenerate")).toHaveCount(1);
    await expect(page.locator("#panel-photos #regenerate")).toHaveCount(0);
    await expect(page.locator("#panel-style #layout-cards")).toHaveCount(1);
    await expect(page.locator("#panel-style #columns-block")).toHaveCount(1);
    await expect(page.locator("#panel-style #seed")).toHaveCount(1);
    await expect(page.locator("#panel-poster #layout-cards")).toHaveCount(0);
    await expect(page.locator("#panel-poster #regenerate")).toHaveCount(0);
  });

  test("Select: clicking a photo on the preview selects it in the Photos step", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await page.click("#tab-style");
    await page.click("#mode-select");
    await expect(page.locator("#mode-select")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "false");
    const at = await posterPoint(page, 0.25, 0.5);
    await page.mouse.click(at.x, at.y);
    // The Photos step opens with that photo picked, ready for Wider / Taller.
    await expect(page.locator("#tab-photos")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#photo-list button.tile[aria-pressed='true']")).toHaveCount(1);
    await expect(page.locator("#selected-dock")).toBeVisible();
    await page.click("#span-wider");
    await expect(page.locator("#photo-list button.tile[aria-pressed='true']")).toHaveCount(1);
    // Space pans while it is held (with the pointer over the preview), then Select comes back.
    await page.mouse.move(at.x, at.y);
    await page.keyboard.down("Space");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.up("Space");
    await expect(page.locator("#mode-select")).toHaveAttribute("aria-pressed", "true");
  });

  test("a Help button opens a dialog that explains the tools; the preview has no always-on hint", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await expect(page.locator("#hint")).toBeHidden();
    await page.click("#help-open");
    const dialog = page.locator("#help-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("drag the collage to move it");
    await expect(dialog).toContainText("scroll over the collage");
    await expect(dialog).toContainText("click a photo, then another");
    await page.click("#help-close");
    await expect(dialog).toBeHidden();
  });

  test("Pan is the default; Pan and Swap are exclusive", async ({ page }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "false");
    await page.click("#mode-swap");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "true");
    await page.click("#mode-pan");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
  });

  /** Zoom in far enough that the collage overhangs the view on both sides, and wait for it. */
  async function zoomInUntilPannable(page: import("@playwright/test").Page) {
    const before = await posterRect(page);
    for (let i = 0; i < 3; i++) await page.click("#zoom-in");
    await expect(page.locator("#view-zoom")).toContainText("%");
    await expect.poll(async () => (await posterRect(page)).w).toBeGreaterThan(before.w * 1.3);
  }

  test("in Pan mode a drag moves the collage and a click does not select a photo", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await zoomInUntilPannable(page);
    const start = await posterRect(page);
    const from = await posterPoint(page, 0.5, 0.5);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + 30, { steps: 4 });
    await page.mouse.up();
    // The view is redrawn on the next frame, which WebKit on CI can be slow to reach.
    await expect.poll(async () => (await posterRect(page)).x).toBeGreaterThan(start.x + 20);
    await expect(page.locator("#remove-selected")).toBeHidden();
    // A click in Pan mode picks nothing: only the Select tool does.
    await page.mouse.click(from.x + 40, from.y + 30);
    await previewIdle(page);
    await expect(page.locator("#remove-selected")).toBeHidden();
    await clickPhoto(page, 0.5, 0.5);
    await expect(page.locator("#remove-selected")).toBeVisible();
  });

  test("in Swap mode, holding Space pans for as long as it is held", async ({ page }) => {
    await addPhotos(page, await makeImages(page, TWO));
    await swapMode(page);
    await zoomInUntilPannable(page);
    const start = await posterRect(page);
    const from = await posterPoint(page, 0.5, 0.5);
    await page.mouse.move(from.x, from.y);
    await page.keyboard.down("Space");
    // While Space is held Pan is the selected tool; it goes back to Swap on release.
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#mode-swap")).toHaveAttribute("aria-pressed", "false");
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y + 30, { steps: 4 });
    await page.mouse.up();
    await page.keyboard.up("Space");
    await expect(page.locator("#mode-pan")).toHaveAttribute("aria-pressed", "false");
    await expect.poll(async () => (await posterRect(page)).x).toBeGreaterThan(start.x + 20);
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

    await page.click('[data-choice="small"]');
    await expect(page.locator("#width")).toHaveValue("600");
    await expect(page.locator("#height")).toHaveValue("800");

    await page.click("#orient-landscape");
    await expect(page.locator("#width")).toHaveValue("800");

    // Square is a plain screen size, not an Instagram one; there is no story size.
    await expect(page.locator('[data-choice="story"]')).toHaveCount(0);
    await page.click('[data-choice="square"]');
    await expect(page.locator("#width")).toHaveValue("1080");
    await expect(page.locator("#height")).toHaveValue("1080");

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
    await page.click("#tab-style");
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
    await expect(page.locator("#notices-summary")).toContainText("1 file was not added");
    await expect(page.locator("#notices-reasons")).toContainText("1 already added");
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

  test("a step rises from the bottom when opened or switched to, and can be pulled down to close", async ({
    page,
  }) => {
    await page.click("#tab-photos");
    await expect(page.locator(".sheet")).toHaveClass(/rise/);
    await page.click("#tab-poster");
    await expect(page.locator(".sheet")).toHaveClass(/rise/);
    await expect(page.locator("#sheet-title")).toHaveText("Poster");
    // Let the rise finish, so the head is where it will stay when it is measured.
    await page.waitForFunction(
      () => document.querySelector(".sheet")?.getAnimations().length === 0,
    );
    const head = await page.locator(".sheet .sheet-head").boundingBox();
    expect(head).not.toBeNull();
    const x = (head?.x ?? 0) + (head?.width ?? 0) / 2;
    const y = (head?.y ?? 0) + 10;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 40, { steps: 4 });
    await page.mouse.up();
    // A short pull springs back.
    await expect(page.locator(".sheet")).toBeVisible();
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 140, { steps: 6 });
    await page.mouse.up();
    await expect(page.locator(".sheet")).toBeHidden();
  });

  test("the phone header has a Help button left of the menu button, and no floating Shuffle", async ({
    page,
  }) => {
    await expect(page.locator("#help-open")).toBeHidden();
    await expect(page.locator("#shuffle")).toHaveCount(0);
    const help = await page.locator("#help-open-head").boundingBox();
    const menu = await page.locator("#menu-open").boundingBox();
    expect((help?.x ?? 0) + (help?.width ?? 0)).toBeLessThanOrEqual(menu?.x ?? 0);
    await page.click("#help-open-head");
    await expect(page.locator("#help-dialog")).toBeVisible();
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

test.describe("Address, saved work and language", () => {
  test("the seed is in the address and back/forward step through arrangements", async ({
    page,
  }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await setSeed(page, 101);
    await setSeed(page, 202);
    expect(new URL(page.url()).searchParams.get("seed")).toBe("202");
    await page.goBack();
    await expect(page.locator("#seed")).toHaveValue("101");
    expect(new URL(page.url()).searchParams.get("seed")).toBe("101");
    await page.goForward();
    await expect(page.locator("#seed")).toHaveValue("202");
  });

  test("going back gives the same arrangement as before", async ({ page }) => {
    await setSize(page, 480, 360);
    await addPhotos(page, await makeImages(page, SIX));
    const grid = () =>
      page.evaluate(() => (document.getElementById("preview") as HTMLCanvasElement).toDataURL());
    await setSeed(page, 31);
    const first = await grid();
    await setSeed(page, 32);
    expect(await grid()).not.toBe(first);
    await page.goBack();
    await expect(page.locator("#seed")).toHaveValue("31");
    await settle(page);
    expect(await grid()).toBe(first);
  });

  test("an address with a seed opens with that seed", async ({ page }) => {
    await page.goto("./?seed=777");
    await openTechnical(page);
    await expect(page.locator("#seed")).toHaveValue("777");
  });

  test("a refresh keeps the photos, their sizes, the seed and the settings", async ({ page }) => {
    await setSize(page, 480, 360);
    await addPhotos(page, await makeImages(page, SIX));
    await removeFromList(page, 0);
    await page.click("#tab-style");
    await page.fill("#border-width", "30");
    await page.click('[data-corner="rounded"]');
    await page.click("#tab-poster");
    await page.fill("#columns", "3");
    await setSeed(page, 4242);
    // Saving waits a moment after the last change.
    await savedWork(page);
    await page.reload();
    // Bringing photos back decodes them again, which is slow when the machine is busy.
    await expect(page.locator("#photo-list li")).toHaveCount(5, { timeout: 20_000 });
    await openTechnical(page);
    await expect(page.locator("#seed")).toHaveValue("4242");
    await expect(page.locator("#width")).toHaveValue("480");
    await expect(page.locator("#border-width")).toHaveValue("30");
    await expect(page.locator('[data-corner="rounded"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#columns")).toHaveValue("3");
    await expect(page.locator("#save")).toBeEnabled();
  });

  test("while saved photos are coming back there is a loading display, and new photos wait for them", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    await savedWork(page);
    // Make reading each photo slow, as it can be with many large photos.
    await page.addInitScript(() => {
      const post = Worker.prototype.postMessage;
      Worker.prototype.postMessage = function (...args: [unknown, ...unknown[]]) {
        setTimeout(() => post.apply(this, args as never), 900);
      };
    });
    await page.reload();
    const loading = page.locator("#panel-photos .restoring");
    await expect(loading).toBeVisible();
    await expect(loading).toContainText("Bringing back your photos");
    await expect(page.locator("#empty-state .restoring-stage")).toBeVisible();
    await expect(page.locator("#add")).toBeDisabled();
    await expect(page.locator("#add-empty")).toHaveCount(0);

    // Photos added meanwhile are kept until the saved ones are back, then added after them.
    await page.setInputFiles(
      "#file-input",
      await makeImages(page, [{ name: "late.png", w: 300, h: 200, color: "red" }]),
    );
    await expect(page.locator("#photo-list li")).toHaveCount(4, { timeout: 20000 });
    await expect(loading).toHaveCount(0);
    await expect(page.locator("#add")).toBeEnabled();
    await expect(page.locator("#photo-list li .name").last()).toHaveText("late.png");
  });

  test("a refresh gives back the same picture", async ({ page }) => {
    await setSize(page, 480, 360);
    await addPhotos(page, await makeImages(page, SIX));
    await setSeed(page, 9);
    const grid = () =>
      page.evaluate(() => (document.getElementById("preview") as HTMLCanvasElement).toDataURL());
    await settle(page);
    const before = await grid();
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(6, { timeout: 20_000 });
    await expect(page.locator("#preview")).toHaveAttribute("data-poster", /.+/);
    await settle(page);
    expect(await grid()).toBe(before);
  });

  test("Remove all clears what is kept", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    await page.click("#tab-photos");
    await page.click("#remove-all");
    await page.click("#confirm-ok");
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#photo-list li")).toHaveCount(0);
    await expect(page.locator("#save")).toBeDisabled();
  });

  test("starts in the browser's language when it is supported", async ({ browser }) => {
    const context = await browser.newContext({ locale: "fr-CA" });
    const page = await context.newPage();
    await page.goto("./");
    await expect(page.locator("#add")).toHaveText("Ajouter des images...");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await context.close();
  });

  test("starts in English when the browser's language is not supported", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ja-JP" });
    const page = await context.newPage();
    await page.goto("./");
    await expect(page.locator("#add")).toHaveText("Add images...");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  });

  test("a language chosen in the page is remembered over the browser's", async ({ page }) => {
    await page.selectOption("#language", "de");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });
});
