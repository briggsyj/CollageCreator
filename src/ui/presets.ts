// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

export interface SizePreset {
  label: string;
  width: number;
  height: number;
}

/** Paper sizes at 300 DPI, in pixels. */
export const PRESETS: SizePreset[] = [
  { label: "800 × 600", width: 800, height: 600 },
  { label: "1600 × 1200", width: 1600, height: 1200 },
  { label: "A4 portrait (300 DPI)", width: 2480, height: 3508 },
  { label: "A4 landscape (300 DPI)", width: 3508, height: 2480 },
  { label: "A3 portrait (300 DPI)", width: 3508, height: 4961 },
  { label: "A3 landscape (300 DPI)", width: 4961, height: 3508 },
  { label: "A2 portrait (300 DPI)", width: 4961, height: 7016 },
  { label: "A2 landscape (300 DPI)", width: 7016, height: 4961 },
];

export function findPreset(width: number, height: number): number {
  return PRESETS.findIndex((p) => p.width === width && p.height === height);
}
