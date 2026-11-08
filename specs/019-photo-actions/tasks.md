# Tasks: Photo actions on the preview

- [x] T001 [US1] Add `src/ui/PhotoActions.svelte` with Wider, Taller (×n badge), a divider and Crop, accent styled, ids kept
- [x] T002 [US1] Show it in `src/ui/Stage.svelte` while photos are selected, except in Swap
- [x] T003 [US2] Crop slider (vertical) and the quiet round Done button (`#crop-done`) under Crop; Done, Enter and Crop again finish
- [x] T004 [US2] `zoomSelectedCrop(1)` clears the crop (FR-006) in `src/ui/app-state.svelte.ts`
- [x] T005 [US1][US2] Remove Wider, Taller, Default size, Crop and Reset crop from `src/ui/SelectedDock.svelte`; remove their styles
- [x] T006 [US3] Keep the Swap tool; no actions in Swap
- [x] T007 [US4] Crop disabled with "Select one photo to crop" for several photos
- [x] T008 [US5] W, T, C and Enter in `src/ui/Preview.svelte`; Help lists the keys (`#help-keys`); no hints on buttons
- [x] T009 [US6] Phone row under the tools; narrower zoom group; tool column wraps when too tall
- [x] T010 Update `src/agent/controls.json` and the e2e selectors; add tests for Done, Enter, the keys, Swap and several photos
- [x] T011 Run Biome, svelte-check, Vitest, the header check and the Chromium e2e suite
