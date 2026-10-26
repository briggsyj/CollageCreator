// SPDX-License-Identifier: GPL-2.0-or-later

import { readFile } from "node:fs/promises";
import { type Download, expect, type Locator, type Page } from "@playwright/test";

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

/** Open the "Technical configuration" section, as a user would to reach the seed. */
export async function openTechnical(page: Page): Promise<void> {
  const open = await page.locator("#technical").evaluate((el) => (el as HTMLDetailsElement).open);
  if (!open) await page.locator("#technical summary").click();
}

export async function setSeed(page: Page, seed: number): Promise<void> {
  await openTechnical(page);
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

/** Where the poster is inside the preview canvas, in CSS pixels from the canvas's top-left. */
export async function posterRect(
  page: Page,
): Promise<{ x: number; y: number; w: number; h: number }> {
  return page.evaluate(() => {
    const c = document.getElementById("preview") as HTMLCanvasElement;
    const [x, y, w, h] = (c.dataset.poster ?? "0,0,1,1").split(",").map(Number);
    return { x: x as number, y: y as number, w: w as number, h: h as number };
  });
}

/** A point on the poster (fractions 0..1) as page coordinates, for mouse clicks. */
export async function posterPoint(
  page: Page,
  fx: number,
  fy: number,
): Promise<{ x: number; y: number }> {
  const box = await page.locator("#preview").boundingBox();
  const poster = await posterRect(page);
  if (!box) throw new Error("preview is not visible");
  return { x: box.x + poster.x + fx * poster.w, y: box.y + poster.y + fy * poster.h };
}

/** Mean absolute RGB difference (0..255) between the poster in the preview and an exported image. */
export async function previewDifference(page: Page, image: Buffer): Promise<number> {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bytes]));
    const preview = document.getElementById("preview") as HTMLCanvasElement;
    const scale = preview.width / preview.clientWidth;
    const [px, py, pw, ph] = (preview.dataset.poster ?? "0,0,1,1").split(",").map(Number);
    // Compare the inside of the poster, leaving out a thin strip at its edge where the shadow starts.
    const inset = 2;
    const x = Math.round((px as number) * scale) + inset;
    const y = Math.round((py as number) * scale) + inset;
    const w = Math.round((pw as number) * scale) - 2 * inset;
    const h = Math.round((ph as number) * scale) - 2 * inset;
    const b = new OffscreenCanvas(
      Math.round((pw as number) * scale),
      Math.round((ph as number) * scale),
    );
    const bctx = b.getContext("2d") as OffscreenCanvasRenderingContext2D;
    bctx.imageSmoothingQuality = "high";
    bctx.drawImage(bmp, 0, 0, b.width, b.height);
    const a = preview.getContext("2d") as CanvasRenderingContext2D;
    const da = a.getImageData(x, y, w, h).data;
    const db = bctx.getImageData(inset, inset, w, h).data;
    let sum = 0;
    for (let i = 0; i < da.length; i += 4) {
      sum += Math.abs((da[i] as number) - (db[i] as number));
      sum += Math.abs((da[i + 1] as number) - (db[i + 1] as number));
      sum += Math.abs((da[i + 2] as number) - (db[i + 2] as number));
    }
    return sum / ((da.length / 4) * 3);
  }, image.toString("base64"));
}

/**
 * Waits until the preview has stopped changing, so a read right after a click sees the redraw
 * that click caused (slow runners draw a frame or two later).
 */
export async function settle(page: Page): Promise<void> {
  let last = "";
  await expect
    .poll(async () => {
      const now = await page.evaluate(
        () =>
          new Promise<string>((done) =>
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                const c = document.getElementById("preview") as HTMLCanvasElement;
                const px = (c.getContext("2d") as CanvasRenderingContext2D).getImageData(
                  0,
                  0,
                  c.width,
                  c.height,
                ).data;
                // A canvas that has not been drawn yet is not settled, however still it is.
                done(px.some((v, i) => i % 4 === 3 && v > 0) ? c.toDataURL() : "");
              }),
            ),
          ),
      );
      const same = now !== "" && now === last;
      last = now;
      return same;
    })
    .toBe(true);
}

