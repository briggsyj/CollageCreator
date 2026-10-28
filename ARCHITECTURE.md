# Architecture

Collage Creator is a static web app: Svelte 5 components over one state object, pure layout
code, and canvas drawing in the page (preview) and in web workers (export). There is no server;
photos never leave the browser.

## Data flow

```
files ──▶ io/import ──▶ AppState.photos ──▶ core/search + core/book ──▶ layout
 (zip ──▶ io/unzip)      (thumbs, ids,          (best of N tries,          │
                          pages, crops)          one per page)             │
                                                                           ▼
                                   ui/Preview.svelte ◀── render/preview (thumbnails, canvas)
                                   ui/SaveBlock ──▶ render/export, render/book-export
                                                        └─▶ render/pool ──▶ export.worker.ts
                                                            (full-size decode, OffscreenCanvas)
AppState ──▶ ui/state/saved-work ──▶ io/session (IndexedDB) ── restored on the next visit
```

1. **Import** (`src/io/import.ts`): files are checked, decoded once in a worker to make a
   thumbnail and read the size, and become `ImportedPhoto`s. ZIPs are opened first by
   `src/io/unzip.ts`.
2. **Layout** (`src/core/`): pure functions with no DOM. `layout.ts` (Mosaic, ported from the
   original), `slicing.ts` (Gallery), `search.ts` (best of several seeds), `book.ts` (pages in
   a row, each with its own layout). Same photos + seed + settings = same layout.
3. **Preview** (`src/render/preview.ts`, `src/ui/Preview.svelte`): draws the layout from
   thumbnails on one canvas, redrawn on the next frame after any change, with pan and zoom
   (`render/view.ts`) and the selection, hover and page marks on top.
4. **Export** (`src/render/export.ts`, `book-export.ts`): full-size photos are decoded and drawn
   in a pool of workers on `OffscreenCanvas`; a book or an Instagram post becomes several images
   and a ZIP (`src/io/zip.ts`, no library).
5. **Saved work** (`src/io/session.ts`): photos (as files) and settings in IndexedDB, written a
   moment after each change and read back on load.

## The state

`src/ui/app-state.svelte.ts` holds the single `AppState` (`app`): the photos, the layout, the
settings, the selection, the view, and every action the UI calls. Components read it and call
its methods; they hold only local display state. It is grouped in sections (collage, editor,
messages, layout, book, address and storage, view, photos, size, export).

Logic that does not need the live state lives beside it in `src/ui/state/` and is unit tested:

| File                  | What                                               |
| --------------------- | -------------------------------------------------- |
| `state/browser.ts`    | Language storage and preferences, downloads        |
| `state/notices.ts`    | The "files not added" notice, size descriptions    |
| `state/saved-work.ts` | Converting the state to and from the stored record |

When adding a feature, put pure rules in `src/core/` (or a `state/` helper) with unit tests,
and keep `AppState` methods thin: change state, call the pure code, set a status message.

## Modules

| Folder          | Responsibility                                               | DOM?   |
| --------------- | ------------------------------------------------------------ | ------ |
| `src/core/`     | Layout, pages, crops, split images, seeded randomness, types | No     |
| `src/io/`       | Import, ZIP read and write, HEIC, saved work, colours        | Some   |
| `src/render/`   | Preview and export drawing, worker pool, view maths          | Canvas |
| `src/platform/` | Detecting the largest canvas the browser allows              | Yes    |
| `src/i18n/`     | Message lookup from the original `.po` catalogues            | No     |
| `src/ui/`       | Svelte components, the state, presets, the address           | Yes    |

## Principles

- **Private:** no network requests after load; a strict Content Security Policy (`csp.ts`) with
  no inline scripts or styles (styles set from code go through the CSSOM).
- **Reproducible:** layouts come from a seed, shown in the address.
- **Responsive work:** decoding and export run in workers; the preview uses thumbnails.
- **Accessible:** every control is a real button or input with a label and a tooltip; the
  preview can be driven from the keyboard.

## Tests

- `tests/` (Vitest, fast-check): the pure code, including property tests of the layout.
- `e2e/` (Playwright, Chromium, Firefox and WebKit in CI): the app as a user drives it, one file
  per area (`basics`, `photos`, `editing`, `book`, `instagram`, `app`, `export-100`). Helpers
  in `e2e/helpers.ts` wait for the preview (`data-pending`) and saved work (`data-saving`)
  instead of fixed pauses.

Specs for each feature are in [specs/](specs/) (see [specs/README.md](specs/README.md)).
