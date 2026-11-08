# Collage Creator documentation

Collage Creator turns photos into a collage in the browser. Everything happens on your device:
photos are never uploaded, and once the page has loaded it works offline.

## For people making collages

The [user guide](user-guide/README.md) explains every part of the app, from adding photos to
saving a print-ready PDF.

- [Getting started](user-guide/getting-started.md): your first collage in a minute
- [Adding photos](user-guide/adding-photos.md)
- [Arranging the collage](user-guide/arranging.md): layouts, columns, shuffling, pages
- [Editing photos](user-guide/editing-photos.md): selecting, Wider, Taller, Crop, Swap, removing
- [Size and style](user-guide/size-and-style.md): output size, Instagram posts, borders, corners
- [Saving](user-guide/saving.md): PNG, JPEG, PDF and zips
- [Keyboard and touch](user-guide/keyboard-and-touch.md)
- [Privacy and saved work](user-guide/privacy-and-storage.md)
- [Browser assistants (WebMCP)](user-guide/browser-assistants.md)
- [FAQ and troubleshooting](user-guide/faq.md)

## For contributors and self-hosters

The [technical documentation](technical/README.md) covers how the app is built, tested and
deployed.

- [Development](technical/development.md): set up, scripts, project layout, how work is planned
- [Architecture](../ARCHITECTURE.md): the big picture and where code belongs
- [Layout engine](technical/layout-engine.md): Mosaic, Gallery, seeds, pages, sizes and crops
- [Rendering and export](technical/rendering-and-export.md): preview, workers, PNG, JPEG, PDF, ZIP
- [State and storage](technical/state-and-storage.md): `AppState`, the address, saved work
- [File formats](technical/file-formats.md): what goes in and what comes out
- [Testing](technical/testing.md): unit, property and end-to-end tests, CI
- [Internationalisation](technical/i18n.md)
- [Accessibility](technical/accessibility.md)
- [WebMCP tools](technical/webmcp.md): the reference for browser assistants
- [Security and privacy](technical/security-and-privacy.md)
- [Deployment](technical/deployment.md): Docker, nginx, GitHub Pages, previews

## Project

- [README](../README.md) · [Contributing](../CONTRIBUTING.md) ·
  [Code of conduct](../CODE_OF_CONDUCT.md) · [Security policy](../SECURITY.md)
- [Feature specs](../specs/README.md): how each feature was planned
- [Licence](../LICENSE) (GPL-2.0-or-later) and [credits](../NOTICE.md)
