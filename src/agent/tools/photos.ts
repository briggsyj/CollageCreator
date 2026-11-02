// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { t } from "../../i18n";
import { numberIn } from "../args";
import { isOutcome, type Kit, photoRef, photoRefs, tool } from "../kit";
import { done, refused, waiting } from "../result";
import type { Tool } from "../types";

export function photoTools(kit: Kit): Tool[] {
  const { app } = kit;
  return [
    tool(
      "set_tool",
      t(
        "Choose the preview tool: select (pick photos), swap (click two photos to swap them) or pan.",
      ),
      { tool: { type: "string", enum: ["select", "swap", "pan"] } },
      (a) => {
        if (a.tool !== "select" && a.tool !== "swap" && a.tool !== "pan") {
          return refused("bad-value", t("The tool is select, swap or pan."));
        }
        app.setMode(a.tool);
        return done(t("Tool: %(tool)s.", { tool: a.tool }));
      },
      { required: ["tool"] },
    ),
    tool(
      "select_photos",
      t("Select photos. With add set, they join the current selection; otherwise they replace it."),
      { photos: photoRefs, add: { type: "boolean" } },
      (a) => {
        const found = kit.photos(a.photos);
        if (isOutcome(found)) return found;
        app.selectMany(a.add === true ? [...app.selection, ...found.indices] : found.indices);
        return done(t("%(n)s photo(s) selected.", { n: app.selection.length }));
      },
      { required: ["photos"] },
    ),
    tool("clear_selection", t("Let go of the selection."), {}, () => {
      app.deselect();
      return done(t("Nothing is selected."));
    }),
    tool(
      "swap_photos",
      t("Swap two photos, also across pages."),
      { a: photoRef, b: photoRef },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const one = kit.photo(a.a);
        if (isOutcome(one)) return one;
        const two = kit.photo(a.b);
        if (isOutcome(two)) return two;
        if (one.index === two.index) return refused("bad-value", t("Choose two different photos."));
        const cells = app.layout?.placements ?? [];
        const first = cells.findIndex((p) => p.photoIndex === one.index);
        const second = cells.findIndex((p) => p.photoIndex === two.index);
        if (first < 0 || second < 0)
          return refused("busy", t("The photos are still being arranged."));
        app.deselect();
        app.pick(first);
        app.pick(second);
        return done(t("Swapped."));
      },
      { required: ["a", "b"] },
    ),
    tool(
      "resize_photo",
      t(
        "Give photos more room: columns 1 or 2 (wider) and rows 1 to 3 (taller), or reset them to their normal size.",
      ),
      {
        photos: photoRefs,
        columns: { type: "integer", enum: [1, 2] },
        rows: { type: "integer", enum: [1, 2, 3] },
        reset: { type: "boolean" },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const found = kit.photos(a.photos);
        if (isOutcome(found)) return found;
        if (a.reset === true) {
          app.setSpans(found.indices, "reset");
          return done(t("Back to normal size."));
        }
        const columns = a.columns === 1 || a.columns === 2 ? a.columns : undefined;
        const rows = a.rows === 1 || a.rows === 2 || a.rows === 3 ? a.rows : undefined;
        if (columns === undefined && rows === undefined) {
          return refused("bad-value", t("Give columns, rows or reset."));
        }
        app.setSpans(found.indices, {
          ...(columns ? { columns } : {}),
          ...(rows ? { rows } : {}),
        });
        return done(t("Resized."));
      },
      { required: ["photos"] },
    ),
    tool(
      "crop_photo",
      t(
        "Open crop mode on one photo and set its zoom (1 and up) and the way it is moved inside its cell (x and y, as shares of the collage width). reset goes back to the default crop; finish ends crop mode.",
      ),
      {
        photo: photoRef,
        zoom: { type: "number", minimum: 1, maximum: app.maxZoom },
        x: { type: "number" },
        y: { type: "number" },
        reset: { type: "boolean" },
        finish: { type: "boolean" },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const one = kit.photo(a.photo);
        if (isOutcome(one)) return one;
        if (app.multiSelected) {
          return refused(
            "crop-needs-one-photo",
            t("Cropping works on one photo; clear the selection first."),
          );
        }
        app.cropPhoto(one.index);
        if (a.reset === true) app.resetCrop();
        if (a.zoom !== undefined) {
          const zoom = numberIn(a.zoom, 1, app.maxZoom);
          if (zoom === undefined)
            return refused("out-of-range", t("Zoom is from 1 to %(max)s.", { max: app.maxZoom }));
          app.zoomSelectedCrop(zoom);
        }
        const x = numberIn(a.x ?? 0, -10, 10);
        const y = numberIn(a.y ?? 0, -10, 10);
        if (x === undefined || y === undefined)
          return refused("out-of-range", t("Move by a small amount."));
        if (x !== 0 || y !== 0) app.panSelectedCrop(x, y);
        if (a.finish === true) app.cropFor = null;
        return done(t("Cropping."));
      },
      { required: ["photo"] },
    ),
    tool(
      "remove_photos",
      t("Remove photos. The person is asked first; Undo remove brings them back."),
      { photos: photoRefs },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const found = kit.photos(a.photos);
        if (isOutcome(found)) return found;
        app.askRemovePhotos(found.indices.flatMap((i) => app.photos[i] ?? []));
        return waiting(t("Waiting for the person to confirm the removal."));
      },
      { required: ["photos"] },
    ),
    tool(
      "remove_all_photos",
      t("Remove every photo and go back to one page. The person is asked first."),
      {},
      () => {
        const busy = kit.busy();
        if (busy) return busy;
        if (!app.hasPhotos) return refused("no-photos", t("There are no photos."));
        app.askRemoveAll();
        return waiting(t("Waiting for the person to confirm."));
      },
    ),
    tool("undo_remove", t("Bring back the photos removed last."), {}, () => {
      if (!app.removed) return refused("not-supported", t("Nothing was removed."));
      app.undoRemove();
      return done(t("Restored."));
    }),
    tool(
      "move_photos_to_page",
      t("Move photos to another page (they go last there). Needs two or more pages."),
      { photos: photoRefs, page: { type: "integer", minimum: 1 } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const found = kit.photos(a.photos);
        if (isOutcome(found)) return found;
        const page = typeof a.page === "number" ? a.page : 0;
        if (!app.book || !Number.isInteger(page) || page < 1 || page > app.pageCount) {
          return refused(
            "no-such-page",
            t("There are %(n)s page(s); choose one of them.", { n: app.pageCount }),
          );
        }
        app.movePhotosToPage(
          found.indices.flatMap((i) => app.photos[i]?.id ?? []),
          page - 1,
        );
        return done(t("Moved to page %(n)s.", { n: page }));
      },
      { required: ["photos", "page"] },
    ),
  ];
}
