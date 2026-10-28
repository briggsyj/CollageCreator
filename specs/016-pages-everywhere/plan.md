# Plan: every collage is a book of pages

- `pageCount` replaces the Book switch: `book` is `pageCount > 1`. A single page keeps using the plain arrangement (`generatePage`), which is the same as page 0 of a book with the same seed, so nothing changes for one page. Adding the second page wraps the current arrangement in a `BookPage` (`BookPage.wrap`) instead of re-arranging it; removing down to one page arranges again from the seed.
- `fillPage` puts every photo on page 0 while there is one page.
- The preview reports the poster's rectangle in CSS pixels (`app.posterBox`); a DOM overlay (`PagePills.svelte`) places the "+ Add page" button and the page pills over the canvas from it, so they are real buttons (keyboard, screen reader, glass styling) and not canvas drawing.
- Carousel pages: `exportCollage` is split into `exportPieces` (the images of one page: one, or one per square) and the zip; a book saves each page's pieces and zips them.
- The Book card, the page-style switch and the "Add page" button of the Poster step are removed; the page count text, Photos per page and Spread evenly stay, shown from two pages on.
- Cut marks are drawn on every page of a carousel book.
