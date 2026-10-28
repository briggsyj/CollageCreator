# Tasks: Spec 014

- [ ] `src/core/book.ts`: limits, distribution, move, swap, remove and reorder pages, gaps and offsets (unit and property tested: every photo on exactly one page; swap and move keep the count)
- [ ] `Placement.page`; a book `LayoutPage` that arranges each page and offsets it in the row
- [ ] Draw all pages in one preview, with gap, labels, selected-page outline; skip pages out of view
- [ ] Session: page of each photo, page order and count; old sessions open as one page
- [ ] State actions and undo for pages
- [ ] Poster step: Book layout card, page count, Add page, Remove page, Move left / right, Spread evenly
- [ ] Photos step grouped by page; "Move to page" in the dock
- [ ] Swap and Select across pages; the keyboard ring and reading order run across pages; Page Up / Page Down
- [ ] Phone pager
- [ ] End-to-end tests: add pages; each page has the output size; swap across pages; move to page; Wider on one page leaves the others; remove a page and undo; refresh keeps the book
- [ ] Help text and the translation note (strings English-only until translated)