/** Preview colour at a fractional point of the poster. */
export async function previewColor(
  page: Page,
  fx: number,
  fy: number,
): Promise<[number, number, number]> {
  return page.evaluate(
    ([fx, fy]) => {
      const c = document.getElementById("preview") as HTMLCanvasElement;
      const scale = c.width / c.clientWidth;
      const [px, py, pw, ph] = (c.dataset.poster ?? "0,0,1,1").split(",").map(Number);
      const x = Math.floor(((px as number) + (fx as number) * ((pw as number) - 1)) * scale);
      const y = Math.floor(((py as number) + (fy as number) * ((ph as number) - 1)) * scale);
      const d = (c.getContext("2d") as CanvasRenderingContext2D).getImageData(x, y, 1, 1).data;
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

/** Locator methods that act on an element and so need it to be visible. */
const ACTIONS = new Set([
  "check",
  "click",
  "dblclick",
  "fill",
  "focus",
  "hover",
  "press",
  "selectOption",
  "setInputFiles",
  "uncheck",
]);

/** Show the step (tab) that holds a control, as a person would before using it. */
async function reveal(page: Page, selector: string): Promise<void> {
  // A tab pressed before the page's script has run does nothing, and WebKit can be that early.
  await page.waitForSelector('html[data-app-ready="true"]', { state: "attached" });
  const panel = await page
    .locator(selector)
    .first()
    .evaluate(
      (el) =>
        el.closest('[role="tabpanel"]')?.id ?? (el.closest(".save-opts") ? "panel-style" : null),
      undefined,
      { timeout: 2000 },
    )
    .catch(() => null);
  if (!panel) return;
  const hidden = await page.locator(`#${panel}`).evaluate((el) => (el as HTMLElement).hidden);
  if (hidden) await page.locator(`#tab-${panel.replace("panel-", "")}`).click();
}

type Wrapped<T> = T;

function isLocator(value: unknown): value is Locator {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Locator).fill === "function" &&
    typeof (value as Locator).locator === "function"
  );
}

function wrapLocator<T extends Locator>(page: Page, locator: T, selector: string): Wrapped<T> {
  return new Proxy(locator, {
    get(target, prop) {
      const value = Reflect.get(target, prop, target);
      if (typeof value !== "function") return value;
      if (typeof prop === "string" && ACTIONS.has(prop)) {
        return async (...args: unknown[]) => {
          await reveal(page, selector);
          return value.apply(target, args);
        };
      }
      return (...args: unknown[]) => {
        const out = value.apply(target, args);
        return isLocator(out) ? wrapLocator(page, out, selector) : out;
      };
    },
  });
}

/**
 * The controls live in three steps and only one is shown at a time. Make every call that
 * acts on a control (by selector) first show the step it is in, so tests read as they
 * always did: "fill the border width".
 */
export function autoReveal(page: Page): void {
  // The glass look is blur on blur; WebKit's software rendering on CI cannot paint that fast
  // enough for Playwright's "stable" checks (a few frames in a row). Turn the blur off for tests.
  // A constructable stylesheet is not blocked by the page's `style-src 'self'`.
  void page.addInitScript(() => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(
      "*{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}.backdrop{filter:none!important}",
    );
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  });
  const original = page.locator.bind(page);
  page.locator = ((selector: string, options?: Parameters<Page["locator"]>[1]) =>
    wrapLocator(page, original(selector, options), selector)) as Page["locator"];
  for (const method of ["fill", "selectOption", "check", "uncheck", "click", "press"] as const) {
    const base = (page[method] as (...args: unknown[]) => Promise<unknown>).bind(page);
    (page as unknown as Record<string, unknown>)[method] = async (
      selector: string,
      ...rest: unknown[]
    ) => {
      await reveal(page, selector);
      return base(selector, ...rest);
    };
  }
}

/** Switch the preview to Swap mode, where clicking two photos swaps them. */
export async function swapMode(page: Page): Promise<void> {
  await page.click("#mode-swap");
}

/** Take the photo in the list at `index` out: select it, then press Remove selected photo. */
export async function removeFromList(page: Page, index: number): Promise<void> {
  await page.locator("#photo-list li button").nth(index).click();
  await page.click("#remove-selected");
}
/** The files in a ZIP archive, in the order they are listed (stored or deflated entries are read as stored). */
export function readZip(zip: Buffer): { name: string; data: Buffer }[] {
  const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0) throw new Error("not a zip file");
  const count = zip.readUInt16LE(end + 10);
  let at = zip.readUInt32LE(end + 16);
  const files: { name: string; data: Buffer }[] = [];
  for (let i = 0; i < count; i++) {
    if (zip.readUInt32LE(at) !== 0x02014b50) throw new Error("bad central directory");
    const method = zip.readUInt16LE(at + 10);
    if (method !== 0) throw new Error("only stored entries are read here");
    const size = zip.readUInt32LE(at + 24);
    const nameLength = zip.readUInt16LE(at + 28);
    const extraLength = zip.readUInt16LE(at + 30);
    const commentLength = zip.readUInt16LE(at + 32);
    const local = zip.readUInt32LE(at + 42);
    const name = zip.subarray(at + 46, at + 46 + nameLength).toString("utf8");
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    files.push({ name, data: zip.subarray(start, start + size) });
    at += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

/** Put images side by side, in order, into one PNG (to compare with the preview). */
export async function stitch(page: Page, images: Buffer[]): Promise<Buffer> {
  const url = await page.evaluate(
    async (all) => {
      const bitmaps = await Promise.all(
        all.map((base64) =>
          createImageBitmap(new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))])),
        ),
      );
      const canvas = new OffscreenCanvas(
        bitmaps.reduce((sum, b) => sum + b.width, 0),
        Math.max(...bitmaps.map((b) => b.height)),
      );
      const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
      let x = 0;
      for (const b of bitmaps) {
        ctx.drawImage(b, x, 0);
        x += b.width;
      }
      const blob = await canvas.convertToBlob({ type: "image/png" });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary);
    },
    images.map((b) => b.toString("base64")),
  );
  return Buffer.from(url, "base64");
}

/** Width and height from a PNG's header. */
export function pngSize(png: Buffer): { width: number; height: number } {
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}
