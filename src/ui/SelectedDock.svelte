<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const count = $derived(app.selection.length);
  const many = $derived(count > 1);
</script>

<!--
  Shown for the selected photo: under the list on wide screens, a bar above the tabs on phones.
  Its size and crop are changed with the photo actions beside the tools (PhotoActions.svelte).
-->
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
