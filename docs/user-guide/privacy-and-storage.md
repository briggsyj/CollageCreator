# Privacy and saved work

## Your photos stay on your device

Collage Creator has no server. Photos are opened, arranged and saved by your browser. The page
makes no network requests after it has loaded (the end-to-end tests check this), and a strict
Content Security Policy stops it from contacting anything but its own site. Once loaded, it works
offline.

## What is kept, and where

To survive a refresh, the app keeps your work in this browser's own storage (IndexedDB, under the
name `collage-creator`):

- the photos, as the files you added;
- each photo's size request, crop and page;
- the settings: size, layout, columns, border, corners, pages, format, quality and seed.

Your chosen language is kept separately (in local storage). Nothing is shared with other browsers
or devices.

**Remove all** clears the photos. To remove everything, clear this site's data in your browser's
settings.

Some browsers refuse to store files in private windows. The app still works there, but a refresh
starts afresh, and it says so.
