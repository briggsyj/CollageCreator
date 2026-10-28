// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { PER_PAGE_DEFAULT } from "../../core/book";
import { type LayoutStyle, NO_SPAN, type PosterSettings } from "../../core/types";
import { fileKey, type ImportedPhoto } from "../../io/import";
import type { SavedPhoto, SavedSession } from "../../io/session";

/** What of the app's state is kept between visits. */
export interface WorkToSave {
  photos: readonly ImportedPhoto[];
  /** How many pages; a page number is kept for each photo only when there are two or more. */
  pageCount: number;
  seed: number;
  columns: number | undefined;
  layoutStyle: LayoutStyle;
  /** A plain copy (`$state.snapshot`), not the live settings. */
  settings: PosterSettings;
}

/** The record kept in browser storage for this work (the photo files are stored apart). */
export function toSavedSession(work: WorkToSave): SavedSession {
  const book = work.pageCount > 1;
  return {
    v: 1,
    photos: work.photos.map((p) => ({
      key: fileKey(p.file),
      span: p.span ?? { ...NO_SPAN },
      ...(p.crop ? { crop: p.crop } : {}),
      ...(book && p.bookPage !== undefined ? { page: p.bookPage } : {}),
    })),
    seed: work.seed,
    columns: work.columns,
    layoutStyle: work.layoutStyle,
    // perPage is no longer used; it is still written so older versions can read the record.
    ...(book ? { book: { pages: work.pageCount, perPage: PER_PAGE_DEFAULT } } : {}),
    settings: work.settings,
  };
}

/** Give photos read back from storage their saved size request, crop and page. */
export function withSavedDetails(
  photos: readonly ImportedPhoto[],
  saved: readonly SavedPhoto[],
): ImportedPhoto[] {
  const byKey = new Map(saved.map((p) => [p.key, p]));
  return photos.map((photo) => {
    const kept = byKey.get(fileKey(photo.file));
    return {
      ...photo,
      span: { ...(kept?.span ?? NO_SPAN) },
      ...(kept?.crop ? { crop: kept.crop } : {}),
      ...(kept?.page !== undefined ? { bookPage: kept.page } : {}),
    };
  });
}
