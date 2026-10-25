# Spec 010: Sidebar redesign

**Gate**: every control is reachable from the Photos, Poster or Style tab; the selected photo's controls and the Save button stay in view; nothing sticks out of the sidebar at any width; all earlier behaviour still works.

## What changed

- **Tabs** (Photos, Poster, Style) replace one long scroll. Arrow keys, Home and End move between tabs.
- **Photos**: Add images and the privacy note, a count with Undo remove and Remove all, and a grid of thumbnails. A badge shows a requested size. Selecting a tile selects the photo in the collage, and the other way round.
- **Poster**: size presets as buttons plus Width and Height; Columns as Automatic or Choose a number with a stepper; the seed under Technical configuration.
- **Style**: border thickness slider, colour swatches (and a custom colour), corner shapes as four tiles, and the outer-border switch.
- **Selected photo** (below the tabs, shown only while a photo is selected): Width Normal or Wider (2 columns), Height Normal, Taller or Tallest, Remove this photo, Done.
- **Export & save** (below the tabs): a one-line summary (type and pixel size), a disclosure for file type and JPEG quality, and Save poster.
- **Shuffle layout** moved to the bar above the preview, so it is always in reach.

## Requirements

The earlier controls keep their behaviour; the Taller button is now three explicit choices instead of one that cycles. Controls that changed type (preset list to buttons, corner list to tiles, file type list to two buttons) keep the same settings and the same saved results.

## Out of scope

The touch layout in the mobile design (bottom bar and sheets); numbers on the tab labels.
