// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/**
 * Pull a sheet down by its head to put it away; a short pull springs back.
 * Put on the sheet's head; the sheet is its parent.
 */
export function pullToClose(head: HTMLElement, close: () => void): { destroy(): void } {
  const sheet = head.parentElement;
  let from: number | null = null;
  /** The latest pull, applied once a frame: setting it on every move restyles the glass sheet. */
  let pull = 0;
  let frame = 0;
  const reset = () => {
    from = null;
    cancelAnimationFrame(frame);
    frame = 0;
    sheet?.classList.remove("pulling");
    sheet?.style.removeProperty("--drag");
  };
  const down = (e: PointerEvent) => {
    if ((e.target as Element).closest("button")) return;
    from = e.clientY;
    head.setPointerCapture(e.pointerId);
    sheet?.classList.remove("rise");
    sheet?.classList.add("pulling");
  };
  const move = (e: PointerEvent) => {
    if (from === null) return;
    pull = Math.max(0, e.clientY - from);
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      if (from !== null) sheet?.style.setProperty("--drag", `${pull}px`);
    });
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

/** What a touch drag reports to the page that uses it. */
export interface TouchDragHandlers {
  /** The finger has been held still long enough: the drag begins here. Return false to refuse. */
  start(x: number, y: number): boolean;
  move(x: number, y: number): void;
  /** The finger was lifted where the drag ended (or the drag was cancelled: `dropped` false). */
  end(x: number, y: number, dropped: boolean): void;
}

/** How long a finger stays still on a photo before it can be dragged. */
const HOLD_MS = 350;
/** Moving further than this before then is a scroll, not a drag. */
const HOLD_SLOP = 8;

/**
 * Drag with a finger: press and hold, then move. Browsers do not offer HTML drag and drop for
 * touch, so the Photos step uses this on phones. Before the hold the list scrolls as usual;
 * once the drag has begun, scrolling stops until the finger is lifted, and the click that
 * follows the lift is swallowed so the photo is not also selected.
 */
export function touchDrag(
  node: HTMLElement,
  handlers: TouchDragHandlers,
): { update(h: TouchDragHandlers): void; destroy(): void } {
  let h = handlers;
  let timer = 0;
  let start: { x: number; y: number; id: number } | null = null;
  let dragging = false;
  let swallowClick = false;
  let last = { x: 0, y: 0 };

  const clear = () => {
    clearTimeout(timer);
    start = null;
  };
  const down = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    last = { x: e.clientX, y: e.clientY };
    timer = window.setTimeout(() => {
      if (!start) return;
      dragging = h.start(last.x, last.y);
      if (dragging) navigator.vibrate?.(10);
    }, HOLD_MS);
  };
  const move = (e: PointerEvent) => {
    if (!start || e.pointerId !== start.id) return;
    last = { x: e.clientX, y: e.clientY };
    if (dragging) h.move(e.clientX, e.clientY);
    else if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > HOLD_SLOP) clear();
  };
  const up = (e: PointerEvent) => {
    if (!start || e.pointerId !== start.id) return;
    if (dragging) {
      h.end(e.clientX, e.clientY, e.type === "pointerup");
      swallowClick = e.type === "pointerup";
    }
    dragging = false;
    clear();
  };
  // Only a touchmove can stop the page scrolling, and only while the drag is on.
  const touchmove = (e: TouchEvent) => {
    if (dragging) e.preventDefault();
  };
  const click = (e: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  // A long press would otherwise open the browser's own menu for the photo.
  const contextmenu = (e: Event) => {
    if (start || dragging) e.preventDefault();
  };
  node.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  node.addEventListener("touchmove", touchmove, { passive: false });
  node.addEventListener("click", click, true);
  node.addEventListener("contextmenu", contextmenu);
  return {
    update(next) {
      h = next;
    },
    destroy() {
      clear();
      node.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      node.removeEventListener("touchmove", touchmove);
      node.removeEventListener("click", click, true);
      node.removeEventListener("contextmenu", contextmenu);
    },
  };
}
