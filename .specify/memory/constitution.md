# Collage Web Constitution

Collage Web is a browser-only web reimplementation of PhotoCollage. These
principles govern every spec, plan and change. Performance numbers are
proposed targets for the owner to confirm.

## Principles

1. **Privacy.** All photo processing happens client-side. Photos are never uploaded. The app makes no network requests at runtime except loading its own static assets.
2. **Spec first.** Specs describe user outcomes only. Technology choices appear only in plans.
3. **Code quality.** TypeScript in strict mode, no implicit or explicit `any` without a justifying comment, ESLint and Prettier enforced in CI.
4. **Pure core.** The layout generator has no DOM or canvas dependency and is deterministic for a given seed, so it can be unit tested.
5. **Testing.** Unit tests (Vitest) for the core and end-to-end tests (Playwright) for each user story. Every user story must be independently testable and demonstrable.
6. **Performance.** The UI thread never runs long tasks during export. Generating a new layout for 100 photos feels instant (target under 200 ms). Export reports progress and can be cancelled.
7. **Memory.** Release decoded images (`ImageBitmap.close()`) as soon as they are drawn. The preview uses downscaled copies, never full-resolution originals.
8. **Accessibility and localisation.** All actions are keyboard operable and user-visible strings live in a message catalogue, with English first.
9. **Simplicity.** Prefer the platform. Add a dependency or framework only when the plan justifies it against the platform alternative.
10. **Licensing and attribution.** This project is a derivative work of PhotoCollage and is released under the same GPL terms (`GPL-2.0-or-later`, as the original's file headers state). Keep original notices intact, mark changed files with prominent change notices and dates, and keep `LICENSE`, `NOTICE.md` and a README derivation statement in the repository root.

## Licensing rules in force (from the handoff plan)

- Every source file starts with an `SPDX-License-Identifier: GPL-2.0-or-later` line and a copyright line; `scripts/check-headers.mjs` enforces this in CI.
- A file derived from the original keeps the original copyright and licence notice, adds our own copyright line next to it, and carries a "CHANGED on <date>" notice.
- Treat the JavaScript served to browsers and the Docker image as distribution: the About dialog and the image's `org.opencontainers.image.source` label link to the source.
- Reuse the original's translation files with translator credits intact.
- A generated third-party licence file is built with the app; every bundled library's licence must be GPL-compatible (`scripts/third-party-licenses.mjs` fails the build otherwise).
- Present the app as an independent modified version, with a distinct name (Collage Web).

## Governance

- Run `/speckit.clarify` before every plan and `/speckit.analyze` before every implement.
- If something in a plan conflicts with what the repo shows, stop and ask the owner; do not resolve it silently. Record the decision in the spec's research notes.
- Updating `spec.md` or `plan.md` is itself a task whenever implementation changes the design.

**Version**: 1.0.0 | **Ratified**: 2026-10-25
