# Plan: Saving a book

- `exportCollage` gets a book path: for each page, `exportPage(page)` makes an `OffscreenCanvas` of the output size, draws that page's placements with `drawPhoto` (as now), encodes it and lets the canvas go before the next page starts. The zip writer from spec 011 collects the encoded images.
- Cell sizes for decoding come from the page's own cells, including a crop's zoom, so a zoomed photo stays sharp.
- Progress is `(page, photo)`; the progress dialog shows both. Abort stops between photos and terminates the workers, as now.
- File names: `bookFileNames(base, pages, extension)` in `src/core/book.ts`, same padding rule as `splitFileNames`.
- "Save this page" reuses `exportPage` and downloads one image.
- Tests: a unit test for the names and for skipping empty pages; an end-to-end test that saves a three-page book, reads the zip, checks each image's size and compares each with the preview of its page (`previewDifference` on that page's rectangle).
