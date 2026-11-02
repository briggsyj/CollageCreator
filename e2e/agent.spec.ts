// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// biome-ignore-all lint/suspicious/noExplicitAny: tool results are untyped JSON read by the tests

// WebMCP: the tools the page offers a browser assistant. A stand-in `modelContext` records the
// registered tools so the tests can call them as an assistant would.

import { expect, type Page, test } from "@playwright/test";
import { addPhotos, autoReveal, makeImages, SIX, settle } from "./helpers";

type Json = Record<string, any>;

/** Install a stand-in WebMCP before the page loads. */
async function standIn(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const tools: Record<string, { execute: (a: unknown) => Promise<unknown> }> = {};
    (window as unknown as { __tools: typeof tools }).__tools = tools;
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool(tool: { name: string; execute: (a: unknown) => Promise<unknown> }) {
          tools[tool.name] = tool;
        },
      },
    });
  });
}

/** Call a tool; the parsed JSON of its text, plus whether it was an error and any image. */
async function call(page: Page, name: string, args: Json = {}): Promise<Json> {
  return page.evaluate(
    async ([n, a]) => {
      const tools = (
        window as unknown as { __tools: Record<string, { execute: (a: unknown) => Promise<any> }> }
      ).__tools;
      const tool = tools[n as string];
      if (!tool) return { missing: true };
      const r = await tool.execute(a);
      const text = r.content.find((c: { type: string }) => c.type === "text");
      return {
        ...JSON.parse(text.text),
        isError: r.isError === true,
        images: r.content.filter((c: { type: string }) => c.type === "image").length,
      };
    },
    [name, args] as const,
  );
}

const state = async (page: Page): Promise<Json> => (await call(page, "get_state")).data;
const ref = (page: number, position: number) => ({ page, position });

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  await standIn(page);
  await page.goto("./");
});

async function withPhotos(page: Page, count = 6): Promise<void> {
  await addPhotos(page, await makeImages(page, SIX.slice(0, count)));
  await settle(page);
}

