# Testing

## Unit and property tests (`tests/`)

Vitest, with [fast-check](https://fast-check.dev/) for property tests. They cover the pure code: the
layouts (every photo placed once, cells tile the page, spans respected, determinism by seed), the search,
pages, crops, split images, presets, the address, saved-work validation, the ZIP reader and PDF writer,
the CSP, colours, i18n parsing and the WebMCP report and argument checks.

```sh
npm test                         # all
npx vitest run tests/pdf.test.ts # one file
```

Put new pure logic in `src/core/` or `src/ui/state/` and test it here.

## End-to-end tests (`e2e/`)

Playwright drives the built app as a person would, one file per area:

| File                                      | Area                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `basics.spec.ts`                          | adding photos, the first collage, saving                                            |
| `photos.spec.ts`                          | the selected photo: actions, crop, size requests, removal, touch, HEIC, orientation |
| `editing.spec.ts`                         | borders, corners, swapping, columns, outer border, technical settings               |
| `book.spec.ts`                            | pages, page pills, moving photos between pages, multi-select, shuffling             |
| `instagram.spec.ts`                       | Instagram posts and cut marks                                                       |
| `pdf.spec.ts`                             | PDF export                                                                          |
| `app.spec.ts`                             | layout of the app, tools, help, phone layout, privacy, offline, language            |
| `agent.spec.ts`, `agent-coverage.spec.ts` | the WebMCP tools and the check that every control has one                           |
| `export-100.spec.ts`                      | saving 100 photos without crashing                                                  |

`playwright.config.ts` builds the app and serves it with `vite preview` (port 4173) unless
`E2E_BASE_URL` points at a running server.

```sh
npm run test:e2e                                       # all engines
npx playwright test --project=chromium e2e/pdf.spec.ts # one engine, one file
```

### Helpers (`e2e/helpers.ts`)

- `makeImages` / `makeOrientedJpeg` make test photos in the browser; the only binary fixture is a small
  HEIC file (`e2e/fixtures/rb.heic`), since browsers cannot make one.
- `addPhotos`, `setSize`, `setSeed`, `clickPhoto`, `posterPoint`, `swapMode`.
- `settle` / `previewIdle` wait for the preview's `data-pending` to clear; `savedWork` waits for
  `data-saving`. Never use fixed timeouts.
- The preview canvas exposes `data-poster` (where the poster is), `data-crop` (the selected photo's
  crop) and `data-photos` (the photos shown, by id, in placement order) for tests.
- `saveAndRead`, `analyse`, `previewColor`, `previewDifference` compare the preview with saved images.
- `autoReveal` opens the step that holds a control before acting on it, and turns off blur effects that
  slow WebKit on CI.

Test names say what a person does and sees ("removing a page asks first, and Cancel keeps it").

## Continuous integration

`.github/workflows/ci.yaml` runs on every pull request and push to `master`:

- lint, type check, licence headers, unit tests and a build;
- end-to-end tests in Chromium, Firefox and WebKit (WebKit in three shards), with one retry and a trace on
  retry;
- `docker.yaml`: builds the image and smoke-tests it;
- `pages.yaml`: builds under a sub-path, as GitHub Pages serves it, and deploys `master`;
- `preview.yaml`: publishes each pull request to `/pr-preview/pr-<n>/` and comments the link.
