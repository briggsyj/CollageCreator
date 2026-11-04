# Research: PDF export

## D1. Library or hand-written

- **Decision**: hand-write the PDF.
- **Rationale**: constitution 9 (prefer the platform). A file of full-page JPEG pictures needs a header, a catalog, a page tree, and per page a page object, a content stream and an image object, plus a cross-reference table. The ZIP writer in the app is the same kind of small module. Libraries such as pdf-lib or jsPDF add 100 KB or more and their own licence checks.
- **Alternatives**: pdf-lib / jsPDF (rejected: size, dependency); `window.print()` to PDF (rejected: depends on the browser's print dialog and cannot set the page size reliably).

## D2. Picture encoding inside the PDF

- **Decision**: JPEG (DCTDecode), at the existing quality control (spec FR-007).
- **Rationale**: the browser already encodes JPEG; the bytes are embedded unchanged, so there is no recompression and the file stays small. Lossless (Flate) would need a compressor and make large files.
- **Alternatives**: PNG data in Flate (rejected: files of hundreds of megabytes at B1).

## D3. Page size

- **Decision**: `pixels × 72 / 300` points for every size (spec clarification Q1).
- **Rationale**: the print sizes are defined at 300 pixels per inch, so they come out as real paper sizes (A4 is 841.92 × 595.2 pt, within 0.1 mm of ISO 297 × 210). The same rule gives other sizes a page in proportion.
- **Alternatives**: 96 per inch for screen sizes (rejected by the owner), fit to A4.

## D4. Size limits

- **Finding**: PDF viewers cap a page at 14 400 units (200 inches); B1 at 300 pixels per inch is 11 811 px = 2 835 pt, well inside.
- **Decision**: no extra limit; the browser's own canvas limit still applies, as for images.

## D5. Instagram post

- **Decision**: no PDF for a post (clarification Q2). The choice is hidden; choosing the post size while PDF is chosen goes back to PNG.
