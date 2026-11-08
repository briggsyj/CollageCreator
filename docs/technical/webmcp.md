# WebMCP tools

[WebMCP](https://github.com/webmachinelearning/webmcp) is a proposed web standard that lets a page offer
tools to an AI assistant built into the browser. When the browser has it (`navigator.modelContext`, or
`document.modelContext` in the current draft), Collage Creator registers one tool per user action; without
it, nothing is registered and nothing changes. The code is in `src/agent/`; the design is in
[spec 017](../../specs/017-webmcp-agent-tools/spec.md).

## Principles

- **Parity.** Each tool calls the same `AppState` method as the matching control, with the same limits.
- **Confirmations stay with the person.** Tools that the app confirms first (removing photos or a page,
  Remove all, shuffling after hand edits) open the normal dialog and return `status: "waiting"` at once; the
  outcome appears in `get_state` (`ui.pendingQuestion`, `ui.confirmationOutcome`).
- **No photo adding.** The person adds photos; there is no tool for it.
- **Photos are named by page and position**, both counting from 1 in reading order, as the collage stands
  when the tool runs. Read the state again after anything that moves photos.
- **Refusals change nothing** and say why (`code`: `no-such-photo`, `no-such-page`, `out-of-range`,
  `bad-value`, `busy`, `no-photos`, `crop-needs-one-photo`, `not-supported`).

Results are `{ content: [{ type: "text", text: JSON }] }` (`isError: true` on a refusal);
`get_photo_preview` also returns an image block.

## Tools

| Tool                           | Input                                                 | Does                                                                                                                          |
| ------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `get_state`                    | none                                                  | the whole state: photos by page and position, selection, layout, style, size, pages, view, saving, language, pending question |
| `get_photo_preview`            | `page`, `position`                                    | a small JPEG preview of one photo                                                                                             |
| `set_tool`                     | `tool`: select, swap, pan                             | choose a tool                                                                                                                 |
| `select_photos`                | `photos`, `add?`                                      | select photos                                                                                                                 |
| `clear_selection`              | none                                                  | deselect                                                                                                                      |
| `swap_photos`                  | `a`, `b`                                              | swap two photos (across pages)                                                                                                |
| `resize_photo`                 | `photos`, `columns?` 1–2, `rows?` 1–3, `reset?`       | Wider / Taller                                                                                                                |
| `crop_photo`                   | `photo`, `zoom?` 1–5, `x?`, `y?`, `reset?`, `finish?` | crop one photo                                                                                                                |
| `remove_photos`                | `photos`                                              | remove (asks the person)                                                                                                      |
| `remove_all_photos`            | none                                                  | remove all (asks)                                                                                                             |
| `undo_remove`                  | none                                                  | bring back the last removal                                                                                                   |
| `move_photos_to_page`          | `photos`, `page`                                      | move photos to a page                                                                                                         |
| `add_page`                     | none                                                  | add a blank page                                                                                                              |
| `move_page`                    | `page`, `direction`: left, right                      | move a page                                                                                                                   |
| `set_page_count`               | `count` 1–20                                          | set pages, sharing photos evenly                                                                                              |
| `remove_page`                  | `page`                                                | remove a page (asks)                                                                                                          |
| `shuffle_layout`               | none                                                  | new arrangement within pages (asks after hand edits)                                                                          |
| `shuffle_between_pages`        | none                                                  | mix photos between pages (asks after hand edits)                                                                              |
| `set_layout`                   | `style`: mosaic, gallery                              | layout                                                                                                                        |
| `set_columns`                  | `columns` 1–100 or `"auto"`                           | Mosaic columns                                                                                                                |
| `set_seed`                     | `seed`                                                | arrangement seed                                                                                                              |
| `set_border`                   | `percent?` 0–100, `color?`, `outer?`                  | border                                                                                                                        |
| `set_corners`                  | `style`: none, slight, rounded                        | corners                                                                                                                       |
| `set_output_size`              | `named?` or `width` and `height`                      | size                                                                                                                          |
| `set_orientation`              | `orientation`: landscape, portrait                    | turn                                                                                                                          |
| `set_instagram_post`           | `images` 2–20, `side?`                                | Instagram post                                                                                                                |
| `open_tab`                     | `tab`: photos, poster, style, save                    | open a step                                                                                                                   |
| `zoom_view`                    | `percent?`, `factor?`, `fit?`                         | zoom the preview                                                                                                              |
| `pan_view`                     | `dx`, `dy`                                            | pan the preview                                                                                                               |
| `set_language`                 | `code`                                                | language                                                                                                                      |
| `open_dialog` / `close_dialog` | `name`: help, about                                   | Help, About                                                                                                                   |
| `set_save_format`              | `format`: png, jpeg, pdf; `quality?` 1–100            | format (PDF refused for a post)                                                                                               |
| `save`                         | `page?`                                               | save as the Save button does; read `get_state` for progress and the file                                                      |
| `cancel_save`                  | none                                                  | cancel a running save                                                                                                         |

## Coverage

`src/agent/controls.json` maps every control (by id, or label) to its tool or to a reason it has none (the
file chooser, the person's own confirm buttons, phone-only close buttons). `e2e/agent-coverage.spec.ts`
walks the app and fails when a control is missing from the map or a mapped tool is not registered. **When
you add a control, add its tool or a reason.**

## Adding a tool

1. Add it to the right file in `src/agent/tools/` with `tool(name, description, schema, run)`; check
   arguments with `args.ts` helpers and refuse with `refused(code, message)`.
2. Call the `AppState` method the control calls; return `done()` or `waiting()`.
3. Map the control in `controls.json` and add an e2e case in `e2e/agent.spec.ts` (the tests install a
   stand-in `modelContext`).
