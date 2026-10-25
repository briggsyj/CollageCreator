// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
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
