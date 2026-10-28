<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const span = $derived(app.selectedPhoto?.span ?? { columns: 1, rows: 1 });
  const crop = $derived(app.selectedPhoto?.crop);
  const zoom = $derived(crop?.zoom ?? 1);
  const taller = $derived(span.rows > 1 ? `${tr("Taller")} ×${span.rows}` : tr("Taller"));
  const count = $derived(app.selection.length);
  const many = $derived(count > 1);
</script>

<!-- Shown for the selected photo: under the list on wide screens, a bar above the tabs on phones. -->
<section
  class="dock"
  id="selected-dock"
  aria-label={many ? tr("Selected photos") : tr("Selected photo")}
  hidden={!app.selectedPhoto}
>
  <div class="rowhead">
    <h3 id="dock-name">
      {many ? tr("%(n)s photos selected", { n: count }) : (app.selectedPhoto?.name ?? "")}
    </h3>
    <button type="button" id="dock-done" title={many ? tr("Deselect the photos") : tr("Deselect the photo")} class="link" onclick={() => app.deselect()}>
      {tr("Done")}
    </button>
  </div>
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
  <fieldset id="span-group" class="span-group">
    <legend class="sr-only">{tr("Size of the selected photo")}</legend>
    <button
      type="button"
      id="span-reset"
      title={many ? tr("Back to their default size") : tr("Back to its default size")}
      disabled={!many && span.columns === 1 && span.rows === 1}
      onclick={() => app.resetSpan()}
    >
      {tr("Default size")}
    </button>
    <button
      type="button"
      id="span-wider"
      title={many ? tr("Give these photos two columns") : tr("Give this photo two columns")}
      aria-pressed={span.columns === 2}
      onclick={() => app.toggleWider()}
    >
      <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />
      </svg>
      <span>{tr("Wider")}</span>
    </button>
    <button
      type="button"
      id="span-taller"
      title={many ? tr("Give these photos more rows") : tr("Give this photo more rows")}
      aria-pressed={span.rows > 1}
      onclick={() => app.cycleTaller()}
    >
      <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
      </svg>
      <span>{taller}</span>
    </button>
  </fieldset>
  <!-- Crop: the button and, while it is on, its tools right below it on one shaded panel. -->
  <div class="crop-area" class:open={app.cropping}>
    <button
      type="button"
      id="crop-toggle"
      class="wide"
      title={many
        ? tr("Crop works on one photo at a time")
        : tr("Choose which part of the photo shows")}
      disabled={many}
      aria-pressed={app.cropping}
      aria-expanded={app.cropping}
      aria-controls="crop-tools"
      onclick={() => app.toggleCrop()}
    >
      <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" />
      </svg>
      <span>{app.cropping ? tr("Done cropping") : tr("Crop")}</span>
    </button>
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
        <button
          type="button"
          id="crop-reset"
          title={tr("Show the middle of the photo again")}
          disabled={!crop}
          onclick={() => app.resetCrop()}
        >
          {tr("Reset crop")}
        </button>
        <p class="hint">{tr("Drag the photo to move it, scroll or use the slider to zoom.")}</p>
      </div>
    {/if}
  </div>
  <button
    type="button"
    id="remove-selected"
    class="danger wide"
    title={many ? tr("Take these photos out of the collage") : tr("Take this photo out of the collage")}
    onclick={() => app.removeSelected()}
  >
    {many ? tr("Remove %(n)s photos", { n: count }) : tr("Remove selected photo")}
  </button>
</section>
