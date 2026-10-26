<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import type { Layout, Rect } from "../core/types";
  import { t } from "../i18n";
  import { drawCollage, drawSelection } from "../render/preview";
  import { drawSplitMarks } from "../render/splitmarks";
  import { posterOrigin, posterSize } from "../render/view";
  import { onWheel } from "./actions";
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  let box: HTMLElement;
  let canvas: HTMLCanvasElement;
  let boxWidth = $state(0);
  let boxHeight = $state(0);
  let panningNow = $state(false);

  /** The cells as drawn, in canvas pixels, and where the poster's corner is, for hit testing. */
  let lastRects: Rect[] = [];
  let lastOrigin = { x: 0, y: 0 };
  let lastPosterWidth = 1;
  let frameRequested = false;

  // Pointer state.
  let dragFrom = -1;
  let panning: { x: number; y: number } | null = null;
  let panMoved = false;
  let pointerOver = false;
  let downAt = { x: 0, y: 0 };
  /** While adjusting a crop: the last pointer position of the drag moving the photo. */
  let cropDrag: { x: number; y: number } | null = null;
  /** Set when a press switched the selection while cropping, so its release does not act as a click. */
  let switchedWhileCropping = false;

  const fit = $derived(app.fitPoster({ w: boxWidth, h: boxHeight }));

  $effect(() => {
    app.viewport = { w: boxWidth, h: boxHeight };
  });

  /** Cells in reading order (top to bottom, left to right), for keyboard navigation. */
  function readingOrder(layout: Layout): number[] {
    return layout.placements
      .map((p, i) => ({ i, y: Math.round(p.cell.y * 1000), x: p.cell.x }))
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((e) => e.i);
  }

  /** Redraw on the next frame: wheel and drag events can arrive faster than that. */
  function requestDraw(): void {
    if (frameRequested) return;
    frameRequested = true;
    // Tells tests (and tooling) that a redraw is on its way.
    canvas.dataset.pending = "1";
    requestAnimationFrame(() => {
      frameRequested = false;
      try {
        draw();
      } finally {
        canvas.dataset.pending = "0";
      }
    });
  }

  function draw(): void {
    const viewport = { w: box.clientWidth, h: box.clientHeight };
    const fitted = app.fitPoster(viewport);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // The canvas fills the preview area; the poster is drawn on it at the current zoom and pan.
    canvas.width = Math.max(1, Math.round(viewport.w * dpr));
    canvas.height = Math.max(1, Math.round(viewport.h * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = posterSize(fitted, app.view);
    const origin = posterOrigin(viewport, fitted, app.view);
    const pw = Math.max(1, Math.round(size.w * dpr));
    const ph = Math.max(1, Math.round(size.h * dpr));
    const ox = Math.round(origin.x * dpr);
    const oy = Math.round(origin.y * dpr);
    lastOrigin = { x: ox, y: oy };
    lastPosterWidth = pw;
    // Where the poster is, in CSS pixels from the canvas's top-left (used by tests and tooling).
    canvas.dataset.poster = [ox, oy, pw, ph].map((n) => (n / dpr).toFixed(1)).join(",");

    // The selected photo's crop (used by tests and tooling).
    const crop = app.selectedPhoto?.crop;
    canvas.dataset.crop = crop
      ? [crop.zoom, crop.x, crop.y].map((n) => n.toFixed(3)).join(",")
      : "";

    const layout = app.layout;
    if (!layout) {
      lastRects = [];
      return;
    }

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * dpr;
    ctx.shadowOffsetY = 2 * dpr;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(ox, oy, pw, ph);
    ctx.restore();

    ctx.save();
    ctx.translate(ox, oy);
    const settings = $state.snapshot(app.settings);
    lastRects = drawCollage(ctx, pw, ph, {
      layout,
      thumbs: app.photos.map((p) => p.thumb),
      crops: app.photos.map((p) => p.crop),
      settings,
    });

    const order = readingOrder(layout);
    const focusCell = order[app.focused];
    if (app.canvasFocused && app.focusRing && focusCell !== undefined) {
      const rect = lastRects[focusCell];
      if (rect) drawSelection(ctx, rect, "#ff9d00");
    }
    if (app.selected !== null) {
      const i = layout.placements.findIndex((p) => p.photoIndex === app.selected);
      const rect = lastRects[i];
      if (rect) drawSelection(ctx, rect, "#1f5fbf");
    }
    ctx.restore();
    if (settings.splitImages > 1) {
      const colour =
        getComputedStyle(document.documentElement).getPropertyValue("--sub").trim() || "#3b3b37";
      drawSplitMarks(
        ctx,
        { x: ox, y: oy, w: pw, h: ph },
        settings.splitImages,
        dpr,
        colour,
        t("Cut along the dashed lines: the collage is split into %(n)s images for the post.", {
          n: settings.splitImages,
        }),
      );
    }
  }

  // Everything the picture depends on: change any of it and the preview is redrawn.
  $effect(() => {
    void app.layout;
    void app.photos;
    void $state.snapshot(app.settings);
    void app.view;
    void app.selected;
    void app.cropping;
    void app.focused;
    void app.canvasFocused;
    void app.focusRing;
    void app.narrow;
    void app.lang;
    void boxWidth;
    void boxHeight;
    requestDraw();
  });

  function cellAt(clientX: number, clientY: number): number {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width - lastOrigin.x;
    const y = ((clientY - rect.top) / rect.height) * canvas.height - lastOrigin.y;
    return lastRects.findIndex((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
  }

  function endPan(): void {
    panning = null;
    panningNow = false;
  }

  function photoAt(cell: number): number | undefined {
    return app.layout?.placements[cell]?.photoIndex;
  }

  function onPointerDown(e: PointerEvent): void {
    canvas.focus();
    // The mouse is in use: no keyboard ring, and the arrow keys start from the photo pressed.
    app.focusRing = false;
    const order = app.layout ? readingOrder(app.layout) : [];
    const pressed = order.indexOf(cellAt(e.clientX, e.clientY));
    if (pressed >= 0) app.focused = pressed;
    if (app.cropping) {
      // Adjusting a crop: a drag on the selected photo moves it inside its cell.
      const photoIndex = photoAt(cellAt(e.clientX, e.clientY));
      if (photoIndex === app.selected) {
        cropDrag = { x: e.clientX, y: e.clientY };
        canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
      } else if (photoIndex !== undefined) {
        // Choosing another photo accepts this crop (it is already applied) and selects that one.
        switchedWhileCropping = true;
        app.selectPhoto(photoIndex);
      }
      return;
    }
    // In Pan mode a drag moves the view; in the other tools it does so only while Space is held.
    if (app.spaceHeld || app.mode === "pan") {
      panning = { x: e.clientX, y: e.clientY };
      downAt = { x: e.clientX, y: e.clientY };
      panMoved = false;
      canvas.setPointerCapture(e.pointerId);
      panningNow = true;
      e.preventDefault();
      return;
    }
    dragFrom = cellAt(e.clientX, e.clientY);
  }

  function onPointerMove(e: PointerEvent): void {
    if (cropDrag) {
      // Canvas pixels per screen pixel, then a share of the poster's width (the page is 1 wide).
      const rect = canvas.getBoundingClientRect();
      const toPoster = canvas.width / rect.width / lastPosterWidth;
      app.panSelectedCrop((e.clientX - cropDrag.x) * toPoster, (e.clientY - cropDrag.y) * toPoster);
      cropDrag = { x: e.clientX, y: e.clientY };
      return;
    }
    if (!panning) return;
    if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 4) panMoved = true;
    const dx = e.clientX - panning.x;
    const dy = e.clientY - panning.y;
    panning = { x: e.clientX, y: e.clientY };
    app.panBy(dx, dy);
  }

  function onPointerUp(e: PointerEvent): void {
    if (switchedWhileCropping) {
      switchedWhileCropping = false;
      return;
    }
    if (cropDrag || app.cropping) {
      cropDrag = null;
      return;
    }
    if (panning) {
      const click = !panMoved && !app.spaceHeld && app.mode === "pan";
      endPan();
      // A press that did not move the view selects the photo under it.
      if (click) {
        const photoIndex = photoAt(cellAt(e.clientX, e.clientY));
        if (photoIndex !== undefined) app.selectPhoto(photoIndex);
      }
      return;
    }
    const to = cellAt(e.clientX, e.clientY);
    if (to < 0) return;
    if (app.mode === "select") {
      const photoIndex = photoAt(to);
      if (photoIndex !== undefined) app.selectInPhotos(photoIndex);
      return;
    }
    if (dragFrom >= 0 && dragFrom !== to && app.selected === null) app.pick(dragFrom);
    app.pick(to);
    dragFrom = -1;
  }

  /** Scrolling over the collage zooms around the mouse (pinch gestures arrive as ctrl + wheel). */
  function onWheelEvent(e: WheelEvent): void {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.0015));
    if (app.cropping) {
      app.zoomSelectedCropBy(factor);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    app.zoomAtPoint(factor, { x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  /** Keys that should keep working normally while a form control has the focus. */
  function isFormControl(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLButtonElement
    );
  }

  function setSpaceHeld(held: boolean): void {
    app.setSpaceHeld(held);
    if (!held) endPan();
  }

  // Holding Space over the preview makes a drag move the collage. Form controls keep their own use of Space.
  function onWindowKeyDown(e: KeyboardEvent): void {
    if (e.code !== "Space") return;
    // A button that still has the focus (the Pan / Swap toggle just pressed) must not swallow
    // Space while the pointer is over the preview.
    const buttonUnderPointer = pointerOver && e.target instanceof HTMLButtonElement;
    if (isFormControl(e.target) && !buttonUnderPointer) return;
    if (!pointerOver && document.activeElement !== canvas) return;
    e.preventDefault();
    if (!e.repeat) setSpaceHeld(true);
  }

  function onWindowKeyUp(e: KeyboardEvent): void {
    if (e.code !== "Space") return;
    // Stop a focused button from taking the release as a press.
    if (app.spaceHeld) e.preventDefault();
    setSpaceHeld(false);
  }

  function onCanvasKeyDown(e: KeyboardEvent): void {
    // View keys and undo work whether or not there are photos.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      app.undoRemove();
      return;
    }
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      if (app.cropping) app.zoomSelectedCropBy(1.25);
      else app.zoomAtCentre(1.25);
      return;
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      if (app.cropping) app.zoomSelectedCropBy(0.8);
      else app.zoomAtCentre(0.8);
      return;
    }
    if (e.key === "0") {
      e.preventDefault();
      app.fitView();
      return;
    }
    if (e.shiftKey && e.key.startsWith("Arrow")) {
      e.preventDefault();
      const step = 40;
      const dx = e.key === "ArrowLeft" ? step : e.key === "ArrowRight" ? -step : 0;
      const dy = e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0;
      app.panBy(dx, dy);
      return;
    }

    if (app.cropping && e.key.startsWith("Arrow")) {
      // Move the photo inside its cell (the arrows would otherwise move the focus ring).
      e.preventDefault();
      const step = 0.01;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
      app.panSelectedCrop(dx, dy);
      return;
    }

    const layout = app.layout;
    if (!layout) return;
    const order = readingOrder(layout);
    if (e.key.startsWith("Arrow") || e.key === "Enter") app.focusRing = true;
    if (e.key === "Delete" || e.key === "Backspace") {
      // Remove the selected photo, or else the one with the focus ring.
      const photoIndex = app.selected ?? layout.placements[order[app.focused] ?? -1]?.photoIndex;
      const photo = photoIndex === undefined ? undefined : app.photos[photoIndex];
      e.preventDefault();
      if (photo) {
        app.removePhotos(new Set([photo.id]), t("Removed %(name)s.", { name: photo.name }));
      }
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      app.focused = (app.focused + 1) % order.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      app.focused = (app.focused - 1 + order.length) % order.length;
    } else if (e.key === "Enter") {
      const cell = order[app.focused];
      if (cell !== undefined) app.pick(cell);
    } else if (e.key === "Escape") {
      app.deselect();
    } else {
      return;
    }
    e.preventDefault();
    const name =
      app.photos[layout.placements[order[app.focused] as number]?.photoIndex ?? -1]?.name;
    if (name && e.key.startsWith("Arrow")) app.setStatus(name);
  }
</script>

<svelte:window onkeydown={onWindowKeyDown} onkeyup={onWindowKeyUp} onblur={() => setSpaceHeld(false)} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  id="canvas-box"
  class="canvas-box"
  class:pan-mode={app.mode === "pan"}
  class:pan-ready={app.spaceHeld}
  class:panning={panningNow}
  class:cropping={app.cropping}
  bind:this={box}
  bind:clientWidth={boxWidth}
  bind:clientHeight={boxHeight}
  onpointerenter={() => (pointerOver = true)}
  onpointerleave={() => (pointerOver = false)}
>
  <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
  <!-- biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: the canvas handles its own arrow-key navigation, so screen readers must pass keys through (application role) -->
  <canvas
    id="preview"
    tabindex="0"
    role="application"
    aria-label="Collage preview. Use arrow keys to move between photos, Enter to pick one and Enter on another to swap them, Delete to remove the photo, Escape to cancel. Plus and minus zoom, Shift and arrow keys pan, zero fits the window. With a mouse, drag to pan, scroll to zoom, or choose Swap to click two photos and swap them."
    bind:this={canvas}
    use:onWheel={onWheelEvent}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={() => {
      cropDrag = null;
      endPan();
    }}
    onkeydown={onCanvasKeyDown}
    onfocus={() => {
      app.canvasFocused = true;
      // Reached with Tab, the ring shows at once; a click or script focus leaves it off.
      app.focusRing = canvas.matches(":focus-visible");
    }}
    onblur={() => (app.canvasFocused = false)}
  ></canvas>
  <section
    id="empty-state"
    class="empty"
    aria-label="Drop photos here"
    hidden={app.hasPhotos}
    style:--empty-w={`${fit.w}px`}
    style:--empty-h={`${fit.h}px`}
  >
    {#if app.restoring}
      <div class="restoring-stage" role="status">
        <progress
          max={Math.max(1, app.restoring.total)}
          value={app.restoring.total > 0 ? app.restoring.done : undefined}
          aria-label={tr("Bringing back your photos")}
        ></progress>
        <h2>
          {app.restoring.total > 0
            ? tr("Bringing back your photos… %(done)s of %(total)s", {
                done: app.restoring.done,
                total: app.restoring.total,
              })
            : tr("Looking for your saved photos…")}
        </h2>
        <p>{tr("You can add more once they are back.")}</p>
      </div>
    {:else}
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="m21 16-5-5-9 8" />
      </svg>
      <h2>{tr("Drop photos here")}</h2>
      <p>{tr("Everything runs in your browser. Your photos are never uploaded.")}</p>
      <button type="button" id="add-empty" onclick={() => app.chooseFiles()}>
        {tr("Choose photos…")}
      </button>
    {/if}
  </section>
</div>
