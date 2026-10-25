# Plan 004: Packaging

- `Dockerfile`: multi-stage; Node stage runs `npm ci` and `npm run build`; final stage is `nginxinc/nginx-unprivileged:alpine` (non-root, port 8080) with only the build output, `nginx.conf` and `security-headers.conf`.
- `nginx.conf`: `index.html` for unknown routes; gzip; hashed `/assets/` cached for a year (`immutable`); `index.html` `no-store`; licence files served as plain text.
- `security-headers.conf`: a Content Security Policy that allows no external origins (`default-src 'none'`, scripts, styles, workers and connections `'self'`, images `'self' data: blob:`), `nosniff`, no referrer. Included in every location because nginx drops inherited `add_header` lines where a location sets its own.
- `HEALTHCHECK` requests the root page.
- `.dockerignore` keeps `node_modules`, build output and Git data out of the context.
- `compose.yaml`: one service, `${HOST_PORT:-8080}`, `restart: unless-stopped`, read-only root filesystem with a tmpfs for `/tmp`, all capabilities dropped, `no-new-privileges`.
- Source offer: the image carries `org.opencontainers.image.source` and `...licenses` labels; the app's About dialog links to the repository.

## Verification status

- `docker compose config` validates the compose file.
- The nginx config passed `nginx -t`, and the full e2e suite (25 tests, Chromium) passed against nginx serving the built output with the CSP header.
- **The image has not been built here**: the authoring sandbox has no Docker daemon. The CI `docker` job runs `docker compose up --build`, waits for the health check, fetches the page and asserts a non-root user. The read-only root filesystem setting in compose is the part most likely to need a tweak if nginx needs another writable path.
