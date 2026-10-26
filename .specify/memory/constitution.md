# Collage Creator Constitution

Collage Creator is a browser-only web reimplementation of PhotoCollage. These
principles govern every spec, plan and change. Performance numbers are
proposed targets for the owner to confirm.

## Principles

1. **Privacy.** All photo processing happens client-side. Photos are never uploaded. The app makes no network requests at runtime except loading its own static assets.
2. **Spec first.** Specs describe user outcomes only. Technology choices appear only in plans.
3. **Code quality.** TypeScript in strict mode, no implicit or explicit `any` without a justifying comment, Biome (lint and format) enforced in CI.
4. **Pure core.** The layout generator has no DOM or canvas dependency and is deterministic for a given seed, so it can be unit tested.
5. **Testing.** Unit tests (Vitest) for the core and end-to-end tests (Playwright) for each user story. Every user story must be independently testable and demonstrable.
6. **Performance.** The UI thread never runs long tasks during export. Generating a new layout for 100 photos feels instant (target under 200 ms). Export reports progress and can be cancelled.
7. **Memory.** Release decoded images (`ImageBitmap.close()`) as soon as they are drawn. The preview uses downscaled copies, never full-resolution originals.
8. **Accessibility and localisation.** All actions are keyboard operable and user-visible strings live in a message catalogue, with English first.
9. **Simplicity.** Prefer the platform. Add a dependency or framework only when the plan justifies it against the platform alternative.
10. **Licensing and attribution.** This project is a derivative work of PhotoCollage and is released under the same GPL terms (`GPL-2.0-or-later`, as the original's file headers state). Keep original notices intact, mark changed files with prominent change notices and dates, and keep `LICENSE`, `NOTICE.md` and a README derivation statement in the repository root.

## Licensing rules in force (from the handoff plan)

- Every source file starts with an `SPDX-License-Identifier: GPL-2.0-or-later` line. This project adds no copyright notice of its own (owner decision): its changes are offered under the same licence. `scripts/check-headers.mjs` enforces the rules below in CI.
- A file derived from the original keeps the original author's copyright and licence notice and carries a "CHANGED on <date>" notice (the GPL requires both). Files that are not derived carry only the SPDX line.
- Treat the JavaScript served to browsers and the Docker image as distribution: the About dialog and the image's `org.opencontainers.image.source` label link to the source.
- Reuse the original's translation files with translator credits intact.
- A generated third-party licence file is built with the app; every bundled library's licence must be GPL-compatible (`scripts/third-party-licenses.mjs` fails the build otherwise).
- Present the app as an independent modified version, with a distinct name (Collage Creator).

## Governance

- Run `/speckit.clarify` before every plan and `/speckit.analyze` before every implement.
- If something in a plan conflicts with what the repo shows, stop and ask the owner; do not resolve it silently. Record the decision in the spec's research notes.
- Updating `spec.md` or `plan.md` is itself a task whenever implementation changes the design.

**Version**: 1.3.0 | **Ratified**: 2026-10-25 | **Amended**: principle 3 names Biome instead of ESLint and Prettier; licensing rules no longer add a copyright line of our own; the app is renamed Collage Creator (spec 012)
