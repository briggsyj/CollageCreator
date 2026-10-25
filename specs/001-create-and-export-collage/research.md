# Research 001

## 1. How the original's layout works (and what was ported)

Source read: `photocollage/collage.py`, `photocollage/render.py`, `photocollage/gtkgui.py` at PhotoCollage 1.5.0. **The original Python/GTK code was removed from the tree after the port; it is preserved in git history, for example at `3289328` ("PhotoCollage 1.5.0", the upstream release this port was made from).**

**Algorithm** (ported to `src/core/layout.ts`):

1. _Column count_ (`UserCollage.make_page`): `cols = round(sqrt(avg_photo_ratio / poster_ratio * 2 * n))`, using the heuristic that about one photo in three spans two columns. Ratios are height / width.
2. _Phase A_, add photos one by one in shuffled order: a photo goes to the lowest column (ties broken at random). If `2 * random() > photo_ratio` (so wide photos span more often) and a neighbouring column's height is within half a column width, the photo spans both columns (a `Cell` in the left, a `CellExtent` placeholder in the right).
3. `remove_empty_cols`, then `remove_bottom_holes` (patterns A1, A2, B1, B2, one left-to-right pass).
4. _Phase B_, `adjust_cols_heights`: every column is stretched to `page_width * target_ratio`, in independent groups of cells between extents.
5. Phase C ("adapt columns' width") is described in the original's docstring but not implemented in it; not ported.

**Cost**: dominated by recomputing `Cell.y` by walking the column, so O(cells per column squared) per query. Measured (`benchmarks/layout.json`): under 1 ms for 100 photos, about 12 ms for 500.

**Rendering rules** (ported to `src/render/draw.ts`): each photo is scaled to cover its cell and cropped, centred (the original keeps `offset_w` and `offset_h` at 0.5; dragging them was never exposed, so not ported). Borders: width is a fraction of the longer side (the original defaulted to 1%, black; this version defaults to 0.5%, white), drawn as a frame and seams on cell edges. The background is white.

**New or changed relative to the original**

| Change                                        | Why                                                                                                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Injected, seedable random source              | Reproducible layouts (clarification)                                                                                                                           |
| Column count clamped to at least 1            | The original raises `ZeroDivisionError` on very tall posters with few photos (the column count rounds to 0; checked with a 1 x 10 poster and one square photo) |
| Python `round` half-to-even replicated        | Same column counts as the original                                                                                                                             |
| `Page.toLayout()` normalises to a page 1 wide | The original rescales with `scale_to_fit` when drawing; empty columns removed by `adjust` leave the raw page narrower than 1                                   |
| Cell edges rounded once per shared edge       | No pixel seams between cells (the original rounded position and size separately)                                                                               |
| Not ported                                    | `Page.scale`, `scale_to_fit`, `Cell.content_coords`, `Photo.move`, drag-and-drop file URI handling                                                             |

**Tests ported**: `tests/test_collage.py` becomes `tests/layout.test.ts`; all six cases pass with identical expected ASCII layouts.

## 2. Edge cases the port must handle

Zero photos (empty page, nothing to save); one photo; extreme aspect ratios; very tall or wide posters (column clamp, above); duplicate files (skipped); non-images and corrupt files (skipped with a message naming the file).

## 3. Known limitation of the original: layouts can have holes

**Finding.** The plan requires rectangles that tile the poster exactly. The original does not always do that. Measured over 8,000 generated layouts (3 to 12 photos, poster ratios 0.75 and 1.41): **181 (2.3%) have holes; none overlap.** By photo count and poster shape, between 0% (1 or 2 photos) and about 43% (100 photos, portrait poster) of layouts have some hole; the worst single hole seen was 19% of the poster area, and for 100 photos holes are small (about 1.5% of the area at worst).

**Causes.**

1. **A gap in the shorter of two columns that a cell spans (160 of 181).** `add_cell` lets a photo span two columns when their heights differ by less than half a column width. The spanning cell starts at the taller column's height, leaving a gap in the shorter column. `adjust_height` normally closes the gap by stretching the cells above the extent in that column; when there are none, the gap stays. This happens when a short, wide photo sits in one column between two spanning cells (neighbour column has two extents with nothing between: 3 photos, seed 12), or when the shorter column is empty above an extent (3 photos, seed 26).
2. **A bottom hole left by `remove_bottom_holes` (20 of 181).** The pass is a single left-to-right sweep over four patterns. B1 and B2 move a cell and its extent to other columns, which can open a new hole in a column the sweep has already passed (5 photos, seed 1224: column 1 ends with an extent while column 0 has a tall photo below it; case A1 would have fixed it but ran first). A column whose last cell is an extent is skipped entirely.

**Decision (owner, 2026-10-25).** Keep the original behaviour and keep the tiling tests as they are; fix later. The affected tests in `tests/layout.properties.test.ts` therefore currently fail, and CI is red until then:

- `rectangles exactly tile the poster`
- `changing the poster ratio keeps the arrangement and still tiles`
- `tiles exactly with a very wide panorama among portraits`
- `handles 100 photos quickly` (it also asserts tiling; its timing assertion is fine)

Holes are drawn as the white page background.

**Options already analysed for the later fix**: deterministic retry with derived sub-seeds (algorithm untouched, about 98% of layouts pass first time); a hole-fill step that stretches bordering cells (guaranteed, new logic); or relaxing the requirement.

## 4. Downscale quality (plan research item 1)

Implemented: `createImageBitmap` is asked to resize while decoding (`resizeQuality: "high"`); the worker checks the returned size and, if a browser ignored or mangled the request, decodes in full and shrinks by successive halving (`render/downscale.ts`, unit-tested).

Measured here: Chromium only. With solid-colour fixtures the saved image differs from the on-screen preview by under 6/255 mean per channel (e2e test `preview and saved image match`). **Not yet measured**: aliasing of real 12 MP photos in Firefox and Safari; that needs a visual comparison by the owner (Spec 003 gate).

## 5. EXIF orientation (plan research item 2)

`imageOrientation: "from-image"` is passed for every decode. In Chromium, an orientation-6 JPEG exported through the resize path comes out upright (e2e test). Firefox and Safari are untested locally; the CI matrix runs the same test. The probe and export both read the upright size from the decoded bitmap, so a browser that applied orientation differently would show up as a size mismatch and take the full-decode fallback.
