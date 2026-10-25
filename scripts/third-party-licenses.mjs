// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

// Generates public/THIRD-PARTY-LICENSES.txt from the production dependencies
// and fails if any of them has a licence that is not GPL-2.0-or-later
// compatible. Also copies LICENSE and NOTICE.md next to it so the built app
// can link to them from its About dialog.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

// Licences that can be combined with GPL-2.0-or-later. Apache-2.0 is
// compatible with GPL-3.0 only; that is fine because this project's licence
// allows "any later version", so a combined work is distributable under GPL-3.0.
const ALLOWED = new Set([
  "MIT",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "0BSD",
  "Zlib",
  "Unlicense",
  "CC0-1.0",
  "Apache-2.0",
]);

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const seen = new Map();

function visit(name) {
  if (seen.has(name)) return;
  const dir = join(root, "node_modules", name);
  if (!existsSync(dir)) throw new Error(`Dependency ${name} is not installed; run npm ci`);
  const meta = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const file = readdirSync(dir).find((f) => /^(licen[cs]e|copying)(\.|$)/i.test(f));
  seen.set(name, {
    name,
    version: meta.version,
    license: typeof meta.license === "string" ? meta.license : (meta.license?.type ?? "UNKNOWN"),
    homepage: meta.homepage ?? meta.repository?.url ?? "",
    text: file ? readFileSync(join(dir, file), "utf8").trim() : "(no licence file shipped)",
  });
  for (const dep of Object.keys(meta.dependencies ?? {})) visit(dep);
}

for (const dep of Object.keys(pkg.dependencies ?? {})) visit(dep);

const bad = [...seen.values()].filter((d) => !ALLOWED.has(d.license));
if (bad.length) {
  console.error("Licences not known to be GPL-2.0-or-later compatible:");
  for (const d of bad) console.error(`  ${d.name}@${d.version}: ${d.license}`);
  process.exit(1);
}

const out = [
  "Third-party software bundled in Collage Web",
  "===========================================",
  "",
  "Collage Web itself is GPL-2.0-or-later; see LICENSE and NOTICE.md.",
  "The libraries below are shipped in the built application.",
  "",
];
for (const d of [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))) {
  out.push(
    `${d.name} ${d.version}  (${d.license})`,
    d.homepage,
    "",
    d.text,
    "",
    "-".repeat(70),
    "",
  );
}

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "THIRD-PARTY-LICENSES.txt"), out.join("\n"));
// Copied as .txt so every static host (GitHub Pages included) serves them as plain text
// instead of offering a download.
copyFileSync(join(root, "LICENSE"), join(root, "public", "LICENSE.txt"));
copyFileSync(join(root, "NOTICE.md"), join(root, "public", "NOTICE.txt"));
console.log(`Wrote licences for ${seen.size} package(s): ${[...seen.keys()].join(", ")}`);
