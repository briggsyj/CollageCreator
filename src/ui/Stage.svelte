<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<script lang="ts">
  import { app } from "./app-state.svelte";
  import Preview from "./Preview.svelte";
  import { tr } from "./tr.svelte";

  const summary = $derived.by(() => {
    if (!app.layout) return tr("No photos yet");
    const n = app.photos.length;
    return [
      n === 1 ? tr("1 photo") : tr("%(n)s photos", { n }),
      app.layoutStyle === "gallery"
        ? tr("Gallery")
        : tr("%(n)s columns", { n: app.columnsInUse ?? 0 }),
      tr("%(pct)s% trimmed", { pct: app.cropPercent }),
    ].join(" · ");
  });
  const none = $derived(!app.hasPhotos);
</script>

<main class="stage" aria-label="Preview">
  <p id="hint" class="pill hint-pill">{app.status}</p>
  <div class="tools" id="tools">
    <fieldset class="modes group" id="modes" aria-label="Mode">
      <button
        type="button"
        id="mode-pan"
        aria-pressed={app.activeMode === "pan"}
        aria-keyshortcuts="Space"
        disabled={none}
        onclick={() => app.setMode("pan")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"
          />
        </svg>
        <span>{tr("Pan")}</span>
      </button>
      <button
        type="button"
        id="mode-swap"
        aria-pressed={app.activeMode === "swap"}
        disabled={none}
        onclick={() => app.setMode("swap")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
        </svg>
        <span>{tr("Swap")}</span>
      </button>
      <button
        type="button"
        id="mode-select"
        aria-pressed={app.activeMode === "select"}
        disabled={none}
        onclick={() => app.setMode("select")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3v16l4.2-4 3.3 6.2 2.4-1.3-3.3-6.1H19z" />
        </svg>
        <span>{tr("Select")}</span>
      </button>
    </fieldset>
    <fieldset class="zoomers group" aria-label="Zoom">
      <button
        type="button"
        id="zoom-in"
        class="sq"
        aria-label="Zoom in"
        disabled={none}
        onclick={() => app.zoomAtCentre(1.25)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <button
        type="button"
        id="zoom-out"
        class="sq"
        aria-label="Zoom out"
        disabled={none}
        onclick={() => app.zoomAtCentre(0.8)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
      </button>
      <button
        type="button"
        id="reset-view"
        class="sq"
        aria-label="Fit to window"
        disabled={app.isFit || none}
        onclick={() => app.fitView()}
      >
        {tr("Fit")}
      </button>
      <span id="view-zoom" class="zoom-pct" aria-live="off"
        >{app.isFit ? "" : tr("Zoom: %(pct)s%", { pct: app.zoomPercent })}</span
      >
    </fieldset>
  </div>

  <Preview />

  <button
    type="button"
    id="help-open"
    class="help-btn help-fab"
    aria-haspopup="dialog"
    aria-label="Help"
    onclick={() => (app.dialog = "help")}
  >
    ?
  </button>
  <p id="status-line" class="pill status-pill">{summary}</p>
  <div id="messages" class="sr-only" role="status" aria-live="polite">
    {#if app.status}<div class="status">{app.status}</div>{/if}
    {#each app.messages as m, i (i)}<div class={m.kind}>{m.text}</div>{/each}
  </div>
</main>
