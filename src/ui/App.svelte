<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { onMount } from "svelte";
  import { app } from "./app-state.svelte";
  import { backdropColours } from "./backdrop";
  import Dialogs from "./Dialogs.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Stage from "./Stage.svelte";

  const colours = $derived(backdropColours(app.photoColours));
  let fileInput: HTMLInputElement;

  onMount(() => {
    const narrow = window.matchMedia("(max-width: 760px)");
    app.narrow = narrow.matches;
    const onNarrow = () => {
      app.narrow = narrow.matches;
      app.setTab(app.tab, false);
    };
    narrow.addEventListener("change", onNarrow);
    app.fileInput = fileInput;
    app.setTab("photos", false);
    app.start();
    // The controls respond from here on. Exposed for tests, which must not press a tab earlier.
    document.documentElement.dataset.appReady = "true";
    return () => narrow.removeEventListener("change", onNarrow);
  });

  // Nothing is saved until saved work has been restored, or it would overwrite it. The photos
  // and settings are kept in this browser shortly after the last change.
  $effect(() => {
    if (!app.persistReady) return;
    void app.photos;
    void app.seed;
    void app.columns;
    void app.pageCount;
    void app.layoutStyle;
    void $state.snapshot(app.settings);
    // `data-saving` lets tests (and anyone curious) see when the latest change has been kept.
    const root = document.documentElement;
    let current = true;
    root.dataset.saving = "true";
    const timer = setTimeout(() => {
      void app.persist().finally(() => {
        if (current) root.dataset.saving = "false";
      });
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  });

  function addFromInput(): void {
    const files = Array.from(fileInput.files ?? []);
    fileInput.value = "";
    void app.addFiles(files);
  }
</script>

<svelte:window
  onpopstate={() => app.onPopState()}
  ondragover={(e) => {
    // Only files from outside are added; photos dragged between pages are handled where dropped.
    if (!e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    document.body.classList.add("dragging");
  }}
  ondragleave={(e) => {
    if (!e.relatedTarget) document.body.classList.remove("dragging");
  }}
  ondrop={(e) => {
    if (!e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    document.body.classList.remove("dragging");
    void app.addFiles(Array.from(e.dataTransfer?.files ?? []));
  }}
/>

<div class="backdrop" id="backdrop" aria-hidden="true">
  {#each colours as colour, i (i)}<i style:--c={colour}></i>{/each}
</div>

<div
  class="app"
  id="app"
  data-tab={app.tab}
  data-open={String(app.sheetOpen)}
  data-empty={String(!app.hasPhotos)}
  data-menu={app.menuOpen ? "open" : "closed"}
>
  <input
    id="file-input"
    type="file"
    accept="image/*,.heic,.heif,.zip,application/zip"
    multiple
    hidden
    bind:this={fileInput}
    onchange={addFromInput}
  />
  <Sidebar />
  <Stage />
</div>

<Dialogs />
