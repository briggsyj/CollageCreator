# Plan: Book pages

## Model

- A book is a list of pages; a page is a list of photo indexes (the photo list stays one list, in the order added, which the session already stores) plus the page's own arrangement. `src/core/book.ts` (pure, unit tested): page limits, `fill`, `distribute(photoCount, pageCount, perPage)`, `pageOf(photoIndex)`, `move(photo, toPage)`, `swap(a, b)`, `removePage(page)`, `reorder(page, to)`, page gaps and the position of each page in the row.
- Each page is a `LayoutPage` (the interface Mosaic and Gallery already provide) built from that page's photos and the seed `hash(seed, pageNumber)`. `toLayout()` of the book puts each page's layout in a row offset by `(pageWidth + gap) × k`, so the preview and the hit testing work on one list of placements; `Placement` gains `page` and `Layout` gains `pages` (each page's place in the row); a photo's page is `Photo.bookPage`.
- `swapPhotos(a, b)` across pages moves the two photos into each other's place and re-arranges only the two pages concerned.

## Rendering

- `drawCollage` draws a book by drawing each page with the existing single-page code in its own rectangle, so a page looks exactly as it does today. The gap, the labels and the outline are on-screen extras, like the cut marks.
- All pages are drawn each time; if a long book proves slow, pages out of view can be skipped later.

## State and UI

- `app-state.svelte.ts` gets `pages`, `currentPage`, and actions `addPage`, `removePage`, `movePage`, `moveSelectedToPage`, `spreadEvenly`, `shufflePages`, `photosPerPage`; adding photos uses `fill(photoIndex)` from `book.ts` (first page with room, else a new page). Undo of removing a page uses the same slot as removing photos.
- Components: a `Pages` group in `PosterPanel` (count, Add page, Spread evenly), page headings in `PhotosPanel`, "Move to page" in `SelectedDock`, the labels and outline in `Preview`.
- Layout cards in `StylePanel` gain Book. The inner arrangement (Mosaic or Gallery) is a second choice shown only for Book.

## Constitution check

Nothing new leaves the device; no new dependencies; the core stays free of the browser (`book.ts` is pure).
