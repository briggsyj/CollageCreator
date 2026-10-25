# Plan: Spec 009

- `src/ui/url.ts`: `parseSeed`, `withSeed` (pure; unit tested).
- `src/io/session.ts`: IndexedDB store with two object stores (`files`, `meta`); `saveSession` writes only files not yet stored and deletes unused ones; `loadSession`, `checkSession` and `checkSettings` validate what comes back (unit tested).
- `src/ui/app.ts`: `relayout` calls `syncUrl` and `persist`; `popstate` re-generates from the address seed; `restore` runs at startup and blocks saving until done so an empty page cannot overwrite stored work; `addFiles` waits for it.
- `src/i18n/index.ts`: `preferredLanguage` walks a language list; a regional variant maps to its base language's translation.
- Photos are stored in IndexedDB, not `localStorage`: `localStorage` holds only text and about 5 MB.
- The privacy note now says photos are saved in this browser until removed. The button's old translation (`Regenerate`) no longer applies; the new label is English-only until translators add it to the `.po` files.
