# Spec 000: Foundation

**Status**: Done · **Gate**: CI runs on a blank app, including the licence-header check, with licence and attribution files in place.

## Why

Everything after this builds on a repository that is legally clean, checkable and deployable from its first commit.

## User outcomes

- A contributor can clone the repo, run one command each for lint, tests and build, and see the results.
- Anyone reading the repo or the running app can see that it derives from PhotoCollage, who wrote the original, under which licence, and where the source is.

## Requirements

- `LICENSE` holds the full GPL text; `NOTICE.md` names the original, its authors, licence and URL and lists what was ported; `README.md` begins with a derivation statement.
- Every source file carries an SPDX identifier; files derived from the original also keep its copyright line and a dated change notice. This project adds no copyright notice of its own. A CI check enforces it.
- The app shell shows credit, licence, a no-warranty statement and a source link.
- The original's licence version was read from its file headers: "version 2 of the License, or (at your option) any later version", so the identifier is `GPL-2.0-or-later`.

## Out of scope

Anything about collages.
