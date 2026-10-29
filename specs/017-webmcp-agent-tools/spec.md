# Feature Specification: WebMCP agent tools

**Feature Branch**: `claude/spec-kit` (spec directory `017-webmcp-agent-tools`)

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "WebMCP support for every action facilitating the usage of this web app: the page registers tools with the browser (navigator.modelContext) so an in-browser AI agent can do anything a user can: choose layout, size, pages, borders, corners, columns, shuffle, swap, resize, crop, remove, undo, select, language, theme, and save/export."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ask an assistant to make a collage (Priority: P1)

A person has an AI assistant built into their browser open beside Collage Creator. The photos are already in the page. They tell it what they want ("a 3-column collage of these photos with thin white borders and rounded corners, A4 portrait") and the assistant makes the changes in the page, which the person watches happen in the live preview.

**Why this priority**: this is the whole point; without it nothing else matters. It also needs the assistant to see the app's current state, or it cannot act sensibly.

**Independent Test**: with photos already in the page, an assistant is given only the app's offered tools and a plain-language request; the resulting settings and preview match the request.

**Acceptance Scenarios**:

1. **Given** the page is open with photos, **When** the assistant asks what the app can do, **Then** it is told every action available, with a plain description of each and what it needs.
2. **Given** the assistant asks for the current state, **When** it receives it, **Then** it learns the photos (with their pages), the layout, output size, pages, borders, corners, columns, language, theme and what is selected.
3. **Given** a request to change the layout, size, columns, borders or corners, **When** the assistant acts, **Then** the preview shows the change at once, exactly as if the person had used the controls.

---

### User Story 2 - Edit photos and pages (Priority: P1)

The assistant does what the person could do by hand with the photos themselves: select photos, swap two, make one wider or taller, crop it, remove photos, move photos between pages, add, move or remove pages, shuffle, and undo a removal.

**Why this priority**: arranging the photos is most of the work in making a collage.

**Independent Test**: from a known collage, each editing action is requested in turn and the result matches the same action done by hand, including undo.

**Acceptance Scenarios**:

1. **Given** a collage, **When** the assistant swaps two photos, **Then** they trade places as with the Swap tool.
2. **Given** a selected photo, **When** the assistant makes it wider, taller or sets a crop, **Then** the preview and later the saved image show it.
3. **Given** several pages, **When** the assistant moves photos to another page, adds, moves or removes a page, or shuffles, **Then** the page controls and photo counts agree with what it did.
4. **Given** photos were removed, **When** the assistant undoes the removal, **Then** they come back where they were.
5. **Given** a request that cannot be done (a page that does not exist, a crop on several photos), **When** the assistant makes it, **Then** it is told plainly why not and nothing changes.

---

### User Story 3 - Save the result (Priority: P2)

The assistant can save the finished collage (one image, one image per page, or a zip) in the format and quality the person asked for, and report what was saved.

**Why this priority**: it completes the job, but a person can still press Save themselves.

**Independent Test**: ask for a save in each supported format and check the downloaded files match a hand-made save.

**Acceptance Scenarios**:

1. **Given** a finished collage, **When** the assistant saves it, **Then** the same files a person would get are downloaded, and the assistant is told their names and count.
2. **Given** a save takes a while, **When** the assistant waits for it, **Then** it can learn progress and can cancel, as a person can.

---

### User Story 4 - Everything else in the app (Priority: P2)

The assistant can also change the language and theme, zoom and pan the view, choose tools, use the confirmations the app asks for, and open Help or About, so nothing a person can do needs hands.

**Why this priority**: completes "every action", but is rarely the reason someone asks.

**Independent Test**: each remaining control has a matching tool, found by walking the app's controls one tab at a time.

**Acceptance Scenarios**:

1. **Given** the app in English and light theme, **When** the assistant switches to another language and the dark theme, **Then** the page changes as the controls would change it.
2. **Given** an action the app confirms first (removing photos or a page, Remove all), **When** the assistant requests it, **Then** the person is asked as usual, and the action happens only when the person confirms.

---

### User Story 5 - A person stays in charge (Priority: P1)

Whatever the assistant does, the person sees it, can undo it, and the app never does something to their photos they did not ask their assistant for.

**Why this priority**: trust, and the project's privacy promise.

**Independent Test**: with an assistant connected, check that no photo leaves the page, every change is visible, and the person's own controls keep working throughout.

**Acceptance Scenarios**:

