// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import { readFile } from "node:fs/promises";
import { type Download, expect, type Page } from "@playwright/test";

export interface Fixture {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export const COLORS = {
  red: [220, 30, 30],
  green: [30, 180, 60],
  blue: [30, 60, 220],
  yellow: [230, 210, 30],
  magenta: [200, 30, 200],
  cyan: [30, 200, 210],
} as const;
export type ColorName = keyof typeof COLORS;

/** Make solid-colour images in the browser (the page's own canvas), so tests need no binary files. */
export async function makeImages(
  page: Page,
  specs: { name: string; w: number; h: number; color: ColorName; type?: "png" | "jpeg" }[],
): Promise<Fixture[]> {
  const out = await page.evaluate(
    async ({ specs, COLORS }) => {
      const result: { name: string; mimeType: string; base64: string }[] = [];
      for (const s of specs) {
        const c = new OffscreenCanvas(s.w, s.h);
        const ctx = c.getContext("2d") as OffscreenCanvasRenderingContext2D;
        const [r, g, b] = COLORS[s.color];
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, s.w, s.h);
        const mimeType = s.type === "jpeg" ? "image/jpeg" : "image/png";
        const blob = await c.convertToBlob({ type: mimeType, quality: 0.95 });
        const bytes = new Uint8Array(await blob.arrayBuffer());
        let bin = "";
        for (const byte of bytes) bin += String.fromCharCode(byte);
        result.push({ name: s.name, mimeType, base64: btoa(bin) });
      }
      return result;
    },
    { specs, COLORS },
  );
  return out.map((o) => ({
    name: o.name,
    mimeType: o.mimeType,
    buffer: Buffer.from(o.base64, "base64"),
  }));
}

