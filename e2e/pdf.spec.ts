// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Saving as PDF: one page, a book, one page of a book, the choice hidden for an Instagram post.

import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";
import { addPhotos, autoReveal, makeImages, SIX, savedWork, setSize, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  autoReveal(page);
  await page.goto("./");
});

/** Save with the Save button and return the downloaded file's name and text (PDF is plain text). */
async function savePdf(page: Page, click = "#save"): Promise<{ name: string; text: string }> {
  const download = page.waitForEvent("download");
  await page.click(click);
  const file = await download;
  const path = await file.path();
  return { name: file.suggestedFilename(), text: (await readFile(path)).toString("latin1") };
}

const pageCount = (text: string) =>
  Number(/\/Type \/Pages \/Kids \[[^\]]*\] \/Count (\d+)/.exec(text)?.[1]);
const boxes = (text: string) =>
  [...text.matchAll(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);

test.describe("Saving as PDF", () => {
  test("a collage saves as one PDF page that is the paper size", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.click("#format-pdf");
    await expect(page.locator("#save-summary")).toContainText("PDF");
    await page.click('[data-choice="a4"]');
    const { name, text } = await savePdf(page);
    expect(name).toMatch(/^collage-\d+\.pdf$/);
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(pageCount(text)).toBe(1);
    // A4 landscape at 300 pixels per inch is 297 x 210 mm (841.92 x 595.2 points).
    expect(boxes(text)).toEqual([[841.92, 595.2]]);
    expect(text).toContain("/Filter /DCTDecode");
  });

  test("a size with no paper size is made at 300 pixels per inch", async ({ page }) => {
    await setSize(page, 1200, 900);
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.click("#format-pdf");
    const { text } = await savePdf(page);
    expect(boxes(text)).toEqual([[288, 216]]);
  });

  test("the quality control changes the size of the file", async ({ page }) => {
    await setSize(page, 800, 600);
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.click("#format-pdf");
    await expect(page.locator("#quality-field")).toBeVisible();
    await page.locator("#quality").fill("100");
    const high = (await savePdf(page)).text.length;
    await page.locator("#quality").fill("10");
    const low = (await savePdf(page)).text.length;
    expect(low).toBeLessThan(high);
  });

  test("the format is kept over a refresh", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.click("#format-pdf");
    await savedWork(page);
    await page.reload();
    await expect(page.locator("#format-pdf")).toHaveAttribute("aria-pressed", "true");
  });

  test("a book saves as one PDF with a page for each, and one page saves on its own", async ({
    page,
  }) => {
    await setSize(page, 900, 600);
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.fill("#pages", "3");
    await settle(page);
    await page.click("#format-pdf");
    await expect(page.locator("#save-summary")).toContainText("PDF of 3 pages");
    const book = await savePdf(page);
    expect(book.name).toMatch(/^book-\d+\.pdf$/);
    expect(pageCount(book.text)).toBe(3);
    expect(boxes(book.text)).toHaveLength(3);

    const one = await savePdf(page, ".page-save >> nth=1");
    expect(one.name).toMatch(/^book-\d+_page-2\.pdf$/);
    expect(pageCount(one.text)).toBe(1);
  });

  test("an empty page is skipped with a notice", async ({ page }) => {
    await setSize(page, 900, 600);
    await addPhotos(page, await makeImages(page, SIX.slice(0, 2)));
    await settle(page);
    await page.click("#tab-poster");
    await page.fill("#pages", "2");
    await settle(page);
    await page.click("#tab-photos");
    await page.click("#add-page-tile");
    await settle(page);
    await page.click("#format-pdf");
    const book = await savePdf(page);
    expect(pageCount(book.text)).toBe(2);
    await expect(page.locator("#messages")).toContainText("Skipped empty page");
  });

  test("an Instagram post is not offered as PDF", async ({ page }) => {
    await addPhotos(page, await makeImages(page, SIX));
    await settle(page);
    await page.click("#format-pdf");
    await page.click('[data-choice="post"]');
    await expect(page.locator("#format-pdf")).toBeHidden();
    await expect(page.locator("#format-png")).toHaveAttribute("aria-pressed", "true");
    await page.click('[data-choice="a4"]');
    await expect(page.locator("#format-pdf")).toBeVisible();
  });

  test("saving a PDF sends nothing anywhere", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => {
      if (!r.url().startsWith("data:") && !r.url().startsWith("blob:")) requests.push(r.url());
    });
    await addPhotos(page, await makeImages(page, SIX.slice(0, 3)));
    await settle(page);
    await page.click("#format-pdf");
    const before = requests.length;
    await savePdf(page);
    expect(requests.length).toBe(before);
  });
});
