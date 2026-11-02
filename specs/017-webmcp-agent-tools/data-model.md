# Data model: WebMCP agent tools

None of this is stored. It is the shape of what an assistant reads and sends.

## PhotoRef (input)

| Field    | Type    | Rule                                                     |
| -------- | ------- | -------------------------------------------------------- |
| page     | integer | 1 to the page count                                      |
| position | integer | 1 to the number of photos on that page, in reading order |

Resolved against the collage at the moment of the call. Refused with `no-such-photo` if it does not exist.

## ToolResult (output)

| Field   | Type                             | Meaning                                                                                                       |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| ok      | boolean                          | the request was accepted                                                                                      |
| status  | `done` or `waiting` or `refused` | `waiting` = a confirmation is open for the person                                                             |
| code    | string, when refused             | `no-such-photo`, `no-such-page`, `out-of-range`, `busy`, `crop-needs-one-photo`, `no-photos`, `not-supported` |
| message | string                           | plain reason or summary (localised)                                                                           |
| state   | partial StateReport, optional    | the parts the tool changed                                                                                    |

## StateReport (get_state)

| Field         | Content                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| photos        | per page: list of `{ page, position, name, width, height, orientation, selected, wider, taller, cropped }`                          |
| selection     | list of PhotoRef                                                                                                                    |
| layout        | style, columns (number or auto), seed                                                                                               |
| style         | borderPercent (0 to 100 of the allowed maximum), borderColor, corners, outerBorder                                                  |
| size          | width, height, orientation, named size id or `custom`, instagramPost: `{ images, side }` or null                                    |
| pages         | count, per-page photo counts, carousel or standard                                                                                  |
| view          | tab, mode, zoomPercent, fit                                                                                                         |
| save          | format, jpegQuality, `saving`, progress 0 to 100, `lastSave`: `{ files: string[], count }`                                          |
| ui            | language, open dialog, `pendingQuestion` (text or null), `confirmationOutcome` (`confirmed` or `cancelled` or null), recent notices |
| canUndoRemove | boolean                                                                                                                             |

Size budget: about 60 bytes per photo, so 100 photos fit in about 8 KB.

## ControlEntry (controls.json)

| Field   | Meaning                                                                  |
| ------- | ------------------------------------------------------------------------ |
| control | the control's accessible name (English)                                  |
| tool    | the tool that does the same, or null                                     |
| reason  | required when tool is null (for example "opens the native file chooser") |
