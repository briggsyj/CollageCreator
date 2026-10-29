---

## description: "Task list for WebMCP agent tools"

# Tasks: WebMCP agent tools

**Input**: Design documents from `specs/017-webmcp-agent-tools/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/tools.md](contracts/tools.md)

**Tests**: Required (spec FR-014, constitution 5): unit tests for the pure parts, Playwright for each story, and a coverage check.

**Organization**: grouped by user story. Every new file starts with `// SPDX-License-Identifier: GPL-2.0-or-later`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: US1 to US5 from the spec

## Phase 1: Setup

- [ ] T001 Create the `src/agent/` folder with `types.ts`: `Tool`, `ToolResult` (`ok`, `status` of `done` / `waiting` / `refused`, `code`, `message`, `state?`), `PhotoRef` and the refusal codes from data-model.md
- [ ] T002 [P] Add `src/agent/result.ts`: `done()`, `refused(code, message)` and `waiting(message)` builders that produce `{ content: [{ type: "text", text: JSON }], isError }`
- [ ] T003 [P] Add `src/agent/context.ts`: find `navigator.modelContext`, else `document.modelContext`, else nothing; `registerTool(tool, { signal })` with fallback to `registerTool(tool)`; abort on `pagehide`; export `agentSupported()` and `registerAll(tools)`

## Phase 2: Foundational (blocks all stories)

- [ ] T004 Add `src/agent/report.ts`: pure `buildReport(snapshot)` returning the StateReport in data-model.md (photos by page and position with name, size, orientation, selected, wider, taller, cropped; selection; layout; style with `borderPercent` 0 to 100; size; pages; view; save; ui including `pendingQuestion`, `confirmationOutcome`, notices; `canUndoRemove`)
- [ ] T005 [P] Add `src/agent/args.ts`: pure `resolvePhoto(ref, pages)` (counting from 1, refusing `no-such-photo` / `no-such-page`), `inRange()` with the app's own limits (`BOOK_MAX_PAGES`, `SPLIT_MAX`, border 0 to 100 percent) and a `snapshotOf(app)` that makes the plain object for `buildReport`
- [ ] T006 Record the confirmation outcome in `src/ui/app-state.svelte.ts`: set `confirmationOutcome` to `confirmed` or `cancelled` when the confirm dialog closes, clear it when a new question opens; expose `pendingQuestion` text (no behaviour change for the interface)
- [ ] T007 Add `src/agent/register.ts` with `registerAgentTools(app)` that builds the tool list, returns early when `agentSupported()` is false, and call it from `src/main.ts` after the app starts
- [ ] T008 [P] Add `tests/agent-report.test.ts`: report for 0, 1 and 100 photos, correct page/position numbering, size under 8 KB for 100 photos (SC-006)
- [ ] T009 [P] Add `tests/agent-args.test.ts`: property tests (fast-check) that a photo reference resolves to the same photo the interface would pick, that a removed position is refused, and that limits match the constants
- [ ] T010 Add an e2e helper in `e2e/agent.spec.ts` that injects a stub `modelContext` with `addInitScript`, records registered tools, and exposes `callTool(name, args)` and `state()`

## Phase 3: User Story 1 - Ask an assistant to make a collage (P1)

**Goal**: an assistant can read the state and change layout, style and size.

**Independent Test**: with photos loaded, only the registered tools are used to make "3 columns, thin white borders, rounded corners, A4 portrait"; the settings and preview match.

- [ ] T011 [P] [US1] Add `src/agent/tools/read.ts`: `get_state` (read-only) and `get_photo_preview` (one image block, longest side 256, made from the existing downscaled copy, released after use)
- [ ] T012 [P] [US1] Add `src/agent/tools/style.ts`: `set_layout`, `set_columns` (integer or `auto`), `set_seed`, `set_border` (`percent` 0 to 100, `color`, `outer`), `set_corners`, each calling the method the control calls
- [ ] T013 [P] [US1] Add `src/agent/tools/size.ts`: `set_output_size` (named id, or width and height), `set_orientation`, `set_instagram_post` (images 2 to 20, side)
- [ ] T014 [US1] Register the read, style and size tools in `src/agent/register.ts` with plain descriptions and JSON schemas from contracts/tools.md
- [ ] T015 [US1] E2E in `e2e/agent.spec.ts`: the tool list holds every US1 tool with a description; each tool gives the same settings as the control; an out-of-range value is refused and changes nothing (AC 1 to 3, FR-004, FR-005)

## Phase 4: User Story 2 - Edit photos and pages (P1)

**Goal**: every photo and page action is available.

**Independent Test**: from a known collage, each editing action is requested in turn and matches the same action by hand, including undo.

