// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { generateLayout, type LayoutOptions, type Page } from "./layout";
import { type Rng, seededRng } from "./rng";
import { generateSlicingLayout } from "./slicing";
import type { Layout, LayoutPage, LayoutPhoto, LayoutStyle, PhotoSize } from "./types";

/** How many candidate layouts the first generation tries. */
export const DEFAULT_TRIES = 30;

/** Gallery refines each candidate, so it needs fewer of them. */
export const GALLERY_TRIES = 10;

export interface LayoutScore {
  /** Share of the poster no photo covers (gaps), 0 to 1. */
  uncovered: number;
  /** Average share of each photo's picture that is cropped away, 0 to 1. */
  cutOff: number;
}

/**
 * How well a layout fits its photos. Each photo is scaled to cover its cell and
 * cropped to it, so the part kept is the smaller of the two shape ratios divided
 * by the larger; a photo whose cell has collapsed to nothing counts as fully cut
 * off. Lower is better for both numbers.
 */
export function scoreLayout(layout: Layout, photos: readonly PhotoSize[]): LayoutScore {
  const posterArea = layout.width * layout.height;
  let covered = 0;
  let cutOff = 0;
  for (const { photoIndex, cell } of layout.placements) {
    covered += cell.w * cell.h;
    const photo = photos[photoIndex];
    if (!photo || cell.w <= 0 || cell.h <= 0) {
      cutOff += 1;
      continue;
    }
    const photoRatio = photo.height / photo.width;
    const cellRatio = cell.h / cell.w;
    cutOff += 1 - Math.min(cellRatio / photoRatio, photoRatio / cellRatio);
  }
  return {
    uncovered: posterArea > 0 ? Math.max(0, 1 - covered / posterArea) : 0,
    cutOff: layout.placements.length > 0 ? cutOff / layout.placements.length : 0,
  };
}

/** Gaps matter more than cropping: a hole is a visible flaw, a tighter crop is not. */
export function isBetter(a: LayoutScore, b: LayoutScore): boolean {
  if (Math.abs(a.uncovered - b.uncovered) > 1e-6) return a.uncovered < b.uncovered;
  return a.cutOff < b.cutOff;
}

export interface BestLayout {
  page: Page;
  /** The seed that produces exactly this layout again with `generateLayout`. */
  seed: number;
  score: LayoutScore;
  /** How many candidates were generated. */
  tried: number;
}

export interface SearchOptions extends LayoutOptions {
  /** Number of candidates to generate (default 30). */
  tries?: number;
}

/**
 * Generate candidates with `make` and keep the one that crops the photos least.
 * `masterSeed` decides the seed of every candidate, so the search is repeatable.
 */
function searchBest<P extends LayoutPage>(
  make: (rng: Rng) => P,
  photos: readonly LayoutPhoto[],
  masterSeed: number,
  tries: number,
): { page: P; seed: number; score: LayoutScore; tried: number } {
  const count = Math.max(1, Math.floor(tries));
  const master = seededRng(masterSeed);
  let best: { page: P; seed: number; score: LayoutScore; tried: number } | undefined;
  for (let i = 0; i < count; i++) {
    const seed = Math.floor(master.random() * 2 ** 32) >>> 0;
    const page = make(seededRng(seed));
    const score = scoreLayout(page.toLayout(), photos);
    if (!best || isBetter(score, best.score)) best = { page, seed, score, tried: count };
  }
  return best as { page: P; seed: number; score: LayoutScore; tried: number };
}

/**
 * Generate several Mosaic candidates and keep the one that crops the photos least.
 * `masterSeed` makes the search repeatable: it decides the seed of every candidate,
 * and the winner's own seed is returned so it can be shown, typed back in, and give
 * the same layout without searching again.
 */
export function generateBest(
  photos: readonly LayoutPhoto[],
  posterRatio: number,
  masterSeed: number,
  { tries = DEFAULT_TRIES, ...options }: SearchOptions = {},
): BestLayout {
  return searchBest(
    (rng) => generateLayout(photos, posterRatio, rng, options),
    photos,
    masterSeed,
    tries,
  );
}

export interface BestPage {
  page: LayoutPage;
  seed: number;
  score: LayoutScore;
  tried: number;
}

/** One arrangement in the chosen style (Mosaic uses `columns`; Gallery has none). */
export function generatePage(
  style: LayoutStyle,
  photos: readonly LayoutPhoto[],
  posterRatio: number,
  rng: Rng,
  options: LayoutOptions = {},
): LayoutPage {
  return style === "gallery"
    ? generateSlicingLayout(photos, posterRatio, rng)
    : generateLayout(photos, posterRatio, rng, options);
}

/** The best of several arrangements in the chosen style, as `generateBest` does for Mosaic. */
export function generateBestPage(
  style: LayoutStyle,
  photos: readonly LayoutPhoto[],
  posterRatio: number,
  masterSeed: number,
  { tries = style === "gallery" ? GALLERY_TRIES : DEFAULT_TRIES, ...options }: SearchOptions = {},
): BestPage {
  return searchBest(
    (rng) => generatePage(style, photos, posterRatio, rng, options),
    photos,
    masterSeed,
    tries,
  );
}
