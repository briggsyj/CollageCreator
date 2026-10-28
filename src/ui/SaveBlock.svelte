<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { pullToClose, showValue } from "./actions";
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  let { block = $bindable() }: { block?: HTMLElement } = $props();

  const kind = $derived(app.settings.format === "jpeg" ? "JPEG" : "PNG");
  const filledPages = $derived(app.pageCounts.filter((n) => n > 0).length);
  const summary = $derived(
    app.book
      ? filledPages > 1
        ? tr("ZIP of %(n)s %(kind)s images, %(w)s × %(h)s px each", {
            n: filledPages,
            kind,
            w: app.settings.width,
            h: app.settings.height,
          })
        : `${kind}, ${app.settings.width} × ${app.settings.height} px`
      : app.settings.splitImages > 1
        ? tr("ZIP of %(n)s %(kind)s images, %(px)s × %(px)s px each", {
            n: app.settings.splitImages,
            kind,
            px: app.settings.height,
          })
        : `${kind}, ${app.settings.width} × ${app.settings.height} px`,
  );
  /** The first page with photos, for "Save this page" when no photo is selected. */
  const firstFilled = () =>
    Math.max(
      0,
      app.pageCounts.findIndex((n) => n > 0),
    );
  const quality = $derived(Math.round(app.settings.jpegQuality * 100));
</script>

<div class="save-block" id="save-block" bind:this={block}>
  <div class="sheet-head only-narrow" use:pullToClose={() => app.setTab("save", true)}>
    <span class="grab" aria-hidden="true"></span>
    <h2>{tr("Save image")}</h2>
    <button type="button" id="save-close" class="link" onclick={() => app.setTab("save", true)}>
      {tr("Close")}
    </button>
  </div>
  <p id="save-summary" class="meta">{summary}</p>
  <div class="save-opts">
    <fieldset class="seg group" id="format-seg" aria-label="Format">
      <button
        type="button"
        id="format-png"
        aria-pressed={app.settings.format === "png"}
        onclick={() => (app.settings.format = "png")}
      >
        PNG
      </button>
      <button
        type="button"
        id="format-jpeg"
        aria-pressed={app.settings.format === "jpeg"}
        onclick={() => (app.settings.format = "jpeg")}
      >
        JPEG
      </button>
    </fieldset>
    <select
      id="format"
      class="sr-only"
      tabindex="-1"
      aria-label="Format"
      use:showValue={{ value: app.settings.format }}
      onchange={(e) => (app.settings.format = e.currentTarget.value === "jpeg" ? "jpeg" : "png")}
    >
      <option value="png">PNG</option>
      <option value="jpeg">JPEG</option>
    </select>
    <label class="field" id="quality-field" hidden={app.settings.format !== "jpeg"}>
      <span class="rowhead"
        ><span>{tr("JPEG quality")}</span>
        <output id="quality-output" for="quality">{quality}%</output></span
      >
      <input
        id="quality"
        class="range"
        type="range"
        min="10"
        max="100"
        step="1"
        style:--p={`${((quality - 10) / 90) * 100}%`}
        use:showValue={{ value: String(quality), again: app.restoreEpoch, sticky: true }}
        oninput={(e) => (app.settings.jpegQuality = Number(e.currentTarget.value) / 100)}
      />
    </label>
  </div>
  <button
    type="button"
    id="save"
    class="primary wide"
    disabled={!app.hasPhotos}
    onclick={() => void app.save()}
  >
    {app.book ? tr("Save book...") : tr("Save poster...")}
  </button>
  {#if app.book}
    <button
      type="button"
      id="save-page"
      class="wide"
      disabled={!app.hasPhotos}
      onclick={() => void app.save(app.selected === null ? firstFilled() : app.selectedPage)}
    >
      {tr("Save this page")}
    </button>
  {/if}
</div>
