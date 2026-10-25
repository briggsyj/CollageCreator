// SPDX-License-Identifier: GPL-2.0-or-later

// Spec 003 gate: exporting 100 large photos completes without crashing the tab.
// Run with BENCH_WRITE=1 to record timings in benchmarks/export-<browser>.json.

import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { addPhotos, analyse, type Fixture, saveAndRead, setSize } from "./helpers";

test("exports 100 twelve-megapixel photos", async ({ page, browserName }) => {
  test.setTimeout(300_000);
  await page.goto("./");

  // Five distinct 4000 x 3000 JPEGs with some detail, each used 20 times under different names.
  const base = await page.evaluate(async () => {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) {
      const c = new OffscreenCanvas(4000, 3000);
      const ctx = c.getContext("2d") as OffscreenCanvasRenderingContext2D;
      for (let n = 0; n < 400; n++) {
        ctx.fillStyle = `hsl(${(i * 70 + n * 7) % 360} 70% ${30 + (n % 40)}%)`;
        ctx.fillRect((n * 97) % 4000, (n * 53) % 3000, 600, 450);
      }
      const blob = await c.convertToBlob({ type: "image/jpeg", quality: 0.8 });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let bin = "";
      for (const b of bytes) bin += String.fromCharCode(b);
      out.push(btoa(bin));
    }
    return out;
  });
  const files: Fixture[] = Array.from({ length: 100 }, (_, i) => ({
    name: `big-${i}.jpg`,
    mimeType: "image/jpeg",
    buffer: Buffer.from(base[i % 5] as string, "base64"),
  }));

  const importStart = Date.now();
  await addPhotos(page, files);
  const importMs = Date.now() - importStart;

  await setSize(page, 4961, 3508); // A3 landscape at 300 DPI
  const layoutMs = await page.evaluate(() => {
    const start = performance.now();
    (document.getElementById("regenerate") as HTMLButtonElement).click();
    return performance.now() - start;
  });

  const exportStart = Date.now();
  const png = await saveAndRead(page);
  const exportMs = Date.now() - exportStart;
  const result = await analyse(page, png);
  expect([result.width, result.height]).toEqual([4961, 3508]);

  if (process.env.BENCH_WRITE) {
    await mkdir("benchmarks", { recursive: true });
    await writeFile(
      `benchmarks/export-${browserName}.json`,
      `${JSON.stringify(
        {
          date: new Date().toISOString().slice(0, 10),
          photos: 100,
          photoSize: "4000x3000",
          poster: "4961x3508 PNG",
          importMs,
          regenerateClickMs: Math.round(layoutMs),
          exportMs,
        },
        null,
        2,
      )}\n`,
    );
  }
  expect(exportMs).toBeLessThan(240_000);
});
