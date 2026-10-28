// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * Reading the files out of a ZIP, such as a zipped folder of photos. Entries are read one at a
 * time from the file (nothing is loaded whole): stored entries are slices of it, and deflated
 * ones are inflated by the browser's own DecompressionStream, so no library is needed.
 */

const END = 0x06054b50;
const CENTRAL = 0x02014b50;
const LOCAL = 0x04034b50;

export function isZip(file: File): boolean {
  return (
    /\.zip$/i.test(file.name) ||
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed"
  );
}

const TYPES: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

async function bytes(blob: Blob, start: number, end: number): Promise<DataView> {
  return new DataView(await blob.slice(start, end).arrayBuffer());
}

/** A ZIP's time stamp (local time, two-second steps) as milliseconds. */
function dosTime(time: number, date: number): number {
  return new Date(
    1980 + (date >> 9),
    ((date >> 5) & 15) - 1,
    date & 31,
    time >> 11,
    (time >> 5) & 63,
    (time & 31) * 2,
  ).getTime();
}

/** Folders, Mac resource forks and hidden files are not wanted from a zipped folder. */
function wanted(path: string): boolean {
  if (path.endsWith("/")) return false;
  if (path.startsWith("__MACOSX/") || path.includes("/__MACOSX/")) return false;
  return !path.split("/").some((part) => part.startsWith("."));
}

/**
 * The images in a ZIP, by their names without the folders. Other files are only named, in
 * `others`; encrypted images and ones packed in a way browsers cannot unpack are named in
 * `unreadable`. Throws when the file is not a ZIP that can be read.
 */
export async function unzipImages(
  zip: Blob,
): Promise<{ files: File[]; others: string[]; unreadable: string[] }> {
  // The end record is in the last 22 bytes, or up to 64 KB before them when there is a comment.
  const tailStart = Math.max(0, zip.size - 22 - 0xffff);
  const tail = await bytes(zip, tailStart, zip.size);
  let end = -1;
  for (let i = tail.byteLength - 22; i >= 0; i--) {
    if (tail.getUint32(i, true) === END) {
      end = i;
      break;
    }
  }
  if (end < 0) throw new Error("not a zip file");
  const count = tail.getUint16(end + 10, true);
  const size = tail.getUint32(end + 12, true);
  const offset = tail.getUint32(end + 16, true);
  if (offset === 0xffffffff || offset + size > zip.size) throw new Error("unsupported zip file");

  const dir = await bytes(zip, offset, offset + size);
  const names = new TextDecoder();
  const files: File[] = [];
  const others: string[] = [];
  const unreadable: string[] = [];
  let at = 0;
  for (let i = 0; i < count; i++) {
    if (at + 46 > dir.byteLength || dir.getUint32(at, true) !== CENTRAL) {
      throw new Error("bad zip directory");
    }
    const flags = dir.getUint16(at + 8, true);
    const method = dir.getUint16(at + 10, true);
    const time = dir.getUint16(at + 12, true);
    const date = dir.getUint16(at + 14, true);
    const packed = dir.getUint32(at + 20, true);
    const nameLength = dir.getUint16(at + 28, true);
    const extraLength = dir.getUint16(at + 30, true);
    const commentLength = dir.getUint16(at + 32, true);
    const local = dir.getUint32(at + 42, true);
    const path = names.decode(new Uint8Array(dir.buffer, at + 46, nameLength));
    at += 46 + nameLength + extraLength + commentLength;
    if (!wanted(path)) continue;
    const name = path.split("/").pop() ?? path;
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const type = TYPES[ext];
    if (!type) {
      others.push(name);
      continue;
    }
    if (flags & 1 || (method !== 0 && method !== 8) || packed === 0xffffffff) {
      unreadable.push(name);
      continue;
    }
    const head = await bytes(zip, local, local + 30);
    if (head.getUint32(0, true) !== LOCAL) throw new Error("bad zip entry");
    const start = local + 30 + head.getUint16(26, true) + head.getUint16(28, true);
    const data = zip.slice(start, start + packed);
    const blob =
      method === 0
        ? data
        : await new Response(
            data.stream().pipeThrough(new DecompressionStream("deflate-raw")),
          ).blob();
    files.push(new File([blob], name, { type, lastModified: dosTime(time, date) }));
  }
  return { files, others, unreadable };
}
