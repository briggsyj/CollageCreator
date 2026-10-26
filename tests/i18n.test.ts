// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { beforeEach, describe, expect, it } from "vitest";
import {
  getLanguage,
  languages,
  preferredLanguage,
  resolveLanguage,
  setLanguage,
  t,
} from "../src/i18n";
import { parsePo } from "../src/i18n/po";

describe("parsePo", () => {
  it("parses entries, continuations and escapes, and skips header, fuzzy and empty", () => {
    const m = parsePo(
      [
        "# comment",
        'msgid ""',
        'msgstr ""',
        '"Language: fr\\n"',
        "",
        "#: file.py:1",
        'msgid "Hello"',
        'msgstr "Bonjour"',
        "",
        'msgid ""',
        '"Two "',
        '"lines\\n"',
        'msgstr ""',
        '"Deux "',
        '"lignes\\n"',
        "",
        "#, fuzzy",
        'msgid "Fuzzy"',
        'msgstr "Flou"',
        "",
        'msgid "Empty"',
        'msgstr ""',
        "",
        'msgid "Quote"',
        'msgstr "dit \\"oui\\""',
      ].join("\n"),
    );
    expect(m).toEqual({ Hello: "Bonjour", "Two lines\n": "Deux lignes\n", Quote: 'dit "oui"' });
  });
});

describe("catalogue", () => {
  beforeEach(() => setLanguage("en"));

  it("bundles the original project's translations", () => {
    for (const l of ["bg", "cs", "de", "es", "fr", "it", "nl", "pl", "pt_BR", "ru", "uk"]) {
      expect(languages).toContain(l);
    }
  });

  it("translates strings from the original and falls back to English", () => {
    setLanguage("fr");
    expect(t("Save poster...")).toBe("Enregistrer le poster...");
    expect(t("A string that is not in any catalogue")).toBe(
      "A string that is not in any catalogue",
    );
  });

  it("interpolates named placeholders", () => {
    expect(t("Skipped %(name)s", { name: "a.jpg" })).toBe("Skipped a.jpg");
  });

  it("resolves browser language tags", () => {
    expect(resolveLanguage("fr-FR")).toBe("fr");
    expect(resolveLanguage("pt-BR")).toBe("pt_BR");
    expect(resolveLanguage("ja")).toBe("en");
    expect(resolveLanguage(undefined)).toBe("en");
    setLanguage("de-AT");
    expect(getLanguage()).toBe("de");
  });
});

describe("preferredLanguage", () => {
  it("takes the first browser language that has a translation", () => {
    expect(preferredLanguage(["de-AT", "fr"])).toBe("de");
    expect(preferredLanguage(["xx", "fr-CA", "de"])).toBe("fr");
  });

  it("matches a regional variant to the translation of its language", () => {
    expect(preferredLanguage(["pt-PT"])).toBe("pt_BR");
    expect(preferredLanguage(["pt-BR"])).toBe("pt_BR");
  });

  it("falls back to English when nothing matches or nothing is known", () => {
    expect(preferredLanguage(["xx", "zz-ZZ"])).toBe("en");
    expect(preferredLanguage([])).toBe("en");
    expect(preferredLanguage(undefined)).toBe("en");
    expect(preferredLanguage([undefined, ""])).toBe("en");
  });
});
