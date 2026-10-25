# Plan 005: Localisation and polish

- The original `.po` files live unchanged in `src/i18n/po/` and are bundled as raw text and parsed at start-up (`src/i18n/po.ts`); English source strings are the keys, so original msgids that still exist are translated automatically (about 17 strings).
- The language follows the browser, can be changed in the header, and is remembered in `localStorage` when available.
- New strings (seed, width, height, format, ...) have no translation yet and show in English; translators can add them to the `.po` files.
- The preview canvas is focusable with arrow-key navigation; messages use `aria-live`.
