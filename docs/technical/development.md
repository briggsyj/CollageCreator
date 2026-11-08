# Development

## Requirements

- Node.js 20 or newer (CI uses 22).
- For end-to-end tests, Playwright's browsers: `npx playwright install` (once).

## Getting started

```sh
git clone https://github.com/briggsyj/CollageCreator.git
cd CollageCreator
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Script                            | Does                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`                     | Vite dev server with hot reload                                                     |
| `npm run build`                   | type check, generate the third-party licence list, build to `dist/`                 |
| `npm run preview`                 | serve `dist/` (port 4173), as the e2e tests use                                     |
| `npm run lint` / `npm run format` | Biome lint and format check / fix                                                   |
| `npm run typecheck`               | `svelte-check` with the strict `tsconfig.json`                                      |
| `npm test`                        | Vitest unit and property tests (`tests/`)                                           |
| `npm run test:e2e`                | Playwright end-to-end tests (`e2e/`), all three engines                             |
| `npm run check:headers`           | licence header check (`scripts/check-headers.mjs`)                                  |
| `npm run check:i18n`              | report of untranslated strings (`-- --list` for the strings, `-- --strict` to fail) |
| `npm run bench`                   | layout benchmark (`scripts/bench-layout.ts`)                                        |

To run one engine or one file: `npx playwright test e2e/photos.spec.ts --project=chromium`. With a
locally installed Chromium, set `CHROMIUM_PATH`. To test an already running server (for example the
Docker container), set `E2E_BASE_URL`.

## Project layout

```text
src/
  core/        pure layout code: Mosaic, Gallery, search, pages, crops, split images, types
  io/          import, HEIC, ZIP read/write, PDF writer, saved work (IndexedDB), colours
  render/      preview and export drawing, view maths, worker pool, export worker
  platform/    canvas size limits
  i18n/        message lookup and the .po catalogues
  ui/          Svelte components, AppState, presets, the address, state helpers
  agent/       WebMCP tools for browser assistants
tests/         Vitest unit and property tests
e2e/           Playwright tests and helpers
specs/         feature specs (spec, plan, tasks), one folder per feature
scripts/       header and i18n checks, licence list, benchmark
docs/          this documentation
csp.ts         the Content Security Policy, shared by the build and nginx
nginx.conf, security-headers.conf, Dockerfile, compose.yaml   self-hosting
```

## Code style

See [CONTRIBUTING.md](../../CONTRIBUTING.md). In short: strict TypeScript; pure logic in
`src/core/` with tests; comments that explain why; interface text through `t()`/`tr()`; no inline
styles (the CSP forbids them); every button has a `title`; licence headers on every file.

Keep `AppState` methods thin: change the state, call pure code, set a status message. Logic that
does not need the live state goes in `src/core/` or `src/ui/state/` with unit tests.

## How features are planned

Features start as specs in [`specs/`](../../specs/README.md), following
[Spec Kit](https://github.com/github/spec-kit) (installed in `.specify/` and `.claude/skills/`):

1. `spec.md`: what and why, as user stories, requirements and success criteria; no technology.
2. Clarifications recorded in the spec.
3. `plan.md`: how, checked against the project constitution
   (`.specify/memory/constitution.md`).
4. `tasks.md`: the work, in order, each with a file path.

Small fixes do not need a spec. When an implementation changes the design, update the spec and
plan in the same change.

## Pull requests

Before opening one, run `npm run lint`, `npm run typecheck`, `npm run check:headers`, `npm test`
and the e2e tests you touched. CI runs everything, in three browsers, plus a Docker build and a
build under a sub-path, and posts a preview site for the pull request.
