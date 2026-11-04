// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * A small PDF writer for pages that are each one JPEG picture. The picture's bytes are placed
 * in the file as they are (the PDF DCTDecode filter), so nothing is recompressed and no library
 * is needed. There is no text, no fonts and no scripts.
 */

export interface PdfPage {
  /** A JPEG with three colour components (what a canvas makes). */
  jpeg: Uint8Array;
  /** The picture's size in pixels. */
  width: number;
  height: number;
}

/** Pixels per inch: the print sizes are made at this, so they come out at paper size. */
export const PDF_DPI = 300;

/** A length in PDF points (1/72 inch) for a number of pixels, with at most two decimals. */
export function points(pixels: number): string {
  return String(Math.round(((pixels * 72) / PDF_DPI) * 100) / 100);
}

/** The bytes of a PDF file with one page per picture, in the order given. */
export function pdfBytes(pages: readonly PdfPage[]): Uint8Array {
  if (pages.length === 0) throw new Error("A PDF needs at least one page");
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const add = (part: Uint8Array | string) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    length += bytes.length;
  };
  /** Start object number `n` (they are written in order, 1 first). */
  const begin = (n: number) => {
    offsets[n] = length;
    add(`${n} 0 obj\n`);
  };

  // The second line holds bytes above 127 so tools treat the file as binary.
  add("%PDF-1.4\n");
  add(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const first = (i: number) => 3 + 3 * i;
  begin(1);
  add("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  begin(2);
  const kids = pages.map((_, i) => `${first(i)} 0 R`).join(" ");
  add(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((page, i) => {
    const w = points(page.width);
    const h = points(page.height);
    const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q\n`;
    begin(first(i));
    add(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
        `/Resources << /XObject << /Im0 ${first(i) + 2} 0 R >> >> ` +
        `/Contents ${first(i) + 1} 0 R >>\nendobj\n`,
    );
    begin(first(i) + 1);
    add(`<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
    begin(first(i) + 2);
    add(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ` +
        `/Length ${page.jpeg.length} >>\nstream\n`,
    );
    add(page.jpeg);
    add("\nendstream\nendobj\n");
  });

  const count = offsets.length; // object 0 is the free entry
  const table = offsets.map((o, n) => (n === 0 ? "" : `${String(o).padStart(10, "0")} 00000 n \n`));
  const xref = length;
  add(`xref\n0 ${count}\n0000000000 65535 f \n${table.join("")}`);
  add(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}
