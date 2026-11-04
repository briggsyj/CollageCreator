# PDF file contract

A file made by the app is a PDF 1.4 document:

- Starts with `%PDF-1.4` and ends with `%%EOF`.
- One catalog and one page tree; `/Count` equals the number of pages.
- Each page has a `/MediaBox [0 0 W H]` where W and H are the picture's pixels × 72 / 300 (two decimals), and one content stream that draws its picture over the whole box.
- Each picture is an image XObject with `/Filter /DCTDecode`, `/ColorSpace /DeviceRGB`, 8 bits, and the picture's pixel width and height. The JPEG bytes are the same as the app would save as a JPEG at the chosen quality.
- The cross-reference table lists every object with its exact byte offset, and `startxref` points to it.
- No text, fonts, scripts or links.

## WebMCP

`set_save_format` accepts `format: "pdf"`. For an Instagram post it is refused with code `not-supported` and a reason. `get_state` reports `save.format: "pdf"`; `save.last` reports the PDF's name and the number of pages in `images`.
