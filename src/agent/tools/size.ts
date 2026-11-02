// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { SPLIT_MAX, SPLIT_MIN, SPLIT_SIDE_DEFAULT } from "../../core/split";
import { t } from "../../i18n";
import { SIZE_CHOICES } from "../../ui/presets";
import { wholeIn } from "../args";
import { type Kit, tool } from "../kit";
import { done, refused } from "../result";
import type { Tool } from "../types";

const MAX_SIDE = 65535;

export function sizeTools(kit: Kit): Tool[] {
  const { app } = kit;
  const ids = SIZE_CHOICES.map((c) => c.id);
  return [
    tool(
      "set_output_size",
      t(
        "Set the output size: a named size (screen, small, square, a4, a3, a2, b1), or a custom width and height in pixels. Named sizes follow the current orientation. Leaves the Instagram post.",
      ),
      {
        named: { type: "string", enum: ids },
        width: { type: "integer", minimum: 1, maximum: MAX_SIDE },
        height: { type: "integer", minimum: 1, maximum: MAX_SIDE },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (typeof a.named === "string") {
          if (!ids.includes(a.named)) {
            return refused("bad-value", t("Sizes: %(list)s.", { list: ids.join(", ") }));
          }
          app.chooseNamedSize(a.named);
          return done(t("Size: %(n)s.", { n: a.named }));
        }
        const width = wholeIn(a.width, 1, MAX_SIDE);
        const height = wholeIn(a.height, 1, MAX_SIDE);
        if (width === undefined || height === undefined) {
          return refused("out-of-range", t("Give a named size, or a width and height in pixels."));
        }
        app.settings.splitImages = 0;
        app.customSize = true;
        app.commitSize(width, height);
        return done(t("Size: %(w)s × %(h)s.", { w: app.settings.width, h: app.settings.height }));
      },
    ),
    tool(
      "set_orientation",
      t("Turn the output between landscape and portrait."),
      { orientation: { type: "string", enum: ["landscape", "portrait"] } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (a.orientation !== "landscape" && a.orientation !== "portrait") {
          return refused("bad-value", t("Orientation is landscape or portrait."));
        }
        app.turn(a.orientation === "portrait");
        return done(t("Orientation: %(o)s.", { o: a.orientation }));
      },
      { required: ["orientation"] },
    ),
    tool(
      "set_instagram_post",
      t("Make the collage an Instagram post: one wide page saved as 2 to 20 square images."),
      {
        images: { type: "integer", minimum: SPLIT_MIN, maximum: SPLIT_MAX },
        side: { type: "integer", minimum: 16, description: "Pixels per square image." },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const images = wholeIn(a.images, SPLIT_MIN, SPLIT_MAX);
        if (images === undefined) {
          return refused(
            "out-of-range",
            t("Images: %(a)s to %(b)s.", { a: SPLIT_MIN, b: SPLIT_MAX }),
          );
        }
        const side = a.side === undefined ? undefined : wholeIn(a.side, 16, MAX_SIDE);
        if (a.side !== undefined && side === undefined) {
          return refused("out-of-range", t("The side is from 16 pixels."));
        }
        const current = app.isSplit ? app.settings.height : SPLIT_SIDE_DEFAULT;
        app.customSize = false;
        app.setSplit(images, side ?? current, true);
        return done(t("Instagram post of %(n)s images.", { n: images }));
      },
      { required: ["images"] },
    ),
  ];
}
