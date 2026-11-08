# Feature Specification: Photo actions on the preview

**Feature Branch**: `claude/photo-actions` (spec directory `019-photo-actions`)

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "When an image is selected, a new tool group appears (semantically these are actions), visually distinct from the tools. The actions are Wider, Taller, Swap and Crop. Swap makes the next photo chosen trade places; Crop turns on cropping with a zoom slider under it and a round blue tick to finish. Clicking away deactivates either; holding Space still pans. Crop, Wider and Taller leave the sidebar; the Swap tool is removed."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Act on the selected photo from the preview (Priority: P1)

A person selects a photo on the preview. A group of photo actions appears beside the tools, looking different from them: Wider and Taller, then Swap and Crop. They change the photo without moving to the sidebar.

**Why this priority**: it is the frame every other story uses; with only Wider and Taller it is already useful.

**Independent Test**: select a photo; the action group appears with the four actions; Wider and Taller change the photo as they did in the sidebar; deselecting hides the group.

**Acceptance Scenarios**:

1. **Given** no photo is selected, **When** the person looks at the tools, **Then** there is no action group.
2. **Given** a photo is selected, **When** the person looks at the tools, **Then** the action group shows Wider, Taller, Swap and Crop, in that order, styled as actions (accent-coloured, filled when on), not as tools.
3. **Given** a photo is selected, **When** the person presses Wider, **Then** the photo spans two columns and Wider shows as on; pressing it again turns it off.
4. **Given** a photo is selected, **When** the person presses Taller repeatedly, **Then** the photo steps through 2, 3 and back to 1 row, and Taller shows the number of rows while above 1.
5. **Given** a photo has a size request, **When** the person looks at the Photos list, **Then** its thumbnail still shows the size badge.

---

### User Story 2 - Swap as an action (Priority: P1)

With a photo selected, the person presses Swap and then chooses another photo; the two trade places. The separate Swap tool is gone.

**Why this priority**: swapping is the most common edit and the change removes a tool.

**Independent Test**: select a photo, press Swap, click another photo; they trade places, Swap turns off and the first photo is no longer the one waiting.

**Acceptance Scenarios**:

1. **Given** a photo is selected, **When** the person presses Swap, **Then** Swap shows as on and the preview invites choosing a second photo.
2. **Given** Swap is on, **When** the person chooses another photo (on any page), **Then** the two photos trade places, as the Swap tool did, and Swap turns off.
3. **Given** Swap is on, **When** the person clicks empty space, presses Escape, presses Swap again or chooses another tool, **Then** Swap turns off and nothing moves.
4. **Given** Swap is on, **When** the person holds Space and drags, **Then** the view pans, and Swap is still on when Space is released.
5. **Given** the tools, **When** the person looks at them, **Then** only Pan and Select remain.

---

### User Story 3 - Crop as an action (Priority: P1)

With a photo selected, the person presses Crop. A zoom slider appears under it in the action group, and a round blue button with a tick. Dragging the photo moves it in its cell, as now. The tick ends cropping and leaves the photo selected.

**Why this priority**: cropping moves out of the sidebar, so it must be complete here.

**Independent Test**: select a photo, press Crop, drag and zoom with the slider, press the tick; the crop is kept, cropping ends, the photo is still selected.

**Acceptance Scenarios**:

1. **Given** a photo is selected, **When** the person presses Crop, **Then** Crop shows as on and a vertical zoom slider and a round blue tick appear under it, inside the group.
2. **Given** Crop is on, **When** the person drags the photo or moves the slider, **Then** the photo moves or zooms inside its cell, as cropping does now.
3. **Given** Crop is on, **When** the person presses the tick or Enter, **Then** cropping ends, the crop is kept and the photo stays selected.
4. **Given** Crop is on, **When** the person clicks empty space or another photo, **Then** cropping ends as now (the crop is kept), and the other photo is selected if one was clicked.
5. **Given** Crop is on, **When** the person holds Space and drags, **Then** the view pans, and cropping carries on when Space is released.
6. **Given** a photo is double-clicked with the Select tool, **When** it opens, **Then** Crop is on in the action group.
7. **Given** the sidebar, **When** a photo is selected, **Then** it no longer shows Crop, Wider or Taller.

---

### User Story 4 - Several photos selected (Priority: P2)

With several photos selected, Wider and Taller act on all of them; Swap and Crop are off, saying why.

**Independent Test**: Shift-select three photos; Wider makes all three wider; Swap and Crop are disabled with a tooltip.

**Acceptance Scenarios**:

1. **Given** three photos are selected, **When** the person looks at the group, **Then** Swap and Crop are disabled with tooltips "Select one photo to swap" and "Select one photo to crop".
2. **Given** three photos are selected, **When** the person presses Wider or Taller, **Then** all three change, as the sidebar buttons did.

---

### User Story 5 - Keyboard and help (Priority: P2)

