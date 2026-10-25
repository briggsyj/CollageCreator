# Plan 002: Collage editing

- Border and cover-crop drawing live in `render/draw.ts` and are used by both `render/preview.ts` and `render/export.ts`.
- Swap: `Page.swapPhotos(a, b)` exchanges the photos held by two cells (as the original's `swap_photos`); the UI selects a cell by pointer (click then click, or press-drag-release) or keyboard.
- Resize: `Page.setTargetRatio(r)` re-runs the original's `adjust_cols_heights`, which keeps the column structure and rescales cell heights.
- Vanilla TypeScript was enough for the state handling; no framework was added (the open question in the handoff plan).
- The selection and keyboard-focus outlines are drawn only on the on-screen preview, never in an export.
