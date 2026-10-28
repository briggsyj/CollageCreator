// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Translation report: lists the interface strings (the literal first argument of t() and tr()
// in src/) that a language's catalogue in src/i18n/po/ does not translate yet. Untranslated
// strings fall back to English, so by default this only reports; pass --strict to fail when
// any are missing, or --list to print them.
//
//   npm run check:i18n             counts per language
//   npm run check:i18n -- --list   and the missing strings

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const list = process.argv.includes("--list");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

/** Undo the escapes a JS string literal and a .po string both use. */
const unquote = (s) =>
  s.replace(/\\(n|t|"|'|\\)/g, (_, c) => (c === "n" ? "\n" : c === "t" ? "\t" : c));

const CALL = /\b(?:t|tr)\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
const used = new Set();
for (const file of walk("src").filter((f) => /\.(ts|svelte)$/.test(f))) {
  for (const m of readFileSync(file, "utf8").matchAll(CALL)) used.add(unquote(m[1] ?? m[2]));
}

/** msgids that have a non-empty, non-fuzzy translation. */
function translated(po) {
  const ids = new Set();
  let id = null;
  let str = null;
  let target = null;
  let fuzzy = false;
  let nextFuzzy = false;
  const flush = () => {
    if (id && str && !fuzzy) ids.add(id);
    id = str = target = null;
  };
  for (const raw of po.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("#,")) nextFuzzy = line.includes("fuzzy");
    else if (line.startsWith("msgid ")) {
      flush();
      fuzzy = nextFuzzy;
      nextFuzzy = false;
      id = unquote(line.slice(7, -1));
      target = "id";
    } else if (line.startsWith("msgstr ")) {
      str = unquote(line.slice(8, -1));
      target = "str";
    } else if (line.startsWith('"') && target) {
      const more = unquote(line.slice(1, -1));
      if (target === "id") id += more;
      else str += more;
    }
  }
  flush();
  return ids;
}

const dir = "src/i18n/po";
let missingAny = 0;
console.log(`${used.size} strings in the interface.`);
for (const file of readdirSync(dir)
  .filter((f) => f.endsWith(".po"))
  .sort()) {
  const have = translated(readFileSync(join(dir, file), "utf8"));
  const missing = [...used].filter((s) => !have.has(s)).sort();
  missingAny += missing.length;
  console.log(`${file.replace(".po", "").padEnd(6)} ${missing.length} untranslated`);
  if (list) for (const s of missing) console.log(`         ${JSON.stringify(s)}`);
}
if (strict && missingAny > 0) process.exit(1);
