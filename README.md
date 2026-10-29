# Collage Creator

[![CI](https://github.com/briggsyj/CollageCreator/actions/workflows/ci.yaml/badge.svg)](https://github.com/briggsyj/CollageCreator/actions/workflows/ci.yaml)
[![License: GPL v2 or later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)
[![Derived from PhotoCollage](https://img.shields.io/badge/derived%20from-adrienverge%2FPhotoCollage-informational.svg)](https://github.com/adrienverge/PhotoCollage)

**Turn your photos into a tidy collage, right in your browser. Free, private, nothing to install.**

### 👉 [Open Collage Creator](https://briggsyj.github.io/CollageCreator/)

- **Easy:** drop in your photos and a collage appears. Pick a size, tweak the look, save.
- **Private:** everything happens on your device. Your photos are never uploaded, and once the
  page has loaded it even works offline.
- **Free and open source:** no account, no watermark, no ads.

## How it works

1. **Add photos.** Choose them, drag them onto the page, or drop a zipped folder of them.
2. **Make it yours.** Pick an output size, a layout, borders and corners. Swap photos, make one
   wider or taller, or crop it.
3. **Save.** Download a PNG or JPEG. A collage with several pages, or an Instagram carousel, comes
   as a zip of images.

Your work is kept in your browser, so a refresh doesn't lose it.

## Features

**Layouts**
- **Mosaic** (photos in columns of different heights) or **Gallery** (one panel per photo); the
  first arrangement shown is the best of many tries
- Shuffle for a new arrangement, or set the number of columns yourself
- Every arrangement has a seed in the address, so you can share or return to it

**Sizes and pages**
- Screen, print (A4 to B1 at 300 DPI), social and custom sizes, landscape or portrait
- **Pages:** add as many pages as you need, each saved as its own image; drag photos between them
- **Instagram carousel:** one wide collage cut into square images, with cut marks in the preview

**Editing**
- Swap two photos, select several at once, make a photo wider or taller, or crop it
- Border colour and thickness, square or rounded corners, with or without an outer border
- Undo removals; confirmations before anything you can't easily take back

**Everywhere**
- Works on phones and tablets (pinch to zoom, press and hold to drag photos) as well as desktop
- Light and dark themes with a frosted glass look
- Keyboard friendly, with a tooltip on every button
- Handles 100+ photos, HEIC photos from iPhones, and photos taken sideways

## Host your own copy

It is a static site, so any web server will do.

- **Docker:** `docker compose up --build -d`, then open <http://localhost:8080>
  (`HOST_PORT=9000 docker compose up -d` for another port). nginx runs as a non-root user with a
  strict Content Security Policy and needs no configuration.
- **GitHub Pages:** fork the repository and set **Settings → Pages → Source** to GitHub Actions;
  pushes to `master` then publish automatically. To also get a preview site for each pull
  request, use **Deploy from a branch → `gh-pages`** instead (the workflows keep it up to date).

## Contribute

Bug reports and pull requests are welcome. You need Node.js 20 or newer:

```sh
npm ci
npm run dev        # start the app locally
npm test           # unit tests
npm run test:e2e   # browser tests (first run: npx playwright install)
```

- [CONTRIBUTING.md](CONTRIBUTING.md): checks to run, code style, licence headers, translations
- [ARCHITECTURE.md](ARCHITECTURE.md): how the code fits together
- [specs/](specs/): how each feature was planned

**Translations** come from the original project. Many newer strings are still English only;
`npm run check:i18n -- --list` shows what each language needs, and help is very welcome.

## Credit and licence

Collage Creator is based on [PhotoCollage](https://github.com/adrienverge/PhotoCollage) by
Adrien Vergé and contributors, rebuilt as a web app. It is an independent, modified version and
is not endorsed by the original authors.

- The Mosaic layout is a TypeScript port of the original's `collage.py` (with its tests), and the
  drawing rules come from its `render.py`.
- The translations in [`src/i18n/po`](src/i18n/po) and the icon are the original project's, with
  the translators' credits intact.
- [NOTICE.md](NOTICE.md) lists the original authors and translators, what was ported and what
  changed. Every file derived from the original keeps its copyright notice and a dated change
  notice. Bundled libraries are listed in the app's About dialog.
- The complete source is this repository; the About dialog and the Docker image link to it.

Copyright © 2013–2014 Adrien Vergé (original PhotoCollage), and the translators credited in
[NOTICE.md](NOTICE.md) for their translation files.
Copyright © 2026 John Briggs, for the changes and additions in Collage Creator.

This program is free software; you can redistribute it and/or modify it under the terms of the
[GNU General Public License](LICENSE) as published by the Free Software Foundation; either
version 2 of the License, or (at your option) any later version (SPDX: `GPL-2.0-or-later`).

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
