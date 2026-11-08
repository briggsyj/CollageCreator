# Implementation Plan: Photo actions on the preview

**Branch**: `claude/photo-actions` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

## Summary

A new `PhotoActions.svelte` group sits in the preview's tool column between the tools and the zoom group while photos are selected (not in Swap). It holds Wider, Taller and Crop (with the crop slider and a quiet round Done button) and reuses the existing `AppState` methods (`toggleWider`, `cycleTaller`, `toggleCrop`, `zoomSelectedCrop`). The same controls, Reset size and Reset crop leave `SelectedDock.svelte`. Zooming the crop to 100% clears it. W, T, C and Enter are handled beside the existing preview keys; Help lists them.

## Technical Context

TypeScript 6 strict, Svelte 5, as now; no new dependency; Playwright e2e and Vitest as now. Performance and memory unchanged (no new drawing).

## Constitution Check

All ten principles pass: no network, no new dependency, pure code unchanged (the crop reset at zoom 1 is in `AppState`), every action keyboard operable with a title and a name, strings through `tr()`, tests for each story, new file with SPDX and copyright lines.

## Project Structure

```text
src/ui/PhotoActions.svelte   # new: Wider, Taller, Crop, crop slider, Done
src/ui/Stage.svelte          # shows the group while photos are selected (not in Swap)
src/ui/SelectedDock.svelte   # keeps name, Done, Page, Remove
src/ui/Preview.svelte        # W, T, C, Enter
src/ui/Dialogs.svelte        # Help: actions and keys
src/ui/app-state.svelte.ts   # zoom 1 clears the crop; status text
src/style.css                # action styles (accent, filled when on), quiet round Done,
                             # narrower zoom group, column wraps when too tall, phone row
src/agent/controls.json      # crop-done; reset buttons gone
e2e/*.spec.ts                # updated selectors; new tests for the actions
```

## Design

- **Visibility**: `app.mode !== "swap" && app.selection.length > 0`, so a selection made in the Photos list with the Pan tool also shows the actions (they are the only place to resize and crop now).
- **Ids kept** (`#span-wider`, `#span-taller`, `#crop-toggle`, `#crop-tools`, `#crop-zoom`) so tests and the WebMCP coverage map follow the controls; the group is `#photo-actions`; the Done button is `#crop-done`.
- **Look**: the tools' glass; buttons in `--accent`, filled with `--accent` and `--on-accent` text when pressed; Taller shows `×n`; Done is a 40 px circle in the pressed-tool style (`--press-bg`, `--press-shadow`).
- **Height**: the tool column wraps (`wrap-reverse`) when it would reach the save panel, so the zoom group moves to a column on the left instead of under it.
- **Phones**: the group floats in a row under the tools row, slider horizontal; the hint pill moves below it.
