# Security and privacy

## The guarantee

Photos never leave the device. The app is static files; there is no server-side code, no analytics, no
cookies and no third-party requests. After loading, it makes no network requests (an e2e test watches for
any while adding and saving photos), so it also works offline.

## Content Security Policy

`csp.ts` defines the policy, used by both the build and nginx (`tests/csp.test.ts` keeps them in step):

```
default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self';
img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:;
base-uri 'none'; form-action 'none'
```

- Only the site's own scripts run; no inline scripts or `eval`. `'wasm-unsafe-eval'` is for the HEIC decoder
  (WebAssembly).
- No inline styles: styles set from code go through the CSSOM (Svelte `style:` directives).
- `connect-src 'self'` stops any request to another host.
- nginx adds `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`
  (`security-headers.conf`). On GitHub Pages, which cannot set headers, the policy is a `<meta>` tag injected
  at build time (where `frame-ancestors` is not allowed).

## Storage

Work is kept in the browser's IndexedDB for this site only; see
[State and storage](state-and-storage.md). Clearing the site's data removes it.

## Input handling

Photos are decoded by the browser (or the bundled HEIC decoder) inside workers. ZIP files are read entry by
entry with bounds checks; encrypted or unsupported entries are skipped and named. Saved records are validated
field by field before use.

## Supply chain

Runtime dependencies are `svelte`, `canvas-size` and `libheif-js`. `scripts/third-party-licenses.mjs`
generates the licence list shown in About and fails the build if a bundled licence is not GPL-compatible.
Dependency updates go through CI like any change.

## Threat model, briefly

In scope: a malicious photo or ZIP (decoded by the browser's own decoders, in workers), a malicious page
trying to frame the app (`frame-ancestors`, where headers are available), script injection (strict CSP).
Out of scope: a compromised browser or device, and what a browser assistant (WebMCP) does with what it reads.

To report a vulnerability, see [SECURITY.md](../../SECURITY.md).
