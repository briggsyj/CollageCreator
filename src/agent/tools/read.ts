// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { t } from "../../i18n";
import { type Args, isOutcome, type Kit, photoRef, tool } from "../kit";
import { buildReport } from "../report";
import { toResult } from "../result";
import { snapshotOf } from "../snapshot";
import type { Tool } from "../types";

const PREVIEW_SIDE = 256;

/** A small JPEG of a photo, as base64, made from the copy the app already keeps. */
async function previewOf(bitmap: ImageBitmap): Promise<string> {
  const scale = Math.min(1, PREVIEW_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = new OffscreenCanvas(w, h);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.7 });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export function readTools(kit: Kit): Tool[] {
  const { app } = kit;
  const getState = tool(
    "get_state",
    t(
      "Read the whole state of the collage: photos by page and position, the selection, layout, style, size, pages, view, saving, language and any question waiting for the person. Read it again after anything that may move photos.",
    ),
    {},
    () => ({
      status: "done",
      message: t("State of the collage."),
      data: buildReport(snapshotOf(app)),
    }),
    { readOnly: true },
  );
  const preview: Tool = {
    name: "get_photo_preview",
    description: t("See a small preview image of one photo, by its page and position."),
    inputSchema: {
      type: "object",
      properties: photoRef.properties,
      required: ["page", "position"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    async execute(args: Args) {
      const one = kit.photo(args);
      if (isOutcome(one)) return toResult(one);
      const photo = app.photos[one.index];
      if (!photo)
        return toResult({ status: "refused", code: "no-such-photo", message: "No photo." });
      return {
        content: [
          { type: "image", data: await previewOf(photo.thumb), mimeType: "image/jpeg" },
          { type: "text", text: JSON.stringify({ ok: true, name: photo.name }) },
        ],
      };
    },
  };
  return [getState, preview];
}
