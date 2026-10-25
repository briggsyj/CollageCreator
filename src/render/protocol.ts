// SPDX-License-Identifier: GPL-2.0-or-later

/** Messages between the main thread and image workers. */

export type WorkerRequest =
  /** Decode a file once to learn its upright size, and make a thumbnail. */
  | { kind: "probe"; id: number; file: File; thumbMax: number }
  /** Decode a file at the size needed to cover one cell. */
  | { kind: "cell"; id: number; file: File; width: number; height: number };

export type WorkerResponse =
  | { kind: "probe"; id: number; ok: true; width: number; height: number; thumb: ImageBitmap }
  | { kind: "cell"; id: number; ok: true; bitmap: ImageBitmap }
  | { kind: "probe" | "cell"; id: number; ok: false; error: string };

/** Sent once by a worker when its script has loaded and it is ready for jobs. */
export interface WorkerReady {
  kind: "ready";
}
