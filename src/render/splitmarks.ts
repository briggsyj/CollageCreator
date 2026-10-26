// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { splitBoundaries } from "../core/split";
import type { Rect } from "../core/types";
import type { Ctx2D } from "./draw";

/** Room (in CSS pixels) kept above and below the poster for the cut marks and their note. */
export const SPLIT_MARGIN = 56;

const GAP = 3;
const MARK = 36;
const SCISSORS_AT = 10;
const SCISSORS_LENGTH = 16;

/** Small scissors with their blades pointing along +y, drawn around (0, 0). */
function scissors(ctx: Ctx2D, scale: number): void {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineWidth = 1.2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(-2.6, -3);
  ctx.lineTo(2.4, 7);
  ctx.moveTo(2.6, -3);
  ctx.lineTo(-2.4, 7);
  ctx.stroke();
  for (const x of [-3.4, 3.4]) {
    ctx.beginPath();
    ctx.arc(x, -5.4, 2.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Show where a collage for a multi-image post will be cut: a thin dashed line above and
 * below each cut, outside the poster, with scissors in it, and one note shared by all of
 * them. Drawn on the on-screen preview only, never in a saved image. `scale` is the
 * canvas pixels per CSS pixel; `poster` is the poster's rectangle in canvas pixels.
 */
export function drawSplitMarks(
  ctx: Ctx2D,
  poster: Rect,
  count: number,
  scale: number,
  colour: string,
  note: string,
): void {
  const cuts = splitBoundaries(poster.w, count);
  if (cuts.length === 0) return;
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = Math.max(1, scale);
  ctx.lineCap = "butt";

  for (const cut of cuts) {
    const x = Math.round(poster.x + cut) + 0.5;
    for (const above of [true, false]) {
      // From the poster's edge outwards: dashes, scissors, dashes.
      const edge = above ? poster.y - GAP * scale : poster.y + poster.h + GAP * scale;
      const dir = above ? -1 : 1;
      ctx.setLineDash([4 * scale, 3 * scale]);
      ctx.beginPath();
      ctx.moveTo(x, edge);
      ctx.lineTo(x, edge + dir * SCISSORS_AT * scale);
      ctx.moveTo(x, edge + dir * (SCISSORS_AT + SCISSORS_LENGTH) * scale);
      ctx.lineTo(x, edge + dir * MARK * scale);
      ctx.stroke();
      // Blades point towards the poster: along +y when above it, along -y when below.
      ctx.save();
      ctx.translate(x, edge + dir * (SCISSORS_AT + SCISSORS_LENGTH / 2) * scale);
      if (!above) ctx.rotate(Math.PI);
      scissors(ctx, scale);
      ctx.restore();
    }
  }

  // One note, beside the first cut, above the marks.
  const first = cuts[0] as number;
  const textX = Math.round(poster.x + first) + 8 * scale;
  const room = poster.x + poster.w - textX;
  if (room > 40 * scale) {
    ctx.font = `${12 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(note, textX, poster.y - (GAP + MARK + 5) * scale, room);
  }
  ctx.restore();
}
