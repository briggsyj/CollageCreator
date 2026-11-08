<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const span = $derived(app.selectedPhoto?.span ?? { columns: 1, rows: 1 });
  const zoom = $derived(app.selectedPhoto?.crop?.zoom ?? 1);
  const many = $derived(app.multiSelected);
</script>

<!--
  Actions on the selected photos, beside the tools while the Select tool has a selection. They
  look unlike the tools (accent colour, filled when on): they act on the photos, not the view.
-->
<fieldset class="photo-actions group" id="photo-actions" aria-label={tr("Photo actions")}>
  <button
    type="button"
    id="span-wider"
    title={many ? tr("Give these photos two columns") : tr("Give this photo two columns")}
    aria-pressed={span.columns === 2}
    aria-keyshortcuts="W"
    onclick={() => app.toggleWider()}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 12h10M7 12l2-2M7 12l2 2M17 12l-2-2M17 12l-2 2" />
    </svg>
    <span>{tr("Wider")}</span>
  </button>
  <button
    type="button"
    id="span-taller"
    title={many ? tr("Give these photos more rows") : tr("Give this photo more rows")}
    aria-pressed={span.rows > 1}
    aria-keyshortcuts="T"
    onclick={() => app.cycleTaller()}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M12 7v10M12 7l-2 2M12 7l2 2M12 17l-2-2M12 17l2-2" />
    </svg>
    <span>{tr("Taller")}{#if span.rows > 1}{" "}<span class="rows-badge">×{span.rows}</span>{/if}</span>
  </button>
  <span class="actions-sep" aria-hidden="true"></span>
  <button
    type="button"
    id="crop-toggle"
    title={many
      ? tr("Select one photo to crop")
      : app.cropping
        ? tr("Finish cropping")
        : tr("Choose which part of the photo shows")}
    disabled={many}
    aria-pressed={app.cropping}
    aria-expanded={app.cropping}
    aria-controls="crop-tools"
    aria-keyshortcuts="C"
    onclick={() => app.toggleCrop()}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" />
    </svg>
    <span>{tr("Crop")}</span>
  </button>
  {#if app.cropping}
    <div class="crop-tools" id="crop-tools">
      <input
        id="crop-zoom"
        type="range"
        min="1"
        max={app.maxZoom}
        step="0.01"
        value={zoom}
        aria-label={tr("Zoom into the photo; all the way out undoes the crop")}
        title={tr("Zoom into the photo; all the way out undoes the crop")}
        oninput={(e) => app.zoomSelectedCrop(Number(e.currentTarget.value))}
      />
      <span class="crop-pct" aria-hidden="true">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        id="crop-done"
        class="crop-done"
        title={tr("Done cropping")}
        aria-label={tr("Done cropping")}
        aria-keyshortcuts="Enter"
        onclick={() => app.toggleCrop()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </button>
    </div>
  {/if}
</fieldset>
