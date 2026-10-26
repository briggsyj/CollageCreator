// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Layout benchmark. Run with `npm run bench`; add `--write` to record the
// result in benchmarks/layout.json (rerun when the layout core changes).

import { mkdirSync, writeFileSync } from "node:fs";
import { generateLayout } from "../src/core/layout";
import { seededRng } from "../src/core/rng";

function photos(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    width: 3000 + (i % 7) * 400,
    height: 2000 + (i % 5) * 500,
  }));
}

const results: Record<string, { meanMs: number; maxMs: number }> = {};
for (const n of [10, 50, 100, 200, 500]) {
  const times: number[] = [];
  for (let seed = 0; seed < 50; seed++) {
    const start = performance.now();
    generateLayout(photos(n), 0.75, seededRng(seed)).toLayout();
    times.push(performance.now() - start);
  }
  results[`${n} photos`] = {
    meanMs: Number((times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)),
    maxMs: Number(Math.max(...times).toFixed(2)),
  };
}
console.table(results);

if (process.argv.includes("--write")) {
  mkdirSync("benchmarks", { recursive: true });
  const record = { node: process.version, date: new Date().toISOString().slice(0, 10), results };
  writeFileSync("benchmarks/layout.json", `${JSON.stringify(record, null, 2)}\n`);
}
