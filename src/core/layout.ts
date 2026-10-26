// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2014 Adrien Vergé
// Copyright (C) 2026 John Briggs
//
// This file is part of Collage Creator, a modified version of PhotoCollage
// (https://github.com/adrienverge/PhotoCollage). It was CHANGED on 2026-10-25:
// it is a TypeScript port of photocollage/collage.py and of the layout setup
// in UserCollage.make_page (photocollage/gtkgui.py). Changes: translated from
// Python to TypeScript; the random source is injected so layouts are
// reproducible from a seed; a photo can ask to span two columns or to be taller;
// Page.scale/scale_to_fit, Cell.content_coords and
// Photo.move were not ported (the renderer does cover-cropping itself); the
// column count is clamped to at least 1.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import { type Rng, shuffle } from "./rng";
import type { Layout, LayoutPhoto, PhotoSize } from "./types";

/*
Summary of collage objects (from the original):

A "Page" represents the whole poster. It is divided into columns. Each column
contains cells. When a cell is located in several columns, its "extended" flag
is set, and a CellExtent object is added to the column on the right to reserve
the place. Each cell is associated to a photo.

The layout placing process is divided in three phases.

Phase A: Fill columns with photos.
  Photos are added to columns, one by one, until there are no more photos.
  Each new photo is put in the smallest column, so as to have balanced
  columns. If two columns have approximately the same height, a photo can be
  "extended" to fit two columns. In this case, the "Cell" object is put in
  the first column, and the second column takes a "CellExtent" object to
  reserve the taken space.

Phase B: Set all columns to same height.
  A global common height is computed for all columns, and every of them is
  stressed or extended to this common length. This can result in a decrease
  or increase in columns' width.

Phase C: Adapt columns' width.
  Since cells in a column may have different widths, each column width is set
  to the smallest width amongst its images.
*/

/** The part of a photo the layout needs: its position in the caller's list and its shape. */
class PagePhoto {
  constructor(
    public index: number,
    public readonly ratio: number,
    /** The user asked for this photo to span two columns. */
    public readonly forceSpan = false,
  ) {}
}

abstract class CellBase {
  abstract readonly parents: Column[];
  abstract readonly photo: PagePhoto;
  abstract readonly y: number;
  abstract readonly h: number;
  abstract scale(alpha: number): void;
  abstract isExtension(): this is CellExtent;

  get x(): number {
    return (this.parents[0] as Column).x;
  }

  get w(): number {
    return this.parents.reduce((sum, c) => sum + c.w, 0);
  }

  get ratio(): number {
    return this.h / this.w;
  }

  get wantedRatio(): number {
    return this.photo.ratio;
  }

  /** The cell above this one in its column. */
  topNeighbor(): AnyCell | undefined {
    let prev: AnyCell | undefined;
    for (const c of (this.parents[0] as Column).cells) {
      if ((this as CellBase) === c) return prev;
      prev = c;
    }
    return undefined;
  }

  /** The cell below this one in its column. */
  bottomNeighbor(): AnyCell | undefined {
    let prev: AnyCell | undefined;
    const cells = (this.parents[0] as Column).cells;
    for (let i = cells.length - 1; i >= 0; i--) {
      const c = cells[i] as AnyCell;
      if ((this as CellBase) === c) return prev;
      prev = c;
    }
    return undefined;
  }
}

/** A cell in a column, holding one photo. */
class Cell extends CellBase {
  parents: Column[];
  photo: PagePhoto;
  extent: CellExtent | null = null;
  h: number;

  constructor(parents: Column[], photo: PagePhoto) {
    super();
    this.parents = parents;
    this.photo = photo;
    this.h = this.w * this.wantedRatio;
  }

  /** Cell's y coordinate. It assumes a single column: the previous cell's y + h. */
  get y(): number {
    let prev: AnyCell | undefined;
    for (const c of (this.parents[0] as Column).cells) {
      if ((this as CellBase) === c) return prev ? prev.y + prev.h : 0;
      prev = c;
    }
    throw new Error("cell is not in its parent column");
  }

  scale(alpha: number): void {
    this.h *= alpha;
  }

  isExtension(): this is CellExtent {
    return false;
  }

  toString(): string {
    return `[${Math.trunc(this.w)} ${Math.trunc(this.h)}${this.extent ? "--" : "]"}`;
  }
}

/** Reserves, in the column on the right, the space taken by an extended cell. */
class CellExtent extends CellBase {
  constructor(readonly origin: Cell) {
    super();
    origin.extent = this;
  }

  get parents(): Column[] {
    return [this.origin.parents[1] as Column];
  }

  get photo(): PagePhoto {
    return this.origin.photo;
  }

  get y(): number {
    return this.origin.y;
  }

  get h(): number {
    return this.origin.h;
  }

  scale(): void {}

