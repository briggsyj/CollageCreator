// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Every control in the interface has a matching tool for an assistant, or a recorded reason why
// not (src/agent/controls.json). A new control with no entry fails here.

import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { addPhotos, autoReveal, clickPhoto, makeImages, SIX, settle } from "./helpers";

interface Entry {
  tool?: string;
  reason?: string;
}

const controls: Record<string, Entry> = JSON.parse(
  readFileSync(new URL("../src/agent/controls.json", import.meta.url), "utf8"),
);

/** Every visible button, input, select and tab, named by its id, else its title or label. */
async function names(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out = new Set<string>();
    const nodes = document.querySelectorAll(
      "button, input, select, textarea, [role=tab], [role=button], summary",
    );
    for (const el of nodes) {
      const html = el as HTMLElement;
      const hidden = html.closest("[hidden], [inert]") || html.closest("dialog:not([open])");
      if (hidden) continue;
      if (html.closest(".photo-list")) {
        out.add("photo-row");
        continue;
      }
      if (html.dataset.color) {
        out.add("swatch");
        continue;
      }
      if (html.dataset.choice) {
        out.add(`choice:${html.dataset.choice}`);
        continue;
      }
      const key = html.id || html.getAttribute("aria-label") || html.getAttribute("title") || "";
      if (key) out.add(key.replace(/\d+/g, "N"));
    }
    return [...out];
  });
}

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  await page.goto("./");
});

test("every control has a tool, or a reason it has none", async ({ page }) => {
  const seen = new Set<string>();
  const take = async () => {
    for (const n of await names(page)) seen.add(n);
  };
  await take();
  await addPhotos(page, await makeImages(page, SIX));
  await settle(page);
  for (const tab of ["photos", "poster", "style"]) {
    await page.click(`#tab-${tab}`);
    await take();
  }
  // A selected photo shows its own controls, and cropping more.
  await page.click("#tab-photos");
  await clickPhoto(page, 0.5, 0.5);
  await take();
  await page.click("#crop-toggle");
  await take();
  await page.click("#crop-toggle");
  // Several pages show the page controls and the pills.
  await page.click("#tab-poster");
  await page.fill("#pages", "3");
  await settle(page);
  await page.click("#tab-photos");
  await take();
  await page.click("#tab-poster");
  await take();
  // The Instagram post shows its own size controls.
  await page.click('[data-choice="post"]');
  await take();
  // Removing asks first; afterwards Undo remove appears.
  await page.click("#tab-photos");
  await clickPhoto(page, 0.2, 0.2);
  await page.click("#remove-selected");
  await take();
  await page.click("#confirm-ok");
  await take();
  // Dialogs.
  await page.click("#help-open");
  await take();
  await page.click("#help-close");
  await page.click("#about-open");
  await take();
  await page.click("#about-close");
  const missing = [...seen].filter((n) => !(n in controls)).sort();
  expect(missing, "controls with no entry in src/agent/controls.json").toEqual([]);
});

test("every tool named in controls.json is one the page registers", async ({ page }) => {
  await page.addInitScript(() => {
    const tools: Record<string, unknown> = {};
    (window as unknown as { __tools: unknown }).__tools = tools;
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: { registerTool: (t: { name: string }) => (tools[t.name] = t) },
    });
  });
  await page.goto("./");
  const registered = await page.evaluate(() =>
    Object.keys((window as unknown as { __tools: Record<string, unknown> }).__tools),
  );
  for (const [control, entry] of Object.entries(controls).filter(([k]) => !k.startsWith("//"))) {
    if (entry.tool) expect(registered, control).toContain(entry.tool);
    else expect(entry.reason, `${control} needs a reason`).toBeTruthy();
  }
});
