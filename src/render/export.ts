// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { sliceRects, splitFileNames } from "../core/split";
import type { Layout, Photo, PosterSettings } from "../core/types";
import { zipBlob } from "../io/zip";
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
  /** File name stem for a split collage's images (`<baseName>_1.png`, ...). */
  baseName?: string;
}

export function mimeType(format: PosterSettings["format"]): string {
  return format === "jpeg" ? "image/jpeg" : "image/png";
}

/** The file extension for a format. */
export function extension(format: PosterSettings["format"]): string {
  return format === "jpeg" ? "jpg" : "png";
}

/**
 * Render the collage at full resolution and encode it. A collage made for a multi-image post
 * is cut into squares, left to right, and the result is a zip of those images.
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
    outer: settings.outerBorder,
  };
  const rects = cellPixelRects(layout, width, height);
  drawBackground(ctx, width, height, frame);

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
        // A zoomed photo shows only part of itself, so it is decoded larger to stay sharp.
        const zoom = Math.max(1, photo.crop?.zoom ?? 1);
        const size = coverSize(photo.width, photo.height, rect.w * zoom, rect.h * zoom);
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
            photo.crop,
          );
        } finally {
          res.bitmap.close();
        }
        onProgress?.(++done, rects.length);
      }),
    );
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    drawBorders(ctx, rects, width, height, frame);
    const options = {
      type: mimeType(settings.format),
      quality: settings.format === "jpeg" ? settings.jpegQuality : undefined,
    };
    const count = settings.splitImages;
    if (count < 2) return await canvas.convertToBlob(options);

    // One square image per part of the collage, named in order from the leftmost.
    const names = splitFileNames(input.baseName ?? "collage", count, extension(settings.format));
    const entries = [];
    for (const [i, part] of sliceRects(count, height).entries()) {
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      const piece = new OffscreenCanvas(part.w, part.h);
      const pieceCtx = piece.getContext("2d");
      if (!pieceCtx) throw new Error("2D canvas is not available");
      pieceCtx.drawImage(canvas, part.x, part.y, part.w, part.h, 0, 0, part.w, part.h);
      const blob = await piece.convertToBlob(options);
      entries.push({ name: names[i] as string, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    return zipBlob(entries);
  } finally {
    signal?.removeEventListener("abort", abort);
  }
}
