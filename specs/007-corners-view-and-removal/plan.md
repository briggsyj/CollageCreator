# Plan 007: Corner styles, zoom and pan, removing photos

## Corner styles (`src/render/draw.ts`)

- `PosterSettings.cornerStyle`: `none | slight | rounded | circle`. Radius is a share of the photo's shorter side (`slight` 8 %, `rounded` 25 %); `circle` is an ellipse in the photo's box.
- One drawing path for preview and export: `drawBackground`, `drawPhoto`, `drawBorders` all take a `Frame { corners, border, color }`. With square photos nothing changes. With shaped photos the poster is first filled with the border colour and each photo is drawn, clipped to its shape, inside its cell minus the border (`insetCell`). The two halves of a border on a shared edge are `floor(b/2)` and `b - floor(b/2)`, so the gap is exactly `b` for odd and even widths.
- `drawBorders` clips to the poster: seams run half a border past each cell, which was invisible while the canvas was exactly the poster and showed once it was not.
- Paths use `arcTo` rather than `roundRect`, which older browsers lack.

## Zoom and pan (`src/render/view.ts`, `src/ui/app.ts`)

- The canvas now fills the preview area and the poster is drawn on it, translated to its place, with its own shadow (no CSS shadow, no checkerboard). `view = { zoom, panX, panY }` in CSS pixels, relative to "fit".
- `view.ts` is pure: `zoomAt` keeps the poster point under the cursor fixed, `panBy`/`clampPan` keep at least a strip of the poster on screen, zoom is clamped to 0.5–8. Tested with property tests.
- Wheel events (`passive: false`) zoom by `exp(-deltaY × k)`; `ctrl` + wheel (pinch) uses a larger k. Space is tracked on `window` while the pointer is over the preview or the canvas has focus, and ignored while a form control has focus. Dragging with Space held pans; redraws are coalesced with `requestAnimationFrame`.
- Hit testing subtracts the poster's origin, so picking and swapping work at any zoom.
- The canvas exposes the poster's rectangle as `data-poster` (CSS px) for the tests.
- Layout: the preview column is `position: sticky` with a viewport-based height; the rows below it (view bar, messages, size note) have fixed heights so nothing resizes the preview.

## Removal (`src/ui/app.ts`)

- `removePhotos(ids, message)` records `{ photo, index }` for the removed photos (their thumbnails stay open) and `undoRemove` splices them back at their old indexes, skipping any whose file key is present again. A new removal closes the thumbnails of the previous one.
- Entry points: the list's Remove button, Delete/Backspace on the preview, Remove selected photo, Remove all; Undo remove button and Ctrl/⌘+Z on the preview.

## Defaults

Border 0.5 % white, square corners. The original defaulted to 1 % black.

## Translations

New English-only strings: Corner style, None, Slightly rounded, Rounded, Circle, Zoom: %(pct)s%, Fit to window, Scroll to zoom. Hold Space and drag to pan., Remove selected photo, Remove all, Undo remove, Removed %(name)s., Removed all %(n)s photos., Undo remove brings it back., Restored %(n)s photo(s).
