# Technical documentation

For contributors, maintainers and people hosting their own copy. Start with
[Development](development.md) and the [Architecture](../../ARCHITECTURE.md) overview.

| Document                                        | What it covers                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| [Development](development.md)                   | Setting up, scripts, project layout, code style, how features are planned        |
| [Architecture](../../ARCHITECTURE.md)           | Data flow, the state, modules and principles                                     |
| [Layout engine](layout-engine.md)               | Mosaic, Gallery, the search for the best arrangement, seeds, pages, sizes, crops |
| [Rendering and export](rendering-and-export.md) | The preview, view maths, the worker pool, PNG/JPEG/PDF/ZIP output, canvas limits |
| [State and storage](state-and-storage.md)       | `AppState`, the seed in the address, saved work in IndexedDB                     |
| [File formats](file-formats.md)                 | Accepted input, ZIP import, output files and names, the PDF writer               |
| [Testing](testing.md)                           | Vitest and fast-check, Playwright, helpers, CI                                   |
| [Internationalisation](i18n.md)                 | Catalogues, `t()` and `tr()`, adding a language                                  |
| [Accessibility](accessibility.md)               | Keyboard, screen readers, tooltips, motion and contrast                          |
| [WebMCP tools](webmcp.md)                       | The tools offered to browser assistants, and how to add one                      |
| [Security and privacy](security-and-privacy.md) | The privacy guarantee, CSP, headers, threat model                                |
| [Deployment](deployment.md)                     | Docker and nginx, GitHub Pages, sub-paths, pull request previews                 |

Stack: TypeScript (strict), Svelte 5, Vite, Biome, Vitest with fast-check, Playwright. Runtime
dependencies are kept to three: `svelte`, `canvas-size` (canvas limits) and `libheif-js` (HEIC).
