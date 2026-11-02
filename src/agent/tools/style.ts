// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { borderFromPercent } from "../../core/border";
import { MAX_COLUMNS } from "../../core/layout";
import type { CornerStyle, LayoutStyle } from "../../core/types";
import { t } from "../../i18n";
import { numberIn, wholeIn } from "../args";
import { type Kit, tool } from "../kit";
import { done, refused } from "../result";
import type { Tool } from "../types";

const LAYOUTS: LayoutStyle[] = ["mosaic", "gallery"];
const CORNERS: CornerStyle[] = ["none", "slight", "rounded"];

export function styleTools(kit: Kit): Tool[] {
  const { app } = kit;
  return [
    tool(
      "set_layout",
      t(
        "Choose the layout: mosaic (columns of different heights) or gallery (one panel per photo).",
      ),
      { style: { type: "string", enum: LAYOUTS } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const style = LAYOUTS.find((l) => l === a.style);
        if (!style) return refused("bad-value", t("The layout is mosaic or gallery."));
        app.chooseLayout(style);
        return done(t("Layout: %(style)s.", { style }));
      },
      { required: ["style"] },
    ),
    tool(
      "set_columns",
      t("Set the number of columns (mosaic only), or auto to let the app decide."),
      {
        columns: {
          anyOf: [{ type: "integer", minimum: 1, maximum: MAX_COLUMNS }, { const: "auto" }],
        },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (app.layoutStyle === "gallery") {
          return refused("not-supported", t("Columns only apply to the mosaic layout."));
        }
        if (a.columns === "auto") {
          app.setColumns(undefined);
          return done(t("Columns: automatic."));
        }
        const columns = wholeIn(a.columns, 1, MAX_COLUMNS);
        if (columns === undefined) {
          return refused("out-of-range", t("Columns: 1 to %(n)s, or auto.", { n: MAX_COLUMNS }));
        }
        app.setColumns(columns);
        return done(t("Columns: %(n)s.", { n: columns }));
      },
      { required: ["columns"] },
    ),
    tool(
      "set_seed",
      t("Set the arrangement's seed (a whole number); the same seed gives the same arrangement."),
      { seed: { type: "integer", minimum: 0 } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (typeof a.seed !== "number" || !app.setSeed(a.seed)) {
          return refused("out-of-range", t("The seed is a whole number from 0 to 4294967295."));
        }
        return done(t("Seed: %(n)s.", { n: app.seed }));
      },
      { required: ["seed"] },
    ),
    tool(
      "set_border",
      t(
        "Set the border: thickness as a percentage 0 to 100 of the slider's range, its colour (any CSS colour) and whether the outer edge has it too. Give any of them.",
      ),
      {
        percent: { type: "number", minimum: 0, maximum: 100 },
        color: { type: "string" },
        outer: { type: "boolean" },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (a.percent === undefined && a.color === undefined && a.outer === undefined) {
          return refused("bad-value", t("Give percent, color or outer."));
        }
        const percent = a.percent === undefined ? undefined : numberIn(a.percent, 0, 100);
        if (a.percent !== undefined && percent === undefined) {
          return refused("out-of-range", t("Border thickness is 0 to 100."));
        }
        if (
          a.color !== undefined &&
          (typeof a.color !== "string" || !CSS.supports("color", a.color))
        ) {
          return refused("bad-value", t("That is not a colour."));
        }
        if (a.outer !== undefined && typeof a.outer !== "boolean") {
          return refused("bad-value", t("outer is true or false."));
        }
        // The sliders keep what the person set unless told settings were put back.
        if (percent !== undefined) {
          app.settings.borderWidth = borderFromPercent(percent);
          app.restoreEpoch++;
        }
        if (typeof a.color === "string") app.settings.borderColor = a.color;
        if (typeof a.outer === "boolean") app.settings.outerBorder = a.outer;
        return done(t("Border changed."));
      },
    ),
    tool(
      "set_corners",
      t("Set the photos' corners: none (square), slight or rounded."),
      { style: { type: "string", enum: CORNERS } },
      (a) => {
        const style = CORNERS.find((c) => c === a.style);
        if (!style) return refused("bad-value", t("Corners are none, slight or rounded."));
        app.settings.cornerStyle = style;
        return done(t("Corners: %(style)s.", { style }));
      },
      { required: ["style"] },
    ),
  ];
}
