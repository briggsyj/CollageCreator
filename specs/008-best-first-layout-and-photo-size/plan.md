# Plan 008

## Search (`src/core/search.ts`)

- `scoreLayout(layout, photos)` returns `{ uncovered, cutOff }`. A photo shown in a cell of shape ratio `c` that is `p` tall for its width keeps `min(c/p, p/c)` of its picture, so `cutOff` is the average of `1 − that`; a collapsed cell counts as 1. `isBetter` compares `uncovered` first (to 1e-6) then `cutOff`.
- `generateBest(photos, ratio, masterSeed, { tries = 30, columns })` draws each candidate's seed from a generator seeded with `masterSeed`, keeps the best and returns its seed, so `generateLayout` with that seed reproduces it. Measured: 100 photos × 30 candidates well under a second.
- The UI calls it only when the set of photos changes; the master seed is random. Every other change is a single `generateLayout`.

## Size requests (`src/core/layout.ts`, `src/core/types.ts`)

- `PhotoSpan { columns: 1 | 2; rows: 1 | 2 | 3 }` on each photo (default `NO_SPAN`).
- `rows` multiplies the photo's shape ratio used to size its cell, so its natural cell is that much taller; the original's "stress every column to the poster height" step then redistributes.
- `columns: 2` forces the photo to span two columns: `addCell` picks the neighbouring column whose height is closest, skipping the usual random rule and height threshold. The column count is raised to at least 2 when anyone asks. The random sequence is unchanged for photos that ask for nothing, so existing seeds give the same layouts (tested).
- Asking is a request: a large height mismatch is absorbed by the original's stretching, which can crop more; the search then favours candidates where that costs least.

## Outer border (`src/render/draw.ts`)

- `Frame.outer`. `insetCell(..., outer)` gives zero inset at the poster's edge when off, and seams between photos are unchanged. Seams became their own function; with shaped photos and no outer border the poster starts white and the seams are drawn first (in `drawBackground`), then the photos.

## UI (`index.html`, `src/ui/app.ts`, `src/style.css`)

- `relayout("search" | "single", keepSelection)`; the seed field moved into `<details id="technical">`; a fieldset of size buttons appears in the bar under the preview while a photo is selected; the list tags each photo with its request.
- Sidebar: `minmax(0, …)` grid tracks and `width: 100%; min-width: 0` on inputs. This also fixes the height field overflowing the sidebar.
- An earlier edit had split the `.unit, .hint` rule so that the "pixels" label picked up the privacy note's styling; split back, with a test.

## Translations

New English-only strings: Technical configuration, the seed explanation, Cropped on average, Border around the whole collage, Wider, Taller, Normal size, Size of the selected photo, wider/taller tags and their status messages.
