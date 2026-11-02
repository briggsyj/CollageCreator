// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { PhotoRef, RefusalCode } from "./types";

/** Photo indexes by page then position (both 0-based), as the collage stands. */
export type PageIndex = readonly (readonly number[])[];

export type Resolved =
  | { ok: true; index: number }
  | { ok: false; code: RefusalCode; message: string };

/** The photo an assistant's page and position (counting from 1) point at, if there is one. */
export function resolvePhoto(ref: unknown, pages: PageIndex): Resolved {
  const r = ref as Partial<PhotoRef> | null | undefined;
  if (!r || !Number.isInteger(r.page) || !Number.isInteger(r.position)) {
    return {
      ok: false,
      code: "bad-value",
      message: "A photo is { page, position }, counting from 1.",
    };
  }
  const page = pages[(r.page as number) - 1];
  if (!page) {
    return {
      ok: false,
      code: "no-such-page",
      message: `There is no page ${r.page}; the collage has ${pages.length}.`,
    };
  }
  const index = page[(r.position as number) - 1];
  if (index === undefined) {
    return {
      ok: false,
      code: "no-such-photo",
      message: `Page ${r.page} has ${page.length} photo(s); there is no position ${r.position}. Read the state again.`,
    };
  }
  return { ok: true, index };
}

/** Resolve several photos at once; the first problem is reported. */
export function resolvePhotos(
  refs: unknown,
  pages: PageIndex,
): { ok: true; indices: number[] } | Extract<Resolved, { ok: false }> {
  if (!Array.isArray(refs) || refs.length === 0) {
    return {
      ok: false,
      code: "bad-value",
      message: "Give at least one photo as { page, position }.",
    };
  }
  const indices: number[] = [];
  for (const ref of refs) {
    const one = resolvePhoto(ref, pages);
    if (!one.ok) return one;
    if (!indices.includes(one.index)) indices.push(one.index);
  }
  return { ok: true, indices };
}

/** A whole number within [min, max], or undefined. */
export function wholeIn(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max
    ? value
    : undefined;
}

/** A number within [min, max], or undefined. */
export function numberIn(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
    ? value
    : undefined;
}
