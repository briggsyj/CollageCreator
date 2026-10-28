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
    class="primary wide"
    aria-describedby="privacy-note"
    disabled={app.restoring !== null}
    onclick={() => app.chooseFiles()}
  >
    {tr("Add images...")}
  </button>
  <p class="drop-tip">{tr("or drop photos anywhere on this page")}</p>
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

  <div id="notices" class="notices" hidden={app.notice === null} data-kind={app.notice?.kind}>
    <p id="notices-summary" class="notices-summary">{app.notice?.summary ?? ""}</p>
    <div class="notices-actions">
      <button
        type="button"
        id="notices-details"
        class="link"
        aria-expanded={app.noticeDetailsOpen}
        aria-controls="notices-list"
        onclick={() => (app.noticeDetailsOpen = !app.noticeDetailsOpen)}
      >
        {tr("Details")}
      </button>
      <button type="button" id="notices-dismiss" class="link" onclick={() => app.hideNotice()}>
        {tr("Dismiss")}
      </button>
    </div>
    <ul id="notices-list" class="notices-list" hidden={!app.noticeDetailsOpen}>
      {#each app.notice?.items ?? [] as item (item)}
        <li>{item}</li>
      {/each}
    </ul>
  </div>

  <div class="rowhead">
    <h3 id="photo-count">{count}</h3>
    <div>
      <button
        type="button"
        id="undo-remove"
        class="link"
        disabled={app.removed === null}
        onclick={() => app.undoRemove()}
      >
        {tr("Undo remove")}
      </button>
      <button
        type="button"
        id="remove-all"
        class="link"
        disabled={!app.hasPhotos}
        onclick={() => app.removeAll()}
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
      <section class="page-group" aria-label={group.page >= 0 ? tr("Page %(n)s", { n: group.page + 1 }) : undefined}>
        {#if group.page >= 0}
          <div class="page-head">
            <h4>
              {tr("Page %(n)s", { n: group.page + 1 })}
              <span class="count">· {group.items.length === 1 ? tr("1 photo") : tr("%(n)s photos", { n: group.items.length })}</span>
            </h4>
            <div class="page-actions">
              <button
                type="button"
                class="link move-page-left"
                aria-label={tr("Move page %(n)s left", { n: group.page + 1 })}
                disabled={group.page === 0}
                onclick={() => app.movePage(group.page, -1)}
              >
                ◀
              </button>
              <button
                type="button"
                class="link move-page-right"
                aria-label={tr("Move page %(n)s right", { n: group.page + 1 })}
                disabled={group.page === app.pageCount - 1}
                onclick={() => app.movePage(group.page, 1)}
              >
                ▶
              </button>
              <button
                type="button"
                class="link remove-page"
                aria-label={tr("Remove page %(n)s", { n: group.page + 1 })}
                disabled={app.pageCount <= 1}
                onclick={() => app.askRemovePage(group.page)}
              >
                {tr("Remove page")}
              </button>
            </div>
          </div>
        {/if}
        {#if group.page >= 0 && group.items.length === 0}
          <p class="hint">{tr("Drop or move photos here")}</p>
        {/if}
        <ul class="photo-list">
          {#each group.items as { photo, index } (photo.id)}
            {@const wanted = describeSpan(photo.span)}
            {@const label = wanted ? `${photo.name}, ${wanted}` : photo.name}
            <li data-photo={index}>
              <button
                type="button"
                class="tile"
                aria-pressed={index === app.selected}
                aria-label={app.book
                  ? `${label}, ${tr("Page %(n)s", { n: (photo.bookPage ?? 0) + 1 })}`
                  : label}
                onclick={() => app.selectPhoto(index)}
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