  isExtension(): this is CellExtent {
    return true;
  }

  toString(): string {
    return "------]";
  }
}

type AnyCell = Cell | CellExtent;

class Column {
  readonly cells: AnyCell[] = [];

  constructor(
    readonly parent: Page,
    public w: number,
  ) {}

  /** Total height. Not simply the sum of the cells' heights: there can be holes. */
  get h(): number {
    const last = this.cells[this.cells.length - 1];
    return last ? last.y + last.h : 0;
  }

  get x(): number {
    let x = 0;
    for (const c of this.parent.cols) {
      if (this === c) break;
      x += c.w;
    }
    return x;
  }

  scale(alpha: number): void {
    this.w *= alpha;
    for (const c of this.cells) c.scale(alpha);
  }

  leftNeighbor(): Column | undefined {
    let prev: Column | undefined;
    for (const c of this.parent.cols) {
      if (this === c) return prev;
      prev = c;
    }
    return undefined;
  }

  rightNeighbor(): Column | undefined {
    let prev: Column | undefined;
    const cols = this.parent.cols;
    for (let i = cols.length - 1; i >= 0; i--) {
      const c = cols[i] as Column;
      if (this === c) return prev;
      prev = c;
    }
    return undefined;
  }

  /** Set the column's height to a given value by resizing cells. */
  adjustHeight(targetH: number): void {
    // First, make groups of "movable" cells. Since cell extents are not
    // movable, these groups only contain pure cell objects. We only resize
    // those groups.
    interface Group {
      y: number;
      h: number;
      cells: Cell[];
    }
    const groups: Group[] = [{ y: 0, h: 0, cells: [] }];
    for (const c of this.cells) {
      const current = groups[groups.length - 1] as Group;
      // While a cell extent is not reached, keep adding cells to the group
      if (!c.isExtension()) {
        current.cells.push(c);
      } else {
        // Close current group and create a new one
        current.h = c.y - current.y;
        groups.push({ y: c.y + c.h, h: 0, cells: [] });
      }
    }
    const lastGroup = groups[groups.length - 1] as Group;
    lastGroup.h = targetH - lastGroup.y;

    // Adjust height for each group independently
    for (const group of groups) {
      if (group.cells.length === 0) continue;
      const alpha = group.h / group.cells.reduce((sum, c) => sum + c.h, 0);
      for (const c of group.cells) c.h = c.h * alpha;
    }
  }
}

/** Python's round(): halves go to the even neighbour. */
function roundHalfEven(x: number): number {
  const r = Math.round(x);
  return Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r;
}

/** The whole poster. `width` is 1 in layout units; `targetRatio` is height / width. */
export class Page {
  readonly cols: Column[] = [];

  constructor(
    w: number,
    public targetRatio: number,
    noCols: number,
    private readonly rng: Rng,
  ) {
    const colW = w / noCols;
    for (let i = 0; i < noCols; i++) this.cols.push(new Column(this, colW));
  }

  get noCols(): number {
    return this.cols.length;
  }

  get w(): number {
    return this.cols.reduce((sum, c) => sum + c.w, 0);
  }

  get h(): number {
    return Math.max(0, ...this.cols.map((c) => c.h));
  }

  /** ASCII art of the page, used by the unit tests. */
  toString(): string {
    const lines: string[] = [];
    let n = 0;
    let end = false;
    while (!end) {
      lines.push("");
      end = true;
      for (const col of this.cols) {
        const cells = col.cells.map((c) => c.toString());
        const rows = cells.length ? cells : [""];
        let w = Math.max(...rows.map((c) => c.length));
        if (col !== this.cols[this.cols.length - 1]) w += 1;
        let cell = " ".repeat(w);
        const row = rows[n];
        if (row !== undefined) {
          cell = row + " ".repeat(w - row.length);
          if (n < rows.length - 1) end = false;
        }
        lines[lines.length - 1] += cell;
      }
      n++;
    }
    return lines.join("\n");
  }

  /** The column with lowest height. */
  nextFreeCol(): Column {
    const minimum = Math.min(...this.cols.map((c) => c.h));
    return this.rng.choice(this.cols.filter((c) => c.h === minimum));
  }

  addCellSingleCol(col: Column, photo: PagePhoto): void {
    col.cells.push(new Cell([col], photo));
  }

  /**
   * Whether two neighbouring columns can be joined by one cell without leaving a hole: they are
   * level, or the shorter one ends in a plain cell that can be stretched to meet the taller.
   */
  canJoin(a: Column, b: Column): boolean {
    const [short, tall] = a.h <= b.h ? [a, b] : [b, a];
    if (tall.h - short.h < 1e-9) return true;
    const last = short.cells[short.cells.length - 1];
    return last instanceof Cell && last.extent === null;
  }