1. **Given** an assistant is making changes, **When** the person also uses the controls, **Then** both work on the same collage with no lost changes.
2. **Given** no assistant is present, **When** the app is used, **Then** it behaves exactly as before.

### Edge Cases

- The browser has no assistant support: the app works as before and nothing is shown or broken.
- The assistant calls a tool with a missing or wrong value (a photo number that does not exist, an out-of-range column count or page count): it gets a clear message and nothing changes.
- The assistant acts while a save is in progress or while photos are still loading: it is told to wait, or the action queues, and nothing is half-applied.
- Two actions arrive quickly, or the person acts at the same time: each is applied in order to the current state.
- The person leaves the page or refreshes: the saved work comes back as it does today, and the assistant is told the app was reloaded.
- A confirmation is left unanswered: the action stays pending and the assistant is told it was not confirmed.
- Very large collages (100 photos): the state and results given to the assistant stay short enough to use.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The app MUST offer an in-browser assistant a tool for every action a person can do with its controls, grouped as: photos, selection and editing, pages, layout and style, size and shape, view and tools, language and theme, saving, help.
- **FR-002**: Each tool MUST have a plain name, a plain description, and a description of what it needs and what it returns, so an assistant can use it without other documentation.
- **FR-003**: The app MUST let the assistant read the current state: photos and their pages, selection, layout, columns, borders, corners, output size and shape, page count, language, theme, view, and whether a save or load is in progress.
- **FR-004**: A tool MUST have the same effect, limits and results as the matching control (for example the 1 to 20 page limit, the carousel image limits, and crop being off with several photos selected).
- **FR-005**: A tool given an invalid or impossible request MUST change nothing and MUST return a clear reason.
- **FR-006**: Actions the app confirms first (removing photos, removing a page, Remove all, shuffling after a hand edit) MUST still ask the person, and MUST complete only when the person confirms.
- **FR-007**: Saving MUST produce the same files as a person's save, MUST report the file names and count to the assistant, and MUST allow progress to be read and a save to be cancelled.
- **FR-008**: The assistant MUST be able to undo a removal, as the person can.
- **FR-009**: Photos MUST stay on the person's device: no tool sends the collage to any outside service, and no tool fetches photos from the network. Adding photos is not a tool: the person (or an assistant that operates the browser's own file chooser, such as a desktop assistant) adds them in the usual way, and the tools then arrange them.
- **FR-010**: The assistant MUST be able to read each photo's details (name, size, orientation, page, position) and a small preview of it, so it can judge content when arranging. Previews are for the person's own assistant only and are never sent elsewhere by the app.
- **FR-011**: A person's own use of the controls MUST keep working while an assistant is connected, and both MUST act on one shared collage.
- **FR-012**: When no assistant support is present the app MUST behave exactly as it does today.
- **FR-013**: Tool names, descriptions and messages MUST be available in the app's languages with English first, like other text in the app.
- **FR-014**: Every tool MUST be covered by an automated test, and a check MUST fail when a control is added with no matching tool or an exception recorded for it.
- **FR-015**: Saving by an assistant MUST NOT add a prompt of the app's own; whether to ask the person first is the assistant's decision. The browser's own download behaviour is unchanged.

### Key Entities

- **Tool**: one action offered to an assistant, with a name, a description, what it needs and what it returns.
- **App state**: what the assistant reads: photos, pages, selection, settings, progress.
- **Confirmation**: the question the app puts to the person before a hard-to-reverse action, which an assistant's request waits on.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of the actions available through the app's controls (as listed by an automated walk of the interface) have a matching tool or a recorded reason why not.
- **SC-002**: An assistant given only the tool descriptions completes a set of 10 typical requests (for example "3 columns, rounded corners, A4 portrait, two pages, save") correctly on the first try in at least 9.
- **SC-003**: A change made by a tool is visible in the preview in the same time as the same change made by hand.
- **SC-004**: The app makes no network requests when tools are used, shown by the existing no-network check passing with tools exercised.
- **SC-005**: With no assistant support, all existing tests pass unchanged.
- **SC-006**: A collage of 100 photos can be described to an assistant in a state report small enough to read in one go.

## Assumptions

- Adding photos stays a person's action through the native file chooser (or a desktop assistant driving it); there is no tool for it.
- The person already has a browser with built-in assistant support; installing one is out of scope.
- Tools are offered only while the page is open; nothing runs in the background.
- An assistant has the same permissions as the person using the page and nothing more.
- The set of tools follows the app's controls as they stand when this is built; later features add their own tools.
- Packaging the app for desktop assistants (an installable local server) is a separate feature.
