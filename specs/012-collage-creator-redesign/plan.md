# Plan 012

## How to run this plan (read first)

1. This plan is run **once, unattended, and must finish in that one run**. Nobody is available to answer questions. Make the decision this plan or the spec implies, record it in the spec's research notes and the PR description, and keep going. Never stop to ask.
2. Work on branch `claude/sharp-ritchie-oq4dba`; do not push to any other branch. Commit once per phase in [tasks.md](tasks.md), push after every commit, and tick the boxes as you go. After Phase 1 is pushed, open the pull request into `master` as a **draft** so the work is never stranded, then keep pushing to it. Mark it ready for review only when every phase is done.
3. Read `.specify/memory/constitution.md`, `specs/README.md`, [spec.md](spec.md) and this file. Read the design Artifact (below) before touching the UI.
4. Run `npm ci`, `npm test`, `npm run lint`, `npm run typecheck` and `npm run check:headers` first and note which tests already fail (the README and `specs/README.md` mention known gaps). Do not fix unrelated failures; list them in the PR.
5. Before each commit run `npm run format`, lint, typecheck, the header check and `npm test`. Before the last commit also run `npm run build` and `npm run test:e2e` (Chromium: `npx playwright install chromium` once).
6. Order of priority if time or context runs short: Phases 0 to 3 first (they carry the product), then 4 (mobile and dark), then 5 (rename and docs). Never leave a phase half done: either finish it and commit, or revert it and say so in the PR. Use sub-agents for independent work (for example the Gallery core in Phase 1 and the theme tokens in Phase 2) and keep your own context for integration.
7. If a task is blocked (a failing test you cannot fix, the Artifact unreadable, a contradiction between the repo and this plan), record it in the research notes and the PR description, skip to the next task, and carry on. Constitution governance asks to stop and ask; for this unattended run the owner has pre-approved recording instead.

## Design reference

The design is a canvas Artifact owned by the repository owner. Read it with the Artifact tool, action `read`, `url` below, `paths` set to the board files you need (each is one `.dc.html` page; open it as text and read the HTML and CSS). If the Artifact cannot be opened, work from this plan and the token appendix; do not guess the look.

- **URL**: <https://claude.ai/artifact/WfR5tSV6ZpJhyDoCxpn6LQ> (title "Collage Creator: mobile and desktop layouts")
- **Boards are mock-ups.** They use inline `style` attributes and fixed pixel sizes. The app's Content Security Policy is `style-src 'self'`, which blocks inline style attributes, so build with classes and custom properties, never `style="…"` in markup. Setting a custom property from script (`element.style.setProperty`) is allowed.

### Which boards to use

| Need                                                | Boards (under `project/`)                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Look, desktop, light**                            | `StyleEDesktop.dc.html`                                                                                            |
| **Look, mobile, light**                             | `StyleEMobile.dc.html`                                                                                             |
| **Form controls (inputs, sliders, switches, etc.)** | `StyleEElements.dc.html` (light), `StyleDElements.dc.html` (dark)                                                  |
| **Empty state**                                     | `StyleEEmptyDesktop.dc.html`, `StyleEEmptyMobile.dc.html`                                                          |
| **Pan / Swap toggle, Swap mode with a selection**   | `StyleEDesktopSwap.dc.html`                                                                                        |
| **Dark look**                                       | `StyleDDesktop.dc.html`, `StyleDMobile.dc.html`, `StyleDElements.dc.html`                                          |
| **Content of each step, desktop**                   | `DesktopPhotos`, `DesktopSelected`, `DesktopPoster`, `DesktopPosterCustom`, `DesktopPosterGallery`, `DesktopStyle` |
| **Content of each step, mobile**                    | `Main`, `Selected`, `Photos`, `Poster`, `PosterCustom`, `PosterGallery`, `Style`, `Save`                           |
| **Ignore**                                          | `StyleA*`, `StyleB*`, `StyleC*` (explored and rejected)                                                            |

The content boards (names without `Style` in front) use an older flat look; take their **layout and wording** from them and their **look** from the E and D boards. Where the two differ, the E boards win for the Pan/Swap toggle, zoom controls, backdrop, and the removed hint bar.

### What the design shows, in short

