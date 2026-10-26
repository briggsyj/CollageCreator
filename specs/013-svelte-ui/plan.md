# Plan: Svelte UI

## Why a framework (constitution, principle 9)

`src/ui/app.ts` had grown to about 1,900 lines plus a 670-line `index.html`. Most of it was
hand-written syncing: after each change a function copied state into the page
(`updateControls`, `syncSizeFields`, `syncSplit`, `renderPhotoList`, `applyTranslations` and so on),
and each new control meant a new ref, a new listener and another place to remember to sync. The
loading display needed one more of each across the sidebar and the preview.

The platform alternative (splitting `app.ts` into modules and a small `render(state)` helper) would
have helped with size but not with the syncing. Svelte compiles to direct DOM updates, adds a small
runtime, and leaves the canvas drawing, workers and layout code as they are.

Measured cost, honestly: the UI is about the same number of lines (2,880 in 17 files against 2,580
in 2), and the built script grows from 94 kB (27 kB gzipped) to 165 kB (52 kB gzipped) because of the
Svelte runtime. The gain is structure and no hand-written syncing, not less code.

## Structure

- `src/ui/app-state.svelte.ts`: the state (`$state`) and the actions (relayout, add and remove
  photos, size and split, save, undo, tabs). It is the successor of `app.ts`.
- Components: `App` (page, window events, saving work), `Sidebar` (header, tabs, sheet, language),
  `PhotosPanel`, `PosterPanel`, `StylePanel`, `SelectedDock`, `SaveBlock`, `Stage` (tools, status),
  `Preview` (canvas, pointer and keyboard handling, empty state), `Dialogs`, `Thumb`.
- `actions.ts`: Svelte actions for pulling a sheet down, a non-passive wheel listener and showing a
  value in a field that must go back to the stored value.
- `tr.svelte.ts`: `tr()` wraps `t()` and reads the language, so text changes with it.
- Photos are held in a `$state.raw` array and replaced, never changed in place (they go to workers,
  which cannot be given a proxy). The page object is changed in place by swaps and resizes, so a
  counter (`pageRev`) tells the preview to redraw.
- The preview is drawn from one `$effect` that reads everything the picture depends on and asks for
  a frame.
- Work is saved from one `$effect` that waits 250 ms after the last change, and only once saved work
  has been restored.

## Outer border fix

`drawBackground` now fills the poster with the border colour whenever photos have shaped corners, and
`drawPhoto` leaves corners on the poster's edge square when there is no outer border
(`squareCorners`). Before, switching the border off left white wedges at every rounded corner on the
edge.

## Tooling

- `svelte` (runtime dependency, so its licence notices ship), `@sveltejs/vite-plugin-svelte`,
  `svelte-check`.
- `npm run typecheck` is `svelte-check` (it also checks the `.ts` files). Biome checks the script of
  `.svelte` files; its unused-variable rules are off for them because it cannot see the template.
- The licence-header check also covers `.svelte` files.
