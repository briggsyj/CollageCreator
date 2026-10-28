<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
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

  function dragStart(e: DragEvent, index: number): void {
    const photo = app.photos[index];
    if (!photo || !e.dataTransfer) return;
    // Dragging one of the selected photos takes all of them along.
    const ids = app.selection.includes(index)
      ? app.selection.flatMap((i) => app.photos[i]?.id ?? [])
      : [photo.id];
    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
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
  <div id="photo-list" bind:this={list}>
    {#each groups as group (group.page)}
      <section
        class="page-group"
        class:drop-target={dropPage === group.page && group.page >= 0}
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
                draggable={app.book}
                ondragstart={(e) => dragStart(e, index)}
                ondragend={() => (dropPage = -1)}
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
  </div>
</section>
