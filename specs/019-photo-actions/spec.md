# Feature Specification: Photo actions on the preview

**Feature Branch**: `claude/photo-actions` (spec directory `019-photo-actions`)

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "When an image is selected, a new tool group appears (semantically these are actions), visually distinct from the tools. The actions are Wider, Taller and Crop. Crop turns on cropping with a zoom slider under it and a button to finish. Clicking away deactivates it; holding Space still pans. Crop, Wider and Taller leave the sidebar. Swap stays a tool: while it is active, photos are dragged onto each other to swap them."

## Clarifications

### Session 2026-11-08

- Q: What should the button that finishes cropping look like? → A: A round button in the quiet raised style (white with an accent tick; soft grey in dark mode), under the zoom slider; no label.
- Q: Where do Reset size and Reset crop go? → A: Nowhere: there are no separate reset buttons. Wider and Taller are turned back off to return to the normal size; the crop is undone by zooming out with the crop slider.
- Q: Is Swap an action on a selected photo? → A: No. Swap stays a tool beside Pan and Select; while it is active, dragging one photo onto another swaps them. It needs no selection.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Act on the selected photo from the preview (Priority: P1)

A person selects a photo with the Select tool. A group of photo actions appears beside the tools, looking different from them: Wider and Taller, then Crop. They change the photo without going to the sidebar.

**Why this priority**: it is the frame every other story uses; with only Wider and Taller it is already useful.

**Independent Test**: select a photo; the action group appears; Wider and Taller change the photo as they did in the sidebar; deselecting hides the group.

**Acceptance Scenarios**:

1. **Given** no photo is selected, **When** the person looks at the tools, **Then** there is no action group.
2. **Given** a photo is selected, **When** the person looks at the tools, **Then** the action group shows Wider, Taller, a divider and Crop, styled as actions (accent-coloured, filled when on), not as tools.
3. **Given** a photo is selected, **When** the person presses Wider, **Then** the photo spans two columns and Wider shows as on; pressing it again turns it off.
4. **Given** a photo is selected, **When** the person presses Taller repeatedly, **Then** the photo steps through 2, 3 and back to 1 row, and Taller shows the number of rows while above 1.
5. **Given** a photo has a size request, **When** the person looks at the Photos list, **Then** its thumbnail still shows the size badge.

---

### User Story 2 - Crop as an action (Priority: P1)

With a photo selected, the person presses Crop. A zoom slider appears under it in the action group, with a round tick button. Dragging the photo moves it in its cell, as now. The tick ends cropping and leaves the photo selected.

**Why this priority**: cropping moves out of the sidebar, so it must be complete here.

**Independent Test**: select a photo, press Crop, drag and zoom with the slider, press the tick; the crop is kept, cropping ends, the photo is still selected.

**Acceptance Scenarios**:

1. **Given** a photo is selected, **When** the person presses Crop, **Then** Crop shows as on and a vertical zoom slider and a round, quietly styled tick button appear under it, inside the group.
2. **Given** Crop is on, **When** the person drags the photo or moves the slider, **Then** the photo moves or zooms inside its cell, as cropping does now.
3. **Given** Crop is on, **When** the person presses the tick or Enter, or presses Crop again, **Then** cropping ends, the crop is kept and the photo stays selected.
4. **Given** Crop is on, **When** the person clicks empty space or another photo, **Then** cropping ends as now (the crop is kept), and the other photo is selected if one was clicked.
5. **Given** Crop is on, **When** the person holds Space and drags, **Then** the view pans, and cropping carries on when Space is released.
6. **Given** a photo is double-clicked with the Select tool, **When** it opens, **Then** Crop is on in the action group.
7. **Given** the sidebar, **When** a photo is selected, **Then** it no longer shows Crop, Wider, Taller, Reset size or Reset crop.

---

### User Story 3 - Swap stays a drag-and-drop tool (Priority: P1)

The Swap tool stays in the tools with Pan and Select. While it is active, the person drags one photo onto another and they trade places; no selection is needed.

**Why this priority**: swapping is the most common edit; this keeps it one gesture.

**Independent Test**: choose Swap, drag photo A onto photo B; they trade places, also across pages.

**Acceptance Scenarios**:

1. **Given** the tools, **When** the person looks at them, **Then** they are Pan, Swap and Select, as now.
2. **Given** Swap is active, **When** the person drags a photo onto another (on any page), **Then** the two trade places.
3. **Given** Swap is active, **When** the person looks at the preview, **Then** no action group is shown (it belongs to a selection made with Select).
4. **Given** Swap is active, **When** the person holds Space and drags, **Then** the view pans and Swap is still active after.

---

### User Story 4 - Several photos selected (Priority: P2)

With several photos selected, Wider and Taller act on all of them; Crop is off, saying why.