- [ ] T016 [P] [US2] Add `src/agent/tools/photos.ts`: `set_tool`, `select_photos`, `clear_selection`, `swap_photos`, `resize_photo` (`wider` / `taller` / `reset`), `crop_photo` (refused with `crop-needs-one-photo` for several), `move_photos_to_page`, `undo_remove`
- [ ] T017 [P] [US2] Add `src/agent/tools/pages.ts`: `add_page`, `move_page`, `set_page_count`
- [ ] T018 [US2] Register the photo and page tools in `src/agent/register.ts`
- [ ] T019 [US2] E2E in `e2e/agent.spec.ts`: swap, resize, crop, select, move to page, add / move pages and set page count match hand use; a missing page or position is refused with a reason (AC 1 to 3, 5)
- [ ] T020 [US2] E2E: a position used after a removal or move is refused or reaches the photo now there, never a stale one (FR-016)

## Phase 5: User Story 5 - A person stays in charge (P1)

**Goal**: hard-to-reverse actions still ask; the interface and an assistant share one collage.

**Independent Test**: confirmed actions wait for the person; nothing changes without an assistant.

- [ ] T021 [US5] Add the confirming tools to `src/agent/tools/photos.ts` and `src/agent/tools/pages.ts`: `remove_photos`, `remove_all_photos`, `remove_page`, `shuffle_layout`, `shuffle_between_pages`; each calls the `ask*` method and returns `waiting` at once
- [ ] T022 [US5] E2E in `e2e/agent.spec.ts`: each confirming tool opens the dialog, changes nothing until Confirm, reports `confirmed` or `cancelled` in `get_state` afterwards; Undo remove works after confirm (AC 1 to 4, FR-006, FR-008)
- [ ] T023 [US5] E2E: with the stub present, the person's own controls still work and both act on one collage; the tool results never contain photo pixels except from `get_photo_preview` (FR-011, FR-009)
- [ ] T024 [US5] E2E in `e2e/agent.spec.ts`: with no `modelContext`, nothing is registered and the page loads without errors; the existing no-network check passes with tools exercised (FR-012, SC-004, SC-005)

## Phase 6: User Story 3 - Save the result (P2)

**Goal**: an assistant saves in the format and quality asked and can follow or cancel it.

**Independent Test**: a save by tool downloads the same files as a hand save.

- [ ] T025 [P] [US3] Add `src/agent/tools/save.ts`: `set_save_format` (png / jpeg, quality 1 to 100), `save` (optional page; returns at once with the planned file count), `cancel_save`
- [ ] T026 [US3] Record the last save in `src/ui/app-state.svelte.ts` (`lastSave` with file names and count) so `get_state` can report it
- [ ] T027 [US3] Register the save tools; E2E in `e2e/agent.spec.ts`: one page, several pages, a carousel and a single page save match hand saves; progress is readable; cancel stops it (AC 1 and 2, FR-007)

## Phase 7: User Story 4 - Everything else in the app (P2)

**Goal**: no remaining control needs hands.

**Independent Test**: the coverage check passes.

- [ ] T028 [P] [US4] Add `src/agent/tools/view.ts`: `open_tab`, `zoom_view` (percent, factor or fit), `pan_view`, `set_language`, `open_dialog` (help / about), `close_dialog`
- [ ] T029 [P] [US4] Add `src/agent/controls.json`: every control's accessible name with its tool, or a reason (adding photos: native file chooser; theme: follows the system, no control; confirmation buttons: the person's choice)
- [ ] T030 [US4] Register the view tools; add `e2e/agent-coverage.spec.ts`: open each tab and dialog, collect every button, input and select name, and fail on any not in `controls.json`; also fail on any `controls.json` tool that is not registered (SC-001, FR-014)
- [ ] T031 [US4] E2E in `e2e/agent.spec.ts`: language switches and tabs, zoom, pan and dialogs work through tools (AC 1)

## Phase 8: Polish

- [ ] T032 [P] Put every tool description and message through `tr()` with English first; run `npm run check:i18n`
- [ ] T033 [P] Update `README.md` (a line under Features), `ARCHITECTURE.md` (the `src/agent/` folder) and `specs/README.md` (row 017)
- [ ] T034 Run `npm run check`, `npm test`, `npm run test:e2e` and the licence-header check; fix anything they report
- [ ] T035 Run `quickstart.md` step 5 by hand in a Chrome with WebMCP, if one is available, and note the result in research.md

## Dependencies

- Phase 1 then Phase 2, which block everything.
- US1, US2 and US3 (tools) are independent of each other after Phase 2. US5 builds on US2's files. US4 comes last because the coverage check needs every tool.
- T006 comes before T021 and T022; T026 before T027.

## Parallel examples

- After Phase 2: T011, T012, T013, T016, T017 and T025 touch different files and can run together.
- Tests T008 and T009 can run alongside T004 and T005.

## Implementation strategy

- **MVP**: Phases 1 to 3 (read state, change layout, style and size), then check with a real assistant.
- Then US2 and US5 together (editing with confirmations), then US3 and US4.
- Ship in small PRs, each leaving the suite green.
