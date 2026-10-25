// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Web, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it replaces build_photolist and PIL_SUPPORTED_EXTS from
// photocollage/render.py. Image sizes are read after the EXIF orientation is
// applied (the original swapped width and height for orientations 6 and 8),
// and unreadable files are skipped with a message instead of aborting.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import type { Photo } from "../core/types";
import { t } from "../i18n";
import type { WorkerPool } from "../render/pool";

/** A photo plus what the browser needs to show and export it. Files never leave the device. */
export interface ImportedPhoto extends Photo {
  file: File;
  thumb: ImageBitmap;
}

/** Extensions browsers can generally decode (a subset of the original's PIL list). */
export const SUPPORTED_EXTENSIONS = [
  "avif",
  "bmp",
  "gif",
  "jfif",
  "jpe",
  "jpeg",
  "jpg",
  "png",
  "webp",
] as const;

export const THUMB_MAX = 480;

export interface ImportMessage {
  kind: "info" | "error";
  text: string;
}

export function looksLikeImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}

export function fileKey(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}

let counter = 0;

/**
 * Add files to a collage. Files that are not images, cannot be decoded, or
 * were already added are skipped with a message naming the file.
 */
export async function importFiles(
  files: readonly File[],
  existing: readonly ImportedPhoto[],
  pool: WorkerPool,
  onMessage: (m: ImportMessage) => void,
  onProgress?: (done: number, total: number) => void,
): Promise<ImportedPhoto[]> {
  const seen = new Set(existing.map((p) => fileKey(p.file)));
  const candidates: File[] = [];
  for (const file of files) {
    if (!looksLikeImage(file)) {
      onMessage({
        kind: "error",
        text: t("Skipped %(name)s: it is not an image.", { name: file.name }),
      });
    } else if (seen.has(fileKey(file))) {
      onMessage({
        kind: "info",
        text: t("Skipped %(name)s: it was already added.", { name: file.name }),
      });
    } else {
      seen.add(fileKey(file));
      candidates.push(file);
    }
  }

  let done = 0;
  const results = await Promise.all(
    candidates.map(async (file): Promise<ImportedPhoto | null> => {
      try {
        const res = await pool.run({ kind: "probe", file, thumbMax: THUMB_MAX });
        if (!res.ok || res.kind !== "probe" || res.width < 1 || res.height < 1) {
          throw new Error(res.ok ? "empty image" : res.error);
        }
        return {
          id: `photo-${++counter}`,
          name: file.name,
          width: res.width,
          height: res.height,
          file,
          thumb: res.thumb,
        };
      } catch {
        onMessage({
          kind: "error",
          text: t('This image could not be opened:\n"%(imgname)s".', { imgname: file.name }),
        });
        return null;
      } finally {
        onProgress?.(++done, candidates.length);
      }
    }),
  );
  return results.filter((p): p is ImportedPhoto => p !== null);
}
