# Tasks 001 (grouped by user story)

## Core (tests written first)

- [x] T001 Port `test_collage.py` to Vitest (`tests/layout.test.ts`)
- [x] T002 Seeded RNG, `Rng` interface, shuffle
- [x] T003 Port Page/Column/Cell/CellExtent and `generateLayout`
- [x] T004 Property tests: tiling, every photo once, determinism, retargeting, swap, edge cases (**tiling ones fail by decision, see research.md**)
- [x] T005 Layout benchmark (`npm run bench`)

## US1 Add photos (P1)

- [x] T010 Worker protocol, pool, worker: probe (upright size + thumbnail)
- [x] T011 Import: file picker, drag and drop, type check, duplicates, messages naming files
- [x] T012 Photo list UI
- [x] T013 Privacy note at the upload controls (nothing is uploaded; linked to the Add images button for screen readers)

## US2 Auto layout (P1)

- [x] T020 Shared draw code (cover-crop, borders), preview rendering
- [x] T021 Empty state

## US3 Poster size (P1)

- [x] T030 Presets and pixel fields
- [x] T031 `platform/limits` detection and clamp (+ tests)

## US4 Save (P1) and US7 progress/cancel (P3)

- [x] T040 Export: worker decode at cell size, draw, close bitmaps, encode PNG/JPEG
- [x] T041 Progress dialog and cancel (terminates workers; pool recreated)

## US5 Re-roll (P2) and US6 Add/remove (P2)

- [x] T050 Seed field, Regenerate
- [x] T051 Remove photo, add more

## Verification

- [x] T060 e2e user stories, EXIF, offline, no foreign requests (Chromium)
- [ ] T061 e2e in Firefox and WebKit (configured; runs in CI, not run in the authoring sandbox)
- [ ] T062 Fix layout holes so the four failing tiling tests pass (owner: later)