The person can use W, T, S and C for Wider, Taller, Swap and Crop while a photo is selected; the shortcuts are listed in Help, not on the buttons.

**Acceptance Scenarios**:

1. **Given** a photo is selected and the preview has focus, **When** the person presses W, T, S or C, **Then** the matching action happens (or turns on).
2. **Given** the Help dialog, **When** it is opened, **Then** it lists the four shortcuts and Enter to finish cropping.
3. **Given** the action buttons, **When** they are shown, **Then** no key hints are drawn on them.

---

### User Story 6 - Phones (Priority: P2)

On a phone the same floating group appears with the tools; the selected-photo bar above the tabs keeps what remains (page, remove).

**Acceptance Scenarios**:

1. **Given** a phone-sized screen and a selected photo, **When** the person looks at the preview, **Then** the action group floats with the tools, and the bar above the tabs no longer shows Crop, Wider or Taller.

### Edge Cases

- A photo is deselected while Swap or Crop is on: the action turns off and the group hides.
- The selected photo is removed while Swap is on: Swap turns off.
- Swap is pressed and the same photo is chosen: nothing moves and Swap turns off.
- The zoom group is narrower than the tool groups (it holds only +, −, Fit and the percentage).
- Typing in a field (seed, size) never triggers W, T, S or C.
- An assistant using the app's tools keeps the same abilities (swap, resize, crop); its tool to choose the Swap tool no longer offers Swap.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: While one or more photos are selected, the preview MUST show a photo action group with Wider, Taller, a divider, Swap and Crop, in that order; it MUST be hidden when nothing is selected.
- **FR-002**: The action group MUST look different from the tool groups: the same glass, accent-coloured icons and labels, filled with the accent colour when on.
- **FR-003**: Wider and Taller MUST behave as the sidebar buttons did (Wider toggles two columns; Taller steps 1, 2, 3 rows), including on several photos, and Taller MUST show the number of rows while above 1.
- **FR-004**: Swap MUST wait for one further photo choice and then swap the two photos as the Swap tool did, across pages; it MUST turn off after the swap, on clicking empty space, on Escape, on pressing it again, on choosing another tool and on deselecting.
- **FR-005**: The Swap tool MUST be removed; the tools are Pan and Select.
- **FR-006**: Crop MUST turn on cropping as it works now; while on, a vertical zoom slider and a round blue tick button MUST appear under Crop in the group. The tick and Enter MUST end cropping and keep the photo selected.
- **FR-007**: Clicking empty space or another photo while cropping MUST end cropping as it does now.
- **FR-008**: Holding Space MUST pan the view during Swap or Crop and MUST leave the action on when released.
- **FR-009**: With several photos selected, Swap and Crop MUST be disabled with tooltips saying one photo is needed; Wider and Taller act on all.
- **FR-010**: Crop, Wider and Taller MUST be removed from the sidebar's selected-photo panel and the phone bar; the Photos list keeps its size badges. [NEEDS CLARIFICATION: where should Reset size (back to normal size, also for several photos) go? Options: A) stays in the sidebar panel; B) in the action group, under Taller; C) removed, since Wider and Taller can be turned back off.]
- **FR-011**: While cropping, resetting the crop MUST stay possible. [NEEDS CLARIFICATION: where should Reset crop go? Options: A) a small text button under the slider, above the tick; B) stays in the sidebar panel; C) double-click the slider to reset.]
- **FR-012**: The keys W, T, S and C MUST trigger Wider, Taller, Swap and Crop while a photo is selected and the focus is not in a text field; they MUST be listed in Help and not shown on the buttons.
- **FR-013**: The zoom group MUST be narrower than the tool groups.
- **FR-014**: On phones the action group MUST float with the tools, as on wide screens.
- **FR-015**: Every action button MUST have a title (tooltip) and an accessible name; the group MUST be operable by keyboard.
- **FR-016**: Dragging one photo onto another, which the Swap tool allowed, MUST be decided. [NEEDS CLARIFICATION: with the Swap tool gone, should dragging a photo onto another with the Select tool swap them? Options: A) yes, drag to swap with Select; B) no, swapping is only the Swap action; C) yes, but only while Swap is on.]

### Key Entities

- **Photo action**: Wider, Taller, Swap or Crop; available while photos are selected; Swap and Crop need exactly one.
- **Active action**: none, Swap (waiting for a second photo) or Crop (cropping the selected photo).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Swapping two photos takes three clicks (select, Swap, the other photo) with no tool change.
- **SC-002**: Cropping a photo needs no visit to the sidebar.
- **SC-003**: Every action is reachable by keyboard and named for screen readers.
- **SC-004**: All existing saving, layout and page behaviour is unchanged; the existing tests pass once updated for the removed Swap tool.

## Assumptions

- Pan and Select keep their places; the zoom group keeps +, −, Fit and the percentage.
- The look follows the agreed mockup (style C, Wider and Taller first, round blue tick under the crop slider).
- Remove and Move to page stay in the sidebar panel and the phone bar.