**Independent Test**: Shift-select three photos; Wider makes all three wider; Crop is disabled with a tooltip.

**Acceptance Scenarios**:

1. **Given** three photos are selected, **When** the person looks at the group, **Then** Crop is disabled with the tooltip "Select one photo to crop".
2. **Given** three photos are selected, **When** the person presses Wider or Taller, **Then** all three change, as the sidebar buttons did.

---

### User Story 5 - Keyboard and help (Priority: P2)

The person can use W, T and C for Wider, Taller and Crop while a photo is selected; the shortcuts are listed in Help, not on the buttons.

**Acceptance Scenarios**:

1. **Given** a photo is selected and the focus is not in a text field, **When** the person presses W, T or C, **Then** the matching action happens (or Crop turns on or off).
2. **Given** the Help dialog, **When** it is opened, **Then** it lists W, T, C and Enter to finish cropping.
3. **Given** the action buttons, **When** they are shown, **Then** no key hints are drawn on them.

---

### User Story 6 - Phones (Priority: P2)

On a phone the same floating group appears with the tools; the selected-photo bar above the tabs keeps what remains (page, remove).

**Acceptance Scenarios**:

1. **Given** a phone-sized screen and a selected photo, **When** the person looks at the preview, **Then** the action group floats with the tools, and the bar above the tabs no longer shows Crop, Wider or Taller.

### Edge Cases

- A photo is deselected while Crop is on: cropping ends and the group hides.
- The tool is changed while a photo is selected: the selection is let go, as now, and the group hides.
- Zooming the crop all the way out (100%) gives the photo's default fit back, so no Reset crop is needed.
- The zoom group is narrower than the tool groups (it holds only +, −, Fit and the percentage).
- Typing in a field (seed, size) never triggers W, T or C.
- An assistant using the app's tools keeps the same abilities (resize, crop, swap, choosing a tool).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: While one or more photos are selected with the Select tool, the preview MUST show a photo action group with Wider, Taller, a divider and Crop, in that order, between the tools and the zoom group; it MUST be hidden otherwise.
- **FR-002**: The action group MUST look different from the tool groups: the same glass, accent-coloured icons and labels, filled with the accent colour when on.
- **FR-003**: Wider and Taller MUST behave as the sidebar buttons did (Wider toggles two columns; Taller steps 1, 2, 3 rows), including on several photos, and Taller MUST show the number of rows while above 1.
- **FR-004**: Crop MUST turn on cropping as it works now; while on, a vertical zoom slider and a round tick button in the quiet raised style (not a filled accent colour) MUST appear under Crop in the group. The tick, Enter and pressing Crop again MUST end cropping and keep the photo selected.
- **FR-005**: Clicking empty space or another photo while cropping MUST end cropping as it does now.
- **FR-006**: Zooming the crop slider down to its lowest value MUST put the photo back to its default fit in its cell, so the crop is undone without a separate button.
- **FR-007**: Holding Space MUST pan the view while cropping or in Swap, and MUST leave cropping or Swap on when released.
- **FR-008**: The Swap tool MUST stay beside Pan and Select; while it is active, dragging one photo onto another MUST swap them, across pages, with no selection needed.
- **FR-009**: With several photos selected, Crop MUST be disabled with a tooltip saying one photo is needed; Wider and Taller act on all.
- **FR-010**: Crop, Wider, Taller, Reset size and Reset crop MUST be removed from the sidebar's selected-photo panel and the phone bar; the Photos list keeps its size badges; Remove and Move to page stay.
- **FR-011**: The keys W, T and C MUST trigger Wider, Taller and Crop while a photo is selected and the focus is not in a text field; they MUST be listed in Help and not shown on the buttons.
- **FR-012**: The zoom group MUST be narrower than the tool groups.
- **FR-013**: On phones the action group MUST float with the tools, as on wide screens.
- **FR-014**: Every action button MUST have a title (tooltip) and an accessible name; the group MUST be operable by keyboard.

### Key Entities

- **Photo action**: Wider, Taller or Crop; available while photos are selected; Crop needs exactly one.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Cropping a photo needs no visit to the sidebar.
- **SC-002**: Making a photo wider or taller takes two clicks on the preview (select, then the action).
- **SC-003**: Every action is reachable by keyboard and named for screen readers.
- **SC-004**: All existing saving, layout, swapping and page behaviour is unchanged; the existing tests pass once updated for the moved controls.

## Assumptions

- The look follows the agreed mockup (style C, Wider and Taller first, round quiet tick under the crop slider), without Swap in the action group.
- Pan, Swap and Select keep their places; the zoom group keeps +, −, Fit and the percentage.
- The Swap tool keeps its current click-two-photos way as well as drag and drop.
