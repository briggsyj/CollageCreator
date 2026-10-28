# Spec 014: Book (several pages, each its own image)

> Partly superseded by [spec 016](../016-pages-everywhere/spec.md): there is no Book card or mode; a collage is a book of one page, and the page controls appear from the second page. The rest (pages, filling, moving photos, editing) stands.

**Gate**: a collage can be made of several pages shown side by side in the preview; photos can be edited as before and moved between pages; every page has the chosen output size.

## What it is

A third layout type, **Book**, beside Mosaic and Gallery. It is like the Instagram post (pages in a row, left to right) with two differences: the pages are separate pictures, each arranged on its own, and there is a small space between them in the preview. The space is only shown on screen; each page is saved as its own image (spec 015).

## User stories

- **P1** As a user, I choose Book and add pages. Every page is the output image size from the Poster step (Width and Height, in either orientation), so a book of five pages is five images of that size.
- **P1** As a user, I see all the pages in one preview, in order, with a small gap between them and a label under each ("Page 2 of 5").
- **P1** As a user, I edit photos as before: select one, make it Wider or Taller, Crop it, change borders and corners, Shuffle. A change on one page changes only that page.
- **P1** As a user, I swap two photos even when they are on different pages, and move a photo to another page without a swap.
- **P2** As a user, I add, remove and reorder pages, and see how many photos are on each.
- **P1** As a user, I just add photos and they fill the pages for me; pages are added as needed.

## Requirements

- **Pages.** 1 to 20 pages; there is always at least one (Remove page is disabled on the last one). A new book starts with one page. "Add page" appends a new blank page. "Remove page" moves its photos to the prior page (to the next page when it is the first) and says so; no photo is lost, so there is no separate undo. "Move left" and "Move right" on a page reorder pages; the photos go with their page.
- **Filling pages automatically.** A "Photos per page" setting (6 at first, 1 to 20) says how many photos a page takes. Photos added go to the first page that has room, in the order added; when every page is full a new page is added (up to 20; after that photos go on the last page). A blank page from "Add page" takes the next photos once the pages before it are full. "Spread evenly" shares all photos across the pages in order, filling each to the setting. Pages may end up with any number of photos after moves and swaps, and may be empty.
- **Arrangement.** Each page is arranged on its own by the inner arrangement (Mosaic or Gallery, chosen in Style as now), from the book's seed and the page number, so the same seed gives the same book. Columns, trim and the other Style settings apply to every page. Both shuffles are offered (Style step): "Shuffle layout" (Style step) re-arranges every page but keeps each photo on its page; "Shuffle photos between pages" mixes the photos across pages, keeping each page's count. The second is shown only in Book mode.
- **Editing.** Select, Pan, Swap, Wider/Taller, Normal size, Crop, Remove and the keyboard ring work on any page. Wider and Taller re-arrange only that photo's page. A crop stays with the photo when it moves pages.
- **Moving photos.** Swap picks two photos on any pages. "Move to page" in the selected-photo dock moves the selected photo to the page chosen from a list (it goes last on that page). In the Photos step the list is grouped by page, with a heading and a count for each page.
- **Preview.** One canvas draws every page, left to right, like the Instagram post shows its images, with a gap of 4% of a page's width, the label under each page, and the selected page outlined. Fit shows all the pages at once; the user pans along the row and zooms as now. All pages are drawn; nothing is left out for speed unless it proves slow.
- **Phone.** The same row, panned with a finger (Pan tool) and zoomed by the zoom buttons or pinch.
- **Keyboard and screen readers.** The arrow keys move the focus ring through the photos in reading order, page by page (all of page 1, then page 2, and so on). A photo's spoken name includes its page ("sea.jpg, page 2 of 5"), and moving a photo to another page is available from the dock, which works with the keyboard.
- **Where the controls are.** Book is a card in the Style step (with a Mosaic or Gallery choice for the pages and "Shuffle photos between pages"); Photos per page, Add page and Spread evenly are at the top of the Poster step; the Photos step lists the photos by page, each page with Move left, Move right and Remove page; Move to page is in the selected-photo dock.
- **Poster step.** In Book, Width and Height are the size of one page. The Instagram post and Book are separate choices; choosing one leaves the other.

## Decided

- Photos fill pages automatically (as above); both shuffles; Book and Instagram post are separate choices; pages stay in one pannable row; empty pages are kept (with a "Drop or move photos here" note) and skipped when saving; every page is drawn.

## Open questions

1. Is 6 photos per page a good start? Any number works; the alternative is to share the photos evenly across a fixed number of pages, which does not fit "Add page makes a blank page".
2. Should Book be a card beside Mosaic and Gallery (a layout) or a size choice like Instagram post? Proposed: a layout card, with the page controls in the Poster step.
3. A shortcut that zooms to the next or previous page (Page Up / Page Down) would save panning along a long row. Proposed: leave it out until the row proves awkward.

## Out of scope

Spreads (two facing pages with a gutter), page numbers or text on pages, covers, bleed and print marks, a PDF, a different size for one page, photos that run across a page edge.
