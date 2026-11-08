# State and storage

## AppState

`src/ui/app-state.svelte.ts` holds one `AppState` instance, `app`, built with Svelte 5 runes
(`$state`, `$derived`). It contains:

- **the collage**: photos (in the order added; replaced, never mutated), seed, columns, layout style,
  page count, the arrangement (`page`, changed in place and bumped with `pageRev`), settings
  (`PosterSettings`: size, border, corners, outer border, Instagram split, format, quality);
- **the editor**: tab, tool (`mode`), selection (`selected` plus `alsoSelected`), crop target, focus ring,
  view, removed photos for undo;
- **messages**: status line, notices, dialogs and confirmations, progress;
- **derived values**: the layout, columns in use, trimmed share, selection, page counts, active size.

Components read `app` and call its methods; they keep only local display state. Methods are grouped by
area (layout, book, address and storage, view, photos, size, export). Helpers that need no live state are in
`src/ui/state/` (`browser.ts`, `notices.ts`, `saved-work.ts`) with unit tests.

Confirmations go through `app.confirm({ title, text, action, run })`, which opens the confirm dialog and runs
`run` on the main button; `pendingQuestion` and `confirmationOutcome` expose it (used by the WebMCP tools).

## The address

`src/ui/url.ts` reads and writes `?seed=` without touching the rest of the URL. A new arrangement pushes a
history entry; startup and restoring rewrite the current one. `popstate` (back/forward) applies that
address's seed.

## Saved work

`src/io/session.ts` keeps the work in IndexedDB (database `collage-creator`): the photo files themselves,
each photo's span, crop and page, and the settings, as a versioned record (`v: 1`). It is written shortly
after each change (the root sets `data-saving` meanwhile, which tests wait on) and read on load, showing a
"Bringing back your photos" progress while files are decoded again. `checkSession` validates every field
of a stored record and falls back to defaults, so old or damaged records load safely; older formats (the
earlier Book mode, work from before Gallery) are migrated.

Language is stored in `localStorage`; it is a small string.

When storage is refused (private windows, some privacy settings, WebKit in tests) the app keeps working and
warns once that work will not survive a refresh.
