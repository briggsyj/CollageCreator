# Spec 007: Corner styles, zoom and pan, removing photos

**Gate**: each behaviour below works in the preview and, where it affects the picture, the saved image is identical to the preview.

## Why

Requests from the owner after the first release: more control over how photos look, a preview that can be inspected closely, and an easy way to take photos out.

## User stories

- **P1** As a user, I can choose how the corners of the photos are shaped: none (the default), slightly rounded, rounded, or a circle (an ellipse touching all four sides, like CSS `border-radius: 100%`), so that the collage can look like cards or portraits.
- **P1** As a user, the border starts as a thin white line (0.5 %) with square corners, so a new collage looks clean without any setup.
- **P1** As a user, I can zoom the preview by scrolling over it, and hold Space and drag to move it, so I can check details.
- **P1** As a user, the preview area is a plain surface, not a checkerboard, so it does not look like an image editor's transparency grid.
- **P1** As a user, I can remove photos from the collage itself (Delete on the preview, or a Remove selected photo button), remove them all, and undo a removal.

## Requirements

- Corner style applies to every photo, in the preview and the saved image alike. With square corners the border is drawn over the photos as before; with a rounded style the photos sit inside the border: the gap between any two photos, and between a photo and the poster's edge, is the border, in the border colour.
- Rounded corners scale with the photo (a fixed share of its shorter side), so they look the same at any poster size.
- Zoom is anchored on the mouse pointer, runs from 50 % to 800 % of "fit", and has a **Fit to window** button that appears when the view is not "fit". The collage can never be moved completely out of the window.
- Keyboard users can zoom (+ and −), move (Shift with the arrow keys) and fit (0). Space is now used for moving the view, so it no longer picks a photo; Enter does.
- Zoom and pan change only the preview; saving always produces the full picture at the chosen size.
- Showing a message or a button never resizes the preview area, so the view does not jump.
- The preview stays in view while the controls scroll, and fills the window.
- Removing a photo can be undone, including "Remove all". Undo puts photos back where they were, and does not bring back a photo that was added again meanwhile. Only the latest removal can be undone.
- Delete removes the photo the user clicked (if any), otherwise the one with the focus ring.

## Out of scope

Touch gestures (pinch, two-finger drag), changing the zoom of one photo inside its cell, per-photo corner styles.
