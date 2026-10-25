# Spec 004: Packaging

**Gate**: `docker compose up` serves the working app.

## Acceptance

- `docker compose up --build` on a clean machine serves the app at http://localhost:8080.
- The container runs as a non-root user.
- The main flow (add photos, generate, export) works with the network disconnected after the page has loaded.
- The README documents run, stop and port change in three commands or fewer.
