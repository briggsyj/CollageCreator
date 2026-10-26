# Spec 012: Collage Creator redesign

**Gate**: the app is renamed Collage Creator, uses the new sidebar and bottom-bar layouts in the muted frosted glass look (light and dark), offers a second layout style (Gallery) beside the existing one (Mosaic), and every existing end-to-end story still passes.

The design is a canvas Artifact (see [plan.md](plan.md), "Design reference"). Where this spec and the Artifact disagree, this spec wins; record the disagreement in the research notes below.

## User stories

- **P1** As a user, the app is called **Collage Creator** everywhere I see it, and the credit to PhotoCollage and its licence notice are still shown in the About dialog.
- **P1** As a user on a wide screen, I see one sidebar with the app name at its top and three steps, **Photos**, **Poster** and **Style**, with the collage beside it. There is no separate header bar. Language and About are small links at the bottom of the sidebar.
- **P1** As a user on a phone, the collage fills the screen and a bottom bar opens the same three steps (and Save) as sheets that slide up.
- **P1** As a user, I choose between **Pan** and **Swap** with a toggle at the top right of the collage. Pan is the default. Holding Space pans temporarily while Swap is on. Zoom in, Zoom out and Fit are separate one-shot buttons under it.
- **P1** As a user, I choose a **layout style** at the top of the Style step: **Mosaic** (the existing layout, the default) or **Gallery** (a slicing tree: the poster is split into panels, one per photo). Columns apply to Mosaic only.
- **P1** As a user, I choose the poster size from presets (Screen, A4, A3, A2, Instagram), a **Custom** size, and **Landscape** or **Portrait**. Typing a width or height switches to Custom.
- **P1** As a user, before I add any photo the collage area is a calm drop target that says "Everything runs in your browser. Your photos are never uploaded."
- **P1** As a user, when files are skipped (already added, not an image, unreadable) I am told which and why, in a summary I can expand and dismiss.
- **P1** As a user, I can still make a photo wider or taller from the Photos step, as today.
- **P2** As a user, the background behind the glass is made from my photos' colours, taken in the order I added them, so shuffling or resizing never changes it.
- **P2** As a user, the app follows my system light or dark setting.
- **P2** As a user, the trim figure reads "N% of each photo is trimmed to fit" in the Style step.

## Requirements

- **Name**: every user-visible "Collage Web" becomes "Collage Creator" (page title, heading, About, README). The About dialog keeps the PhotoCollage attribution, the licence and the no-warranty statement (constitution principle 10).
- **Steps**:
  - **Photos**: Add photos, the drop tip ("or drop photos anywhere on this page"), the photo grid with names and Wider/Taller tags, Undo remove, Remove all, and the selected-photo controls (Normal, Wider, Taller, Remove).
  - **Poster**: size and orientation only (size buttons, width and height).
  - **Style** starts with the layout style (with columns for Mosaic), the trim figure and Shuffle layout, and ends with Technical configuration (seed).
  - **Style**: border thickness, border colour (swatches and Custom), photo corners (Square, Slight, Rounded; **Circle is removed**), and Border around the whole collage.
  - **Save** (footer, and a sheet on phones): file type, JPEG quality when JPEG is chosen, the output size, and Save poster.
- **Privacy note**: "Everything runs in your browser. Your photos are never uploaded." appears in the empty drop target. It no longer appears as a block in the sidebar.
- **Presets**: keep 800 × 600 and 1600 × 1200 as Screen options, A4, A3 and A2 at 300 DPI in both orientations, and add Square (1080 × 1080) with the screen sizes. There is no Instagram story size; Instagram post is the multi-image mode from spec 011. Orientation swaps width and height of a preset. Sizes the browser cannot make are reduced, with the existing note.
- **Gallery**: a slicing tree with a seed, reproducible like Mosaic. The best of 30 tries is kept when photos change, using the same score (gaps, then cropping). Wider and Taller are honoured as weights. Cells tile the poster exactly. Swapping, removal, borders, corner styles and export work unchanged.
- **Messages**: status lines ("Selected…", "Swapped…") show in the pill at the top left of the collage. Import results show as described in the stories. A screen reader still hears them through a live region.
- **Look**: the muted frosted glass tokens in the plan's appendix, light and dark, with fallbacks when blur or transparency are unavailable or reduced.
- **Accessibility**: touch targets at least 44 px; the Pan and Swap toggle uses pressed states; every control keeps its keyboard operation; text contrast 4.5:1.
- **Not changed**: the layout engine for Mosaic, rendering, export, translations already present, and the privacy policy (CSP).

## Out of scope

Dragging to resize photos, choosing which neighbour a wider photo joins, saving settings between visits, and translating the new strings.

## Research notes

- Owner decisions (2026-10-25): implement a basic slicing tree; mobile and desktop together; muted frosted glass in light and dark; per-photo Wider/Taller stays in the Photos step; variants A to D of the look were explored; E (muted frosted glass) is the light theme and D (smoked glass) informs the dark theme.
- Not yet decided by the owner, defaults used here: the Instagram sizes above; the import summary behaviour; restyling (not redesigning) the About and progress dialogs.

### Differences from the design, found while implementing

- The selected-photo controls keep today's buttons (Wider, Taller, Normal size, Remove selected photo) in a dock under the list, rather than the design's segmented controls. They behave as before (Taller cycles x2, x3, normal).
- Columns stay a number field (empty means automatic) with Fewer, More and Automatic buttons, so existing keyboard use and tests are kept; the design's segmented Automatic / Choose a number would be a follow-up.
- In Pan mode a click that does not move the view selects the photo under it (so the size buttons can be used); in Swap mode clicks pick and swap as before. Enter on the preview picks and swaps in both modes.
- The visible privacy sentence is in the drop target; a screen-reader copy stays attached to Add images, so it is still announced after photos are added.
- Strings that changed wording lost their translations and show in English: "Try another arrangement" (was "Regenerate"), "Border thickness" and "Border colour" (were "Thickness:" and "Color:"), and the trim note. The old strings are still in the catalogue for a future translation pass.
- Gallery's tree is refined by random local changes and keeps panels within a 4 % minimum share; it crops a little more than Mosaic on average (about 5 to 13 % in measurements with mixed photo shapes). The first Gallery search is limited to 10 tries because each try is refined.
- Dark theme uses the Smoked glass tokens; there is no dark design board for the empty state, so its neutrals were chosen to match.
- The save options (file type, quality) show under the Style step on wide screens, and inside the Save sheet on phones.
