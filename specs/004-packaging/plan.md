# Plan 004: Packaging

- `Dockerfile`: multi-stage; Node stage runs `npm ci` and `npm run build`; final stage is `nginxinc/nginx-unprivileged:alpine` (non-root, port 8080) with only the build output, `nginx.conf` and `security-headers.conf`.
- `nginx.conf`: `index.html` for unknown routes; gzip; hashed `/assets/` cached for a year (`immutable`); `index.html` `no-store`; licence files served as plain text.
- `security-headers.conf`: a Content Security Policy that allows no external origins (`default-src 'none'`, scripts, styles, workers and connections `'self'`, images `'self' data: blob:`), `nosniff`, no referrer. Included in every location because nginx drops inherited `add_header` lines where a location sets its own.
- `HEALTHCHECK` requests the root page.
- `.dockerignore` keeps `node_modules`, build output and Git data out of the context.
- `compose.yaml`: one service, `${HOST_PORT:-8080}`, `restart: unless-stopped`, read-only root filesystem with a tmpfs for `/tmp`, all capabilities dropped, `no-new-privileges`.
- Source offer: the image carries `org.opencontainers.image.source` and `...licenses` labels; the app's About dialog links to the repository.

## GitHub Pages

The app is a static site, so it is also published to GitHub Pages (`.github/workflows/pages.yaml`).

- **Trigger**: pushes to `master` deploy; pull requests only build and check; `workflow_dispatch` is available. The deploy job runs in the `github-pages` environment with `pages: write` and `id-token: write`, one at a time.
- **Setup once**: Settings → Pages → Source: GitHub Actions. The workflow cannot enable this itself with the default token.
- **Sub-path**: Pages serves a project site at `/<repo>/`. The Vite `base` is `./` (relative), so the same build works there and in Docker. The build job proves it by serving `dist/` under `/PhotoCollage/` with `scripts/serve-subpath.mjs` (no custom headers, unknown file types become downloads, like Pages) and running the key e2e flows against it.
- **Headers**: Pages cannot send HTTP headers, so the Content Security Policy is also injected as a `<meta>` tag at build time (`csp.ts`, `vite.config.ts`; build only, because the dev server needs looser rules). `tests/csp.test.ts` keeps it identical to the nginx header, apart from `frame-ancestors`, which a meta tag cannot carry. Other nginx headers (cache control, `nosniff`, referrer policy) do not apply on Pages.
- **Licence files**: `LICENSE.txt`, `NOTICE.txt` and `THIRD-PARTY-LICENSES.txt` are generated at build time as plain `.txt` files, because Pages serves extension-less and `.md` files as downloads.
- **Not gated on the unit tests**: the deploy depends on the Pages build job only. The four known layout-tiling unit tests (see Spec 001) are not part of it, so the site deploys even while CI's unit job is red.

## Verification status

- `docker compose config` validates the compose file.
- The nginx config passed `nginx -t`, and the full e2e suite (25 tests, Chromium) passed against nginx serving the built output with the CSP header.
- **The image has not been built here**: the authoring sandbox has no Docker daemon. The CI `docker` job runs `docker compose up --build`, waits for the health check, fetches the page and asserts a non-root user. The read-only root filesystem setting in compose is the part most likely to need a tweak if nginx needs another writable path.
