// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Licence header check, run in CI. Only checks files git knows about (tracked,
// or untracked and not ignored). Rules:
//  - every source file starts with the SPDX licence identifier;
//  - a file derived from PhotoCollage (its header says "a modified version of
//    PhotoCollage") must also keep the original author's copyright line and
//    carry a dated "CHANGED on" notice, as the GPL requires.
//  - every source file carries this project's own copyright line.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

const SPDX = "SPDX-License-Identifier: GPL-2.0-or-later";
const DERIVED = /a modified version of\s+PhotoCollage/;
const ORIGINAL_COPYRIGHT = /Copyright \(C\) \d{4}[^\n]*Adrien Vergé/;
const OWN_COPYRIGHT = /Copyright \(C\) \d{4}(?:[–-]\d{4})? John Briggs/;
const CHANGE_NOTICE = /CHANGED on \d{4}-\d{2}-\d{2}/;
const EXTENSIONS = new Set([
  ".ts",
  ".js",
  ".mjs",
  ".css",
  ".html",
  ".svelte",
  ".yaml",
  ".yml",
  ".conf",
]);
const NAMES = new Set(["Dockerfile", ".dockerignore"]);
// Third-party or data files that carry their own notices.
// Spec Kit's own files (MIT, installed by `specify init`) keep their upstream form; the
// project's constitution in .specify/memory/ is checked like any other file.
const SKIP = [
  /^src\/i18n\/po\//,
  /^public\/icon\.svg$/,
  /^LICENSE$/,
  /^package-lock\.json$/,
  /^\.claude\//,
  /^\.specify\/(?!memory\/)/,
];

const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const failures = [];
for (const file of files) {
  if (SKIP.some((re) => re.test(file))) continue;
  if (!EXTENSIONS.has(extname(file)) && !NAMES.has(basename(file))) continue;
  let head;
  try {
    head = readFileSync(file, "utf8").split("\n").slice(0, 40).join("\n");
  } catch {
    continue; // deleted but still listed
  }
  if (!head.includes(SPDX)) {
    failures.push(`${file}: missing "${SPDX}"`);
  } else if (!OWN_COPYRIGHT.test(head)) {
    failures.push(`${file}: missing "Copyright (C) <year> John Briggs"`);
  } else if (DERIVED.test(head)) {
    if (!ORIGINAL_COPYRIGHT.test(head)) {
      failures.push(
        `${file}: derived file lost the original "Copyright (C) <year> Adrien Vergé" line`,
      );
    }
    if (!CHANGE_NOTICE.test(head)) {
      failures.push(`${file}: derived file needs a dated "CHANGED on YYYY-MM-DD" notice`);
    }
  }
}

if (failures.length) {
  console.error(`Licence header check failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`Licence headers OK (${files.length} files scanned).`);
