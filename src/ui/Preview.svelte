<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import type { Layout, Rect } from "../core/types";
  import { t } from "../i18n";
  import { cornerRadius } from "../render/draw";
  import { drawCollage, drawSelection } from "../render/preview";
  import { drawSplitMarks } from "../render/splitmarks";
  import { posterOrigin, posterSize } from "../render/view";
  import { onWheel } from "./actions";
  import { app } from "./app-state.svelte";
  import PagePills from "./PagePills.svelte";
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
  /** The cell under the mouse, darkened a little while the Swap or Select tool is in use. */
  let hoverCell = $state(-1);
  let panning: { x: number; y: number } | null = null;
  /** Where a pan began, to tell a click (which deselects) from a drag. */
  let panStart = { x: 0, y: 0 };
  let pointerOver = false;
  /** While adjusting a crop: the last pointer position of the drag moving the photo. */
  let cropDrag: { x: number; y: number } | null = null;
  /** Set when a press switched the selection while cropping, so its release does not act as a click. */
  let switchedWhileCropping = false;
  /** Fingers on the preview, by pointer id; two make a pinch that zooms and pans together. */
  const touches = new Map<number, { x: number; y: number }>();
  let pinch: { dist: number; mid: { x: number; y: number } } | null = null;
  /** A pinch just ended: the finger still down must not pick a photo or deselect when lifted. */
  let afterPinch = false;

  function pinchState(): { dist: number; mid: { x: number; y: number } } | null {
    const [a, b] = [...touches.values()];
    if (!a || !b) return null;
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  }

  /** Forget a lifted finger; a pinch ends when fewer than two remain. */
  function liftTouch(e: PointerEvent): void {
    touches.delete(e.pointerId);
    if (pinch && touches.size < 2) {
      pinch = null;
      afterPinch = touches.size > 0;
    }
  }

  // The drop area before any photos is one page, however many pages are set.
  const fit = $derived(app.fitPoster({ w: boxWidth, h: boxHeight }, true));

  $effect(() => {
    app.viewport = { w: boxWidth, h: boxHeight };
  });

  /** Cells in reading order (top to bottom, left to right), for keyboard navigation. */
  function readingOrder(layout: Layout): number[] {
    return layout.placements
      .map((p, i) => ({ i, page: p.page ?? 0, y: Math.round(p.cell.y * 1000), x: p.cell.x }))
      .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x)
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
    // Resizing a canvas reallocates it, so that happens only when the area's size changes;
    // otherwise the same canvas is cleared, which keeps panning and zooming smooth on phones.
    const cw = Math.max(1, Math.round(viewport.w * dpr));
    const ch = Math.max(1, Math.round(viewport.h * dpr));
    const resized = canvas.width !== cw || canvas.height !== ch;
    if (resized) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!resized) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
    }
    // The muted text colour of the theme, for page notes and cut marks (read once a frame).
    const sub =
      getComputedStyle(document.documentElement).getPropertyValue("--sub").trim() || "#3b3b37";

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
      if (app.posterBox !== null) app.posterBox = null;
      return;
    }
    // Where the page controls go: they are buttons over the canvas, placed from this box.
    const at = { x: ox / dpr, y: oy / dpr, w: pw / dpr, h: ph / dpr };
    const was = app.posterBox;
    if (!was || was.x !== at.x || was.y !== at.y || was.w !== at.w || was.h !== at.h) {
      app.posterBox = at;
    }

    // The poster's white sheet and shadow; a book has one for each page.
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * dpr;
    ctx.shadowOffsetY = 2 * dpr;
    ctx.fillStyle = "#ffffff";
    for (const sheet of layout.pages ?? [{ x: 0, w: 1 }]) {
      const x = Math.round(sheet.x * pw);
      ctx.fillRect(ox + x, oy, Math.round((sheet.x + sheet.w) * pw) - x, ph);
    }
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
    const picking = app.activeMode !== "pan" && !app.cropping;
    const chosen = new Set(app.selection);
    const hovered = lastRects[hoverCell];
    if (picking && hovered && !chosen.has(photoAt(hoverCell) ?? -1)) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(hovered.x, hovered.y, hovered.w, hovered.h);
    }
    for (const photoIndex of app.selection) {
      const i = layout.placements.findIndex((p) => p.photoIndex === photoIndex);
      const rect = lastRects[i];
      if (!rect) continue;
      // While its crop is adjusted the photo has a plain outline; otherwise a ring and a check.
      if (app.cropping) drawSelection(ctx, rect, "#1f5fbf");
      else markSelected(ctx, rect, dpr, cornerRadius(settings.cornerStyle, rect.w, rect.h));
    }
    ctx.restore();
    if (layout.pages) drawPageMarks(ctx, layout, { x: ox, y: oy, w: pw, h: ph }, dpr, sub);
    if (settings.splitImages > 1) {
      const colour = sub;
      // Every page of a book made for a post has its own cuts; one note is enough.
      (layout.pages ?? [{ x: 0, w: 1 }]).forEach((page, k) => {
        const x = Math.round(page.x * pw);
        drawSplitMarks(
          ctx,
          { x: ox + x, y: oy, w: Math.round((page.x + page.w) * pw) - x, h: ph },
          settings.splitImages,
          dpr,
          colour,
          k > 0
            ? ""
            : t(
                "Cut along the dashed lines: the collage is split into %(n)s images for the post.",
                {
                  n: settings.splitImages,
                },
              ),
        );
      });
    }
  }

  /**
   * Mark a selected photo: a blue ring just inside its edges (a thin white line keeps it clear
   * of dark photos) and a check badge in its top right corner. Everything stays inside the
   * photo, so neighbouring selected photos never overlap. `rect` is in poster pixels.
   */
  function markSelected(ctx: CanvasRenderingContext2D, rect: Rect, dpr: number, radius: number) {
    const accent = "#1f5fbf";
    const ring = 4 * dpr;
    ctx.save();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = ring + 2 * dpr;
    ctx.beginPath();
    ctx.roundRect(rect.x + ring / 2, rect.y + ring / 2, rect.w - ring, rect.h - ring, radius);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = ring;
    ctx.beginPath();
    ctx.roundRect(rect.x + ring / 2, rect.y + ring / 2, rect.w - ring, rect.h - ring, radius);
    ctx.stroke();
    // The badge: smaller on small photos, and left out when there is no room for it.
    const r = Math.min(11 * dpr, Math.min(rect.w, rect.h) / 5);
    if (r >= 5 * dpr) {
      const cx = rect.x + rect.w - ring - r - 4 * dpr;
      const cy = rect.y + ring + r + 4 * dpr;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4 * dpr;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(1.5 * dpr, r / 6);
      ctx.stroke();
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.42, cy + r * 0.02);
      ctx.lineTo(cx - r * 0.1, cy + r * 0.34);
      ctx.lineTo(cx + r * 0.45, cy - r * 0.3);
      ctx.stroke();
    }
    ctx.restore();
  }

  /** A book's empty pages. */
  function drawPageMarks(
    ctx: CanvasRenderingContext2D,
    layout: Layout,
    poster: { x: number; y: number; w: number; h: number },
    dpr: number,
    colour: string,
  ): void {
    const pages = layout.pages ?? [];
    ctx.save();
    ctx.fillStyle = colour;
    ctx.font = `${13 * dpr}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    pages.forEach((page, k) => {
      const x = poster.x + Math.round(page.x * poster.w);
      const w = Math.round((page.x + page.w) * poster.w) - Math.round(page.x * poster.w);
      const photos = app.pageCounts[k] ?? 0;
      if (photos === 0) {
        ctx.setLineDash([6 * dpr, 4 * dpr]);
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1.5 * dpr;
        ctx.strokeRect(x + 0.5 * dpr, poster.y + 0.5 * dpr, w - dpr, poster.h - dpr);
        ctx.setLineDash([]);
        // Only when it fits as it is: squeezed narrower it is hard to read.
        const note = t("Drop or move photos here");
        if (ctx.measureText(note).width <= w - 16 * dpr) {
          ctx.fillText(note, x + w / 2, poster.y + poster.h / 2);
        }
      }
    });
    ctx.restore();
  }

  // Everything the picture depends on: change any of it and the preview is redrawn.
  $effect(() => {
    void app.layout;
    void app.photos;
    void $state.snapshot(app.settings);
    void app.view;
    void app.selection;
    void hoverCell;
    void app.activeMode;
    void app.pageCounts;
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
    if (e.pointerType === "touch") {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2) {
        // A second finger: stop whatever the first one started, and pinch instead.
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Not an active pointer (synthetic events in tests): moves still reach the canvas.
        }
        cropDrag = null;
        endPan();
        dragFrom = -1;
        pinch = pinchState();
        return;
      }
      if (touches.size > 2) return;
    }
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
      } else if (!app.spaceHeld) {
        // A click beside the photos ends the crop and lets go of the photo.
        switchedWhileCropping = true;
        app.deselect();
      }
      return;
    }
    // In Pan mode a drag moves the view; in the other tools it does so only while Space is held.
    if (app.spaceHeld || app.mode === "pan") {
      panning = { x: e.clientX, y: e.clientY };
      panStart = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      panningNow = true;
      e.preventDefault();
      return;
    }
    dragFrom = cellAt(e.clientX, e.clientY);
  }

  function onPointerMove(e: PointerEvent): void {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch) {
      const now = pinchState();
      if (!now || pinch.dist <= 0) return;
      const rect = canvas.getBoundingClientRect();
      app.zoomAtPoint(now.dist / pinch.dist, { x: now.mid.x - rect.left, y: now.mid.y - rect.top });
      app.panBy(now.mid.x - pinch.mid.x, now.mid.y - pinch.mid.y);
      pinch = now;
      return;
    }
    if (cropDrag) {
      // Canvas pixels per screen pixel, then a share of the poster's width (the page is 1 wide).
      const rect = canvas.getBoundingClientRect();
      const toPoster = canvas.width / rect.width / lastPosterWidth;
      app.panSelectedCrop((e.clientX - cropDrag.x) * toPoster, (e.clientY - cropDrag.y) * toPoster);
      cropDrag = { x: e.clientX, y: e.clientY };
      return;
    }
    if (!panning) {
      // Hovering is for a mouse or pen; a finger moving over the preview changes nothing.
      if (e.pointerType !== "touch") {
        hoverCell = app.activeMode === "pan" ? -1 : cellAt(e.clientX, e.clientY);
      }
      return;
    }
    const dx = e.clientX - panning.x;
    const dy = e.clientY - panning.y;
    panning = { x: e.clientX, y: e.clientY };
    app.panBy(dx, dy);
  }

  function onPointerUp(e: PointerEvent): void {
    const wasPinching = pinch !== null || afterPinch;
    liftTouch(e);
    if (wasPinching) {
      // The end of a pinch: nothing is picked, swapped or deselected.
      if (touches.size === 0) afterPinch = false;
      endPan();
      cropDrag = null;
      dragFrom = -1;
      return;
    }
    if (switchedWhileCropping) {
      switchedWhileCropping = false;
      return;
    }
    if (cropDrag || app.cropping) {
      cropDrag = null;
      return;
    }
    if (panning) {
      // Panning never picks a photo: only the Select tool does (and Swap, to choose two to swap).
      // A click with the Pan tool (not a drag, nor Space held to pan for a moment) lets go of
      // the selection.
      const moved = Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y);
      if (moved < 4 && !app.spaceHeld) app.deselect();
      endPan();
      return;
    }
    const to = cellAt(e.clientX, e.clientY);
    if (to < 0) {
      // A click beside the photos lets go of the selection.
      app.deselect();
      dragFrom = -1;
      return;
    }
    if (app.mode === "select") {
      const photoIndex = photoAt(to);
      // Shift-click adds the photo to the selection (or takes it out).
      if (photoIndex !== undefined) app.selectInPhotos(photoIndex, e.shiftKey);
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
    // Scrolling always zooms the view, also while cropping (the photo's zoom is the slider).
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
      app.zoomAtCentre(1.25);
      return;
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      app.zoomAtCentre(0.8);
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
      // Remove the selected photos, or else the one with the focus ring.
      if (app.selected !== null) {
        e.preventDefault();
        app.removeSelected();
        return;
      }
      const photoIndex = app.selected ?? layout.placements[order[app.focused] ?? -1]?.photoIndex;
      const photo = photoIndex === undefined ? undefined : app.photos[photoIndex];
      e.preventDefault();
      if (photo) app.askRemovePhotos([photo]);
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
    const focusedPlacement = layout.placements[order[app.focused] as number];
    const name = app.photos[focusedPlacement?.photoIndex ?? -1]?.name;
    if (name && e.key.startsWith("Arrow")) {
      // In a book the page is part of the name, so it is spoken too.
      app.setStatus(
        layout.pages
          ? t("%(name)s, page %(n)s of %(total)s", {
              name,
              n: (focusedPlacement?.page ?? 0) + 1,
              total: layout.pages.length,
            })
          : name,
      );
    }
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
  onpointerleave={() => {
    pointerOver = false;
    hoverCell = -1;
  }}
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
    onpointercancel={(e) => {
      liftTouch(e);
      if (touches.size === 0) afterPinch = false;
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
  <PagePills />
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
      <button type="button" id="add-empty" title={tr("Choose photos from this device")} onclick={() => app.chooseFiles()}>
        {tr("Choose photos…")}
      </button>
    {/if}
  </section>
</div>
