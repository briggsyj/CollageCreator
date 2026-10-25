# Spec 011: Instagram post (one collage, several square images)

**Gate**: a collage made for a post can be previewed as one picture with its cut marks, and saved as a zip of square images that fit back together in order.

## User stories

- **P1** As a user, I choose the "Instagram post" size and the number of images, and get one wide collage whose size and shape follow from that.
- **P1** As a user, I see in the preview where the collage will be cut.
- **P1** As a user, saving gives me a zip of square images that I can upload in order.
- **P2** As a user, I can still set the number of columns myself.

## Requirements

- Instagram post is a size button in Poster. It sets the number of images (2 to 20, 3 at first) and the size of each square image (1080 px at first, the size Instagram recommends). The collage is `images × size` wide and `size` high; Width and Height are shown but locked.
- The automatic column count uses that shape; changing the number of images makes a new arrangement (the best of 30, as when photos change). Columns can still be set by hand. The size of each image does not change the arrangement.
- The preview is one collage. Border settings are unchanged. For each cut there is a thin dashed vertical line above and below the poster, outside it, with scissors in the line, and one note beside the first cut saying the collage is split there. The same is said in text under the preview. The marks are not part of any saved image.
- Save gives `collage-<seed>.zip` with `collage-<seed>_1.png` ... from the leftmost image to the rightmost (`.jpg` for JPEG). With ten or more images the numbers are padded (`_01`) so they sort correctly.
- The choice is kept over a refresh. Any other size button leaves the post mode.
- A size the browser cannot make is reduced (the image size shrinks, the count stays).

## Notes

- Photos can sit across a cut; the collage is not arranged around the cuts.
- Instagram does not read file names. Its app keeps the order in which you tap the pictures; pickers on a computer or phone files app usually sort by name, so numbering from the leftmost works. On an iPhone the Photos app orders by date, so select them in order.

## Out of scope

Keeping photos from crossing a cut; videos; Instagram's other sizes (4:5 and 9:16 posts).