/** A JPEG whose left half is red and right half is blue, tagged with an EXIF orientation. */
export async function makeOrientedJpeg(
  page: Page,
  name: string,
  orientation: number,
): Promise<Fixture> {
  const [base] = await page
    .evaluate(async () => {
      const c = new OffscreenCanvas(200, 100);
      const ctx = c.getContext("2d") as OffscreenCanvasRenderingContext2D;
      ctx.fillStyle = "rgb(220,30,30)";
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = "rgb(30,60,220)";
      ctx.fillRect(100, 0, 100, 100);
      const blob = await c.convertToBlob({ type: "image/jpeg", quality: 0.95 });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let bin = "";
      for (const byte of bytes) bin += String.fromCharCode(byte);
      return [btoa(bin)];
    })
    .then((r) => r);
  const jpeg = Buffer.from(base as string, "base64");
  // Minimal big-endian TIFF with one IFD entry: Orientation (0x0112), SHORT, 1 value.
  const tiff = Buffer.from([
    0x4d,
    0x4d,
    0x00,
    0x2a,
    0x00,
    0x00,
    0x00,
    0x08,
    0x00,
    0x01,
    0x01,
    0x12,
    0x00,
    0x03,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    orientation,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
  const exif = Buffer.concat([Buffer.from("Exif\0\0", "latin1"), tiff]);
  const segment = Buffer.concat([
    Buffer.from([0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 0xff]),
    exif,
  ]);
  return {
    name,
    mimeType: "image/jpeg",
    buffer: Buffer.concat([jpeg.subarray(0, 2), segment, jpeg.subarray(2)]),
  };
}

/** Add files and wait until `accepted` of them (default: all) appear in the photo list. */
export async function addPhotos(
  page: Page,
  files: (Fixture | string)[],
  accepted: number = files.length,
): Promise<void> {
  const before = await page.locator("#photo-list li").count();
  await page.setInputFiles("#file-input", files as Parameters<Page["setInputFiles"]>[1] as never);
  await expect(page.locator("#photo-list li")).toHaveCount(before + accepted, {
    timeout: 5000 + files.length * 1500,
  });
}

export async function setSize(page: Page, width: number, height: number): Promise<void> {
  await page.fill("#width", String(width));
  await page.fill("#height", String(height));
  await page.locator("#height").press("Tab");
}

export async function setSeed(page: Page, seed: number): Promise<void> {
  await page.fill("#seed", String(seed));
  await page.locator("#seed").press("Tab");
}

export async function saveAndRead(page: Page): Promise<Buffer> {
  const downloadPromise = page.waitForEvent("download");
  await page.click("#save");
  const download: Download = await downloadPromise;
  const path = await download.path();
  return readFile(path);
}

export interface Analysis {
  width: number;
  height: number;
  /** RGB at each requested fractional point. */
  colors: [number, number, number][];
}

/** Decode an image in the page and sample colours at fractional positions. */
export async function analyse(
  page: Page,
  image: Buffer,
  points: [number, number][] = [],
): Promise<Analysis> {
  return page.evaluate(
    async ({ base64, points }) => {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const bmp = await createImageBitmap(new Blob([bytes]));
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      const ctx = c.getContext("2d") as OffscreenCanvasRenderingContext2D;
      ctx.drawImage(bmp, 0, 0);
      const colors = points.map(([fx, fy]) => {
        const d = ctx.getImageData(
          Math.floor(fx * (bmp.width - 1)),
          Math.floor(fy * (bmp.height - 1)),
          1,
          1,
        ).data;
        return [d[0], d[1], d[2]] as [number, number, number];
      });
      return { width: bmp.width, height: bmp.height, colors };
    },
    { base64: image.toString("base64"), points },
  );
}

/** Mean absolute RGB difference (0..255) between the on-screen preview and an exported image. */
export async function previewDifference(page: Page, image: Buffer): Promise<number> {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bytes]));
    const preview = document.getElementById("preview") as HTMLCanvasElement;
    const a = preview.getContext("2d") as CanvasRenderingContext2D;
    const b = new OffscreenCanvas(preview.width, preview.height);
    const bctx = b.getContext("2d") as OffscreenCanvasRenderingContext2D;
    bctx.imageSmoothingQuality = "high";
    bctx.drawImage(bmp, 0, 0, preview.width, preview.height);
    const da = a.getImageData(0, 0, preview.width, preview.height).data;
    const db = bctx.getImageData(0, 0, preview.width, preview.height).data;
    let sum = 0;
    for (let i = 0; i < da.length; i += 4) {
      sum += Math.abs((da[i] as number) - (db[i] as number));
      sum += Math.abs((da[i + 1] as number) - (db[i + 1] as number));
      sum += Math.abs((da[i + 2] as number) - (db[i + 2] as number));
    }
    return sum / ((da.length / 4) * 3);
  }, image.toString("base64"));
}

/** Preview colour at a fractional point of the canvas. */
export async function previewColor(
  page: Page,
  fx: number,
  fy: number,
): Promise<[number, number, number]> {
  return page.evaluate(
    ([fx, fy]) => {
      const c = document.getElementById("preview") as HTMLCanvasElement;
      const d = (c.getContext("2d") as CanvasRenderingContext2D).getImageData(
        Math.floor((fx as number) * (c.width - 1)),
        Math.floor((fy as number) * (c.height - 1)),
        1,
        1,
      ).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    },
    [fx, fy],
  );
}

export function near(
  actual: readonly number[],
  expected: readonly number[],
  tolerance = 40,
): boolean {
  return actual.every((v, i) => Math.abs(v - (expected[i] as number)) <= tolerance);
}

export const SIX = [
  { name: "red.png", w: 600, h: 400, color: "red" as const },
  { name: "green.png", w: 400, h: 600, color: "green" as const },
  { name: "blue.png", w: 500, h: 500, color: "blue" as const },
  { name: "yellow.png", w: 800, h: 300, color: "yellow" as const },
  { name: "magenta.png", w: 300, h: 700, color: "magenta" as const },
  { name: "cyan.png", w: 640, h: 480, color: "cyan" as const },
];
