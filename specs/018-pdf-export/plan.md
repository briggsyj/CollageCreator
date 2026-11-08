# Implementation Plan: PDF export

**Branch**: `claude/pdf-export` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/018-pdf-export/spec.md`

## Summary

PDF becomes a third save format (`png`, `jpeg`, `pdf`). A page is drawn exactly as for a JPEG; the JPEG bytes are placed unchanged in a small hand-written PDF writer (`src/io/pdf.ts`, no library, like `zip.ts`), one picture per PDF page, sized at 300 pixels per inch. A book becomes one PDF with a page per filled page. The PDF choice is hidden for the Instagram post size.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Svelte 5 runes, as now

**Primary Dependencies**: none added

**Storage**: the chosen format is already kept with the settings in saved work; `pdf` is added to the values accepted

**Testing**: Vitest for the writer (structure, page sizes, offsets); Playwright for saving a PDF, a book PDF, the hidden choice, and WebMCP

**Target Platform**: all supported browsers (the writer is plain bytes)

**Project Type**: web app (single project)

**Performance Goals**: no slower than saving the same pages as JPEG plus the writing of the file (a copy of the bytes)

**Constraints**: no network; one canvas at a time as now; the strict CSP is unaffected (a Blob download, as for images)

**Scale/Scope**: one new module (~100 lines), small edits to export, the save state, the Save block and the agent tools

## Constitution Check

| Principle                        | Result                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1 Privacy                        | Pass. The PDF is made in the browser; nothing is sent                                             |
| 2 Spec first                     | Pass. Spec holds outcomes only                                                                    |
| 3 Code quality                   | Pass. Strict TypeScript, Biome                                                                    |
| 4 Pure core                      | Pass. `pdfBytes` is pure (bytes in, bytes out) and unit tested; the drawing is unchanged          |
| 5 Testing                        | Pass. Unit tests for the writer; e2e for each story                                               |
| 6 Performance                    | Pass. Same worker pool, progress and cancel as image saves                                        |
| 7 Memory                         | Pass. Each page's JPEG is kept only until the file is built; pages are drawn one at a time as now |
| 8 Accessibility and localisation | Pass. The button has a title; strings go through the catalogue                                    |
| 9 Simplicity                     | Pass. No library: a PDF holding JPEG pictures is a few objects (research D1)                      |
| 10 Licensing                     | Pass. New files carry the SPDX and copyright lines; no third-party code                           |

Re-checked after design: no violations.

## Project Structure

### Documentation (this feature)

```text
specs/018-pdf-export/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/pdf-file.md
├── checklists/requirements.md
└── tasks.md            # by /speckit-tasks
```

### Source Code (repository root)

```text
src/io/pdf.ts                  # new: pdfBytes(pages) -> Uint8Array
src/core/types.ts              # ImageFormat gains "pdf"
src/render/export.ts           # pdf is drawn as JPEG; single page -> PDF
src/render/book-export.ts      # a book (or one page) -> one PDF
src/ui/SaveBlock.svelte        # PDF button and option; quality shows for PDF; hidden for a post
src/ui/app-state.svelte.ts     # file names; a post puts the format back to PNG
src/io/session.ts              # accept "pdf"; not with a post
src/agent/tools/save.ts        # set_save_format accepts pdf (refused for a post)
src/agent/controls.json        # format-pdf
tests/pdf.test.ts
e2e/pdf.spec.ts
```

**Structure Decision**: the writer sits beside `zip.ts` in `src/io/`; everything else is a small change where formats are already handled.

## Design

- **Page size.** Every PDF page is `pixels × 72 / 300` points, so A4 (3508 × 2480) is 841.92 × 595.2 pt (297 × 210 mm) and a 1600 × 1200 screen size is 384 × 288 pt (5.33 × 4 in). One rule serves print and other sizes (clarification Q1).
- **Picture.** The page is drawn on the canvas as now and encoded as JPEG at the quality control's value (FR-007). The JPEG bytes go into the PDF unchanged as a DCT image; the page content draws it over the whole page.
- **Writer.** Objects: catalog, page tree, then per page a page, a content stream and an image. A cross-reference table with exact byte offsets; no compression, no fonts.
- **Book.** `exportBook` already draws each filled page and skips empty ones with a notice. For PDF it collects each page's JPEG and returns one `.pdf` (`book-<seed>.pdf`; one page `book-<seed>_page-N.pdf`). A one-page collage is `collage-<seed>.pdf`.
- **Hidden for a post.** `setSplit` puts `pdf` back to `png` when the post size is chosen; the Save block hides the PDF button while `splitImages > 1`; saved work with both is read as PNG. The tool `set_save_format` refuses `pdf` for a post.
- **Progress and cancel.** Unchanged: the PDF is written after the pages are drawn, in one quick step.
- **Download.** `download(blob, name)` as for images.

## Complexity Tracking

None.
