// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

// Fails if a source file lacks an SPDX licence identifier and a copyright line
// in its first lines. Run in CI. Only checks files git knows about (tracked, or
// untracked and not ignored).

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

const SPDX = "SPDX-License-Identifier: GPL-2.0-or-later";
const EXTENSIONS = new Set([".ts", ".js", ".mjs", ".css", ".html", ".yaml", ".yml", ".conf"]);
const NAMES = new Set(["Dockerfile", ".dockerignore"]);
// Third-party or data files that carry their own notices.
const SKIP = [/^src\/i18n\/po\//, /^public\/icon\.svg$/, /^LICENSE$/, /^package-lock\.json$/];

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
  if (!head.includes(SPDX)) failures.push(`${file}: missing "${SPDX}"`);
  else if (!/Copyright \(C\)/.test(head)) failures.push(`${file}: missing a "Copyright (C)" line`);
}

if (failures.length) {
  console.error(`Licence header check failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`Licence headers OK (${files.length} files scanned).`);
