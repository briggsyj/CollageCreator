# Contributing

Thanks for helping. Collage Creator is GPL-2.0-or-later and derived from
[PhotoCollage](https://github.com/adrienverge/PhotoCollage); contributions are accepted under the
same licence.

## Set up

Node.js 20 or newer.

```sh
npm ci
npm run dev                    # http://localhost:5173
```

## Before you open a pull request

```sh
npm run lint                   # Biome: lint and formatting (npm run format fixes most)
npm run typecheck              # svelte-check and TypeScript, strict
npm run check:headers          # licence headers (see below)
npm test                       # unit and property tests
npm run test:e2e               # Playwright (first run: npx playwright install)
npm run check:i18n             # report of untranslated strings (does not fail)
```

CI runs all of these, the end-to-end tests in Chromium, Firefox and WebKit, a Docker build and a
build under a sub-path. Every pull request also gets a preview site, linked in a comment.

## How work is planned

Features are written as specs first, in [specs/](specs/): `spec.md` (what and why, with a
gate that says when it is done), `plan.md` (how) and `tasks.md`. Small fixes do not need a
spec. Read [ARCHITECTURE.md](ARCHITECTURE.md) for where code belongs.

## Code style

- TypeScript, strict. Pure logic in `src/core/` (no DOM) with unit tests.
- Comments explain _why_, in plain English, as full sentences; doc comments on exported
  functions and on anything not obvious from its name.
- Interface text goes through `t()` (in TypeScript) or `tr()` (in components) so it can be
  translated; keep it short and plain.
- No inline `<style>` or `style=""` strings: the Content Security Policy forbids them. Use CSS
  classes, or Svelte `style:` directives (set through the CSSOM).
- Every button has a `title` (a test checks this).
- End-to-end tests describe what a person does and sees; wait on `previewIdle`, `settle` or
  `savedWork` rather than fixed timeouts.

## Licence headers

Every source file starts with:

```
// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 <your name>
```

A file derived from the original also keeps the original author's copyright line and a dated
"CHANGED on" notice (see `src/core/layout.ts`). `npm run check:headers` enforces this.

## Translations

The catalogues in `src/i18n/po/` are the original project's. Strings added since are shown in
English until translated; `npm run check:i18n -- --list` lists them per language.
