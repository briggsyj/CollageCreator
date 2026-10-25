# Notice

**Collage Creator** is a modified, independent web reimplementation of
**PhotoCollage**. It is not the original program and is not endorsed by the
original authors.

|                      |                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Original work        | PhotoCollage 1.5.0                                                                                     |
| Original authors     | Adrien Vergé and contributors (listed below)                                                           |
| Original source      | <https://github.com/adrienverge/PhotoCollage>                                                          |
| Original licence     | GNU General Public License, version 2 or (at your option) any later version (SPDX: `GPL-2.0-or-later`) |
| This project         | <https://github.com/briggsyj/PhotoCollage>                                                             |
| This project licence | `GPL-2.0-or-later`, the same terms (full text in `LICENSE`)                                            |

The original's file headers say "either version 2 of the License, or (at your
option) any later version", so `GPL-2.0-or-later` is the identifier used in
every source file here.

This program comes with ABSOLUTELY NO WARRANTY; see `LICENSE`. This file is
general information, not legal advice.

## What was ported from the original

| Original file(s)                                                                                                          | Where it went                                       | What changed                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `photocollage/collage.py` (layout algorithm: pages, columns, cells, extended cells, hole removal, column-count heuristic) | `src/core/layout.ts`                                | Translated from Python to TypeScript, 2026-10-25. Random source injected so layouts are reproducible from a seed. Behaviour otherwise unchanged, including its known limitation that some layouts leave gaps (see `specs/001-create-and-export-collage/research.md`). |
| `tests/test_collage.py`                                                                                                   | `tests/layout.test.ts`                              | Translated to Vitest; same cases and expected results.                                                                                                                                                                                                                |
| `photocollage/render.py` (cover-crop drawing rules, border drawing, image extension list, EXIF orientation handling)      | `src/render/draw.ts`, `src/io/import.ts`            | Re-implemented for the HTML canvas and browser image decoding.                                                                                                                                                                                                        |
| `photocollage/gtkgui.py` (window, settings, column-count heuristic in `make_page`, swap photos)                           | `src/ui/app.ts`, `src/core/layout.ts`, `index.html` | Re-implemented as a browser UI.                                                                                                                                                                                                                                       |
| `photocollage/locale/*/LC_MESSAGES/photocollage.po` (11 translations)                                                     | `src/i18n/po/*.po`                                  | Moved unchanged (git history preserved), translator credits intact. Loaded at runtime by `src/i18n/index.ts`.                                                                                                                                                         |
| `data/icons/hicolor/scalable/apps/photocollage.svg`                                                                       | `public/icon.svg`                                   | Unchanged. No separate licence is stated for it upstream; it is distributed here under the same terms as the rest of the original work.                                                                                                                               |

The original Python/GTK implementation (`photocollage/`, `tests/test_collage.py`,
`pyproject.toml`, `data/`, ...) was removed from this repository once the port
existed. It remains in the git history, for example at commit `3289328`
(PhotoCollage 1.5.0, the upstream release this port was made from).

## Original authors and contributors

Copyright notices found in the original:

- Copyright (C) 2013–2014 Adrien Vergé
- Copyright (C) 2015 Frank Quotschalla, Vincent Bermel (German and Dutch translations)
- Copyright (C) 2015 Michal Kovařík (Czech translation)
- Copyright (C) 2016 Lorenzo Bicci (Italian translation)
- Copyright (C) 2021 Andrey Novikov, Eugene Uvin (Russian and Ukrainian translations)
- Copyright (C) 2024 Marcin Schoenknecht (Polish translation)

Translators named in the translation files: Peyu Yovev (Bulgarian), Michal
Kovařík (Czech), Vincent Bermel (German), Leonardo J. Caballero G. (Spanish),
Adrien Vergé (French), Lorenzo Bicci (Italian), Heimen Stoffels (Dutch),
Marcin Schoenknecht (Polish), Danton Medrado (Brazilian Portuguese),
Andrey Novikov (Russian), Eugene Uvin (Ukrainian).

Authors of commits in the original repository's history: Adrien Vergé,
Alexandre Detiste, Antonio Alonzi, Danton Medrado, Devendra, Eugene Uvin,
Frank Milde, Heimen Stoffels, Hugo van Kemenade, Jakub Wilk, Maniues, Peyu
Yovev, Sabri Ünal, Sandro, Tim Gromeyer, and andreynovikov95.

## Changes made in this version

Every file derived from the original keeps its original copyright and licence
notice and carries a prominent notice that it was changed, with the date. This
version adds no copyright notice of its own: its changes are offered under the
same licence, and the files it adds carry only an SPDX licence identifier. All
changes are dated 2026-10-25 or later and are recorded in git history.

## Third-party software

The built application bundles `canvas-size` (MIT). A complete, generated list
with licence texts is built into the app as `THIRD-PARTY-LICENSES.txt`.

## Source availability

The complete corresponding source of this program is in the repository above.
This applies to every way the program is distributed: the GitHub Pages site and
the Docker image both link back to it.
The About dialog links to it, and the Docker image carries it as the
`org.opencontainers.image.source` label.
