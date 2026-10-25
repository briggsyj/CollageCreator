# Spec 003: Export quality and limits

**Gate**: export of 100 photos completes without a tab crash; downscaled output compared against a reference and accepted by the owner.

## Requirements

- Shrinking large photos into small cells must not look jagged.
- Sizes this browser cannot produce are reduced to the largest available, with a message, keeping the poster's shape.
- Exporting 100 large photos must not crash or freeze the tab.
- Export of very large posters on Safari, where the limit is lower than on Chrome and Firefox, is capped, not tiled (owner decision in the handoff plan; to be confirmed for Safari).
