# Feature Specification: PDF export

**Feature Branch**: `claude/pdf-export` (spec directory `018-pdf-export`)

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "the ability to export to pdf"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Save a collage as a PDF (Priority: P1)

A person has made a collage and wants a PDF, to email it, send it to a print shop or keep it as a document. In the Save options they choose PDF instead of PNG or JPEG and save. They get one PDF file in which the collage fills the page, looking the same as the preview.

**Why this priority**: it is the whole feature; a single-page PDF of a single collage is the smallest useful result.

**Independent Test**: make a collage, choose PDF, save; the file opens in an ordinary PDF viewer as one page that matches the preview.

**Acceptance Scenarios**:

1. **Given** a collage with photos, **When** the person chooses PDF and saves, **Then** one PDF file is downloaded and its page shows the collage as in the preview.
2. **Given** a print size (such as A4 landscape), **When** the PDF is opened or printed, **Then** its page is that paper size and the collage fills it.
3. **Given** PDF is chosen, **When** the person looks at the Save options, **Then** PDF is one of the format choices beside PNG and JPEG, and the options that do not apply to it are not shown.

---

### User Story 2 - Save a book as one PDF (Priority: P1)

A person with several pages saves them as one PDF with a page for each, in order, instead of a zip of separate images.

**Why this priority**: pages are a core feature, and a multi-page document is where PDF beats separate images.

**Independent Test**: make a collage of three pages, save as PDF; one file with three pages in page order.

**Acceptance Scenarios**:

1. **Given** a collage with several pages that have photos, **When** it is saved as PDF, **Then** one file is downloaded with one PDF page per page, in order.
2. **Given** an empty page among them, **When** it is saved, **Then** the empty page is skipped with a notice, as with images.
3. **Given** one page's own save button, **When** the person uses it with PDF chosen, **Then** a PDF of just that page is saved.

---

### User Story 3 - Instagram post as PDF (Priority: P3)

A person who has made an Instagram post (a wide page cut into square images) and chooses PDF gets a PDF that holds the post's images.

**Why this priority**: less common, and what a PDF of a post should be is the one open question.

**Independent Test**: make a post of 3 images, save as PDF, and check the file against the answer to the open question.

**Acceptance Scenarios**:

1. **Given** an Instagram post of 3 images, **When** it is saved as PDF, **Then** the PDF holds the post as described in the requirements.

### Edge Cases

- Very large sizes (such as B1, or a book of many large pages): the save still completes, shows progress and can be cancelled, or the person is told plainly if the browser cannot make it.
- A collage with no photos: nothing is saved, as with images.
- A cancelled PDF save: nothing is downloaded and the app is ready for another save.
- Changing to PDF and back keeps the person's other choices (quality, size).
- The saved PDF opens in common viewers and prints at the right size without scaling.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The Save options MUST offer PDF as a format beside PNG and JPEG.
- **FR-002**: Saving as PDF MUST give a PDF file whose pages look the same as the preview of the pages.
- **FR-003**: For a print size (A4, A3, A2, B1) in either orientation, a PDF page MUST be that paper size, so it prints at full size.
- **FR-004**: For other sizes (screen, small, square, custom), a PDF page MUST have the shape of the output size. [NEEDS CLARIFICATION: how big should the page be on paper for sizes that have no paper size? Options: A) the size in pixels at 96 per inch, as a browser shows it; B) the size in pixels at 300 per inch, as the print sizes are made; C) fit to A4.]
- **FR-005**: A collage with several pages MUST save as one PDF with a page for each page that has photos, in page order; empty pages are skipped with a notice.
- **FR-006**: A page's own save button MUST save a PDF of just that page when PDF is chosen.
- **FR-007**: The picture quality of the PDF MUST follow the quality control the person already uses for JPEG; PNG-style lossless quality is not offered for PDF.
- **FR-008**: An Instagram post saved as PDF MUST hold the post's images. [NEEDS CLARIFICATION: what should the PDF of a post be? Options: A) one wide page with the whole post, cut marks omitted; B) one PDF page for each square image; C) neither is offered, and PDF is unavailable for a post.]
- **FR-009**: Saving as PDF MUST show progress and MUST be cancellable, as saving images is.
- **FR-010**: The PDF MUST be made on the person's device; no photo or collage is sent anywhere.
- **FR-011**: The file name MUST follow the existing pattern with a `.pdf` ending (`collage-<seed>.pdf`, `book-<seed>.pdf`).
- **FR-012**: The choice of format MUST be kept over a refresh, as the other Save options are.
- **FR-013**: An assistant using the app's tools MUST be able to choose PDF and save it, like any other format.

### Key Entities

- **Save format**: PNG, JPEG or PDF; decides the file made.
- **PDF page**: one page of the collage, at a paper size or the shape of the output size.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A single-page collage saved as PDF opens in at least three common PDF viewers (a browser, a desktop reader, a phone reader) and shows the same picture as the preview.
- **SC-002**: A print-size PDF measures its paper size to within 1 mm when opened or printed.
- **SC-003**: A collage of 20 photos at A4 saves as a PDF in no more than twice the time an A4 image takes.
- **SC-004**: A book of 5 pages saved as PDF is one file with 5 pages, in order, in 100% of tries.
- **SC-005**: No network request is made while saving a PDF.
- **SC-006**: All existing saving of images works as before.

## Assumptions

- PDF is made in the browser without a new library, since a PDF holding pictures needs little.
- Each PDF page holds one picture of the page (not editable text or vector shapes), so it looks the same everywhere.
- Photos are not separately kept inside the PDF; only the finished page is.
- A page too large for the browser to draw is handled as saving an image of that size already is.
- Margins, page numbers, titles and covers are out of scope.
