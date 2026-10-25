# Plan 003: Export quality and limits

- Decode at target size in workers (`createImageBitmap` resize options, `"high"`), closing each bitmap after drawing; a bounded pool (2 to 4 workers) limits how many are alive.
- Fallback: if a browser does not honour the resize options, decode in full and shrink by successive halving (`render/downscale.ts`).
- Limits: `canvas-size` detects max side and area; `clampSize` shrinks a request while keeping its shape; a too-large size is reduced after a short pause so typing is not disturbed; Save clamps again.
- Benchmarks are recorded in `benchmarks/`: `layout.json` (`npm run bench`) and `export-<browser>.json` (`BENCH_WRITE=1 npx playwright test e2e/export-100.spec.ts`). Rerun after every export change.

## Recorded results (Chromium, authoring sandbox)

100 photos of 4000 x 3000 exported to a 4961 x 3508 PNG: export 2.5 s, import (full decode of all 100, two workers) 9.8 s. Peak memory was not measured (browsers do not expose it to scripts without cross-origin isolation); the test passing shows the tab did not crash.

## Open

Owner comparison of downscaled output against a reference photo, in Firefox and Safari.
