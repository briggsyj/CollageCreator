# Spec 006: Column control

**Gate**: the number of columns can be chosen in the UI and the chosen number is respected in the preview and the saved image, the same way as the automatic one.

## Why

The layout picks a number of columns on its own (the original's heuristic). People sometimes want a different look: fewer, taller stacks of larger photos, or a finer grid. The original had no way to change it.

## User stories

- **P1** As a user, I can set how many columns the collage uses, so that I can steer the look of the arrangement.
- **P1** As a user, I can leave it on automatic and get exactly what I got before.
- **P2** As a user, I can see how many columns are really in use, because empty ones are dropped and a photo can span two.

## Requirements

- An empty field means automatic. A number means "use this many".
- Values are whole numbers from 1 to 100; anything outside is brought into range, and a value that is not a number means automatic.
- The choice is kept when generating a new arrangement, changing the poster size, or adding and removing photos.
- The same seed and the same number of columns always give the same layout. On automatic, layouts for existing seeds do not change.
- What the preview shows is what is saved.

## Edge cases

No photos yet (the choice is remembered and applied when photos arrive); more columns than photos (empty columns are dropped); one column (photos stack full width and always tile the poster exactly); a number that is not whole.

## Out of scope

Per-column widths, choosing which photos span two columns.
