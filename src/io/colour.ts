// SPDX-License-Identifier: GPL-2.0-or-later

/**
 * The average colour of RGBA pixel data, as a CSS `rgb()` string. Fully transparent pixels
 * are ignored, and a picture with none is a neutral grey.
 */
export function averageColour(data: ArrayLike<number>): string {
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;
  for (let i = 0; i + 3 < data.length; i += 4) {
    const a = (data[i + 3] as number) / 255;
    r += (data[i] as number) * a;
    g += (data[i + 1] as number) * a;
    b += (data[i + 2] as number) * a;
    weight += a;
  }
  if (weight === 0) return "rgb(200, 200, 200)";
  return `rgb(${Math.round(r / weight)}, ${Math.round(g / weight)}, ${Math.round(b / weight)})`;
}

const SAMPLE = 8;

/**
 * Sample a photo's average colour from its thumbnail. The thumbnail is first shrunk to
 * 8 x 8 (one step to 1 x 1 would only look at a few of its pixels), then averaged.
 * Returns a neutral grey where canvas is unavailable.
 */
export function sampleColour(bitmap: ImageBitmap): string {
  try {
    const canvas = new OffscreenCanvas(SAMPLE, SAMPLE);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return averageColour([]);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, SAMPLE, SAMPLE);
    return averageColour(ctx.getImageData(0, 0, SAMPLE, SAMPLE).data);
  } catch {
    return averageColour([]);
  }
}
