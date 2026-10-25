// SPDX-License-Identifier: GPL-2.0-or-later

import { downscale } from "./downscale";
import type { WorkerReady, WorkerRequest, WorkerResponse } from "./protocol";

const scope = self as unknown as DedicatedWorkerGlobalScope;

/**
 * Decode `file` upright at (about) the target size. Asks the browser to
 * resize while decoding, so a 12 MP photo never has to exist in full; if the
 * browser ignores or mangles the request (checked by size), decodes in full
 * and shrinks by successive halvings instead.
 */
async function decodeAt(file: File, width: number, height: number): Promise<ImageBitmap> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "high",
    });
    if (Math.abs(bitmap.width - width) <= 1 && Math.abs(bitmap.height - height) <= 1) return bitmap;
    bitmap.close();
  } catch {
    // fall through to the full decode
  }
  const full = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    return await createImageBitmap(downscale(full, width, height));
  } finally {
    full.close();
  }
}

async function handle(
  req: WorkerRequest,
): Promise<{ res: WorkerResponse; transfer: Transferable[] }> {
  if (req.kind === "probe") {
    const full = await createImageBitmap(req.file, { imageOrientation: "from-image" });
    try {
      const scale = Math.min(1, req.thumbMax / Math.max(full.width, full.height));
      const tw = Math.max(1, Math.round(full.width * scale));
      const th = Math.max(1, Math.round(full.height * scale));
      const thumb = await createImageBitmap(downscale(full, tw, th));
      return {
        res: { kind: "probe", id: req.id, ok: true, width: full.width, height: full.height, thumb },
        transfer: [thumb],
      };
    } finally {
      full.close();
    }
  }
  const bitmap = await decodeAt(req.file, req.width, req.height);
  return { res: { kind: "cell", id: req.id, ok: true, bitmap }, transfer: [bitmap] };
}

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const req = event.data;
  handle(req).then(
    ({ res, transfer }) => scope.postMessage(res, transfer),
    (err: unknown) =>
      scope.postMessage({
        kind: req.kind,
        id: req.id,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      } satisfies WorkerResponse),
  );
};

scope.postMessage({ kind: "ready" } satisfies WorkerReady);
