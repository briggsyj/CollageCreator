# Feature Specification: PDF export

**Feature Branch**: `claude/pdf-export` (spec directory `018-pdf-export`)

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "the ability to export to pdf"

## Clarifications

### Session 2026-11-04

- Q: What should the PDF of an Instagram post be? → A: There is none; the PDF choice is hidden for the Instagram post size.
- Q: How big is the PDF page on paper for sizes that have no paper size? → A: The pixel size at 300 pixels per inch, as the print sizes are made.

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

### User Story 3 - No PDF for an Instagram post (Priority: P3)

A person making an Instagram post (a wide page cut into square images) is not offered PDF, because a post is images to upload, not a document.

**Why this priority**: it keeps the Save options honest; nothing is built beyond hiding a choice.

**Independent Test**: choose the Instagram post size; PDF is not among the formats. Choose another size; it is back.

**Acceptance Scenarios**:

1. **Given** the Instagram post size is chosen, **When** the person looks at the Save options, **Then** PDF is not offered.
2. **Given** PDF was chosen and the person then chooses the Instagram post size, **When** the Save options show, **Then** the format has gone back to PNG, and choosing another size makes PDF available again.
3. **Given** a book of Instagram-post pages, **When** the person saves, **Then** the result is images in a zip as before.

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
- **FR-004**: For other sizes (screen, small, square, custom), a PDF page MUST have the shape of the output size and be made at 300 pixels per inch, as the print sizes are (so 1600 × 1200 gives a page of about 5.3 × 4 inches).
- **FR-005**: A collage with several pages MUST save as one PDF with a page for each page that has photos, in page order; empty pages are skipped with a notice.
- **FR-006**: A page's own save button MUST save a PDF of just that page when PDF is chosen.
- **FR-007**: The picture quality of the PDF MUST follow the quality control the person already uses for JPEG; PNG-style lossless quality is not offered for PDF.
- **FR-008**: PDF MUST NOT be offered while the Instagram post size is chosen; choosing that size while PDF is chosen puts the format back to PNG.
- **FR-009**: Saving as PDF MUST show progress and MUST be cancellable, as saving images is.
- **FR-010**: The PDF MUST be made on the person's device; no photo or collage is sent anywhere.
- **FR-011**: The file name MUST follow the existing pattern with a `.pdf` ending (`collage-<seed>.pdf`, `book-<seed>.pdf`).
- **FR-012**: The choice of format MUST be kept over a refresh, as the other Save options are.
- **FR-013**: An assistant using the app's tools MUST be able to choose PDF and save it, like any other format, and is refused with a reason when it asks for PDF on an Instagram post.

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
