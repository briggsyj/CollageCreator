# Spec 008: Best first layout, photo size requests, outer border, tidier controls

**Gate**: the first arrangement shown for a set of photos is the best of 30 tries; a photo that was asked to be bigger stays bigger; and the controls fit the sidebar at every width.

## User stories

- **P1** As a user, the first collage I see is the best the app can manage by default, so I do not have to keep pressing Regenerate: it tries 30 arrangements and keeps the one where the smallest share of the photos is cut off.
- **P1** As a user, Regenerate gives me exactly one new arrangement.
- **P1** As a user, I can ask for a photo to be bigger: wider (across two columns) or taller (two or three times the height). The rest of the collage is worked out around it, and photos I have asked for keep their size.
- **P1** As a user, I can turn the border around the whole collage off, to have lines only between the photos, or keep it for lines between and around.
- **P2** As a user, the seed is out of my way in a collapsible "Technical configuration" section, where other technical settings can go later.
- **P2** As a user, every control fits inside the sidebar at any window width; nothing sticks out.

## Requirements

- **Searching**: when the set of photos changes (photos added, removed, or a removal undone), 30 arrangements are generated and the best is kept. Everything else (Regenerate, typing a seed, changing the number of columns, asking for a photo's size) is one generation.
- **Best means**: first the fewest gaps (a hole is a visible flaw; a vanished photo counts as fully cut off), then the smallest average share of each photo that is cropped away. A note under the controls shows the average ("Cropped on average: N%").
- **Repeatable**: the seed shown is the winner's own, so typing it back gives the same layout in one generation. The same photos, seed, columns and requested sizes always give the same layout.
- **Size requests**: set on the selected photo with **Wider** (toggle), **Taller** (normal, ×2, ×3, back to normal) and **Normal size**. They are shown on the photo in the list, survive Regenerate, resizing the poster, other photos coming and going, and are respected in the search. A photo that asks to be wider needs two columns, so a collage with one has two. Wider/taller are requests: the layout does its best, and cropping can rise for that photo.
- **Outer border**: a checkbox, on by default. Off removes the border around the whole collage only; the lines between photos stay. It works with square and shaped photos, in the preview and the saved image alike. With shaped photos and no outer border, the corners at the edge of the poster show plain white.
- **Sidebar**: inputs fill the width they are given and may shrink; the width and height fields share their row; long file names are cut with an ellipsis; no horizontal overflow of the sidebar or the page from 340 px up.
- The border defaults to 0.5 % white with square corners (Spec 007).

## Out of scope

Choosing which neighbours a wider photo joins, sizes beyond two columns or three rows, changing a size by dragging.
