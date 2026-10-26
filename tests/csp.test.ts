// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CSP } from "../csp";

describe("Content Security Policy", () => {
  it("allows no external origins", () => {
    expect(CSP).not.toMatch(/https?:|\*/);
    expect(CSP).toContain("default-src 'none'");
  });

  it("is the same in the nginx headers and the built page's meta tag", () => {
    const conf = readFileSync("security-headers.conf", "utf8");
    const header = /add_header Content-Security-Policy "([^"]+)"/.exec(conf)?.[1];
    // A <meta> tag cannot carry frame-ancestors, so only nginx adds it.
    expect(header).toBe(`${CSP}; frame-ancestors 'none'`);
  });
});