  /** Stretch the shorter column's last cell so both columns end at the same height. */
  private level(a: Column, b: Column): void {
    const [short, tall] = a.h <= b.h ? [a, b] : [b, a];
    const last = short.cells[short.cells.length - 1];
    if (last instanceof Cell && last.extent === null) last.h += tall.h - short.h;
  }

  addCellMultiCol(col1: Column, col2: Column, photo: PagePhoto): void {
    this.level(col1, col2);
    const cell = new Cell([col1, col2], photo);
    const extent = new CellExtent(cell);
    col1.cells.push(cell);
    col2.cells.push(extent);
  }

  /** Add a new cell in the best computed place; make it span two columns if worth it. */
  addCell(photo: PagePhoto): void {
    const col = this.nextFreeCol();
    const left = col.leftNeighbor();
    const right = col.rightNeighbor();
    if (photo.forceSpan) {
      // Asked for: span two columns whatever the usual rule says, with the neighbour whose
      // height is closest so the mismatch to absorb is as small as possible.
      // One that can be joined without a hole is preferred.
      const neighbours = [left, right].filter((c): c is Column => c !== undefined);
      neighbours.sort(
        (a, b) =>
          Number(this.canJoin(col, b)) - Number(this.canJoin(col, a)) ||
          Math.abs(col.h - a.h) - Math.abs(col.h - b.h),
      );
      const chosen = neighbours[0];
      if (chosen !== undefined) {
        if (chosen === left) this.addCellMultiCol(chosen, col, photo);
        else this.addCellMultiCol(col, chosen, photo);
        return;
      }
    }
    if (2 * this.rng.random() > photo.ratio) {
      if (left && Math.abs(col.h - left.h) < 0.5 * col.w && this.canJoin(left, col)) {
        this.addCellMultiCol(left, col, photo);
        return;
      }
      if (right && Math.abs(col.h - right.h) < 0.5 * col.w && this.canJoin(col, right)) {
        this.addCellMultiCol(col, right, photo);
        return;
      }
    }
    this.addCellSingleCol(col, photo);
  }

  removeEmptyCols(): void {
    for (let i = this.cols.length - 1; i >= 0; i--) {
      if ((this.cols[i] as Column).cells.length === 0) this.cols.splice(i, 1);
    }
  }

  /**
   * Remove holes created by extended cells, at the bottom of columns.
   *
   * Case A: the bottom cell is below an extended cell and has no neighbour
   * under the latter, so it is extended to fill the hole.
   * Case B: the bottom cell is extended too and should be moved under the other
   * extended cell above it.
   */
  removeBottomHoles(): void {
    // A move can open a hole in a column already visited, so go over the columns again until none.
    for (let pass = 0; pass <= this.cols.length && this.removeBottomHolesPass(); pass++);
  }

  /** One pass over the columns; whether anything was moved. */
  private removeBottomHolesPass(): boolean {
    let changed = false;
    for (const col of this.cols) {
      const cell = col.cells[col.cells.length - 1];
      if (!cell || cell === col.cells[0]) continue;
      const top = cell.topNeighbor();
      const left = col.leftNeighbor() as Column;
      const right = col.rightNeighbor() as Column;

      if (cell instanceof Cell && !cell.extent) {
        if (top instanceof Cell && top.extent && top.extent.bottomNeighbor() === undefined) {
          // Case A1: extend cell to right
          right.cells.push(new CellExtent(cell));
          cell.parents = [col, right];
          changed = true;
        } else if (top instanceof CellExtent && top.origin.bottomNeighbor() === undefined) {
          // Case A2: extend cell to left
          col.cells.splice(col.cells.indexOf(cell), 1);
          left.cells.push(cell);
          col.cells.push(new CellExtent(cell));
          cell.parents = [left, col];
          changed = true;
        }
      } else if (
        cell instanceof Cell &&
        cell.extent &&
        cell.extent.bottomNeighbor() === undefined
      ) {
        const extent = cell.extent;
        const extentTop = extent.topNeighbor();
        if (
          extentTop instanceof Cell &&
          extentTop.extent &&
          extentTop.extent.bottomNeighbor() === undefined
        ) {
          // Case B1: move cell to right
          const rightRight = right.rightNeighbor() as Column;
          col.cells.splice(col.cells.indexOf(cell), 1);
          right.cells.splice(right.cells.indexOf(extent), 1);
          right.cells.push(cell);
          rightRight.cells.push(extent);
          cell.parents = [right, rightRight];
          changed = true;
        } else if (top instanceof CellExtent && top.origin.bottomNeighbor() === undefined) {
          // Case B2: move cell to left
          col.cells.splice(col.cells.indexOf(cell), 1);
          right.cells.splice(right.cells.indexOf(extent), 1);
          left.cells.push(cell);
          col.cells.push(extent);
          cell.parents = [left, col];
          changed = true;
        }
      }
    }
    return changed;
  }

