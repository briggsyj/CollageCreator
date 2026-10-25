# Collage Web

_A web reimplementation of [PhotoCollage](https://github.com/adrienverge/PhotoCollage) by Adrien Vergé and contributors._

Collage Web turns a set of photos into one poster. It runs entirely in your
browser: **photos are never uploaded**, and after the page has loaded it works
without a network connection.

It is an independent, modified version of PhotoCollage, not the original, and
is not endorsed by its authors. It is released under the same terms as the
original, the **GNU GPL, version 2 or (at your option) any later version**
(`GPL-2.0-or-later`), with **no warranty**. See [LICENSE](LICENSE) and
[NOTICE.md](NOTICE.md) for credits and what was ported.

## Features

- Add photos by file picker or drag and drop; works with 100+ photos
- Automatic layouts that fill the poster, using the original's layout algorithm
- Every layout has a **seed**: the same seed gives the same layout
- Poster size in pixels, with A4/A3/A2 presets at 300 DPI
- Border colour and thickness; swap two photos by clicking (or with the keyboard)
- Save as PNG or JPEG, with progress and cancel; large exports run in workers
- Translations from the original (Bulgarian, Czech, German, Spanish, French,
  Italian, Dutch, Polish, Brazilian Portuguese, Russian, Ukrainian)

## Run with Docker

```sh
docker compose up --build -d   # then open http://localhost:8080
docker compose down            # stop
HOST_PORT=9000 docker compose up -d   # use another port
```

The container serves static files with nginx, runs as a non-root user, and
needs no configuration or secrets.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev          # dev server
npm test             # unit and property tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright; first: npx playwright install)
npm run lint && npm run typecheck && npm run check:headers
npm run build        # production build in dist/
npm run bench        # layout benchmark
```

### Known failing tests

`tests/layout.properties.test.ts` contains tests that require layouts to tile
the poster exactly. The original algorithm sometimes leaves gaps, which was
kept deliberately for now; those tests fail until the layout is improved. See
[specs/001-create-and-export-collage/research.md](specs/001-create-and-export-collage/research.md).

## How this project is organised

The project follows spec-driven development (Spec Kit layout): the principles
are in [.specify/memory/constitution.md](.specify/memory/constitution.md) and each
feature has `spec.md`, `plan.md` and `tasks.md` under [specs/](specs/).

| Module          | Responsibility                           |
| --------------- | ---------------------------------------- |
| `src/core/`     | Pure layout generation and types; no DOM |
| `src/io/`       | File import, validation, orientation     |
| `src/render/`   | Preview and export drawing, worker pool  |
| `src/platform/` | Canvas size limits                       |
| `src/ui/`       | Controls, state, wiring                  |
| `src/i18n/`     | Message catalogue (original `.po` files) |

## Licence

Copyright (C) 2013–2014 Adrien Vergé and contributors (original PhotoCollage).
Copyright (C) 2026 briggsyj and contributors (this version).

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version. This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
details.
