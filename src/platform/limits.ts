// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 briggsyj and contributors

import canvasSize from "canvas-size";

export interface CanvasLimits {
  /** Longest side a canvas can have, in pixels. */
  maxSide: number;
  /** Largest canvas area, in pixels. */
  maxArea: number;
}

/** Used until (or unless) detection succeeds. Deliberately low: iOS Safari allows about 4096 x 4096. */
export const FALLBACK_LIMITS: CanvasLimits = { maxSide: 4096, maxArea: 4096 * 4096 };

/** Measure what this browser can really allocate; browsers differ a lot. */
export async function detectLimits(): Promise<CanvasLimits> {
  try {
    const [area, width, height] = await Promise.all([
      canvasSize.maxArea(),
      canvasSize.maxWidth(),
      canvasSize.maxHeight(),
    ]);
    if (!area.success) return FALLBACK_LIMITS;
    return {
      maxArea: area.width * area.height,
      maxSide: Math.max(
        Math.min(width.success ? width.width : 0, height.success ? height.height : 0),
        area.width,
      ),
    };
  } catch {
    return FALLBACK_LIMITS;
  }
}

export interface ClampResult {
  width: number;
  height: number;
  clamped: boolean;
}

/** Shrink a requested size, keeping its shape, until it fits the limits. */
export function clampSize(width: number, height: number, limits: CanvasLimits): ClampResult {
  const factor = Math.min(
    1,
    limits.maxSide / Math.max(width, height),
    Math.sqrt(limits.maxArea / (width * height)),
  );
  if (factor >= 1) return { width, height, clamped: false };
  return {
    width: Math.max(1, Math.floor(width * factor)),
    height: Math.max(1, Math.floor(height * factor)),
    clamped: true,
  };
}
