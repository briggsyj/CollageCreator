# Spec 016: Every collage is a book of pages

**Gate**: a plain collage behaves exactly as before; the page controls appear only once a second page is added; an Instagram post is a kind of page, and a book of them saves every image.

Supersedes the parts of specs 014 and 015 that made Book a separate layout card and mode.

## Idea

A regular collage is a book with one page. There is no "Book" mode to switch on: the page controls show up when a book has more than one page. An Instagram post is a **page type**: instead of one image, the page is several square images side by side, cut when it is saved.

## User stories

- **P1** As a user with one page, nothing about pages is in my way: the Layout cards are Mosaic and Gallery, there are no page controls, and the collage looks and saves as before.
- **P1** As a user, I add a page with a "+ Add page" button beside the last page on the preview, and the page controls appear.
- **P1** As a user with several pages, each page has a small pill above it with Move left, Move right, Save this page and Remove page.
- **P2** As a user, I choose the Instagram post size and every page of my book becomes a post of that many square images.

## Requirements

- **Page type.** There are two, and a book has one type for all its pages.
  - _Standard_: one image of the output size (Width × Height). The default.
  - _Carousel_ (the Instagram post): one wide page of N square images side by side, N from 2 to 20, each the chosen square size, with dashed cut marks and scissors in the preview. Saving a carousel page gives N images, numbered from the left.
    The type is chosen in the Poster step: the size buttons for Standard, the Instagram post button for Carousel. Choosing any other size button goes back to Standard.
- **Pages.** 1 to 20 pages, at least one. The "+ Add page" button appears beside the last page whenever there are photos; adding makes a new blank page after the last. With one page there is no page pill, no page heading in the Photos step and no page controls in the Poster or Style steps.
- **Photos.** With one page every photo goes on it. A **Pages** count at the top of the Poster step sets the number of pages and shares the photos evenly across them, in order; to place photos by hand use Add page, Remove page and Move to page. Photos added later go on the last page. "Shuffle all between pages" and Move to page appear with the second page. The Style step's shuffle is "Shuffle layout within pages" (every page re-arranged, each photo keeping its page) once there are several pages. A hand edit (swap, resize, crop) is tracked, and shuffling asks first until the next edit.
- **The pill above a page** (two or more pages): the page's number and photo count, Move left, Move right, Save this page, Remove page. Move left is off for the first page, Move right for the last. Remove page moves its photos to the prior page (the next for the first) and goes back to a plain collage when one page is left. The same Move and Remove buttons stay in the Photos step, for keyboards, screen readers and pages too narrow to show a pill.
- **Layout cards.** Mosaic and Gallery arrange every page. There is no Book card.
- **Saving.** One page: as before (an image, or for a carousel a zip of its images). Several pages: one image per page with photos, or for carousels every page's images, in a zip named in page order (`book-<seed>_1.png`; for carousels `book-<seed>_p2_3.png` is page 2, image 3). Empty pages are skipped with a notice. "Save this page" saves just that page the same way.
- **Kept over a refresh**: the number of pages, photos per page and each photo's page.

## Notes

- A one-page book is the same arrangement as before for the same seed, so existing seeds and saved work are unchanged. Work saved with the earlier Book mode opens as a book of its pages, or as a plain collage if it had one page.
- A book of carousels is a row of wide pages; at Fit each page is small. The cut marks of every page are drawn, and the pills sit above them.

## Out of scope

Mixing standard and carousel pages in one book; a different size for one page; spreads, covers, page numbers on the images, PDF.

## Later changes

- Removing a page, and Remove all, ask first. Remove all also goes back to one page; Undo remove brings the pages back.
- The drop area before any photos is always one page.
- A ZIP (such as a zipped folder of photos) can be added: the images inside it are added, other files are named in the notice.
- Photos can be dragged onto another page in the Photos step, with a mouse or, on a touch screen, by pressing and holding then dragging. Dropping on the target after the last page makes a new page.
- Several photos can be selected (Shift-click, with any tool or in the Photos step); size and remove apply to all, crop is off, and Move to page moves them together.
- Selection ends when something unrelated is clicked or another tool is chosen (not while Space is held to pan). Removing photos asks first; Enter confirms in every confirmation dialogue.
- Two fingers pinch to zoom the preview, also with the Pan tool. Every button has a title shown as a tooltip, and clickable items show hover feedback on devices with a pointer.
