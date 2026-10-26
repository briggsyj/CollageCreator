// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

export interface SizePreset {
  label: string;
  width: number;
  height: number;
}

/** Every named size, in both orientations (the list behind the size menu). */
export const PRESETS: SizePreset[] = [
  { label: "800 × 600", width: 800, height: 600 },
  { label: "600 × 800", width: 600, height: 800 },
  { label: "1600 × 1200", width: 1600, height: 1200 },
  { label: "1200 × 1600", width: 1200, height: 1600 },
  { label: "A4 portrait (300 DPI)", width: 2480, height: 3508 },
  { label: "A4 landscape (300 DPI)", width: 3508, height: 2480 },
  { label: "A3 portrait (300 DPI)", width: 3508, height: 4961 },
  { label: "A3 landscape (300 DPI)", width: 4961, height: 3508 },
  { label: "A2 portrait (300 DPI)", width: 4961, height: 7016 },
  { label: "A2 landscape (300 DPI)", width: 7016, height: 4961 },
  { label: "B1 portrait (300 DPI)", width: 8350, height: 11811 },
  { label: "B1 landscape (300 DPI)", width: 11811, height: 8350 },
  { label: "Square (1080 × 1080)", width: 1080, height: 1080 },
];

export function findPreset(width: number, height: number): number {
  return PRESETS.findIndex((p) => p.width === width && p.height === height);
}

export type SizeGroup = "screen" | "print";

/** A size the poster step offers as a button; orientation turns it on its side. */
export interface SizeChoice {
  id: string;
  label: string;
  group: SizeGroup;
  /** Size in landscape (the longer side is the width). */
  width: number;
  height: number;
}

export const SIZE_CHOICES: SizeChoice[] = [
  { id: "screen", label: "Screen", group: "screen", width: 1600, height: 1200 },
  { id: "small", label: "Small", group: "screen", width: 800, height: 600 },
  { id: "square", label: "Square", group: "screen", width: 1080, height: 1080 },
  { id: "a4", label: "A4", group: "print", width: 3508, height: 2480 },
  { id: "a3", label: "A3", group: "print", width: 4961, height: 3508 },
  { id: "a2", label: "A2", group: "print", width: 7016, height: 4961 },
  // ISO B1 is 707 × 1000 mm. Few browsers can make a canvas this big (about 99 megapixels),
  // so many will reduce it to the largest size they can, with the usual note.
  { id: "b1", label: "B1", group: "print", width: 11811, height: 8350 },
];

export type Orientation = "landscape" | "portrait";

/** The pixel size of a choice in an orientation (a square is the same either way). */
export function sizeOf(
  choice: SizeChoice,
  orientation: Orientation,
): { width: number; height: number } {
  return orientation === "portrait"
    ? { width: choice.height, height: choice.width }
    : { width: choice.width, height: choice.height };
}

/** Which choice and orientation a size is, or undefined for a custom size. */
export function findChoice(
  width: number,
  height: number,
): { choice: SizeChoice; orientation: Orientation | "square" } | undefined {
  for (const choice of SIZE_CHOICES) {
    if (choice.width === width && choice.height === height) {
      return { choice, orientation: width === height ? "square" : "landscape" };
    }
    if (choice.height === width && choice.width === height) {
      return { choice, orientation: "portrait" };
    }
  }
  return undefined;
}

/** The orientation of a size: portrait when taller than wide, landscape when wider, none for a square. */
export function orientationOf(width: number, height: number): Orientation | "square" {
  if (width === height) return "square";
  return height > width ? "portrait" : "landscape";
}
