# Data model: PDF export

## Save format

| Value  | File made                                                       |
| ------ | --------------------------------------------------------------- |
| `png`  | image, or zip of images                                         |
| `jpeg` | image, or zip of images                                         |
| `pdf`  | one PDF; never with an Instagram post (`splitImages` is 0 or 1) |

Validation: `format` is one of `png`, `jpeg`, `pdf`; any other value is read as `png`. When `splitImages > 1`, `pdf` is read as `png`.

## PdfPage (input to the writer)

| Field         | Rule                                               |
| ------------- | -------------------------------------------------- |
| jpeg          | the bytes of a JPEG image with 3 colour components |
| width, height | pixels of that image, whole numbers of 1 or more   |

Page size in points = pixels × 72 / 300, written with two decimals.

## File names

| Case                | Name                       |
| ------------------- | -------------------------- |
| One page            | `collage-<seed>.pdf`       |
| Several pages       | `book-<seed>.pdf`          |
| One page of several | `book-<seed>_page-<n>.pdf` |
