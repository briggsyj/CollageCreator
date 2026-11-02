# Implementation Plan: WebMCP agent tools

**Branch**: `claude/spec-kit` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/017-webmcp-agent-tools/spec.md`

## Summary

The page registers one WebMCP tool per user action with the browser, when the browser offers the API. Each tool is a thin call onto the existing `AppState` method the matching control already uses, so behaviour, limits and confirmations are shared with the interface and cannot drift. A pure `buildReport` function turns the app's state into the report an assistant reads; a coverage check keeps the tools and the controls in step. Nothing changes when the browser has no WebMCP.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Svelte 5 runes, as now

**Primary Dependencies**: none added. The browser's own `modelContext` is used directly, behind a small adapter (see [research.md](research.md))

**Storage**: none new. State is read from `AppState`; saved work is unchanged

**Testing**: Vitest (+ fast-check) for the report and argument checks; Playwright with a stub `modelContext` injected before the page loads, to call tools and compare with hand use

**Target Platform**: browsers that offer WebMCP (Chrome early preview and later); every other browser is unaffected

**Project Type**: web app (single project)

**Performance Goals**: a tool's change shows in the preview as fast as the control's; the state report for 100 photos stays under about 8 KB of text (no images in it)

**Constraints**: no network requests (CSP unchanged); no new runtime dependency; works with the existing strict CSP; photo previews only through a separate preview tool

**Scale/Scope**: about 35 tools, one state report, one preview tool

## Constitution Check

| Principle                        | Result                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Privacy                        | Pass. No fetching, no uploads; previews go only to the person's own assistant, through the browser. No tool adds photos (spec FR-009)         |
| 2 Spec first                     | Pass. Spec holds outcomes only; technology is here and in research                                                                            |
| 3 Code quality                   | Pass. Strict TypeScript, Biome, no `any`                                                                                                      |
| 4 Pure core                      | Pass. `buildReport` and argument checking are pure and unit tested; DOM and `modelContext` are only in the adapter                            |
| 5 Testing                        | Pass. Each user story has an e2e test; the coverage check covers SC-001                                                                       |
| 6 Performance                    | Pass. Tools call the same code paths; save reuses the worker pool and progress                                                                |
| 7 Memory                         | Pass. Previews are made from the existing downscaled copies and not kept                                                                      |
| 8 Accessibility and localisation | Pass. Tool text goes through the message catalogue with English first; the controls are untouched                                             |
| 9 Simplicity                     | Pass. No library: the browser API is called directly through a ~40 line adapter. The MCP-B polyfill was considered and rejected (research D2) |
| 10 Licensing                     | Pass. New files carry the SPDX line; no third-party code                                                                                      |

Re-checked after design: no violations; Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/017-webmcp-agent-tools/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/tools.md
├── checklists/requirements.md
└── tasks.md            # by /speckit-tasks
```

### Source Code (repository root)

```text
src/agent/
├── context.ts          # adapter: finds modelContext, registers, unregisters, feature detection
├── types.ts            # Tool, ToolResult, error codes
├── report.ts           # pure: buildReport(snapshot) -> StateReport
├── args.ts             # pure: argument checks and photo-reference parsing
├── result.ts           # ok(), refused(), waiting() result builders
├── register.ts         # registerAgentTools(app): builds the list and registers it
└── tools/
    ├── read.ts         # get_state, get_photo_preview
    ├── photos.ts       # selection, swap, size, crop, remove, undo, move
    ├── pages.ts        # pages and shuffles
    ├── style.ts        # layout, columns, seed, borders, corners
    ├── size.ts         # output size, orientation, Instagram post
    ├── view.ts         # tabs, mode, zoom, pan, dialogs, language
    └── save.ts         # format, save, cancel
tests/agent-report.test.ts
tests/agent-args.test.ts
e2e/agent.spec.ts
e2e/agent-coverage.spec.ts
src/agent/controls.json # every control: the tool that matches it, or why none does
```

**Structure Decision**: a new `src/agent/` folder beside `src/ui/`. It depends on `AppState` and never the other way round, except one call in `main.ts` to register the tools after the app starts. Each tool file stays small (one function per tool) to keep `app-state.svelte.ts` from growing.

## Design

- **Registration.** `main.ts` calls `registerAgentTools(app)` once the app has started. `context.ts` uses `navigator.modelContext`, else `document.modelContext`, else does nothing. It registers with `registerTool(tool, { signal })`, and falls back to `registerTool(tool)` for implementations without options. A `pagehide` abort removes the tools.
- **Tool shape.** `{ name, description, inputSchema, annotations: { readOnlyHint }, execute(args) }`. `execute` returns `{ content: [{ type: "text", text }] }` where the text is JSON (`{ ok, message, state? }`), with `isError: true` on a refusal.
- **Photo references.** `{ page, position }`, both counting from 1 in reading order (clarification Q1). `args.ts` resolves them to an `ImportedPhoto` against the collage as it stands at call time, and refuses a reference that no longer exists.
- **Effect parity.** Every tool calls the method the control calls (for example `app.setColumns`, `app.chooseLayout`, `app.toggleWider`). Validation limits come from the same constants (`BOOK_MAX_PAGES`, `SPLIT_MAX`, `BORDER_MAX`).
- **Confirmations.** For removals and shuffles after a hand edit the tool calls the `ask*` method; the app opens its normal dialog; the tool returns `{ ok: true, status: "waiting" }` straight away (clarification Q2). `get_state` reports `pendingQuestion` and the last `confirmationOutcome` (`confirmed`, `cancelled`).
- **Save.** `save` starts `app.save`, returns when started with the planned file count; `get_state` shows `saving` and `progress`; when finished it shows `lastSave` with file names and count. `cancel_save` aborts through the same controller. The browser's download behaviour is unchanged.
- **Previews.** `get_photo_preview` returns an `image` content block (base64 JPEG, longest side 256) made from the existing downscaled copy, one photo per call, so the state report stays small.
- **Report.** `buildReport` is pure: it takes a plain snapshot (`$state.snapshot`-style) and returns photos by page and position, selection, settings, pages, language, view, dialog, progress, pending question, and notices.
- **Language and theme.** The app has a language control but no theme control (the theme follows the system), so `controls.json` records "no control: follows system" for theme (see research D5).
- **Localisation.** Descriptions and messages use `tr()`; untranslated ones fall back to English, as other newer strings do.
- **Coverage.** `controls.json` lists each control's accessible name and its tool (or an exception reason). `e2e/agent-coverage.spec.ts` walks every tab and dialog, collects the accessible names of buttons, inputs and selects, and fails on any not in the file; the file itself is checked against the registered tools.

## Complexity Tracking

None.
