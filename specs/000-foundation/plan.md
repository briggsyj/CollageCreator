# Plan 000: Foundation

- **Repository**: a GitHub fork of the original, so authorship history and the "forked from" link are kept. The original Python was left in place until the TypeScript port existed, then removed in a clearly named commit.
- **Tooling**: Vite, TypeScript (strict, `noUncheckedIndexedAccess`), Vitest, Playwright (Chromium, Firefox, WebKit projects), ESLint (typescript-eslint strict, `no-explicit-any` as error), Prettier.
- **CI** (`.github/workflows/ci.yaml`): header check, lint, typecheck, unit tests, build; e2e matrix over the three engines; Docker build and smoke test.
- **Licence tooling**: `scripts/check-headers.mjs`; `scripts/third-party-licenses.mjs` generates `THIRD-PARTY-LICENSES.txt` at build time and fails on a licence outside an allow-list of GPL-2.0-or-later-compatible ones. Apache-2.0 is on the list because the project licence allows "any later version" (GPL-3.0 is Apache-compatible).
- **Dependencies justified**: `canvas-size` (MIT) for runtime canvas limits (the plan names it); dev-only: Vite, TypeScript, Vitest, fast-check (property tests), Playwright, ESLint, Prettier, tsx, globals.