test.describe("WebMCP agent tools", () => {
  test("every tool has a description and a schema, and the names are what the contract says", async ({
    page,
  }) => {
    const tools = await page.evaluate(() =>
      Object.values((window as unknown as { __tools: Record<string, any> }).__tools).map((t) => ({
        name: t.name,
        description: t.description,
        type: t.inputSchema?.type,
      })),
    );
    expect(tools.length).toBeGreaterThanOrEqual(30);
    for (const t of tools) {
      expect(t.description.length, t.name).toBeGreaterThan(10);
      expect(t.type, t.name).toBe("object");
    }
    for (const name of ["get_state", "get_photo_preview", "save", "undo_remove", "set_layout"]) {
      expect(tools.map((t) => t.name)).toContain(name);
    }
  });

  test("with no WebMCP in the browser the app loads without error", async ({ browser }) => {
    const plain = await browser.newPage();
    const errors: string[] = [];
    plain.on("pageerror", (e) => errors.push(e.message));
    await plain.goto("./");
    await expect(plain.locator("#preview")).toBeVisible();
    expect(await plain.evaluate(() => "modelContext" in navigator)).toBe(false);
    expect(errors).toEqual([]);
    await plain.close();
  });

  test("the state names photos by page and position", async ({ page }) => {
    await withPhotos(page);
    const s = await state(page);
    expect(s.pageCount).toBe(1);
    expect(s.pages[0].photos).toHaveLength(6);
    expect(s.pages[0].photos.map((p: Json) => p.position)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(s.layout.style).toBe("mosaic");
    expect(s.canUndoRemove).toBe(false);
  });

  test("layout, columns, border, corners and size change the preview as the controls do", async ({
    page,
  }) => {
    await withPhotos(page);
    expect((await call(page, "set_columns", { columns: 3 })).ok).toBe(true);
    await expect(page.locator("#columns")).toHaveValue("3");
    expect(
      (await call(page, "set_border", { percent: 40, color: "#336699", outer: false })).ok,
    ).toBe(true);
    await expect(page.locator("#border-width")).toHaveValue("40");
    expect((await call(page, "set_corners", { style: "rounded" })).ok).toBe(true);
    expect((await call(page, "set_output_size", { named: "a4" })).ok).toBe(true);
    expect((await call(page, "set_orientation", { orientation: "portrait" })).ok).toBe(true);
    const s = await state(page);
    expect(s.layout.columns).toBe(3);
    expect(s.style).toMatchObject({
      borderPercent: 40,
      borderColor: "#336699",
      corners: "rounded",
      outerBorder: false,
    });
    expect(s.size).toMatchObject({
      width: 2480,
      height: 3508,
      orientation: "portrait",
      named: "a4",
    });
    expect((await call(page, "set_layout", { style: "gallery" })).ok).toBe(true);
    expect((await state(page)).layout.style).toBe("gallery");
    // Columns are a mosaic setting, as in the interface.
    expect(await call(page, "set_columns", { columns: 2 })).toMatchObject({
      isError: true,
      code: "not-supported",
    });
  });

  test("an out-of-range or unknown value is refused with a reason and changes nothing", async ({
    page,
  }) => {
    await withPhotos(page);
    const before = await state(page);
    for (const [name, args, code] of [
      ["set_columns", { columns: 0 }, "out-of-range"],
      ["set_border", { percent: 101 }, "out-of-range"],
      ["set_border", { color: "not a colour" }, "bad-value"],
      ["set_page_count", { count: 21 }, "out-of-range"],
      ["set_instagram_post", { images: 1 }, "out-of-range"],
      ["set_layout", { style: "collage" }, "bad-value"],
      ["swap_photos", { a: ref(1, 1), b: ref(1, 99) }, "no-such-photo"],
      ["move_photos_to_page", { photos: [ref(1, 1)], page: 2 }, "no-such-page"],
    ] as const) {
      const r = await call(page, name, args);
      expect(r, name).toMatchObject({ isError: true, code });
      expect(r.message.length, name).toBeGreaterThan(5);
    }
    expect(await state(page)).toEqual(before);
  });

  test("swap, resize, select and crop work on the photos named", async ({ page }) => {
    await withPhotos(page);
    const names = (await state(page)).pages[0].photos.map((p: Json) => p.name);
    expect((await call(page, "swap_photos", { a: ref(1, 1), b: ref(1, 2) })).ok).toBe(true);
    const swapped = (await state(page)).pages[0].photos.map((p: Json) => p.name);
    expect(swapped.slice(0, 2)).toEqual([names[1], names[0]]);

    expect(
      (await call(page, "resize_photo", { photos: [ref(1, 3)], columns: 2, rows: 2 })).ok,
    ).toBe(true);
    const sized = (await state(page)).pages[0].photos.find((p: Json) => p.wider);
    expect(sized).toBeTruthy();

    expect((await call(page, "select_photos", { photos: [ref(1, 1), ref(1, 2)] })).ok).toBe(true);
    expect((await state(page)).selection).toHaveLength(2);
    // Cropping is for one photo, as the Crop button is off with several selected.
    expect(await call(page, "crop_photo", { photo: ref(1, 1), zoom: 2 })).toMatchObject({
      isError: true,
      code: "crop-needs-one-photo",
    });
    await call(page, "clear_selection");
    expect((await call(page, "crop_photo", { photo: ref(1, 1), zoom: 3 })).ok).toBe(true);
    await expect(page.locator("#crop-tools")).toBeVisible();
    await expect(page.locator("#preview")).toHaveAttribute("data-crop", /^3\.000,/);
    expect(
      (await call(page, "crop_photo", { photo: ref(1, 1), reset: true, finish: true })).ok,
    ).toBe(true);
    await expect(page.locator("#crop-tools")).toBeHidden();
  });

  test("removing waits for the person; confirming removes, cancelling keeps, undo restores", async ({
    page,
  }) => {
    await withPhotos(page);
    const waiting = await call(page, "remove_photos", { photos: [ref(1, 2)] });
    expect(waiting).toMatchObject({ ok: true, status: "waiting" });
    let s = await state(page);
    expect(s.pages[0].photos).toHaveLength(6);
    expect(s.ui.pendingQuestion).toBeTruthy();
    // While the question is open, other changes wait.
    expect(await call(page, "set_corners", { style: "none" })).toBeTruthy();
    expect(await call(page, "swap_photos", { a: ref(1, 1), b: ref(1, 3) })).toMatchObject({
      code: "busy",
    });

    await page.click("#confirm-ok");
    s = await state(page);
    expect(s.pages[0].photos).toHaveLength(5);
    expect(s.ui.confirmationOutcome).toBe("confirmed");
    expect(s.canUndoRemove).toBe(true);
    // The old position 6 no longer exists: refused, never a stale photo.
    expect(await call(page, "select_photos", { photos: [ref(1, 6)] })).toMatchObject({
      code: "no-such-photo",
    });

    expect((await call(page, "undo_remove")).ok).toBe(true);
    expect((await state(page)).pages[0].photos).toHaveLength(6);

    await call(page, "remove_all_photos");
    await page.click("#confirm-cancel");
    s = await state(page);
    expect(s.ui.confirmationOutcome).toBe("cancelled");
    expect(s.pages[0].photos).toHaveLength(6);
  });

  test("pages: add, share photos, move photos, move a page, remove a page (which asks)", async ({
    page,
  }) => {
    await withPhotos(page);
    expect((await call(page, "set_page_count", { count: 3 })).ok).toBe(true);
    let s = await state(page);
    expect(s.pageCount).toBe(3);
    expect(s.pages.map((p: Json) => p.photos.length)).toEqual([2, 2, 2]);
    expect((await call(page, "move_photos_to_page", { photos: [ref(1, 1)], page: 3 })).ok).toBe(
      true,
    );
    s = await state(page);
    expect(s.pages.map((p: Json) => p.photos.length)).toEqual([1, 2, 3]);
    expect((await call(page, "move_page", { page: 1, direction: "right" })).ok).toBe(true);
    expect(await call(page, "move_page", { page: 3, direction: "right" })).toMatchObject({
      code: "out-of-range",
    });
    expect((await call(page, "add_page")).ok).toBe(true);
    expect((await state(page)).pageCount).toBe(4);
    expect(await call(page, "remove_page", { page: 4 })).toMatchObject({ status: "waiting" });
    expect((await state(page)).pageCount).toBe(4);
    await page.click("#confirm-ok");
    expect((await state(page)).pageCount).toBe(3);
    // Shuffling asks once photos were arranged by hand (a swap counts).
    await call(page, "swap_photos", { a: ref(2, 1), b: ref(3, 1) });
    expect(await call(page, "shuffle_between_pages")).toMatchObject({ status: "waiting" });
    await page.click("#confirm-cancel");
  });

  test("a photo preview comes back as an image", async ({ page }) => {
    await withPhotos(page, 2);
    const r = await call(page, "get_photo_preview", ref(1, 1));
    expect(r.images).toBe(1);
    expect(await call(page, "get_photo_preview", ref(1, 9))).toMatchObject({
      code: "no-such-photo",
    });
  });

  test("an Instagram post, the tab, the language, zoom and dialogs", async ({ page }) => {
    await withPhotos(page);
    expect((await call(page, "set_instagram_post", { images: 4 })).ok).toBe(true);
    expect((await state(page)).size.instagramPostImages).toBe(4);
    expect((await call(page, "open_tab", { tab: "style" })).ok).toBe(true);
    expect((await state(page)).view.tab).toBe("style");
    expect((await call(page, "set_language", { code: "de" })).ok).toBe(true);
    expect((await state(page)).ui.language).toBe("de");
    expect((await call(page, "zoom_view", { factor: 2 })).ok).toBe(true);
    expect((await state(page)).view.fit).toBe(false);
    expect((await call(page, "zoom_view", { fit: true })).ok).toBe(true);
    expect((await call(page, "open_dialog", { name: "help" })).ok).toBe(true);
    expect((await state(page)).ui.dialog).toBe("help");
    expect((await call(page, "close_dialog")).ok).toBe(true);
    expect((await state(page)).ui.dialog).toBeNull();
    expect((await call(page, "set_tool", { tool: "select" })).ok).toBe(true);
    expect((await state(page)).view.tool).toBe("select");
  });

  test("save downloads the same files as the Save button, and reports them", async ({ page }) => {
    await withPhotos(page, 3);
    expect((await call(page, "set_save_format", { format: "jpeg", quality: 80 })).ok).toBe(true);
    const download = page.waitForEvent("download");
    expect((await call(page, "save")).ok).toBe(true);
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^collage-\d+\.jpg$/);
    await expect
      .poll(async () => (await state(page)).save.last?.file)
      .toBe(file.suggestedFilename());
    expect((await state(page)).save.saving).toBe(false);
    expect(await call(page, "cancel_save")).toMatchObject({ code: "not-supported" });
  });

  test("a book of posts saves every page's images in one zip", async ({ page }) => {
    await withPhotos(page, 4);
    await call(page, "set_instagram_post", { images: 3, side: 200 });
    await call(page, "set_page_count", { count: 2 });
    const download = page.waitForEvent("download");
    await call(page, "save");
    expect((await download).suggestedFilename()).toMatch(/^book-\d+\.zip$/);
    await expect.poll(async () => (await state(page)).save.last?.images).toBe(6);
  });

  test("the person's own controls keep working alongside the tools", async ({ page }) => {
    await withPhotos(page);
    await page.fill("#columns", "2");
    await expect.poll(async () => (await state(page)).layout.columns).toBe(2);
    await call(page, "set_columns", { columns: 4 });
    await expect(page.locator("#columns")).toHaveValue("4");
  });
});
