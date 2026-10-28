// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { bookFileNames, pageLayout, pagesWithPhotos } from "../core/book";
import { splitFileNames } from "../core/split";
import type { Layout } from "../core/types";
import { zipBlob } from "../io/zip";
import { type ExportInput, exportPieces } from "./export";

/** What saving a book gives: one file, or a zip of the pages' images. */
export interface BookFile {
  name: string;
  blob: Blob;
}

export interface BookExport {
  /** The file to download, or null when there was nothing to save. */
  file: BookFile | null;
  /** Pages (0-based) left out because they have no photos. */
  skipped: number[];
}

/**
 * Make a book's pages one after another (one canvas at a time) and package them: each page with
 * photos is one image (or, for a page made for a post, one image per square), named in page
 * order; several images go in a zip. `onlyPage` saves just that page.
 */
export async function exportBook(
  input: Omit<ExportInput, "layout" | "baseName" | "onProgress"> & {
    layout: Layout;
    /** File name stem, such as `book-1234`. */
    stem: string;
    ext: string;
    onlyPage?: number;
    /** Overall progress, 0 to 1. */
    onProgress?: (share: number) => void;
  },
): Promise<BookExport> {
  const { layout, stem, ext, onlyPage } = input;
  const filled = pagesWithPhotos(layout);
  const pages = onlyPage === undefined ? filled : filled.filter((k) => k === onlyPage);
  const all = (layout.pages ?? []).map((_, k) => k);
  const skipped = onlyPage === undefined ? all.filter((k) => !filled.includes(k)) : [];
  if (pages.length === 0) return { file: null, skipped };

  const carousel = input.settings.splitImages > 1;
  const total = layout.pages?.length ?? 1;
  const pad = (n: number) => String(n).padStart(String(total).length, "0");
  const files: BookFile[] = [];
  for (const [i, page] of pages.entries()) {
    const pieces = await exportPieces({
      layout: pageLayout(layout, page),
      photos: input.photos,
      settings: input.settings,
      pool: input.pool,
      signal: input.signal,
      onProgress: (done, count) =>
        input.onProgress?.((i + (count ? done / count : 1)) / pages.length),
    });
    if (carousel) {
      const names = splitFileNames(`${stem}_p${pad(page + 1)}`, pieces.length, ext);
      for (const [j, blob] of pieces.entries()) files.push({ name: names[j] as string, blob });
    } else {
      files.push({ name: "", blob: pieces[0] as Blob });
    }
  }
  if (!carousel) {
    const names = bookFileNames(stem, files.length, ext);
    files.forEach((f, i) => {
      f.name = names[i] as string;
    });
  }
  const only = files[0];
  if (files.length === 1 && only) {
    const name = onlyPage === undefined ? stem : `${stem}_page-${(pages[0] ?? 0) + 1}`;
    return { file: { name: `${name}.${ext}`, blob: only.blob }, skipped };
  }
  const entries = await Promise.all(
    files.map(async (f) => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) })),
  );
  return { file: { name: `${stem}.zip`, blob: zipBlob(entries) }, skipped };
}
