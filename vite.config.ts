// SPDX-License-Identifier: GPL-2.0-or-later

import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { CSP } from "./csp.ts";

/**
 * Put the Content Security Policy in the built page itself, so it also applies
 * on hosts that cannot send headers (GitHub Pages). Build only: the dev server
 * needs looser rules for hot reloading.
 */
function cspMeta(): Plugin {
  return {
    name: "csp-meta",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (html) =>
        html.replace(
          "<head>",
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
        ),
    },
  };
}

export default defineConfig({
  // Relative, so the same build works at a site root, under /<repo>/ on GitHub Pages, and in Docker.
  base: "./",
  plugins: [cspMeta()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  worker: {
    format: "es",
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
