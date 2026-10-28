// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/** Small wrappers round browser facilities the app state uses: storage, languages, downloads. */

const LANG_KEY = "collage-creator.language";
/** What the key was called before the app was renamed, still read so a saved choice is kept. */
const OLD_LANG_KEY = "collage-web.language";

/** The language chosen in an earlier visit, if any. */
export function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANG_KEY) ?? localStorage.getItem(OLD_LANG_KEY);
  } catch {
    return null;
  }
}

/** The browser's language preferences, most preferred first; empty if it does not say. */
export function browserLanguages(): readonly string[] {
  try {
    const list = navigator.languages;
    return list?.length ? list : navigator.language ? [navigator.language] : [];
  } catch {
    return [];
  }
}

/** Remember the chosen language for the next visit. */
export function storeLanguage(code: string): void {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    // storage may be unavailable (private mode); the choice just isn't remembered
  }
}

/** Hand a file to the browser to save. */
export function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
