# Tasks 009

Commit once per phase. Tick a box only when its tests pass.

## Phase 0: baseline

- [x] R001 Run install, unit tests, lint, typecheck, header check and e2e; write down what already fails
- [x] R002 Read the design Artifact boards listed in the plan and `src/ui/app.ts`, `src/render/view.ts`, `src/render/preview.ts`

## Phase 1: core (no UI)

- [x] R010 Remove `"circle"` from `CornerStyle`, `draw.ts`, tests and README
- [x] R011 `LayoutStyle` type; `generateSlicingLayout` in `src/core/slicing.ts`
- [x] R012 Unit and property tests for Gallery: exact tiling, determinism, all photos placed, spans enlarge cells
- [x] R013 `generateBest` and `scoreLayout` work for both styles; test "seed reproduces the winner" for Gallery
- [x] R014 Swap and removal work for Gallery layouts
- [x] R015 Benchmark Gallery with 100 photos (`npm run bench`); the target is under 200 ms for one layout

## Phase 2: look and structure (desktop)

- [x] R020 Tokens, glass classes, fallbacks, backdrop module; sampled photo colours at import
- [x] R021 Remove the header bar; sidebar with app name, tablist, panels, footer (Save, file summary, Language, About)
- [x] R022 Empty state and drop target; privacy line inside it
- [x] R023 Pan/Swap toggle, zoom buttons, hint pill; Space pans temporarily
- [x] R024 Update e2e tests for moved controls; keep ids where possible

## Phase 3: steps

- [x] R030 Photos step: grid, selected-photo controls, import notices summary
- [x] R031 Poster step: presets (including 800 × 600 and Instagram), Custom, orientation, Layout cards, Columns for Mosaic, trim figure
- [x] R032 Style step: border thickness, colour swatches, corners (no Circle), outer border switch
- [x] R033 Save: file summary, format, JPEG quality, progress dialog restyle
- [x] R034 About dialog and credit footer renamed and restyled; attribution kept

## Phase 4: mobile and dark

- [x] R040 Narrow layout: title bar, bottom bar, sheets, photo action bar, zoom column, shuffle button
- [x] R041 Dark theme from the tokens; reduced-transparency and no-blur fallbacks
- [x] R042 Layout test: no horizontal overflow from 340 px to 1440 px in both themes

## Phase 5: rename, docs, finish

- [x] R050 Rename to Collage Creator everywhere; amend the constitution; update NOTICE and README features list (Gallery, presets, modes)
- [x] R051 Update `specs/README.md` with the 009 row; update this spec's research notes with anything that differed from the design
- [x] R052 `npm run format`, lint, typecheck, headers, unit, build, e2e all green; list any pre-existing failures in the PR description
- [x] R053 Open the pull request into `master` with screenshots of desktop, mobile, empty state and dark
