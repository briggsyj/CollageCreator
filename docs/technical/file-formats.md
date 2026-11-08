# File formats

## Input

| Format                          | How it is read                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JPEG, PNG, WebP, AVIF, GIF, BMP | `createImageBitmap` in a worker (respecting EXIF orientation)                                                                                                                                            |
| HEIC, HEIF                      | the browser if it can (Safari); otherwise `libheif-js` (WebAssembly, LGPL-3.0), loaded on first use                                                                                                      |
| ZIP                             | `io/unzip.ts`: the images inside are added (stored and deflated entries, using the browser's `DecompressionStream`); folders, hidden files and `__MACOSX` are skipped; other files are named in a notice |

Each import reads the photo's size and makes a thumbnail (longest side 480 px) and its average colour (for
the frosted backdrop). A file's identity for duplicates is `name|size|lastModified` (`fileKey`).

## Output

| Format | Notes                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| PNG    | lossless                                                                                                                             |
| JPEG   | quality 10–100%                                                                                                                      |
| PDF    | PDF 1.4 written by `io/pdf.ts` (no library); one page per collage page, each a single JPEG picture (`DCTDecode`, embedded unchanged) |
| ZIP    | written by `io/zip.ts`: entries stored (images are already compressed), UTF-8 names, CRC-32                                          |

### File names

| Case                   | Name                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| One page               | `collage-<seed>.<ext>`                                                              |
| Several pages (images) | `book-<seed>.zip` with `book-<seed>_1.<ext>` ... (numbers padded to the page count) |
| Several pages (PDF)    | `book-<seed>.pdf`                                                                   |
| One page of several    | `book-<seed>_page-<n>.<ext>`                                                        |
| Instagram post         | `collage-<seed>.zip` with `collage-<seed>_1.<ext>` ...                              |
| Book of posts          | `book-<seed>.zip` with `book-<seed>_p<page>_<n>.<ext>`                              |

### The PDF

- `%PDF-1.4`, a binary marker line, a catalog, a page tree, and per page a page object, a content stream and
  an image XObject; a cross-reference table with exact byte offsets; `%%EOF`.
- Page size in points = pixels × 72 / 300 (two decimals): print sizes come out at paper size (A4 is
  841.92 × 595.2 pt). Viewers allow up to 14 400 pt per side; B1 is about 2 835 pt.
- No text, fonts, scripts, links or metadata beyond what is needed.
- `tests/pdf.test.ts` checks the structure and offsets; real files have been checked with poppler and pypdf.