- **Desktop**: no header bar. A floating glass sidebar (360 px wide, 10 px from the edges) holds the app name, a segmented tablist (1. Photos, 2. Poster, 3. Style), the step's panel, and a footer with the file summary ("PNG, 1600 × 1200 px"), Save poster, and the Language and About links. The collage sits to its right with, at the top left, a pill showing the hint or status, and at the top right a tool column: a glass tray with **Pan** and **Swap** (pressed-in when on) and, below a gap, the raised buttons **+**, **−** and **Fit**.
- **Mobile**: the collage fills the screen under a slim glass title bar with a menu button (Language, About). A bottom glass bar has Photos, Poster, Style and Save; each opens a sheet (a rounded panel with a grab handle and Close). Tapping a photo shows an action bar (Wider, Taller, Swap, Remove). A pill shows the hint; zoom buttons sit at the top right; Shuffle layout is bottom left.
- **Backdrop**: a heavily blurred set of 12 colour blocks, one per photo in upload order (first 12), on a fixed 4 × 3 grid. It never depends on the layout. With no photos it is a warm neutral (`#e6e1d7`) with a soft vignette.
- **Empty state**: a dashed recessed drop target the size of the poster with an icon, "Drop photos here" (mobile: "Add photos to begin"), "Everything runs in your browser. Your photos are never uploaded." and a button. Steps 2 and 3, Save, zoom and the mode toggle are disabled.
- **Poster step** (size and shape only): size chips (Screen, Small, Square, A4, A3, A2, Instagram post and a full-width Custom), an orientation segmented control (Landscape, Portrait) with width × height fields (in px) below. **Photos step** also holds Shuffle layout, above the list. **Style step** starts with Layout (Mosaic and Gallery cards, Columns for Mosaic, the trim figure), then border, colour, corners and the outer border, and ends with Technical configuration (seed).
- **Style step**: Border thickness slider, Border colour swatches with Custom, Photo corners (Square, Slight, Rounded), and a switch for the outer border.

## Architecture

### Core (`src/core/`, pure, no DOM)

- New `src/core/slicing.ts`: `generateSlicingLayout(photos, ratio, seed, options): Layout`. Same output type as `generateLayout`, so rendering, scoring and export are unchanged.
  - Build a random binary tree over the photos (shuffled by the seeded generator in `rng.ts`). Each internal node is a horizontal or vertical cut.
  - Give each leaf a weight from its photo's shape and its `PhotoSpan` (`columns` × `rows` multiply the weight, so Wider and Taller are honoured as larger panels). Split each node's rectangle in proportion to its subtrees' weights. Choose each cut direction to bring the cell shape closest to its photos' shapes (this is what lowers cropping), with the generator breaking ties.
  - Cells must tile the page exactly with no gaps (same invariant the Mosaic tests check). Use exact fractions at each split and give the last child the remainder so rounding cannot leave a gap.
- `src/core/types.ts`: add `LayoutStyle = "mosaic" | "gallery"`; remove `"circle"` from `CornerStyle`.
- `src/core/search.ts`: `generateBest` takes the style and calls the right generator. Scoring is unchanged. Gallery ignores `columns`.
- Check how `Page.swapPhotos` and removal work on `Page` in `layout.ts`; Gallery needs the same swap behaviour (exchange which photo sits in two cells). Prefer a small shared interface over duplicating `Page`.
- Tests (Vitest, fast-check) mirror `tests/layout.properties.test.ts` and `tests/search.test.ts`: tiling, determinism for a seed, every photo placed exactly once, requested spans give larger cells, best-of-N never worse than a single try, and the seed reproduces the winner.

### Import (`src/io/import.ts`, `src/render`)

- Sample each photo's average colour at import (draw the thumbnail to a 1 × 1 `OffscreenCanvas` in the worker that already makes the thumbnail, or from the thumbnail on the main thread if simpler) and store it on `ImportedPhoto`.
- Return structured results instead of only message strings: a list of `{ kind: "duplicate" | "not-image" | "unreadable", name }` beside the existing `onMessage`, so the UI can group them. Keep the existing messages for the live region.

### UI (`index.html`, `src/style.css`, `src/ui/`)

