# Layout engine

All layout code is in `src/core/`. It has no DOM or canvas dependency, is deterministic for a given
seed, and is covered by unit and property tests (`tests/layout*.test.ts`, including
`layout.properties.test.ts` and `layout.slicing.test.ts`, plus `search.test.ts`, `book.test.ts`,
`crop.test.ts` and `split.test.ts`).

## Coordinates

A layout (`Layout` in `types.ts`) is in page units: the page is 1 wide and `height` (the poster's
height / width) high. Each `Placement` has the photo's index and its cell `Rect`. Cells tile the page
exactly. Rendering scales this to pixels, so the same layout serves the preview and every export size.

## Seeds and randomness

`rng.ts` provides a small seeded generator. Every random choice in a layout comes from it, so the same
photos (in the same order), settings and seed give the same layout. The seed is a 32-bit unsigned
integer, kept in the address (`?seed=`).

## Mosaic (`layout.ts`)

A TypeScript port of PhotoCollage's `collage.py`, in three phases:

1. **Fill columns.** Photos are added one by one, each to the shortest column, to keep the columns
   balanced. When two neighbouring columns are about the same height (or the photo asked to be wider), a
   photo can span both; a `CellExtent` reserves its place in the right-hand column.
2. **Equal heights.** A common height is computed and every column is stretched or squeezed to it, which
   changes column widths.
3. **Widths.** Each column takes the smallest width among its cells.

The number of columns comes from the original's heuristic (photos and page shape) or is set by the user (1
to 100). Taller photos get more height in their column.

### Holes and squeezed cells

The original algorithm sometimes leaves a hole or squeezes a cell to nothing (see
[spec 001 research](../../specs/001-create-and-export-collage/research.md), §3). `generateLayout`
checks every arrangement with `Page.tiles()` and, if it fails, builds it again from seeds drawn from the
same random sequence (8 tries), then without photos spanning two columns unasked (32 tries), and finally
with no spanning at all, which always tiles. The result is still fixed by the seed, and arrangements that
tiled first time are exactly the original's. A requested Wider is kept except in rare extreme cases (many
photos asking for it at once), where the last fallback drops it rather than leave a hole.

## Gallery (`slicing.ts`)

The page is cut into panels by a slicing tree: every inner node cuts its rectangle side by side or stacked,
every leaf is a photo, and cuts run edge to edge, so there are no gaps. The tree is built from the bottom
up by joining the neighbouring groups with the fewest photos in the direction that brings the group's shape
closer to what the page needs, with Wider and Taller as weights. It is then improved by small changes
(turning a cut, swapping two photos) that are kept when they help.

## The search (`search.ts`)

The first arrangement is the best of several: 30 candidate seeds for Mosaic, 10 for Gallery (each is
refined). `scoreLayout` measures each by the share of the page left uncovered and the average share of each
photo cut off by cover-cropping; the lowest wins, and the winning seed is the one shown. Later changes (a
column count, a size request, a typed seed) generate a single layout from the current seed.

## Pages (`book.ts`)

A collage is a book of 1 to 20 pages, laid out in a row in the preview with a small gap (`PAGE_GAP`). Each
page is arranged on its own from the book's seed and the page number, with the same style and settings.
`BookPage.wrap` turns a one-page arrangement into page 0 of a book without re-arranging, so adding the
second page changes nothing on the first. Photos carry their page (`bookPage`); helpers spread photos evenly,
move them, remove a page (its photos go to a neighbour) and shuffle across pages keeping each page's count.

## Size requests

A photo may ask for two columns (`span.columns = 2`) and 2 or 3 rows (`span.rows`). Requests are kept on the
photo, so new arrangements, size changes and added photos respect them.

## Crops (`crop.ts`)

A photo always covers its cell. Its crop is `{ zoom, x, y }`: a zoom from 1 to 5 and the position of the
window within the photo. `panCrop` and `zoomCrop` keep the window inside the photo (no gaps), and `zoomCrop`
keeps the centre in place. A crop is stored per photo and applied in both preview and export.

## Instagram posts (`split.ts`)

A post is one wide page of N squares (2 to 20) of the same side; `sliceRects` gives each square's rectangle
for export and the preview's cut marks.
