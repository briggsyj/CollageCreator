# Saving

The Save panel (bottom right; the **Save** tab on a phone) shows what will be saved, for example
"PNG, 1600 × 1200 px" or "PDF of 3 pages".

## Formats

| Format   | Best for                   | Notes                                                           |
| -------- | -------------------------- | --------------------------------------------------------------- |
| **PNG**  | exact colours, sharp edges | larger files                                                    |
| **JPEG** | smaller files, sharing     | a **Quality** slider (10–100%)                                  |
| **PDF**  | printing, documents        | a page per collage page, at paper size; uses the Quality slider |

A **PDF** page is the output size at 300 pixels per inch, so A4 comes out as a 297 × 210 mm page
that prints at full size, and a 1600 × 1200 screen size gives a page of about 5.3 × 4 inches. PDF
is hidden for an Instagram post.

## What you get

| Collage                                      | PNG / JPEG                                            | PDF                        |
| -------------------------------------------- | ----------------------------------------------------- | -------------------------- |
| One page                                     | `collage-<seed>.png`                                  | `collage-<seed>.pdf`       |
| Several pages                                | `book-<seed>.zip` with `book-<seed>_1.png`, `_2`, ... | `book-<seed>.pdf`          |
| One page of several (the pill's save button) | `book-<seed>_page-<n>.png`                            | `book-<seed>_page-<n>.pdf` |
| Instagram post                               | `collage-<seed>.zip` with `collage-<seed>_1.png` ...  | not offered                |
| Several pages of posts                       | `book-<seed>.zip` with `book-<seed>_p1_1.png` ...     | not offered                |

Empty pages are skipped, with a notice. A book with photos on only one page saves that one image
rather than a zip.

## Progress and cancelling

Saving shows its progress and can be cancelled. Big sizes and many photos take longer, since every
photo is decoded at full size; the app keeps only a few in memory at once.
