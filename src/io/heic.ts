// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * HEIC/HEIF photos (the iPhone's default). Safari decodes them itself; other
 * browsers cannot, so this loads a WebAssembly decoder (libheif, LGPL-3.0)
 * the first time one is needed and turns the photo into a bitmap. It runs in
 * the same worker that decodes every photo, and nothing leaves the device.
 */

const EXTENSIONS = ["heic", "heif", "hif"];
const TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

export function looksLikeHeic(file: { name: string; type: string }): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return TYPES.includes(file.type.toLowerCase()) || EXTENSIONS.includes(ext);
}

let decoder: Promise<InstanceType<Awaited<ReturnType<typeof load>>["HeifDecoder"]>> | undefined;

async function load() {
  const start = (await import("libheif-js/libheif-wasm/libheif-bundle.mjs")).default;
  return start();
}

function getDecoder() {
  decoder ??= load().then((lib) => new lib.HeifDecoder());
  return decoder;
}

/** Decode the first image in a HEIC file, upright (libheif applies its rotation). */
export async function decodeHeic(file: Blob): Promise<ImageBitmap> {
  const dec = await getDecoder();
  const [image] = dec.decode(new Uint8Array(await file.arrayBuffer()));
  if (!image) throw new Error("no image in the HEIC file");
  const width = image.get_width();
  const height = image.get_height();
  const filled = await new Promise<ImageData>((resolve, reject) =>
    image.display(new ImageData(width, height), (out) =>
      out ? resolve(out) : reject(new Error("the HEIC file could not be decoded")),
    ),
  );
  return createImageBitmap(filled);
}
