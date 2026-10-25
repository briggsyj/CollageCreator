# Spec 001: Create and export a collage

**Gate**: a user story walkthrough passes end to end in Chromium, Firefox and WebKit.

## Why

People want a free, private way to combine many photos into one printable image without installing software or uploading photos anywhere.

## User stories

- **P1** As a user, I add photos from my device (file picker or drag and drop) so that I can build a collage from them.
- **P1** As a user, I see a collage that automatically arranges all my photos to fill the whole poster with no empty gaps, keeping each photo as large as possible, so that I get a good result with no manual work.
- **P1** As a user, I can set the poster dimensions so that the result matches the size I want to print.
- **P1** As a user, I can save the collage as an image file at the poster dimensions I chose, so that I can print or share it.
- **P2** As a user, I can generate a different arrangement, as many times as I like, until I like one, so that I can pick my favourite.
- **P2** As a user, I can remove photos or add more after seeing the collage, and the arrangement updates.
- **P3** As a user, I see progress while the final image is being produced and I can cancel it.

## Requirements

- Works with at least 100 photos in one collage.
- Photos are never sent anywhere. The app works without a network connection after it has loaded. The upload controls say so in plain words (everything runs in the browser, nothing is uploaded), so people know before they add a photo.
- Photos are shown the right way up, respecting the orientation stored in each file.
- If the requested poster size is larger than this device and browser can produce, tell the user the largest size available and let them continue with that size.
- Unreadable or unsupported files are skipped with a clear message naming the file.

## Clarifications

Answered following the handoff plan (Session 2026-10-25):

- **Cropped or whole?** Photos are cropped to fill their cell, centred, never letter-boxed. This is the original's behaviour (`render.py: resize_photo` scales to cover the cell, then crops by `offset_w`/`offset_h`, 0.5 by default). See `research.md`.
- **Output format**: PNG and JPEG, with a JPEG quality setting.
- **Size units**: pixels, with a preset list (A4, A3, A2, portrait and landscape, at 300 DPI) that fills in the pixel fields.
- **Reproducible?** Yes. Each arrangement has a seed; the same seed and photos give the same layout.
- **Browsers**: current Chrome, Firefox and Safari, desktop first. Mobile Safari is best effort.
- **Duplicate files** (decided in implementation, to confirm with the owner): a file with the same name, size and modification time as one already added is skipped with a message, so each supplied photo appears exactly once.

## Edge cases

A single photo; two photos with very different aspect ratios; a very wide panorama among portraits; duplicate files; photos with no orientation data; zero photos (nothing to save; the preview shows how to add photos).

## Out of scope

Border colour or width, swapping photos between positions (see Spec 002), multiple languages (Spec 005), saving projects.

## Success criteria (proposed targets, to confirm with the owner)

- Opening the app to a saved collage in under 2 minutes with 20 photos.
- A new arrangement for 100 photos appears in under 1 second on a typical laptop (measured: under 1 ms for layout, see `benchmarks/layout.json`).
- The app stays responsive while the final image is produced.
- 100% of photos supplied appear in the collage exactly once.

## Known gap: layouts can leave holes

The requirement "fill the whole poster with no empty gaps" is **not met** by the original algorithm in about 2% of layouts (3 to 12 photos; up to 40% for some sizes), and this was kept on purpose for now (owner decision 2026-10-25). Details and the tests that fail because of it are in `research.md`.
