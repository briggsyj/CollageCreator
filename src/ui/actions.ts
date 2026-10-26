// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * Pull a sheet down by its head to put it away; a short pull springs back.
 * Put on the sheet's head; the sheet is its parent.
 */
export function pullToClose(head: HTMLElement, close: () => void): { destroy(): void } {
  const sheet = head.parentElement;
  let from: number | null = null;
  const reset = () => {
    from = null;
    sheet?.style.removeProperty("--drag");
  };
  const down = (e: PointerEvent) => {
    if ((e.target as Element).closest("button")) return;
    from = e.clientY;
    head.setPointerCapture(e.pointerId);
    sheet?.classList.remove("rise");
  };
  const move = (e: PointerEvent) => {
    if (from === null) return;
    sheet?.style.setProperty("--drag", `${Math.max(0, e.clientY - from)}px`);
  };
  const up = (e: PointerEvent) => {
    if (from === null) return;
    const pulled = e.clientY - from;
    reset();
    if (pulled > 60) close();
  };
  head.addEventListener("pointerdown", down);
  head.addEventListener("pointermove", move);
  head.addEventListener("pointerup", up);
  head.addEventListener("pointercancel", reset);
  return {
    destroy() {
      head.removeEventListener("pointerdown", down);
      head.removeEventListener("pointermove", move);
      head.removeEventListener("pointerup", up);
      head.removeEventListener("pointercancel", reset);
    },
  };
}

/** A listener that may call preventDefault (Svelte's own wheel listeners are passive). */
export function onWheel(
  node: HTMLElement,
  handler: (e: WheelEvent) => void,
): { update(next: (e: WheelEvent) => void): void; destroy(): void } {
  let current = handler;
  const listener = (e: WheelEvent) => current(e);
  node.addEventListener("wheel", listener, { passive: false });
  return {
    update(next) {
      current = next;
    },
    destroy() {
      node.removeEventListener("wheel", listener);
    },
  };
}

/**
 * Show `value` in a field. Svelte only writes a field when its expression changes, but a field
 * the person has typed into must go back to the stored value even if that did not change
 * (for example a size that was reduced to what the browser can make): `again` changes then.
 * With `sticky` the field is written only when `again` changes, so a slider being dragged is
 * not moved by the rounding of the value it just produced.
 */
export interface ShownValue {
  value: string;
  again?: unknown;
  sticky?: boolean;
}

export function showValue(
  node: HTMLInputElement | HTMLSelectElement,
  params: ShownValue,
): { update(next: ShownValue): void } {
  let last = params;
  node.value = params.value;
  return {
    update(next) {
      if (!(next.sticky && next.again === last.again)) node.value = next.value;
      last = next;
    },
  };
}
