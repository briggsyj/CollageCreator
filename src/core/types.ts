// SPDX-License-Identifier: GPL-2.0-or-later

/** Pixel size of a photo after its EXIF orientation has been applied. */
export interface PhotoSize {
  width: number;
  height: number;
}

export interface Photo extends PhotoSize {
  /** Unique, stable id for the lifetime of the session. */
  id: string;
  /** File name, used in messages. */
  name: string;
}

export type ImageFormat = "png" | "jpeg";

export interface PosterSettings {
  /** Output width in pixels. */
  width: number;
  /** Output height in pixels. */
  height: number;
  /** Border thickness as a fraction of the longer poster side (0.01 = 1 %). */
  borderWidth: number;
  /** Any CSS colour. */
  borderColor: string;
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
