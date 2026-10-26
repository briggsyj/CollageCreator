<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app, describeSpan } from "./app-state.svelte";
  import Thumb from "./Thumb.svelte";
  import { tr } from "./tr.svelte";

  let list: HTMLUListElement;

  // The Select tool asks for the chosen photo to be brought into view.
  $effect(() => {
    if (app.revealToken === 0) return;
    const index = app.selected;
    if (index !== null) list.children[index]?.scrollIntoView({ block: "nearest" });
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
  <ul id="photo-list" class="photo-list" bind:this={list}>
    {#each app.photos as photo, index (photo.id)}
      {@const wanted = describeSpan(photo.span)}
      <li>
        <button
          type="button"
          class="tile"
          aria-pressed={index === app.selected}
          aria-label={wanted ? `${photo.name}, ${wanted}` : photo.name}
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
