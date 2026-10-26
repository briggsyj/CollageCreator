// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/** How many blocks the backdrop has: a fixed grid of 4 x 3. */
export const BACKDROP_CELLS = 12;

export function createBackdrop(root: HTMLElement): HTMLElement[] {
  const cells: HTMLElement[] = [];
  for (let i = 0; i < BACKDROP_CELLS; i++) {
    const cell = document.createElement("i");
    root.append(cell);
    cells.push(cell);
  }
  return cells;
}

/**
 * The colour of each block: the photos' average colours in the order the photos were added,
 * starting again from the first when there are fewer photos than blocks. It depends on
 * nothing else, so shuffling the layout, resizing the poster or changing columns never
 * changes it. With no photos the blocks fall back to the theme's neutral colours.
 */
export function backdropColours(photoColours: readonly string[]): (string | undefined)[] {
  return Array.from({ length: BACKDROP_CELLS }, (_, i) =>
    photoColours.length === 0 ? undefined : photoColours[i % photoColours.length],
  );
}

export function updateBackdrop(
  cells: readonly HTMLElement[],
  photoColours: readonly string[],
): void {
  const colours = backdropColours(photoColours);
  cells.forEach((cell, i) => {
    const colour = colours[i];
    if (colour) cell.style.setProperty("--c", colour);
    else cell.style.removeProperty("--c");
  });
}
