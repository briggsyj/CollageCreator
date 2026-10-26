# 013 Svelte UI

**Gate**: the app looks and behaves as before, every end-to-end test passes unchanged in all three
browsers, the pure core and the drawing code are untouched (apart from the outer-border fix below),
and the loading display for saved photos works.

## User stories

- **P1** As a user, nothing I know changes: the same controls, texts, shortcuts, saved work and
  exports.
- **P1** As a user, when the page is reloaded and my saved photos are being read back, I see that
  it is happening (how many are done, of how many) and the Add buttons wait. If I add photos
  meanwhile, they are added after the saved ones, not lost or mixed in.
- **P1** As a user, the switch "Border around the whole collage" only adds or removes the border
  around the whole collage. The gaps between photos look the same either way, for every corner
  style. With it off, photos at the poster's edge run to the edge and their corners on the edge stay
  square; corners that face another photo stay rounded.

## Requirements

- The UI is written as Svelte 5 components with the state in one reactive module
  (`src/ui/app-state.svelte.ts`). `index.html` only holds the mount point.
- Element ids, classes, attributes and texts are kept, so the stylesheet and the tests do not change.
- The Content Security Policy is unchanged (`style-src 'self'`): no inline styles in markup, no
  Svelte transitions (they inject `<style>` elements). Styles are set through the CSSOM.
- The layout, rendering, i18n and I/O modules do not import Svelte.
- New strings (English only until translated): "Bringing back your photos… %(done)s of %(total)s",
  "Looking for your saved photos…", "Bringing back your photos", "You can add more once they are
  back.", "Your new photos are added once your saved ones are back."

## Out of scope

- A visual redesign, new features other than the two above, translations of the new strings.

## HEIC photos

iPhone photos (`.heic`, `.heif`) can be added in every browser. Safari decodes them itself; elsewhere a
WebAssembly decoder (`libheif-js`, LGPL-3.0) is fetched from the app's own files the first time one is
needed and runs in the image worker, so photos still never leave the device. The Content Security Policy
gains `'wasm-unsafe-eval'` in `script-src` for it (nothing else changes: still no outside origins).
