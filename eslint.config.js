// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "playwright-report", "test-results", "coverage"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Constitution principle 3: no explicit any without a justifying comment.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": true, "ts-expect-error": "allow-with-description" },
      ],
    },
  },
  {
    // Test code indexes fixtures it has just built; a non-null assertion is clearer than a guard.
    files: ["e2e/**", "tests/**"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
);
