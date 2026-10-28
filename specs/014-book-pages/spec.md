# Spec 014: Book (several pages, each its own image)

**Gate**: a collage can be made of several pages shown side by side in the preview; photos can be edited as before and moved between pages; every page has the chosen output size.

## What it is

A third layout type, **Book**, beside Mosaic and Gallery. It is like the Instagram post (pages in a row, left to right) with two differences: the pages are separate pictures, each arranged on its own, and there is a small space between them in the preview. The space is only shown on screen; each page is saved as its own image (spec 015).

## User stories

- **P1** As a user, I choose Book and add pages. Every page is the output image size from the Poster step (Width and Height, in either orientation), so a book of five pages is five images of that size.
- **P1** As a user, I see all the pages in one preview, in order, with a small gap between them and a label under each ("Page 2 of 5").
- **P1** As a user, I edit photos as before: select one, make it Wider or Taller, Crop it, change borders and corners, Shuffle. A change on one page changes only that page.
- **P1** As a user, I swap two photos even when they are on different pages, and move a photo to another page without a swap.
- **P2** As a user, I add, remove and reorder pages, and see how many photos are on each.
- **P2** As a user, on a phone I look at one page at a time.

## Requirements

- **Pages.** 1 to 20 pages. A new book starts with two. "Add page" appends an empty page; "Remove page" moves its photos to the previous page (or the next, for the first page) and says so, and can be undone like removing a photo.
- **Where photos go.** Photos added go to the page being worked on (the last page selected, at first the first), in the order added; "Spread evenly" shares all photos across the pages in order. A page may be empty and may hold any number of photos.
- **Arrangement.** Each page is arranged on its own by the inner arrangement (Mosaic or Gallery, chosen in Style as now), from the book's seed and the page number, so the same seed gives the same book. Columns, trim and the other Style settings apply to every page. Shuffle layout re-arranges every page but keeps each photo on its page; "Shuffle photos between pages" is a separate action.
- **Editing.** Select, Pan, Swap, Wider/Taller, Normal size, Crop, Remove and the keyboard ring work on any page. Wider and Taller re-arrange only that photo's page. A crop stays with the photo when it moves pages.
- **Moving photos.** Swap picks two photos on any pages. "Move to page" in the selected-photo dock moves the selected photo to the page chosen from a list (it goes last on that page). In the Photos step the list is grouped by page, with a heading and a count for each page.
- **Preview.** One canvas draws all pages left to right with a gap of 4% of a page's width, the label under each page, and the selected page outlined. Only pages in view are drawn at full resolution. Pan, Zoom and Fit work as now; "Fit" shows every page, and a new "Page" action (and the keys Page Up / Page Down) zooms to the next or previous page.
- **Phone.** A pager shows one page at a time, with arrows and a "Page n of m" label; pan and zoom work inside the page; Swap and Move to page still reach other pages.
- **Poster step.** In Book, Width and Height are the size of one page. The Instagram post and Book are separate choices; choosing one leaves the other.

## Open questions (answers proposed; change the spec if you disagree)

1. Should Book be a card beside Mosaic and Gallery (a layout) or a size choice like Instagram post? Proposed: a layout card, because it changes how photos are grouped, with the page controls in the Poster step.
2. Do photos fill pages automatically when added, or does the user fill them? Proposed: the page being worked on, plus "Spread evenly".
3. Empty pages: kept, shown with a "Drop or move photos here" note, and skipped when saving (with a notice). Proposed: kept and skipped.
4. Reordering pages: Move left / Move right buttons on the page label. Drag is not proposed (phones).

## Out of scope

Spreads (two facing pages with a gutter), page numbers or text on pages, covers, bleed and print marks, a PDF, a different size for one page, photos that run across a page edge.
