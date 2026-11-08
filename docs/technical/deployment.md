# Deployment

Collage Creator is static files. Any web server works; these are the supported ways.

## Docker

```sh
docker compose up --build -d            # http://localhost:8080
HOST_PORT=9000 docker compose up -d     # another port
```

The `Dockerfile` builds the app with Node 22 and serves `dist/` with `nginxinc/nginx-unprivileged` (non-root,
port 8080), with a health check and OCI labels pointing to the source (the GPL asks that source accompany
distributions). `nginx.conf`:

- serves `index.html` for unknown paths and never caches it;
- caches hashed files under `/assets/` for a year (`immutable`);
- gzips text assets;
- includes `security-headers.conf` (CSP and friends) in every location.

## Any static host

```sh
npm ci && npm run build      # output in dist/
```

The build uses relative paths (`base: "./"`), so `dist/` works at a domain root or under a sub-path. If your
server can set headers, send the CSP from `csp.ts` plus `frame-ancestors 'none'`,
`X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`, as `security-headers.conf` does. The
build also injects the CSP as a `<meta>` tag for hosts that cannot.

## GitHub Pages

Fork the repository, then in **Settings → Pages** choose one of:

- **Source: GitHub Actions**: `pages.yaml` builds and deploys every push to `master`.
- **Source: Deploy from a branch → `gh-pages`, `/ (root)`**: `pages.yaml` publishes `master` to the `gh-pages`
  branch and `preview.yaml` publishes every pull request to `/pr-preview/pr-<n>/`, commenting the link and
  removing it when the pull request closes. Use this to get pull request previews.

The preview shares browser storage with the main site (same origin), so saved work is shared between them.

## Updating

Pull the latest `master` and rebuild (`docker compose up --build -d`). Saved work in visitors' browsers is
versioned and migrated on load.
