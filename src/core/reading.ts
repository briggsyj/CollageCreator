// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { Layout } from "./types";

/** Placement indexes in reading order: by page, then top to bottom, then left to right. */
export function readingOrder(layout: Layout): number[] {
  return layout.placements
    .map((p, i) => ({ i, page: p.page ?? 0, y: Math.round(p.cell.y * 1000), x: p.cell.x }))
    .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x)
    .map((e) => e.i);
}
