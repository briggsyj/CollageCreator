---

## description: "Task list for PDF export"

# Tasks: PDF export

**Input**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/pdf-file.md](contracts/pdf-file.md)

**Tests**: required (constitution 5). Every new file starts with the SPDX and copyright lines.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational (blocks all stories)

- [ ] T001 Add `src/io/pdf.ts`: pure `pdfBytes(pages)` writing a PDF 1.4 file per contracts/pdf-file.md (catalog, page tree, per page a page, a content stream and a DCTDecode image; exact cross-reference offsets; page size = pixels × 72 / 300 with two decimals)
- [ ] T002 [P] Add `tests/pdf.test.ts`: header and `%%EOF`; `/Count`; the A4 box (3508 × 2480 gives 841.92 × 595.2) and a 1600 × 1200 box (384 × 288); every `xref` offset points at its object; many pages; the JPEG bytes are present unchanged
- [ ] T003 [P] In `src/core/types.ts` make `ImageFormat` `"png" | "jpeg" | "pdf"`; in `src/io/session.ts` read `pdf` as valid, and as `png` when the saved collage is an Instagram post (`splitImages` above 1)

## Phase 2: User Story 1 - Save a collage as a PDF (P1)

**Independent Test**: choose PDF, save, open the file: one page matching the preview, A4 at paper size.

- [ ] T004 [US1] In `src/render/export.ts` draw a `pdf` page as JPEG at `jpegQuality` (`mimeType`, the encode options) and make `extension("pdf")` `"pdf"`; in `exportCollage` return the single page wrapped by `pdfBytes` as a PDF Blob when the format is `pdf`
- [ ] T005 [US1] In `src/ui/app-state.svelte.ts` name the file with `extension(settings.format)` (`collage-<seed>.pdf`) and record it in `lastSave`
- [ ] T006 [US1] In `src/ui/SaveBlock.svelte` add the PDF button (`#format-pdf`, with a title) and the PDF option in the format list; show the quality control for JPEG and PDF; make the summary line say PDF
- [ ] T007 [US1] E2E in `e2e/pdf.spec.ts`: choose PDF, save, the download is `collage-<seed>.pdf`, starts with `%PDF`, has one page; A4 landscape measures 841.92 × 595.2 pt (SC-002); quality changes the file size; the format is kept over a refresh (FR-012)

## Phase 3: User Story 2 - Save a book as one PDF (P1)

**Independent Test**: three pages saved as PDF gives one file with three pages in order.

- [ ] T008 [US2] In `src/render/book-export.ts` when the format is `pdf`: draw each filled page as a JPEG, build one PDF (`book-<seed>.pdf`, or `book-<seed>_page-<n>.pdf` for one page) and return it with `images` as the number of pages; skip empty pages with the existing notice
- [ ] T009 [US2] E2E in `e2e/pdf.spec.ts`: three pages give one `book-<seed>.pdf` with 3 pages (SC-004); an empty page is skipped with a notice; a page's own save button gives a one-page PDF; cancelling a PDF save downloads nothing

## Phase 4: User Story 3 - No PDF for an Instagram post (P3)

- [ ] T010 [US3] In `src/ui/app-state.svelte.ts` `setSplit`: when the post size is chosen and the format is `pdf`, set it to `png`; in `SaveBlock.svelte` hide the PDF button and option while `splitImages` is above 1
- [ ] T011 [US3] E2E in `e2e/pdf.spec.ts`: with the post size chosen there is no PDF choice; choosing the post while PDF is chosen puts the format back to PNG; another size brings PDF back (FR-008); a book of posts still saves a zip of images

## Phase 5: WebMCP

- [ ] T012 [P] In `src/agent/tools/save.ts` let `set_save_format` take `pdf` (schema and check), refused with `not-supported` and a reason for an Instagram post; add `format-pdf` to `src/agent/controls.json`
- [ ] T013 E2E in `e2e/agent.spec.ts`: an assistant chooses PDF and saves (`save.last.file` ends `.pdf`); the post refuses it (FR-013)

## Phase 6: Polish

- [ ] T014 [P] Update `README.md` (Features), `ARCHITECTURE.md` (`src/io/pdf.ts`), `specs/README.md` (row 018) and `NOTICE.md` only if needed
- [ ] T015 Run `npx biome check .`, `npm run typecheck`, `npm test`, `npm run test:e2e` (Chromium), `node scripts/check-headers.mjs`, `npm run check:i18n`; fix what they report
- [ ] T016 Open one saved PDF in a real viewer and check the picture and the A4 size by hand, and note the result in research.md

## Dependencies

- T001 before T004 and T008; T003 before T006 and T010.
- US1 and US2 share `export.ts` / `book-export.ts`, so do US1 first. US3 and the tools follow.

## Implementation strategy

- MVP: T001 to T007 (a single-page PDF). Then the book, then hiding for the post, then tools and docs, in one PR.