- Keep every existing element **id** that e2e tests use (`#photo-list`, `#save`, `#messages`, `#seed`, `#preview`, `#file-input`, `#progress-dialog`, etc.) unless the design removes the control. Where an id must change, update `e2e/` in the same commit.
- Replace the top bar and flat sidebar with the sidebar structure above. Tabs are an ARIA tablist; arrow keys move between tabs. Split `app.ts` (983 lines) where it helps: a small module for mode and zoom controls (`src/ui/tools.ts`), one for notices (`src/ui/notices.ts`), one for the backdrop (`src/ui/backdrop.ts`).
- **Pan and Swap**: add `state.mode: "pan" | "swap"` (default `"pan"`). In Pan mode a drag on the preview pans and a click does nothing to the layout; in Swap mode a click picks or swaps as today; holding Space pans temporarily in Swap mode. The toggle buttons use `aria-pressed` and `aria-keyshortcuts="Space"` on Pan. Zoom buttons call the same code as the keys (`view.ts`). Keyboard behaviour on the canvas stays as today; Enter still picks and swaps whatever the mode.
- **Hint pill**: shows a mode-specific hint; status messages from `setStatus` show here for a few seconds and also go to the live region.
- **Presets**: extend `src/ui/presets.ts` with groups (Screen, Print; Instagram post is its own button) and an orientation flag; keep `findPreset`. Typing a width or height selects Custom. Orientation swaps width and height. Remove the `#preset` `<select>` only if every e2e use is rewritten; otherwise keep it visually hidden but in sync, which is simpler to keep green.
- **Layout cards and columns**: a radio-style pair bound to `state.layoutStyle`. Changing it calls `relayout("search")`. The Columns control is hidden for Gallery.
- **Trim figure**: replace "Cropped on average: N%" with "N% of each photo is trimmed to fit." plus "Lower means more of each photo is visible." in the Style step, under Layout. Remove the caption under the preview.
- **Selected photo**: keep Wider, Taller, Normal and Remove in the Photos step (desktop dock below the grid; mobile action bar), tied to the same `state.selected`.
- **Notices**: a region at the top of the Photos panel summarising skipped files with an expandable list, dismissible; errors persist until dismissed; "already added" clears itself after about ten seconds.
- **Credit footer, About dialog, progress dialog**: keep the content and behaviour, rename to Collage Creator, restyle with the glass tokens. The sidebar no longer shows the credit; it lives in the About dialog only (one click from the sidebar footer or the phone menu).
- **Backdrop**: a `<div class="backdrop" aria-hidden="true">` behind the app with 12 children. Colours are set with `style.setProperty("--c", …)` from the sampled colours in upload order. Blur, opacity and saturation come from tokens. Empty: neutral blocks.
- **Responsive**: one breakpoint near 760 px. Wider: sidebar layout. Narrower: collage fills the screen, the bottom bar replaces the tabs, and each panel becomes a sheet. Reuse the same panel markup; do not duplicate controls. Ensure no horizontal overflow from 340 px (the existing test does this for the sidebar).

### Theme

- Put the tokens from the appendix in `:root` (light) and in `@media (prefers-color-scheme: dark)` (dark). The existing `<meta name="color-scheme" content="light dark">` stays.
- Fallbacks: `@supports not (backdrop-filter: blur(1px))` and `@media (prefers-reduced-transparency: reduce)` switch the glass panels to opaque colours with the same text colours.
- Check contrast of text on glass at both extremes of the backdrop (white and saturated photos).

### Rename and attribution

- Rename in `index.html` (title, heading, About, credit), `README.md`, `NOTICE.md` where it names this app, `package.json` description, the Docker labels and Pages workflow titles if they name the app, and the e2e tests that check titles.
- Amend the constitution (principle 10 and "Present the app as an independent modified version, with a distinct name") to name **Collage Creator**; bump its version and amendment line. Keep the GPL notice, the original authors' credit and the SPDX headers. New files get only the SPDX line; changed files derived from the original keep their original notices and get a dated "CHANGED on" line.

### Translations