  /** Set all columns' heights to the same value (width * target ratio). */
  adjustColsHeights(): void {
    const targetH = this.w * this.targetRatio;
    for (const c of this.cols) c.adjustHeight(targetH);
  }

  adjust(): void {
    this.removeEmptyCols();
    this.removeBottomHoles();
    // Moving a cell (cases B1, B2) can leave a column empty.
    this.removeEmptyCols();
    this.adjustColsHeights();
  }

  /** Change the poster shape without changing which photo is where. */
  setTargetRatio(ratio: number): void {
    this.targetRatio = ratio;
    this.adjustColsHeights();
  }

  /** Swap the photos shown by the cells holding photo indexes `a` and `b`. */
  swapPhotos(a: number, b: number): void {
    const cells = this.photoCells();
    const cellA = cells.find((c) => c.photo.index === a);
    const cellB = cells.find((c) => c.photo.index === b);
    if (!cellA || !cellB) return;
    [cellA.photo, cellB.photo] = [cellB.photo, cellA.photo];
  }

  private photoCells(): Cell[] {
    return this.cols.flatMap((col) => col.cells.filter((c): c is Cell => !c.isExtension()));
  }

  /**
   * Plain data describing the current arrangement, scaled so the page is 1
   * wide (the original does this with Page.scale_to_fit when drawing; empty
   * columns removed by `adjust` leave the raw page narrower than 1).
   */
  toLayout(): Layout {
    const s = this.w > 0 ? 1 / this.w : 1;
    return {
      width: 1,
      height: this.targetRatio,
      placements: this.photoCells().map((c) => ({
        photoIndex: c.photo.index,
        cell: { x: c.x * s, y: c.y * s, w: c.w * s, h: c.h * s },
      })),
    };
  }
}

/** The most columns a layout may be asked for. */
export const MAX_COLUMNS = 100;

/**
 * The original's heuristic for how many columns suit these photos and this
 * poster shape: inversely proportional to the square root of the poster ratio
 * and proportional to the square root of the average photo ratio and of the
 * number of photos. (Ported from UserCollage.make_page.)
 */
export function autoColumns(photos: readonly PhotoSize[], posterRatio: number): number {
  const n = photos.length;
  if (n === 0) return 1;
  const avgRatio = photos.reduce((sum, p) => sum + p.height / p.width, 0) / n;
  // Virtual number of images: since ~ 1 image over 3 is in a multi-cell (i.e.
  // takes two columns), it takes the space of 4 images. So it's equivalent to
  // 1/3 * 4 + 2/3 = 2 times the number of images.
  const virtualNoImgs = 2 * n;
  return Math.max(1, roundHalfEven(Math.sqrt((avgRatio / posterRatio) * virtualNoImgs)));
}

/** Whole number of columns in 1..MAX_COLUMNS, or undefined (automatic) if `value` is not a usable number. */
export function normaliseColumns(value: number | undefined | null): number | undefined {
  if (value === undefined || value === null || !Number.isFinite(value)) return undefined;
  return Math.min(MAX_COLUMNS, Math.max(1, Math.floor(value)));
}

export interface LayoutOptions {
  /**
   * Number of columns to use instead of the automatic choice. Fewer columns
   * give larger photos in tall stacks, more give a finer grid. Columns that end
   * up empty are dropped, so the result can have fewer (a photo may also span
   * two columns). Values are rounded down and kept within 1..MAX_COLUMNS.
   */
  columns?: number;
}

/**
 * Build a collage page for the given photos (sizes after EXIF orientation).
 * `posterRatio` is poster height / width. The same photos, ratio, options and
 * rng sequence always give the same page.
 */
export function generateLayout(
  photos: readonly LayoutPhoto[],
  posterRatio: number,
  rng: Rng,
  options: LayoutOptions = {},
): Page {
  const n = photos.length;
  if (n === 0) return new Page(1, posterRatio, 1, rng);

  let noCols = normaliseColumns(options.columns) ?? autoColumns(photos, posterRatio);
  // A photo that asks to span two columns needs at least two.
  if (photos.some((p) => p.span?.columns === 2)) noCols = Math.max(noCols, 2);
  // A photo that asks for more height gets a cell that many times taller than its shape implies.
  const ratios = photos.map((p) => (p.height / p.width) * (p.span?.rows ?? 1));

  const page = new Page(1, posterRatio, noCols, rng);
  const order = ratios.map((_, i) => i);
  shuffle(order, rng);
  for (const i of order) {
    page.addCell(new PagePhoto(i, ratios[i] as number, photos[i]?.span?.columns === 2));
  }
  page.adjust();
  return page;
}

/** For tests: build a page and add cells with explicit ratios, bypassing the shuffle. */
export function pagePhoto(index: number, ratio: number): PagePhoto {
  return new PagePhoto(index, ratio);
}
