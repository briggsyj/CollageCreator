// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import { isZip, unzipImages } from "../src/io/unzip";
import { crc32, zipBytes } from "../src/io/zip";

const enc = new TextEncoder();

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** A ZIP with each entry deflated (method 8), as most zip tools make them. */
async function deflatedZip(entries: { name: string; data: Uint8Array }[]): Promise<Uint8Array> {
  const parts: BlobPart[] = [];
  const central: BlobPart[] = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const packed = await deflate(data);
    const nameBytes = enc.encode(name);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true);
    head.setUint16(8, 8, true);
    head.setUint32(14, crc32(data), true);
    head.setUint32(18, packed.length, true);
    head.setUint32(22, data.length, true);
    head.setUint16(26, nameBytes.length, true);
    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true);
    dir.setUint16(10, 8, true);
    dir.setUint32(16, crc32(data), true);
    dir.setUint32(20, packed.length, true);
    dir.setUint32(24, data.length, true);
    dir.setUint16(28, nameBytes.length, true);
    dir.setUint32(42, offset, true);
    parts.push(new Uint8Array(head.buffer), nameBytes, packed as BlobPart);
    central.push(new Uint8Array(dir.buffer), nameBytes);
    offset += 30 + nameBytes.length + packed.length;
  }
  const size = central.reduce<number>((n, p) => n + (p as Uint8Array).length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, size, true);
  end.setUint32(16, offset, true);
  return new Uint8Array(
    await new Blob([...parts, ...central, new Uint8Array(end.buffer)]).arrayBuffer(),
  );
}

describe("unzip", () => {
  it("knows a zip by its name or type", () => {
    expect(isZip(new File([], "Holiday.ZIP"))).toBe(true);
    expect(isZip(new File([], "x", { type: "application/zip" }))).toBe(true);
    expect(isZip(new File([], "photo.jpg"))).toBe(false);
  });

  it("takes the images out of a zipped folder, leaving folders, hidden and Mac files", async () => {
    const zip = zipBytes([
      { name: "Holiday/beach.jpg", data: enc.encode("jpeg bytes") },
      { name: "Holiday/notes.txt", data: enc.encode("hello") },
      { name: "Holiday/.DS_Store", data: enc.encode("x") },
      { name: "__MACOSX/Holiday/._beach.jpg", data: enc.encode("x") },
      { name: "Holiday/sub/", data: new Uint8Array() },
      { name: "Holiday/sub/hill.PNG", data: enc.encode("png bytes") },
    ]);
    const out = await unzipImages(new Blob([zip as BlobPart]));
    expect(out.files.map((f) => [f.name, f.type])).toEqual([
      ["beach.jpg", "image/jpeg"],
      ["hill.PNG", "image/png"],
    ]);
    expect(await out.files[0]?.text()).toBe("jpeg bytes");
    expect(out.others).toEqual(["notes.txt"]);
    expect(out.unreadable).toEqual([]);
  });

  it("inflates deflated entries", async () => {
    const big = enc.encode("photo ".repeat(5000));
    const zip = await deflatedZip([{ name: "a/one.webp", data: big }]);
    const out = await unzipImages(new Blob([zip as BlobPart]));
    expect(out.files).toHaveLength(1);
    expect(new Uint8Array(await (out.files[0] as File).arrayBuffer())).toEqual(big);
  });

  it("refuses a file that is not a zip", async () => {
    await expect(unzipImages(new Blob([enc.encode("not a zip at all")]))).rejects.toThrow();
  });
});
