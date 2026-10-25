// SPDX-License-Identifier: GPL-2.0-or-later

/**
 * Sizes to pass through when shrinking an image: halve until the next halving
 * would go below the target, then land on the target. Shrinking in one step by
 * a large factor makes some browsers alias (harsh, jagged results).
 */
export function halvingSteps(
  width: number,
  height: number,
  targetW: number,
  targetH: number,
): { width: number; height: number }[] {
  const steps: { width: number; height: number }[] = [];
  let w = width;
  let h = height;
  while (Math.floor(w / 2) >= targetW && Math.floor(h / 2) >= targetH) {
    w = Math.floor(w / 2);
    h = Math.floor(h / 2);
    steps.push({ width: w, height: h });
  }
  if (w !== targetW || h !== targetH) steps.push({ width: targetW, height: targetH });
  return steps;
}

type Source = ImageBitmap | OffscreenCanvas;

/** Shrink `source` to the target size via successive halvings. Does not close `source`. */
export function downscale(source: Source, targetW: number, targetH: number): OffscreenCanvas {
  let current: Source = source;
  for (const step of halvingSteps(source.width, source.height, targetW, targetH)) {
    const next = new OffscreenCanvas(step.width, step.height);
    const ctx = next.getContext("2d");
    if (!ctx) throw new Error("2D canvas is not available");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, step.width, step.height);
    current = next;
  }
  if (current === source) {
    const copy = new OffscreenCanvas(targetW, targetH);
    copy.getContext("2d")?.drawImage(source, 0, 0, targetW, targetH);
    return copy;
  }
  return current as OffscreenCanvas;
}
