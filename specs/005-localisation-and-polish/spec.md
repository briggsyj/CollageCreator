# Spec 005: Localisation and polish

**Gate**: a keyboard-only run through the main flow; at least one non-English language shown.

## Requirements

- Every user-visible string comes from a message catalogue; English is the source.
- The original's translations are reused with their translator credits intact; strings that did not exist in the GTK version fall back to English.
- All actions are keyboard operable; dialogs and the preview have accessible names; status changes are announced.
- Empty and error states are clear (no photos, unreadable files, size too large, export failure).
