<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const span = $derived(app.selectedPhoto?.span ?? { columns: 1, rows: 1 });
  const crop = $derived(app.selectedPhoto?.crop);
  const zoom = $derived(crop?.zoom ?? 1);
  const taller = $derived(span.rows > 1 ? `${tr("Taller")} ×${span.rows}` : tr("Taller"));
</script>

<!-- Shown for the selected photo: under the list on wide screens, a bar above the tabs on phones. -->
<section class="dock" id="selected-dock" aria-label="Selected photo" hidden={!app.selectedPhoto}>
  <div class="rowhead">
    <h3 id="dock-name">{app.selectedPhoto?.name ?? ""}</h3>
    <button type="button" id="dock-done" title={tr("Deselect the photo")} class="link" onclick={() => app.deselect()}>
      {tr("Done")}
    </button>
  </div>
  <fieldset id="span-group" class="span-group">
    <legend class="sr-only">{tr("Size of the selected photo")}</legend>
    <button
      type="button"
      id="span-wider"
      title={tr("Give this photo two columns")}
      aria-pressed={span.columns === 2}
      onclick={() => app.toggleWider()}
    >
      {tr("Wider")}
    </button>
    <button type="button" id="span-taller" title={tr("Give this photo more rows")} onclick={() => app.cycleTaller()}>{taller}</button>
    <button
      type="button"
      id="span-reset"
      title={tr("Back to its normal size")}
      disabled={span.columns === 1 && span.rows === 1}
      onclick={() => app.resetSpan()}
    >
      {tr("Normal size")}
    </button>
    <button
      type="button"
      id="crop-toggle"
      title={tr("Choose which part of the photo shows")}
      aria-pressed={app.cropping}
      onclick={() => app.toggleCrop()}
    >
      {tr("Crop")}
    </button>
    <button type="button" id="remove-selected" title={tr("Take this photo out of the collage")} class="danger" onclick={() => app.removeSelected()}>
      {tr("Remove selected photo")}
    </button>
  </fieldset>
  {#if app.book}
    <label class="field move-page" for="move-page">
      <span>{tr("Page")}</span>
      <select
        id="move-page"
        value={String(app.selectedPage)}
        onchange={(e) => app.moveSelectedToPage(Number(e.currentTarget.value))}
      >
        {#each Array.from({ length: app.pageCount }, (_, i) => i) as page (page)}
          <option value={String(page)}>{tr("Page %(n)s", { n: page + 1 })}</option>
        {/each}
      </select>
    </label>
  {/if}
  {#if app.cropping}
    <div class="crop-tools" id="crop-tools">
      <label for="crop-zoom">{tr("Zoom")}</label>
      <input
        id="crop-zoom"
        type="range"
        min="1"
        max={app.maxZoom}
        step="0.01"
        value={zoom}
        oninput={(e) => app.zoomSelectedCrop(Number(e.currentTarget.value))}
      />
      <button type="button" id="crop-reset" title={tr("Show the middle of the photo again")} disabled={!crop} onclick={() => app.resetCrop()}>
        {tr("Reset crop")}
      </button>
      <p class="hint">{tr("Drag the photo to move it, scroll or use the slider to zoom.")}</p>
    </div>
  {/if}
</section>
