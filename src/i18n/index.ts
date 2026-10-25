// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
//
// This file is part of Collage Web, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it loads the original project's gettext translation files (src/i18n/po,
// moved unchanged from photocollage/locale/*/LC_MESSAGES/photocollage.po with
// the translators' copyright and credit lines intact).
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import { type Messages, parsePo } from "./po";

// Constitution principle 8: user-visible strings live in a message catalogue.
// English source strings are the keys; the original translations cover the
// strings that also existed in the GTK version, the rest falls back to English.
const files = import.meta.glob("./po/*.po", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const catalogues: Record<string, Messages> = {};
for (const [path, source] of Object.entries(files)) {
  const code = /\/([^/]+)\.po$/.exec(path)?.[1];
  if (code) catalogues[code] = parsePo(source);
}

export const languages = ["en", ...Object.keys(catalogues).sort()];

let current = "en";

/** The supported language for a BCP 47 tag (exact, or by its base language), or undefined. */
function matchLanguage(tag: string | undefined): string | undefined {
  if (!tag) return undefined;
  const norm = tag.replace("-", "_").toLowerCase();
  const exact = languages.find((l) => l.toLowerCase() === norm);
  if (exact) return exact;
  const base = norm.split("_")[0];
  return (
    languages.find((l) => l.toLowerCase() === base) ??
    languages.find((l) => l.split("_")[0]?.toLowerCase() === base)
  );
}

/** Pick the best supported language for a BCP 47 tag, or English. */
export function resolveLanguage(tag: string | undefined): string {
  return matchLanguage(tag) ?? "en";
}

/**
 * Pick a language from a preference list such as `navigator.languages`: the first
 * entry we have a translation for, or English if none (or the list is empty).
 */
export function preferredLanguage(tags: readonly (string | undefined)[] | undefined): string {
  for (const tag of tags ?? []) {
    const found = matchLanguage(tag);
    if (found) return found;
  }
  return "en";
}

export function setLanguage(tag: string): string {
  current = resolveLanguage(tag);
  return current;
}

export function getLanguage(): string {
  return current;
}

/** Translate `key`, replacing `%(name)s` placeholders from `params`. */
export function t(key: string, params?: Record<string, string | number>): string {
  const text = catalogues[current]?.[key] ?? key;
  if (!params) return text;
  return text.replace(/%\((\w+)\)s/g, (m, name: string) =>
    name in params ? String(params[name]) : m,
  );
}
