// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * The border slider runs 0 to 100% of its track, for borders of 0 to 10% of the collage's
 * longer side (wider looks heavy). It shows how full it is, not the share of the side.
 */
export const BORDER_MAX = 0.1;

/** A border width (share of the longer side) from the slider's 0 to 100. */
export function borderFromPercent(percent: number): number {
  return (Math.min(100, Math.max(0, percent)) / 100) * BORDER_MAX;
}

/** The slider's 0 to 100 for a border width. */
export function percentFromBorder(width: number): number {
  return Math.round((width / BORDER_MAX) * 100);
}
