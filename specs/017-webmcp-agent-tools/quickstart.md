# Quickstart: checking WebMCP agent tools

Prerequisites: `npm ci`, `npx playwright install`.

1. **Unit**: `npm test` runs `tests/agent-report.test.ts` (the report for 0, 1 and 100 photos fits the size budget) and `tests/agent-args.test.ts` (photo references and limits).
2. **Tools against the app**: `npm run test:e2e -- e2e/agent.spec.ts`. A stub `modelContext` is injected before the page loads; the test lists the registered tools, calls them and compares the result with hand use (stories 1 to 5).
3. **Coverage**: `npm run test:e2e -- e2e/agent-coverage.spec.ts` walks every tab and dialog and fails on any control missing from `src/agent/controls.json`.
4. **No assistant**: the whole existing suite passes unchanged (`npm run test:e2e`), and a run with no `modelContext` registers nothing.
5. **By hand** in a Chrome with WebMCP enabled: open the app with photos loaded, ask the browser's assistant "three columns, rounded corners, A4 portrait, then save". The preview changes as it works; removals ask you first.
6. **Privacy**: the existing no-network test passes with tools exercised (SC-004).
