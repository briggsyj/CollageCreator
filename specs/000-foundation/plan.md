# Plan 000: Foundation

- **Repository**: a GitHub fork of the original, so authorship history and the "forked from" link are kept. The original Python was left in place until the TypeScript port existed, then removed in a clearly named commit.
- **Tooling**: Vite, TypeScript (strict, `noUncheckedIndexedAccess`), Vitest, Playwright (Chromium, Firefox, WebKit projects), Biome for linting and formatting (`noExplicitAny` and `noNonNullAssertion` as errors; the second is off in test code). It replaced ESLint, typescript-eslint and Prettier after the first merge: one tool and one config, much faster. Trade-off: Biome does not format Markdown or YAML, which Prettier used to.
- **CI** (`.github/workflows/ci.yaml`): header check, lint, typecheck, unit tests, build; e2e matrix over the three engines; Docker build and smoke test.
- **Licence tooling**: `scripts/check-headers.mjs`; `scripts/third-party-licenses.mjs` generates `THIRD-PARTY-LICENSES.txt` at build time and fails on a licence outside an allow-list of GPL-2.0-or-later-compatible ones. Apache-2.0 is on the list because the project licence allows "any later version" (GPL-3.0 is Apache-compatible).
- **Dependencies justified**: `canvas-size` (MIT) for runtime canvas limits (the plan names it); dev-only: Vite, TypeScript, Vitest, fast-check (property tests), Playwright, Biome, tsx.
