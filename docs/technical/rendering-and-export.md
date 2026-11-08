# Rendering and export

## Preview

`src/ui/Preview.svelte` draws the collage on one `<canvas>` using `src/render/preview.ts`, from small
copies of each photo (thumbnails, longest side 480 px, made once on import). A change requests a redraw on
the next animation frame; the canvas sets `data-pending` while one is due, which tests wait on.

On top of the photos it draws the hover, the selection, the keyboard ring, Instagram cut marks
(`splitmarks.ts`) and page gaps. Page pills, the Add page button and the photo actions are real DOM
elements placed over the canvas from the poster's rectangle (`app.posterBox`), so they are keyboard and
screen-reader accessible.

### View maths (`render/view.ts`)

The view is `{ zoom, panX, panY }`, zoom 50% to 800%. `fitPoster` sizes the poster to the preview area;
`zoomAt` zooms around a point (the mouse, a pinch centre or the middle). The view never affects the saved
image.

## Drawing (`render/draw.ts`)

One set of drawing rules serves preview and export: the background, each photo cover-cropped into its cell
(with its crop), rounded corners, and the borders between and around photos. The border is a share of the
longer side, so it scales with the output size.

## Export

`render/export.ts` makes one page:

1. An `OffscreenCanvas` of the output size.
2. Each photo is decoded in a worker of the pool (`render/pool.ts`, 2 to 4 workers by
   `navigator.hardwareConcurrency`), at just the size its cell needs (larger when zoomed by a crop), drawn,
   and its bitmap closed at once, so only a few full-size photos are in memory.
3. Borders are drawn, then the canvas is encoded.

Progress is reported per photo; cancelling aborts and terminates the pool's workers (a new pool is made).

`render/book-export.ts` makes each page with photos in turn (one canvas at a time) and packages them: one
image, a ZIP of images, or one PDF.

| Format | Encoding                                 | Packaging                                   |
| ------ | ---------------------------------------- | ------------------------------------------- |
| PNG    | `convertToBlob("image/png")`             | image, or ZIP (`io/zip.ts`, stored entries) |
| JPEG   | `image/jpeg` at the quality setting      | image, or ZIP                               |
| PDF    | each page as JPEG at the quality setting | one PDF (`io/pdf.ts`), a page per page      |

An Instagram post is cut into squares (`sliceRects`) after drawing and saved as a ZIP.

## Canvas limits

Browsers cap canvas width, height and area, and the caps differ (iOS Safari is about 4096 × 4096).
`platform/limits.ts` measures them with `canvas-size` on load; until then a low fallback applies.
Sizes are clamped to the limits (`clampSize`) with a note to the user.

## Downloads

Files are offered with a temporary `blob:` URL and an `<a download>` click (`ui/state/browser.ts`); no
network is involved.
