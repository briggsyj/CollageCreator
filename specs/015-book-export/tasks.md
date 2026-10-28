# Tasks: Spec 015

- [x] `bookFileNames` and the empty-page rule in `src/core/book.ts` (unit tested)
- [x] The book path of saving (`saveBook` in the app state): `exportCollage` once per page, so one page canvas at a time
- [x] Progress across the pages; cancel stops the book
- [x] Save, "Save this page", and the notice for skipped pages
- [x] The size limit applies per page; reduce for every page
- [x] Session carries the pages
- [x] End-to-end tests: zip contents and order, image sizes and colours, one image when only one page has photos, empty page skipped, Save this page
- [ ] Tests for JPEG, cancelling, and comparing each saved page with its part of the preview