New strings are English-only for now (see Spec 008's note). Add them through `t()` so the catalogue can pick them up later. Do not edit `src/i18n/po`.

## Risks

- **CSP**: no inline styles; no remote fonts or images. `tests/csp.test.ts` and the header check must stay green.
- **Backdrop cost**: a large `filter: blur` on a full-screen element can be slow. Keep it to 12 blocks, use `will-change: transform` sparingly, and test with 100 photos (`e2e/export-100.spec.ts` exists).
- **e2e churn**: moving controls changes many selectors. Keep ids to limit it, and update tests rather than weakening them.
- **Gallery quality**: a first slicing tree can produce thin panels. Apply a minimum panel aspect (for example 1 : 4) when choosing a cut and let the best-of-30 search discard bad candidates.
- **Tiling tests**: `specs/README.md` records known tiling test failures in Mosaic; do not mask them for Gallery.

## Appendix: design tokens

Light (variant E, "Frosted glass, muted"):

```css
:root {
  --text: #1b1b1a;
  --sub: #3b3b37;
  --accent: #1a56b0;
  --stage-bg: #ebeae7;
  --hair: rgba(255, 255, 255, 0.55);
  --amb: 0.55;
  --amb-filter: blur(44px) saturate(1.1);
  --chrome-bg: rgba(255, 255, 255, 0.56);
  --chrome-filter: blur(24px) saturate(1.7);
  --chrome-border: 1px solid rgba(255, 255, 255, 0.75);
  --chrome-shadow:
    0 10px 32px rgba(30, 30, 40, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  --ctl-bg: rgba(255, 255, 255, 0.55);
  --ctl-border: 1px solid rgba(255, 255, 255, 0.8);
  --ctl-shadow: 0 1px 3px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  --inset-bg: rgba(110, 110, 125, 0.16);
  --inset-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12);
  --press-bg: rgba(255, 255, 255, 0.92);
  --press-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 #fff;
  --press-text: #1a56b0;
  --prim-bg: linear-gradient(180deg, #3f7fe0, #1a56b0);
  --prim-border: 1px solid rgba(255, 255, 255, 0.35);
  --prim-shadow: 0 4px 12px rgba(26, 86, 176, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  --poster-frame: #fff;
  --poster-shadow: 0 20px 44px rgba(20, 20, 30, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2);
  --tile-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  --r-chrome: 26px;
  --r-ctl: 14px;
  --inset: 10px;
  --gap: 10px;
  --badge-bg: rgba(20, 20, 24, 0.78);
  --field-bg: rgba(255, 255, 255, 0.45);
  --field-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.18);
  --field-border: 1px solid rgba(255, 255, 255, 0.7);
  --track: rgba(90, 90, 105, 0.3);
  --on: #1a56b0;
  --knob: #fff;
}
```

Dark (variant D, "Smoked glass"): same names, these values.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text: #f3f2ee;
    --sub: #cfcdc6;
    --accent: #8fb8ff;
    --stage-bg: #101012;
    --hair: rgba(255, 255, 255, 0.12);
    --amb: 0.65;
    --amb-filter: blur(44px) saturate(1.6) brightness(0.75);
    --chrome-bg: rgba(28, 28, 33, 0.56);
    --chrome-filter: blur(26px) saturate(1.5);
    --chrome-border: 1px solid rgba(255, 255, 255, 0.14);
    --chrome-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22);
    --ctl-bg: rgba(255, 255, 255, 0.1);
    --ctl-border: 1px solid rgba(255, 255, 255, 0.18);
    --ctl-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22);
    --inset-bg: rgba(0, 0, 0, 0.35);
    --inset-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
    --press-bg: rgba(255, 255, 255, 0.2);
    --press-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    --press-text: #fff;
    --prim-bg: linear-gradient(180deg, #3d7be4, #1f58b8);
    --prim-border: 1px solid rgba(255, 255, 255, 0.28);
    --prim-shadow: 0 4px 14px rgba(31, 88, 184, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    --poster-frame: #f4f2ec;
    --poster-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 26px 60px rgba(0, 0, 0, 0.65);
    --tile-shadow: 0 2px 6px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    --badge-bg: rgba(0, 0, 0, 0.72);
    --field-bg: rgba(0, 0, 0, 0.3);
    --field-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
    --field-border: 1px solid rgba(255, 255, 255, 0.16);
    --track: rgba(255, 255, 255, 0.18);
    --on: #3d7be4;
    --knob: #e9e9ee;
  }
}
```

Empty-state backdrop (both themes use neutral blocks): light `#d9d2c3 #e8e3d8 #ddd6c8 #e3ded2 #e9e5da #d7d0c1 #e1dbcd #e6e1d6 #dcd5c6 #e4dfd4` over `--stage-bg: #e6e1d7`, vignette `inset 0 0 170px rgba(80, 65, 40, 0.16)`, drop-target outline `2px dashed rgba(70, 60, 40, 0.55)` on `rgba(255, 255, 255, 0.38)`. For dark, darken these blocks to a similar warm-grey range and use a lighter dashed outline; there is no dark empty-state board, so judge by the dark tokens above.
