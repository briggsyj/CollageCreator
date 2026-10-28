// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { PhotoSpan } from "../../core/types";
import { t } from "../../i18n";
import type { SkippedFile } from "../../io/import";

/** What was skipped while adding photos, for the notice in the Photos step. */
export interface Notice {
  summary: string;
  /** Why, by reason: "3 already added, 1 not an image". */
  reasons: string;
  items: string[];
  kind: "info" | "error";
}

/** How long a notice about already-added photos stays before it goes by itself. */
export const DUPLICATE_NOTICE_MS = 10_000;

/**
 * Summarise what was not added: counts by reason, with every file name for Details. Only
 * already-added photos make an "info" notice (it goes by itself); anything else is an error.
 */
export function summariseSkipped(skipped: readonly SkippedFile[]): Notice | null {
  if (skipped.length === 0) return null;
  const count = (reason: SkippedFile["reason"]) =>
    skipped.filter((s) => s.reason === reason).length;
  const duplicates = count("duplicate");
  const notImages = count("not-image");
  const unreadable = count("unreadable");
  const parts: string[] = [];
  if (duplicates) parts.push(t("%(n)s already added", { n: duplicates }));
  if (notImages) parts.push(t("%(n)s not an image", { n: notImages }));
  if (unreadable) parts.push(t("%(n)s could not be opened", { n: unreadable }));
  return {
    summary:
      skipped.length === 1
        ? t("1 file was not added")
        : t("%(n)s files were not added", { n: skipped.length }),
    reasons: parts.join(", "),
    items: skipped.map((s) => {
      const why =
        s.reason === "duplicate"
          ? t("already added")
          : s.reason === "not-image"
            ? t("not an image")
            : t("could not be opened");
      return `${s.name}: ${why}`;
    }),
    kind: duplicates === skipped.length ? "info" : "error",
  };
}

/** Describe a photo's requested size for the list ("" when it asks for nothing). */
export function describeSpan(span: PhotoSpan | undefined): string {
  const parts: string[] = [];
  if (span?.columns === 2) parts.push(t("wider"));
  if (span && span.rows > 1) parts.push(`${t("taller")} ×${span.rows}`);
  return parts.join(" · ");
}
