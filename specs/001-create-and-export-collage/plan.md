# Plan 001: Create and export a collage

## Technical context

- TypeScript (strict), Vite, static output, no backend. Vanilla TypeScript and DOM; no framework was needed.
- Canvas 2D. The live preview draws small thumbnails (480 px longest side). Export runs in a pool of module Web Workers; each photo is decoded with `createImageBitmap` at the size its cell needs (`imageOrientation: "from-image"`, `resizeQuality: "high"`), transferred back, drawn onto an `OffscreenCanvas` on the main thread, and closed.
- Canvas limits are measured at runtime with `canvas-size` and the export size is capped to them; a conservative 4096 px fallback is used until detection finishes.
- Layout is a pure TypeScript module with a seeded generator (mulberry32). Output is a list of rectangles.
- Tests: Vitest (+ fast-check for property tests), Playwright in Chromium, Firefox and WebKit. Tooling: Biome, GitHub Actions.

## Modules

| Module                                                                     | Responsibility                                                                      | Depends on              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| `core/layout`, `core/rng`                                                  | Seeded layout generation, returns rectangles                                        | nothing                 |
| `core/types`                                                               | `Photo`, `Layout`, `PosterSettings` types                                           | nothing                 |
| `io/import`                                                                | File validation, duplicate detection, probing via workers (upright size, thumbnail) | core/types, render/pool |
| `render/draw`, `render/preview`                                            | Shared drawing rules; draws a layout to the on-screen canvas from thumbnails        | core                    |
| `render/export`, `render/export.worker`, `render/pool`, `render/downscale` | Full-resolution draw, progress, cancel, encode PNG/JPEG                             | core                    |
| `platform/limits`                                                          | Canvas size detection and clamping                                                  | `canvas-size`           |
| `ui/`                                                                      | Controls, state, wiring                                                             | all of the above        |
| `i18n/`                                                                    | Message catalogue from the original `.po` files                                     | nothing                 |

Layout logic lives only in `core/`. Preview and export draw through the same functions in `render/draw.ts`, so they cannot drift apart.

## Decisions

- **Seeded randomness**: the original used Python's global `random`. The port takes an injected `Rng`; every random decision (shuffle, column choice, whether a photo spans two columns) comes from it, so a seed fully determines a layout.
- **Worker design**: workers return cell-sized bitmaps rather than drawing onto a shared canvas (canvases cannot be shared across workers). Two pools: a small one for import probing and one for export. They are created at start-up so the worker script is fetched while online; after a cancel the export pool is recreated.
- **Orientation**: the browser applies EXIF orientation (`from-image`); the upright size from the first decode is stored, and the export checks the size the browser returned, falling back to a full decode plus stepwise halving if a browser ignores the resize options.
- **Border**: a fraction of the longer poster side (as in the original), drawn as a frame plus seams centred on cell edges, after photos.
- **Holes**: kept as in the original; they show the white page background.

## Research

See `research.md`.
