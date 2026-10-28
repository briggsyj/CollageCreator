<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { type TouchDragHandlers, touchDrag } from "./actions";
  import { app, describeSpan } from "./app-state.svelte";
  import Thumb from "./Thumb.svelte";
  import { tr } from "./tr.svelte";

  let list: HTMLElement;

  // The Select tool asks for the chosen photo to be brought into view.
  $effect(() => {
    if (app.revealToken === 0) return;
    const index = app.selected;
    if (index !== null) {
      list.querySelector(`[data-photo="${index}"]`)?.scrollIntoView({ block: "nearest" });
    }
  });

  /** The photos in groups: one group for a collage, one per page for a book. */
  const groups = $derived.by(() => {
    const items = app.photos.map((photo, index) => ({ photo, index }));
    if (!app.book) return [{ page: -1, items }];
    return Array.from({ length: app.pageCount }, (_, page) => ({
      page,
      items: items.filter((it) => Math.min(app.pageCount - 1, it.photo.bookPage ?? 0) === page),
    }));
  });

  /** Photos being dragged between pages carry their ids under this type. */
  const DRAG_TYPE = "application/x-collage-photos";
  /** The page a dragged photo is over, to highlight it. */
  let dropPage = $state(-1);
  /** A photo from the list is being dragged (the "new page" target shows then on one page). */
  let dragging = $state(false);
  /** The "new page" target appears after the last page while there is room for one more. */
  const canAddPage = $derived(app.hasPhotos && app.pageCount < app.maxPages);

  /** The photos a drag from this tile moves: all the selected ones if it is one of them. */
  function draggedIds(index: number): string[] {
    const photo = app.photos[index];
    if (!photo) return [];
    return app.selection.includes(index)
      ? app.selection.flatMap((i) => app.photos[i]?.id ?? [])
      : [photo.id];
  }

  function dragStart(e: DragEvent, index: number): void {
    const ids = draggedIds(index);
    if (ids.length === 0 || !e.dataTransfer) return;
    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
    dragging = true;
  }

  /** Photos dropped on the "new page" target: add the page, then move them onto it. */
  function dropOnNewPage(e: DragEvent): void {
    const data = e.dataTransfer?.getData(DRAG_TYPE);
    dropPage = -1;
    dragging = false;
    if (!data) return;
    e.preventDefault();
    e.stopPropagation();
    const ids: unknown = JSON.parse(data);
    if (!Array.isArray(ids)) return;
    app.addPage();
    app.movePhotosToPage(ids.map(String), app.pageCount - 1);
  }

  // ---- With a finger: press and hold a photo, then move it onto a page (see touchDrag).

  /** The photos a finger is moving, and the label that follows it. */
  let touchIds: string[] = [];
  let ghost = $state<{ x: number; y: number; count: number } | null>(null);

  /** The page under a point: a page group's number, the "new page" target's, or -1. */
  function pageAt(x: number, y: number): number {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-drop-page]");
    return el ? Number(el.dataset.dropPage) : -1;
  }

  /** Near the top or bottom of the scrolling list, the list scrolls to reach other pages. */
  function edgeScroll(y: number): void {
    const scroller = list.closest<HTMLElement>(".sheet, .panes, .side") ?? list.parentElement;
    if (!scroller) return;
    const r = scroller.getBoundingClientRect();
    if (y < r.top + 48) scroller.scrollTop -= 12;
    else if (y > r.bottom - 48) scroller.scrollTop += 12;
  }

  function touchHandlers(index: number): TouchDragHandlers {
    return {
      start: (x, y) => {
        if (!(app.book || canAddPage)) return false;
        touchIds = draggedIds(index);
        if (touchIds.length === 0) return false;
        dragging = true;
        ghost = { x, y, count: touchIds.length };
        return true;
      },
      move: (x, y) => {
        ghost = { x, y, count: touchIds.length };
        dropPage = pageAt(x, y);
        edgeScroll(y);
      },
      end: (x, y, dropped) => {
        const page = dropped ? pageAt(x, y) : -1;
        ghost = null;
        dropPage = -1;
        dragging = false;
        if (page < 0) return;
        if (page >= app.pageCount) {
          app.addPage();
          app.movePhotosToPage(touchIds, app.pageCount - 1);
        } else {
          if (!app.book) return;
          app.movePhotosToPage(touchIds, page);
        }
      },
    };
  }

  function dragOver(e: DragEvent, page: number): void {
    if (!e.dataTransfer?.types.includes(DRAG_TYPE)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dropPage = page;
  }

  function drop(e: DragEvent, page: number): void {
    const data = e.dataTransfer?.getData(DRAG_TYPE);
    dropPage = -1;
    if (!data) return;
    e.preventDefault();
    e.stopPropagation();
    const ids: unknown = JSON.parse(data);
    if (Array.isArray(ids)) app.movePhotosToPage(ids.map(String), page);
  }

  const count = $derived(
    app.photos.length === 1 ? tr("1 photo") : tr("%(n)s photos", { n: app.photos.length }),
  );
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<section
  class="tabpanel"
  id="panel-photos"
  role="tabpanel"
  aria-labelledby="tab-photos"
  hidden={app.tab !== "photos"}
>
  <button
    type="button"
    id="add"
    title={tr("Choose photos, or a .zip of them, from this device")}
    class="primary wide"
    aria-describedby="privacy-note"
    disabled={app.restoring !== null}
    onclick={() => app.chooseFiles()}
  >
    {tr("Add images...")}
  </button>
  <p class="drop-tip">{tr("or drop photos or a .zip of them anywhere here")}</p>
  <p id="privacy-note" class="sr-only">
    {tr("Everything runs in your browser. Your photos are never uploaded.")}
  </p>

  {#if app.restoring}
    <div class="restoring" role="status">
      <p>
        {#if app.restoring.total > 0}
          {tr("Bringing back your photos… %(done)s of %(total)s", {
            done: app.restoring.done,
            total: app.restoring.total,
          })}
        {:else}
          {tr("Looking for your saved photos…")}
        {/if}
      </p>
      <progress
        max={Math.max(1, app.restoring.total)}
        value={app.restoring.total > 0 ? app.restoring.done : undefined}
        aria-label={tr("Bringing back your photos")}
      ></progress>
    </div>
  {/if}

  <div
    id="notices"
    class="notices"
    role="status"
    hidden={app.notice === null}
    data-kind={app.notice?.kind}
  >
    <svg class="notices-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d={app.notice?.kind === "error" ? "M12 7.5v5.5M12 16.5v.01" : "M12 11v5.5M12 7.5v.01"} />
    </svg>
    <div class="notices-body">
      <p id="notices-summary" class="notices-summary">{app.notice?.summary ?? ""}</p>
      <p id="notices-reasons" class="notices-reasons">{app.notice?.reasons ?? ""}</p>
      <button
        type="button"
        id="notices-details"
        title={tr("Show or hide the names of the files that were not added")}
        class="link notices-toggle"
        aria-expanded={app.noticeDetailsOpen}
        aria-controls="notices-list"
        onclick={() => (app.noticeDetailsOpen = !app.noticeDetailsOpen)}
      >
        {app.noticeDetailsOpen ? tr("Hide files") : tr("Show files")}
      </button>
      <ul id="notices-list" class="notices-list" hidden={!app.noticeDetailsOpen}>
        {#each app.notice?.items ?? [] as item (item)}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
    <button
      type="button"
      id="notices-dismiss"
      title={tr("Dismiss this notice")}
      class="icon-btn notices-close"
      aria-label={tr("Dismiss")}
      onclick={() => app.hideNotice()}
    >
      <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
  </div>

  <div class="rowhead">
    <h3 id="photo-count">{count}</h3>
    <div>
      <button
        type="button"
        id="undo-remove"
        title={tr("Put back the photos removed last")}
        class="link"
        hidden={app.removed === null}
        onclick={() => app.undoRemove()}
      >
        {tr("Undo remove")}
      </button>
      <button
        type="button"
        id="remove-all"
        title={tr("Take every photo out (asks first)")}
        class="link"
        disabled={!app.hasPhotos}
        onclick={() => app.askRemoveAll()}
      >
        {tr("Remove all")}
      </button>
    </div>
  </div>
  <p id="empty-hint" class="hint" hidden={app.hasPhotos}>
    {tr("No photos yet. Add a few and the collage builds itself.")}
  </p>
  <!-- A click between the photos (not on one) lets go of the selection. -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    id="photo-list"
    bind:this={list}
    onclick={(e) => {
      if (!(e.target as HTMLElement).closest("button, select, input, a")) app.deselect();
    }}
  >
    {#each groups as group (group.page)}
      <section
        class="page-group"
        class:drop-target={dropPage === group.page && group.page >= 0}
        data-drop-page={group.page >= 0 ? group.page : undefined}
        aria-label={group.page >= 0 ? tr("Page %(n)s", { n: group.page + 1 }) : undefined}
        ondragover={(e) => group.page >= 0 && dragOver(e, group.page)}
        ondragleave={(e) => {
          if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) dropPage = -1;
        }}
        ondrop={(e) => group.page >= 0 && drop(e, group.page)}
      >
        {#if group.page >= 0}
          <div class="page-head">
            <h4>
              {tr("Page %(n)s", { n: group.page + 1 })}
              <span class="count">· {group.items.length === 1 ? tr("1 photo") : tr("%(n)s photos", { n: group.items.length })}</span>
            </h4>
            <div class="page-actions">
              <button
                type="button"
                class="icon-btn move-page-left"
                title={tr("Move page %(n)s up", { n: group.page + 1 })}
                aria-label={tr("Move page %(n)s up", { n: group.page + 1 })}
                disabled={group.page === 0}
                onclick={() => app.movePage(group.page, -1)}
              >
                <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
              </button>
              <button
                type="button"
                class="icon-btn move-page-right"
                title={tr("Move page %(n)s down", { n: group.page + 1 })}
                aria-label={tr("Move page %(n)s down", { n: group.page + 1 })}
                disabled={group.page === app.pageCount - 1}
                onclick={() => app.movePage(group.page, 1)}
              >
                <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <button
                type="button"
                class="icon-btn remove-page"
                title={tr("Remove page %(n)s", { n: group.page + 1 })}
                aria-label={tr("Remove page %(n)s", { n: group.page + 1 })}
                disabled={app.pageCount <= 1}
                onclick={() => app.askRemovePage(group.page)}
              >
                <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </div>
        {/if}
        {#if group.page >= 0 && group.items.length === 0}
          <p class="page-empty">{tr("Drop or move photos here")}</p>
        {/if}
        <ul class="photo-list">
          {#each group.items as { photo, index } (photo.id)}
            {@const wanted = describeSpan(photo.span)}
            {@const label = wanted ? `${photo.name}, ${wanted}` : photo.name}
            <li data-photo={index}>
              <button
                type="button"
                class="tile"
                draggable={app.book || canAddPage}
                use:touchDrag={touchHandlers(index)}
                ondragstart={(e) => dragStart(e, index)}
                ondragend={() => {
                  dropPage = -1;
                  dragging = false;
                }}
                title={tr("Select %(name)s (Shift-click to select several)", { name: photo.name })}
                aria-pressed={app.selection.includes(index)}
                aria-label={app.book
                  ? `${label}, ${tr("Page %(n)s", { n: (photo.bookPage ?? 0) + 1 })}`
                  : label}
                onclick={(e) =>
                  e.shiftKey || e.metaKey || e.ctrlKey
                    ? app.toggleSelected(index)
                    : app.selectPhoto(index)}
              >
                <Thumb bitmap={photo.thumb} />
                {#if wanted}<span class="tag">{wanted}</span>{/if}
                <span class="name" title={photo.name}>{photo.name}</span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
    <!-- Always there with two or more pages; with one, only while a photo is dragged. -->
    {#if canAddPage && (app.book || dragging)}
      <section
        class="new-page"
        class:drop-target={dropPage === app.pageCount}
        data-drop-page={app.pageCount}
        aria-label={tr("New page")}
        ondragover={(e) => dragOver(e, app.pageCount)}
        ondragleave={(e) => {
          if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) dropPage = -1;
        }}
        ondrop={dropOnNewPage}
      >
        <div class="page-head">
          <h4>
            {tr("Page %(n)s", { n: app.pageCount + 1 })}
            <span class="count">· {tr("new")}</span>
          </h4>
        </div>
        <p class="page-empty">{tr("Drop photos here for a new page")}</p>
      </section>
    {/if}
  </div>
</section>

<!-- Follows the finger while photos are dragged to another page. -->
{#if ghost}
  <div class="drag-ghost" style:left={`${ghost.x}px`} style:top={`${ghost.y}px`} aria-hidden="true">
    {ghost.count === 1 ? tr("Moving 1 photo") : tr("Moving %(n)s photos", { n: ghost.count })}
  </div>
{/if}

