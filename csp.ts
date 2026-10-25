// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

/**
 * The Content Security Policy that enforces the privacy principle: the page may
 * only load its own files. Photos are decoded in same-origin workers; `blob:`
 * is needed for downloads and workers.
 *
 * Servers that can set headers (nginx, see security-headers.conf) send this
 * plus `frame-ancestors 'none'`. Static hosts that cannot (GitHub Pages) get it
 * from a <meta> tag injected at build time (see vite.config.ts), where
 * `frame-ancestors` is not allowed. tests/csp.test.ts keeps the two in step.
 */
export const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");
