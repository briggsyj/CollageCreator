// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs
// biome-ignore-all lint/suspicious/noExplicitAny: tool results are untyped JSON read by the tests

// Random sequences of edits (through the WebMCP tools, plus reloads): after every one, each
// photo is shown exactly once. Seeds are fixed, so a failure can be replayed.

import { expect, type Page, test } from "@playwright/test";
import { addPhotos, autoReveal, makeImages, SIX, savedWork, settle } from "./helpers";

async function standIn(page: Page) {
  await page.addInitScript(() => {
    const tools: Record<string, { execute: (a: unknown) => Promise<unknown> }> = {};
    (window as unknown as { __tools: typeof tools }).__tools = tools;
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool(t: { name: string; execute: (a: unknown) => Promise<unknown> }) {
          tools[t.name] = t;
        },
      },
    });
  });
}
async function call(page: Page, name: string, args: object = {}) {
  return page.evaluate(
    async ([n, a]) => {
      const t = (window as any).__tools[n as string];
      const r = await t.execute(a);
      return JSON.parse(r.content.find((c: any) => c.type === "text").text);
    },
    [name, args] as const,
  );
}
async function check(page: Page, step: string) {
  await settle(page);
  const ids = ((await page.getAttribute("#preview", "data-photos")) ?? "")
    .split(",")
    .filter(Boolean);
  const s = (await call(page, "get_state")).data;
  const count = s.pages.reduce((n: number, p: any) => n + p.photos.length, 0);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  expect({ step, dup, shown: ids.length, count }).toEqual({ step, dup: [], shown: count, count });
}
for (const seed of [7, 19, 23]) {
  test(`each photo shows once through random edits (seed ${seed})`, async ({ page }) => {
    test.setTimeout(180_000);
    autoReveal(page);
    await standIn(page);
    await page.goto("./");
    const imgs = await makeImages(page, [
      ...SIX,
      ...SIX.map((x) => ({ ...x, name: `b${x.name}`, w: x.h, h: x.w })),
    ]);
    await addPhotos(page, imgs.slice(0, 7));
    await settle(page);
    let r = seed * 9301 + 49297;
    const rnd = (n: number) => {
      r = (r * 9301 + 49297) % 233280;
      return Math.floor((r / 233280) * n);
    };
    const log: string[] = [];
    for (let i = 0; i < 80; i++) {
      const s = (await call(page, "get_state")).data;
      const pages = s.pageCount;
      const on = (p: number) => s.pages[p]?.photos.length ?? 0;
      const ref = () => {
        let p = rnd(pages);
        for (let k = 0; k < pages && on(p) === 0; k++) p = (p + 1) % pages;
        return on(p) ? { page: p + 1, position: 1 + rnd(on(p)) } : null;
      };
      const op = rnd(19);
      let desc = "";
      if (op === 0) {
        const a = ref(),
          b = ref();
        if (a && b) {
          desc = `swap ${JSON.stringify(a)} ${JSON.stringify(b)}`;
          await call(page, "swap_photos", { a, b });
        }
      } else if (op === 1) {
        const a = ref();
        if (a) {
          desc = `wider ${JSON.stringify(a)}`;
          await call(page, "resize_photo", { photos: [a], columns: 2 });
        }
      } else if (op === 2) {
        const a = ref();
        if (a) {
          desc = `taller ${JSON.stringify(a)}`;
          await call(page, "resize_photo", { photos: [a], rows: 1 + rnd(3) });
        }
      } else if (op === 3) {
        desc = "add page";
        await call(page, "add_page");
      } else if (op === 4) {
        desc = "page count";
        await call(page, "set_page_count", { count: 1 + rnd(4) });
      } else if (op === 5 && pages > 1) {
        const a = ref();
        if (a) {
          const to = 1 + rnd(pages);
          desc = `move ${JSON.stringify(a)} -> ${to}`;
          await call(page, "move_photos_to_page", { photos: [a], page: to });
        }
      } else if (op === 6) {
        desc = "layout";
        await call(page, "set_layout", { style: rnd(2) ? "gallery" : "mosaic" });
      } else if (op === 7) {
        desc = "columns";
        await call(page, "set_columns", { columns: rnd(3) ? 1 + rnd(5) : "auto" });
      } else if (op === 8) {
        const a = ref();
        if (a) {
          desc = `remove ${JSON.stringify(a)}`;
          await call(page, "remove_photos", { photos: [a] });
          await page.click("#confirm-ok");
        }
      } else if (op === 9) {
        desc = "undo";
        await call(page, "undo_remove");
      } else if (op === 10) {
        desc = "add photos";
        const k = rnd(imgs.length);
        await addPhotos(page, imgs.slice(k, k + 2));
      } else if (op === 11) {
        desc = "shuffle";
        await call(page, "shuffle_layout");
        if (await page.locator("#confirm-ok").isVisible()) await page.click("#confirm-ok");
      } else if (op === 12 && pages > 1) {
        desc = "shuffle between";
        await call(page, "shuffle_between_pages");
        if (await page.locator("#confirm-ok").isVisible()) await page.click("#confirm-ok");
      } else if (op === 13) {
        desc = "size";
        await call(page, "set_output_size", { named: ["screen", "square", "a4", "small"][rnd(4)] });
      } else if (op === 14) {
        desc = "orient";
        await call(page, "set_orientation", { orientation: rnd(2) ? "portrait" : "landscape" });
      } else if (op === 15 && pages > 1) {
        desc = "move page";
        await call(page, "move_page", {
          page: 1 + rnd(pages),
          direction: rnd(2) ? "left" : "right",
        });
      } else if (op === 16) {
        desc = "reload";
        await savedWork(page);
        await page.reload();
        await page.waitForFunction(() => !document.querySelector(".restoring-stage"));
      } else if (op === 17) {
        desc = "remove all";
        await call(page, "remove_all_photos");
        await page.click("#confirm-ok");
        await call(page, "undo_remove");
      } else if (op === 18) {
        const a = ref(),
          b = ref();
        if (a && b) {
          desc = `select-swap ${JSON.stringify(a)} ${JSON.stringify(b)}`;
          await call(page, "set_tool", { tool: "swap" });
          await call(page, "swap_photos", { a, b });
          await call(page, "set_tool", { tool: "pan" });
        }
      }
      if (!desc) continue;
      log.push(desc);
      try {
        await check(page, desc);
      } catch (e) {
        console.log(log.join("\n"));
        throw e;
      }
    }
  });
}
