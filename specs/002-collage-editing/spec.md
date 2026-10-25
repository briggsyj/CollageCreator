# Spec 002: Collage editing

**Gate**: swap and border changes appear identically in preview and export.

## User stories

- **P1** As a user, I can choose a border colour and thickness so that photos are framed the way I like.
- **P1** As a user, I can swap two photos in the generated arrangement, with the mouse or only the keyboard, so that I can put a photo where I want it.
- **P2** As a user, I can change the poster size without losing the arrangement I picked.

## Requirements

- The border is a frame around the poster plus a line between neighbouring photos, in the chosen colour; thickness is a percentage of the longer poster side (default 0.5%, white, with square corners; the original defaulted to 1%, black). 0 removes it.
- Swapping exchanges the two photos; each is re-cropped to its new cell.
- The keyboard can reach every photo (arrow keys), pick one (Enter or Space), and swap with another (Enter), or cancel (Escape).
- Changing the poster size keeps which photo is where; only the cells' shapes change.
- What the preview shows is what is saved.

## Success criteria

- A pixel comparison of the preview against the saved image differs by less than 6/255 on average.
