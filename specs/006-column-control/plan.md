# Plan 006: Column control

- **Core** (`src/core/layout.ts`): the original's column-count heuristic is now `autoColumns(photos, posterRatio)` (unchanged logic, extracted). `generateLayout(photos, ratio, rng, { columns })` uses `normaliseColumns(columns)` when given, otherwise `autoColumns`. `MAX_COLUMNS` is 100. The automatic path consumes the random source in the same order as before, so existing seeds give the same layouts; a test checks that asking for the automatic number explicitly gives an identical layout.
- **UI** (`index.html`, `src/ui/app.ts`): a "Columns" number field under the seed, empty meaning "Auto" (shown as the placeholder). It applies while typing and is tidied to a valid whole number when the edit ends. A note shows `Page.noCols`, the number really in use. Changing the poster shape keeps the column structure (the existing `setTargetRatio`), so the note stays right.
- **Translations**: the new strings ("Columns", "Auto", "Columns in use: %(n)s") are English-only until translators add them to the `.po` files.
- **Why a plain number field**: the platform's number input already gives keyboard and spinner support; no dependency was needed (constitution principle 9).

## Notes found while testing

- Empty columns are dropped, but a photo spanning two columns also occupies its neighbour, so the number of columns in use can be up to twice the photo count when many are requested. The first draft of a test assumed otherwise; the doc comment and test now say so.
- Tiling is exact for one column (no photo can span). For more columns it is subject to the known gaps in the original algorithm (Spec 001 research).
