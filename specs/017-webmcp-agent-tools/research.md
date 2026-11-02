# Research: WebMCP agent tools

## D1. Which API object

- **Decision**: look for `navigator.modelContext` first, then `document.modelContext`, behind one adapter.
- **Rationale**: sources disagree. Chrome's early preview and the guides use `navigator.modelContext`; the current community-group draft text on GitHub describes `document.modelContext`. An adapter makes the choice a one-line change.
- **Alternatives**: pick one now (breaks when the other ships); wait for the standard (delays a feature that is cheap to guard).

## D2. Library or direct

- **Decision**: call the browser API directly.
- **Rationale**: constitution 9 (prefer the platform); the API surface needed is `registerTool` and removal. A polyfill (such as the MCP-B one) would add a runtime dependency and its own tool transport.
- **Alternatives**: a polyfill, to give assistants in browsers without WebMCP a way in. Not needed for this feature, and MCPB/extension packaging is a separate feature.

## D3. Registering and removing

- **Decision**: `registerTool(tool, { signal })` with one `AbortController`; fall back to `registerTool(tool)` and, if present, `unregisterTool(name)`.
- **Rationale**: the draft removes tools by abort signal; early previews have `unregisterTool`.
- **Alternatives**: `provideContext` to replace the whole set (not in the draft text, and removes other code's tools).

## D4. Result shape

- **Decision**: `{ content: [{ type: "text", text: <JSON> }] }`, plus `isError: true` for refusals. Previews use an `image` block.
- **Rationale**: matches the examples in the draft and MCP's own tool result.
- **Alternatives**: plain objects (no shared definition yet).

## D5. Theme

- **Finding**: the app has no theme control; light and dark follow the system. A tool for theme would have nothing to call.
- **Decision**: record theme in `controls.json` as "no control; follows system". If a theme control is added later, its tool is added with it (the coverage check forces this).

## D6. Confirmation

- **Decision**: tools never confirm for the person; they open the app's own dialog and return `waiting` at once (spec clarification Q2). The outcome is read from `get_state`.
- **Rationale**: WebMCP's own user-interaction/elicitation is still an open question in the draft, so relying on it now would tie the feature to something unstable.

## D7. Unknowns left from the spec

- All three spec questions are answered; none remain open.
