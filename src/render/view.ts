// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * Zoom and pan of the on-screen preview. All values are in CSS pixels and pure
 * functions of their arguments, so the geometry can be tested without a browser.
 *
 * `zoom` 1 means the poster fits the window ("fit"). `panX`/`panY` move the
 * poster away from the centre of the viewport.
 */

export interface View {
  zoom: number;
  panX: number;
  panY: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export const FIT_VIEW: View = { zoom: 1, panX: 0, panY: 0 };
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 8;

/** How much of the poster must stay inside the viewport, so it can never be lost off screen. */
const KEEP_VISIBLE = 48;

export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function isFit(view: View): boolean {
  return view.zoom === 1 && view.panX === 0 && view.panY === 0;
}

/** The poster's size on screen, given its size when it fits the window. */
export function posterSize(fit: Size, view: View): Size {
  return { w: fit.w * view.zoom, h: fit.h * view.zoom };
}

/** Where the poster's top-left corner is inside the viewport. */
export function posterOrigin(viewport: Size, fit: Size, view: View): Point {
  const p = posterSize(fit, view);
  return { x: (viewport.w - p.w) / 2 + view.panX, y: (viewport.h - p.h) / 2 + view.panY };
}

/** Keep part of the poster in view. */
export function clampPan(view: View, viewport: Size, fit: Size): View {
  const p = posterSize(fit, view);
  const keepX = Math.min(KEEP_VISIBLE, p.w / 2, viewport.w / 2);
  const keepY = Math.min(KEEP_VISIBLE, p.h / 2, viewport.h / 2);
  // origin.x must lie in [keepX - p.w, viewport.w - keepX]
  const minPanX = keepX - p.w - (viewport.w - p.w) / 2;
  const maxPanX = viewport.w - keepX - (viewport.w - p.w) / 2;
  const minPanY = keepY - p.h - (viewport.h - p.h) / 2;
  const maxPanY = viewport.h - keepY - (viewport.h - p.h) / 2;
  return {
    zoom: view.zoom,
    panX: Math.min(maxPanX, Math.max(minPanX, view.panX)),
    panY: Math.min(maxPanY, Math.max(minPanY, view.panY)),
  };
}

/** Move the poster by (dx, dy) screen pixels. */
export function panBy(view: View, dx: number, dy: number, viewport: Size, fit: Size): View {
  return clampPan({ ...view, panX: view.panX + dx, panY: view.panY + dy }, viewport, fit);
}

/**
 * Zoom by `factor`, keeping the point of the poster under `cursor` where it is,
 * so the collage grows or shrinks around the mouse.
 */
export function zoomAt(view: View, factor: number, cursor: Point, viewport: Size, fit: Size): View {
  const zoom = clampZoom(view.zoom * factor);
  const before = posterSize(fit, view);
  const origin = posterOrigin(viewport, fit, view);
  // The cursor's place on the poster as a fraction of its width and height.
  const u = (cursor.x - origin.x) / before.w;
  const v = (cursor.y - origin.y) / before.h;
  const after = posterSize(fit, { ...view, zoom });
  const x = cursor.x - u * after.w;
  const y = cursor.y - v * after.h;
  return clampPan(
    { zoom, panX: x - (viewport.w - after.w) / 2, panY: y - (viewport.h - after.h) / 2 },
    viewport,
    fit,
  );
}

export function zoomPercent(view: View): number {
  return Math.round(view.zoom * 100);
}
