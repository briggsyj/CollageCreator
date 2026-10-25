// SPDX-License-Identifier: GPL-2.0-or-later

import type { Layout, Photo, PosterSettings } from "../core/types";
import {
  borderPixels,
  cellPixelRects,
  coverSize,
  drawBackground,
  drawBorders,
  drawPhoto,
  type Frame,
} from "./draw";
import type { WorkerPool } from "./pool";

export interface ExportInput {
  layout: Layout;
  /** Photos indexed like `layout.placements[].photoIndex`. */
  photos: readonly (Photo & { file: File })[];
  settings: PosterSettings;
  /** Workers to decode with. Terminated if `signal` aborts, so create a new one afterwards. */
  pool: WorkerPool;
  signal?: AbortSignal;
  onProgress?: (done: number, total: number) => void;
}

export function mimeType(format: PosterSettings["format"]): string {
  return format === "jpeg" ? "image/jpeg" : "image/png";
}

/**
 * Render the collage at full resolution and encode it.
 *
 * Decoding runs in a pool of workers, each photo decoded at just the size its
 * cell needs. Each decoded bitmap is drawn and closed straight away, so only a
 * few are alive at once. Cancelling terminates the pool's workers.
 */
export async function exportCollage(input: ExportInput): Promise<Blob> {
  const { layout, photos, settings, pool, signal, onProgress } = input;
  const { width, height } = settings;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas is not available");
  const frame: Frame = {
    corners: settings.cornerStyle,
    border: borderPixels(settings.borderWidth, width, height),
    color: settings.borderColor,
  };
  drawBackground(ctx, width, height, frame);

  const rects = cellPixelRects(layout, width, height);
  const abort = () => pool.terminate();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });

  try {
    let done = 0;
    onProgress?.(0, rects.length);
    await Promise.all(
      layout.placements.map(async (placement, i) => {
        const photo = photos[placement.photoIndex];
        const rect = rects[i];
        if (!photo || !rect) return;
        const size = coverSize(photo.width, photo.height, rect.w, rect.h);
        const res = await pool.run({ kind: "cell", file: photo.file, ...size });
        if (!res.ok || res.kind !== "cell") {
          throw new Error(res.ok ? "unexpected response" : res.error);
        }
        try {
          drawPhoto(
            ctx,
            res.bitmap,
            res.bitmap.width,
            res.bitmap.height,
            rect,
            width,
            height,
            frame,
          );
        } finally {
          res.bitmap.close();
        }
        onProgress?.(++done, rects.length);
      }),
    );
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    drawBorders(ctx, rects, width, height, frame);
    return await canvas.convertToBlob({
      type: mimeType(settings.format),
      quality: settings.format === "jpeg" ? settings.jpegQuality : undefined,
    });
  } finally {
    signal?.removeEventListener("abort", abort);
  }
}
