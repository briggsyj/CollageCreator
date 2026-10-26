// SPDX-License-Identifier: GPL-2.0-or-later

declare module "libheif-js/libheif-wasm/libheif-bundle.mjs" {
  interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(into: ImageData, done: (filled: ImageData | null) => void): void;
  }
  interface Libheif {
    HeifDecoder: new () => { decode(data: ArrayBuffer | Uint8Array): HeifImage[] };
  }
  /** Starts the WebAssembly module (it is bundled into the file, so nothing else is fetched). */
  const start: () => Promise<Libheif>;
  export default start;
}
