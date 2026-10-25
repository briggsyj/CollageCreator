# Spec 009: Seed in the address, saved work, browser language

**Gate**: the seed is in the address and back/forward step through arrangements; a refresh brings back the photos, sizes and settings; the page starts in the browser's language, or English.

## User stories

- **P1** As a user, I can use the browser's back and forward buttons to return to an earlier arrangement of my photos.
- **P1** As a user, I can refresh the page (or come back later) and carry on where I was.
- **P2** As a user, I get the interface in my browser's language if it is supported, otherwise English.
- **P2** The button that makes a new arrangement is called **Shuffle layout**.

## Requirements

- The address carries `?seed=N`. Every new arrangement (shuffle, typed seed, photos added or removed, undo) adds a history entry; startup and restoring saved work rewrite the current entry. An address that opens with a seed uses it.
- Back/forward restore the seed and make one generation from it. The photos, columns and sizes are not in the address, so a seed shared with different photos gives a different picture.
- Photos (the files), their order, requested sizes, the seed, columns and all settings are kept in this browser (IndexedDB). Nothing leaves the device (the policy still allows only the app's own files). **Remove all** and removing photos delete the kept files. If storage is unavailable or full, one message says so and the app works as before.
- Saved values from storage are validated; anything out of range falls back to the default.
- Language: a language chosen in the page wins; otherwise the first entry of the browser's language list we have a translation for (`pt-PT` uses the Brazilian Portuguese translation); otherwise English.

## Edge cases

Storage blocked (private windows, policy); a stored file that no longer decodes (skipped with the usual message); adding photos while restoring (waits for it); an address seed together with stored work (the address wins); a browser without `navigator.languages`.

## Out of scope

Putting photos, columns or settings in the address; syncing between devices; limits on how much is stored.
