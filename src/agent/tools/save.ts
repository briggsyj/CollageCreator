// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { t } from "../../i18n";
import { wholeIn } from "../args";
import { type Kit, tool } from "../kit";
import { done, refused } from "../result";
import type { Tool } from "../types";

export function saveTools(kit: Kit): Tool[] {
  const { app } = kit;
  return [
    tool(
      "set_save_format",
      t("Choose the saved image format: png or jpeg, and for jpeg the quality 1 to 100."),
      {
        format: { type: "string", enum: ["png", "jpeg"] },
        quality: { type: "integer", minimum: 1, maximum: 100 },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (a.format !== "png" && a.format !== "jpeg") {
          return refused("bad-value", t("The format is png or jpeg."));
        }
        const quality = a.quality === undefined ? undefined : wholeIn(a.quality, 1, 100);
        if (a.quality !== undefined && quality === undefined) {
          return refused("out-of-range", t("Quality is 1 to 100."));
        }
        app.settings.format = a.format;
        if (quality !== undefined) {
          app.settings.jpegQuality = quality / 100;
          app.restoreEpoch++;
        }
        return done(t("Format: %(f)s.", { f: a.format }));
      },
      { required: ["format"] },
    ),
    tool(
      "save",
      t(
        "Save the collage as the app does: one image, a zip of images for several pages or an Instagram post. page saves just that page. It starts the save and returns; read get_state for progress and the file saved.",
      ),
      { page: { type: "integer", minimum: 1 } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (!app.hasPhotos) return refused("no-photos", t("There are no photos to save."));
        let only: number | undefined;
        if (a.page !== undefined) {
          const page = wholeIn(a.page, 1, app.pageCount);
          if (page === undefined || !app.book) {
            return refused("no-such-page", t("There are %(n)s page(s).", { n: app.pageCount }));
          }
          only = page - 1;
        }
        void app.save(only);
        return done(t("Saving started; read the state for progress."));
      },
    ),
    tool("cancel_save", t("Cancel a save that is running."), {}, () => {
      if (app.dialog !== "progress") return refused("not-supported", t("No save is running."));
      app.cancelExport();
      return done(t("Cancelled."));
    }),
  ];
}
