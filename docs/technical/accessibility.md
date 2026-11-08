# Accessibility

The goal is that every action can be done with a keyboard, is named for screen readers and is explained by
a tooltip.

- **Real controls.** Every action is a `<button>`, `<input>` or `<select>` with a label; toggles use
  `aria-pressed`, tabs use `role="tab"` with arrow-key navigation, dialogs are native `<dialog>`s (Enter
  confirms, Escape cancels).
- **Tooltips.** Every button has a `title`; an e2e test fails if one does not.
- **The preview** is a `<canvas role="application">` with instructions in its label. Arrow keys move a
  visible ring between photos (it shows only once the keyboard is used), Enter picks and swaps, Delete
  removes, Escape deselects, + / − / 0 zoom, Shift + arrows pan. With a photo selected, W, T and C act on it
  and Enter finishes a crop; the photo actions declare these with `aria-keyshortcuts`. The keys are listed in
  Help.
- **Overlays are DOM.** Page pills, Add page and the photo actions are buttons over the canvas, not drawn,
  so they are focusable and named.
- **Announcements.** Status messages ("Selected beach.jpg", "Swapped ...") go to a polite live region
  (`#messages`); the page and photo are announced when moving with the arrows in a book.
- **Motion.** `prefers-reduced-motion` sets every transition and the sheet animation to zero.
- **Colour.** Light and dark themes follow the system; state is never shown by colour alone (pressed
  buttons are also filled or raised, Taller shows its row count).

Known gaps: the collage itself is an image; photos are identified by file name only. Please report
anything that gets in your way.
