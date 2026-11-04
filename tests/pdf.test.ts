// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { describe, expect, it } from "vitest";
import { type PdfPage, pdfBytes, points } from "../src/io/pdf";

/** A few bytes that start and end like a JPEG; the writer does not look inside. */
const jpeg = (n = 40): Uint8Array =>
  Uint8Array.from({ length: n }, (_, i) => (i === 0 ? 0xff : i === 1 ? 0xd8 : (i * 37) % 256));

const page = (width: number, height: number, bytes = jpeg()): PdfPage => ({
  jpeg: bytes,
  width,
  height,
});

const text = (bytes: Uint8Array) => new TextDecoder("latin1").decode(bytes);

describe("pdfBytes", () => {
  it("starts as a PDF and ends with the end marker", () => {
    const s = text(pdfBytes([page(100, 100)]));
    expect(s.startsWith("%PDF-1.4\n")).toBe(true);
    expect(s.endsWith("%%EOF\n")).toBe(true);
  });

  it("sizes pages at 300 pixels per inch: A4 is 841.92 x 595.2 points", () => {
    const s = text(pdfBytes([page(3508, 2480), page(1600, 1200)]));
    expect(s).toContain("/MediaBox [0 0 841.92 595.2]");
    expect(s).toContain("/MediaBox [0 0 384 288]");
    expect(points(2480)).toBe("595.2");
    // 297 mm is 841.89 points: the A4 size is within 0.1 mm.
    expect((Math.abs(Number(points(3508)) - (297 / 25.4) * 72) / 72) * 25.4).toBeLessThan(0.1);
  });

  it("counts its pages and lists them in order", () => {
    const s = text(pdfBytes([page(10, 10), page(20, 20), page(30, 30)]));
    expect(s).toContain("/Count 3");
    expect(s).toContain("/Kids [3 0 R 6 0 R 9 0 R]");
    const widths = [...s.matchAll(/\/Subtype \/Image \/Width (\d+)/g)].map((m) => Number(m[1]));
    expect(widths).toEqual([10, 20, 30]);
  });

  it("points every cross-reference entry at its object, and startxref at the table", () => {
    const bytes = pdfBytes([page(10, 10), page(20, 20)]);
    const s = text(bytes);
    const start = Number(/startxref\n(\d+)\n/.exec(s)?.[1]);
    expect(s.slice(start, start + 4)).toBe("xref");
    const entries = [...s.slice(start).matchAll(/(\d{10}) 00000 n /g)].map((m) => Number(m[1]));
    expect(entries).toHaveLength(2 * 3 + 2);
    entries.forEach((offset, i) => {
      expect(s.slice(offset).startsWith(`${i + 1} 0 obj\n`)).toBe(true);
    });
    expect(s).toContain(`/Size ${entries.length + 1}`);
  });

  it("keeps the picture's bytes unchanged, with the right length", () => {
    const picture = jpeg(500);
    const bytes = pdfBytes([page(5, 5, picture)]);
    const s = text(bytes);
    expect(s).toContain("/Filter /DCTDecode /Length 500 >>");
    const at = s.indexOf("stream\n", s.indexOf("/DCTDecode")) + "stream\n".length;
    expect(Array.from(bytes.slice(at, at + 500))).toEqual(Array.from(picture));
    expect(s.slice(at + 500, at + 500 + 17)).toBe("\nendstream\nendobj");
  });

  it("refuses a file with no pages", () => {
    expect(() => pdfBytes([])).toThrow();
  });

  it("writes a long book", () => {
    const s = text(pdfBytes(Array.from({ length: 20 }, () => page(100, 80))));
    expect(s).toContain("/Count 20");
  });
});
