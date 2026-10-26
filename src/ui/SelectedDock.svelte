<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const span = $derived(app.selectedPhoto?.span ?? { columns: 1, rows: 1 });
  const taller = $derived(span.rows > 1 ? `${tr("Taller")} ×${span.rows}` : tr("Taller"));
</script>

<!-- Shown for the selected photo: under the list on wide screens, a bar above the tabs on phones. -->
<section class="dock" id="selected-dock" aria-label="Selected photo" hidden={!app.selectedPhoto}>
  <div class="rowhead">
    <h3 id="dock-name">{app.selectedPhoto?.name ?? ""}</h3>
    <button type="button" id="dock-done" class="link" onclick={() => app.deselect()}>
      {tr("Done")}
    </button>
  </div>
  <fieldset id="span-group" class="span-group">
    <legend class="sr-only">{tr("Size of the selected photo")}</legend>
    <button
      type="button"
      id="span-wider"
      aria-pressed={span.columns === 2}
      onclick={() => app.toggleWider()}
    >
      {tr("Wider")}
    </button>
    <button type="button" id="span-taller" onclick={() => app.cycleTaller()}>{taller}</button>
    <button
      type="button"
      id="span-reset"
      disabled={span.columns === 1 && span.rows === 1}
      onclick={() => app.resetSpan()}
    >
      {tr("Normal size")}
    </button>
    <button type="button" id="remove-selected" class="danger" onclick={() => app.removeSelected()}>
      {tr("Remove selected photo")}
    </button>
  </fieldset>
</section>
