// SPDX-License-Identifier: GPL-2.0-or-later

/** Pixel size of a photo after its EXIF orientation has been applied. */
export interface PhotoSize {
  width: number;
  height: number;
}

/**
 * How much room a photo asks for. `columns: 2` makes it span two columns;
 * `rows` makes its cell that many times taller than its natural shape would be
 * (the rest of the collage adjusts around it).
 */
export interface PhotoSpan {
  columns: 1 | 2;
  rows: 1 | 2 | 3;
}

export const NO_SPAN: PhotoSpan = { columns: 1, rows: 1 };

/** A photo as the layout sees it: its shape, and optionally the room it asks for. */
export interface LayoutPhoto extends PhotoSize {
  span?: PhotoSpan;
}

export interface Photo extends LayoutPhoto {
  /** Unique, stable id for the lifetime of the session. */
  id: string;
  /** File name, used in messages. */
  name: string;
}

export type ImageFormat = "png" | "jpeg";

/** Shape of each photo's corners: square, slightly rounded, rounded, or an ellipse touching all four sides. */
export type CornerStyle = "none" | "slight" | "rounded" | "circle";

export interface PosterSettings {
  /** Output width in pixels. */
  width: number;
  /** Output height in pixels. */
  height: number;
  /** Border thickness as a fraction of the longer poster side (0.005 = 0.5 %). */
  borderWidth: number;
  /** Any CSS colour. */
  borderColor: string;
  /** How the photos' corners are shaped. "none" keeps square photos with the border drawn over them. */
  cornerStyle: CornerStyle;
  /** Draw the border around the whole collage too, not only between photos. */
  outerBorder: boolean;
  format: ImageFormat;
  /** 0..1, used for JPEG only. */
  jpegQuality: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One photo placed in the layout. Coordinates are in page units: the page is 1 wide. */
export interface Placement {
  /** Index into the photo list given to the layout generator. */
  photoIndex: number;
  /** The cell the photo is shown in. Cells tile the page exactly. */
  cell: Rect;
}

export interface Layout {
  /** Page width in layout units; always 1. */
  width: 1;
  /** Page height in layout units: the poster height / width ratio. */
  height: number;
  placements: Placement[];
}
