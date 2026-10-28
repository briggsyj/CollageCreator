# Tasks: Spec 014

- [x] `src/core/book.ts`: limits, distribution, move, swap, remove and reorder pages, gaps and offsets (unit and property tested: every photo on exactly one page; swap and move keep the count)
- [x] `Placement.page`; a book `LayoutPage` that arranges each page and offsets it in the row
- [x] Draw all pages in one preview, with gap, labels, selected-page outline
- [x] Session: page of each photo, page order and count; old sessions open as one page
- [x] State actions and undo for pages
- [x] Poster step: Book layout card, page count, Photos per page, Add page (blank), Remove page (not the last), Move left / right, Spread evenly, Shuffle photos between pages (Book only)
- [x] Photos step grouped by page; "Move to page" in the dock
- [x] Swap and Select across pages; the keyboard ring and reading order run across pages; photo names say their page
- [x] End-to-end tests: photos fill pages and add pages when full; Add page makes a blank page that takes the next photos; each page has the output size; swap across pages; move to page; Wider on one page leaves the others; remove a page and undo; refresh keeps the book
- [x] Help text
- [ ] Translators: the new strings are English-only until added to the `.po` files
