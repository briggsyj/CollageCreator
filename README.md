# Collage Web

[![CI](https://github.com/briggsyj/PhotoCollage/actions/workflows/ci.yaml/badge.svg)](https://github.com/briggsyj/PhotoCollage/actions/workflows/ci.yaml)
[![Docker build](https://github.com/briggsyj/PhotoCollage/actions/workflows/docker.yaml/badge.svg)](https://github.com/briggsyj/PhotoCollage/actions/workflows/docker.yaml)
[![License: GPL v2 or later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)
[![Derived from PhotoCollage](https://img.shields.io/badge/derived%20from-adrienverge%2FPhotoCollage-informational.svg)](https://github.com/adrienverge/PhotoCollage)

> **A web reimplementation of [PhotoCollage](https://github.com/adrienverge/PhotoCollage) by Adrien Vergé and contributors.**
> Collage Web is an independent, modified version. It is not the original program and is not endorsed by the original authors.

Collage Web turns a set of photos into one poster. It runs entirely in your
browser: **photos are never uploaded**, and once the page has loaded it works
without a network connection.

It keeps what PhotoCollage is good at: random layouts that fill the whole
poster while keeping each photo as large as possible, with border colour and
width, photo swapping, and saving at high resolution. It replaces the Python/GTK
desktop program with a static web app that you can host anywhere or run with
Docker.

## Credit and licence

Collage Web is a derivative work of **PhotoCollage**, Copyright © 2013–2024
Adrien Vergé and contributors, and is released under the same terms: the
**GNU General Public License, version 2 or (at your option) any later version**
(SPDX: `GPL-2.0-or-later`). It comes with **no warranty**.

- The layout algorithm in [`src/core/layout.ts`](src/core/layout.ts) is a TypeScript port of the original's `collage.py`, and its tests are ported from `test_collage.py`.
- The drawing rules (crop to fill, borders) come from the original's `render.py`.
- The interface translations in [`src/i18n/po`](src/i18n/po) are the original project's, unchanged, with the translators' credits intact.
- The icon is the original's.

[**NOTICE.md**](NOTICE.md) lists the original authors and translators, what was
ported and what changed. Every file derived from the original keeps its
original copyright and licence notice and carries a dated change notice. The
full licence text is in [LICENSE](LICENSE); bundled libraries are listed in the
app's About dialog (`THIRD-PARTY-LICENSES.txt`, generated at build time).

The complete source is this repository, and the About dialog and the Docker
image's `org.opencontainers.image.source` label both link to it. This section is
general information, not legal advice.

## Features

- Add photos by file picker or drag and drop; works with 100+ photos
- Automatic layouts that fill the poster, using the original's layout algorithm
- Every layout has a **seed**: the same seed and photos give the same layout
- Poster size in pixels, with A4, A3 and A2 presets at 300 DPI; sizes your browser cannot produce are reduced to the largest available
- Border colour and thickness; swap two photos by clicking or from the keyboard
- Photos are shown the right way up (EXIF orientation)
- Save as PNG or JPEG, with progress and cancel; decoding runs in web workers
- Translations from the original: Bulgarian, Czech, German, Spanish, French, Italian, Dutch, Polish, Brazilian Portuguese, Russian, Ukrainian

## What is different from the original

|              | PhotoCollage                | Collage Web                                                     |
| ------------ | --------------------------- | --------------------------------------------------------------- |
| Platform     | Python + GTK desktop app    | Static web app, no backend                                      |
| Rendering    | Pillow / cairo              | Canvas 2D, `OffscreenCanvas` in a worker pool                   |
| Layouts      | New random layout each time | Same algorithm, reproducible from a seed                        |
| Maximum size | Limited by memory           | Limited by what the browser can allocate (detected at run time) |
| Packaging    | pip / distro packages       | Docker (nginx) or any static host                               |

## Run with Docker

```sh
docker compose up --build -d          # then open http://localhost:8080
docker compose down                   # stop
HOST_PORT=9000 docker compose up -d   # use another port
```

The container serves static files with nginx as a non-root user, sends a
Content Security Policy that allows no external origins, and needs no
configuration or secrets.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev            # dev server
npm test               # unit and property tests (Vitest)
npm run test:e2e       # end-to-end tests (Playwright; first run: npx playwright install)
npm run lint && npm run typecheck && npm run check:headers
npm run build          # production build in dist/
npm run bench          # layout benchmark
```

Every source file needs an SPDX identifier and a copyright line at the top;
`npm run check:headers` (also run in CI) enforces it. New files derived from the
original must keep its notice and add a dated change notice (see an existing
ported file such as `src/core/layout.ts`).

## How the project is organised

The project follows spec-driven development (Spec Kit layout). The principles
are in [.specify/memory/constitution.md](.specify/memory/constitution.md); each
feature has a `spec.md`, `plan.md` and `tasks.md` under [specs/](specs/); [specs/README.md](specs/README.md) tracks the status of each slice.

| Module          | Responsibility                               |
| --------------- | -------------------------------------------- |
| `src/core/`     | Pure layout generation and types; no DOM     |
| `src/io/`       | File import, validation, orientation         |
| `src/render/`   | Preview and export drawing, worker pool      |
| `src/platform/` | Canvas size limits                           |
| `src/ui/`       | Controls, state, wiring                      |
| `src/i18n/`     | Message catalogue (the original `.po` files) |

## Licence

Copyright © 2013–2024 Adrien Vergé and contributors (original PhotoCollage).
Copyright © 2026 briggsyj and contributors (Collage Web).

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.
