# Security policy

## Supported versions

Collage Creator is a static web app with no releases yet; the `master` branch (and the site built from it)
is the supported version.

## Reporting a vulnerability

Please report vulnerabilities privately through
[GitHub's private vulnerability reporting](https://github.com/briggsyj/CollageCreator/security/advisories/new)
rather than in a public issue. Include the browser and version, steps to reproduce, and what an attacker
could achieve. Do not include personal photos.

You should get an acknowledgement within a week. Fixes are released on `master` and noted in the advisory.

## Scope

Particularly welcome: anything that could make the app send photo data off the device, bypass the Content
Security Policy, or run script from a crafted photo, ZIP or saved record. See
[Security and privacy](docs/technical/security-and-privacy.md) for the design.
