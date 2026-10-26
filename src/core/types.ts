// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

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

/**
 * Which part of a photo shows in its cell. `zoom` 1 is the plain cover fit (the whole photo
 * filling the cell, the overflow cropped); more magnifies it. `x` and `y` say where the visible
 * window sits in the room the photo has to spare: 0 is the left / top edge, 1 the right / bottom
 * edge, 0.5 the middle. Because they are shares of the spare room, any value from 0 to 1 and any
 * zoom of 1 or more always covers the cell, whatever shape the cell has, so a crop survives a
 * new arrangement.
 */
export interface PhotoCrop {
  zoom: number;
  x: number;
  y: number;
}

export const NO_CROP: PhotoCrop = { zoom: 1, x: 0.5, y: 0.5 };

/** A photo as the layout sees it: its shape, and optionally the room it asks for. */
export interface LayoutPhoto extends PhotoSize {
  span?: PhotoSpan;
  /** Does not affect the arrangement: only what is shown inside the photo's cell. */
  crop?: PhotoCrop;
}

export interface Photo extends LayoutPhoto {
  /** Unique, stable id for the lifetime of the session. */
  id: string;
  /** File name, used in messages. */
  name: string;
}

export type ImageFormat = "png" | "jpeg";

/** Shape of each photo's corners: square, slightly rounded, or rounded. */
export type CornerStyle = "none" | "slight" | "rounded";

/** How photos are arranged: in columns of different heights, or in panels cut from the poster. */
export type LayoutStyle = "mosaic" | "gallery";

/**
 * What the app needs from an arrangement, whichever style made it. `Page` (Mosaic) and
 * `SlicingPage` (Gallery) both provide it.
 */
export interface LayoutPage {
  toLayout(): Layout;
  /** Swap the photos shown by the cells holding photo indexes `a` and `b`. */
  swapPhotos(a: number, b: number): void;
  /** Change the poster shape (height / width) without changing which photo is where. */
  setTargetRatio(ratio: number): void;
  /** Number of columns in use; only Mosaic has columns. */
  readonly noCols?: number;
}

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
  /**
   * 0 for an ordinary poster. Otherwise the collage is for a post of this many square images
   * (width = count × height) and is saved as that many files in a zip, left to right.
   */
  splitImages: number;
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
