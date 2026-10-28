# Spec 015: Saving a book

**Gate**: saving a book gives one image per page, in order, each exactly the output size and matching what the preview shows for that page.

## User stories

- **P1** As a user, saving a book gives me every page as its own image, numbered in page order.
- **P1** As a user, I see progress while pages are made, and can cancel.
- **P2** As a user, I can save just the page I am looking at.

## Requirements

- Save gives `book-<seed>.zip` with `book-<seed>_1.png` ... in page order (`.jpg` for JPEG; padded numbers from ten pages, as in spec 011). A book of one page saves a single image, like a collage.
- Each page image has exactly the Width and Height from the Poster step, drawn by the same code as the preview of that page (border, corners, outer border, crop). The gap and labels are never in an image.
- Pages are made one after another, so only one page canvas exists at a time; the size limit of the browser applies to one page, not to the whole book (a book of A2 pages is possible where one A2 × 20 strip would not be). A size the browser cannot make is reduced for every page, with the usual note.
- Progress reads "Page 2 of 5" and counts photos as now; Cancel stops and discards the partial zip.
- Empty pages are skipped, the notice says which, and the numbers follow the pages saved.
- "Save this page" (beside Save, and in the page label's menu) saves only the selected or current page as one image.
- The book is kept over a refresh (pages, photos per page and each photo's page). The address carries the seed only, as for the other layouts.

## Open questions

1. Is a PDF wanted (one file, pages in order)? Proposed: not now; the zip is the output.
2. Should the zip file name be the book title? There is no title field; proposed: not now.

## Out of scope

PDF, print marks and bleed, saving pages as separate downloads without a zip (browsers often block several downloads at once).
