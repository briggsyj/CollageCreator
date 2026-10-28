<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { MAX_COLUMNS, normaliseColumns } from "../core/layout";
  import type { CornerStyle } from "../core/types";
  import { showValue } from "./actions";
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  const SWATCHES = [
    { name: "White", color: "#ffffff" },
    { name: "Black", color: "#111111" },
    { name: "Cream", color: "#f1e7d0" },
    // Muted, so the photos stay the focus: a green, a cool blue and a warm clay.
    { name: "Sage", color: "#a3b18a" },
    { name: "Dusty blue", color: "#8aa1b5" },
    { name: "Terracotta", color: "#c8785a" },
  ];
  const CORNERS: { value: CornerStyle; label: string }[] = [
    { value: "none", label: "Square" },
    { value: "slight", label: "Slight" },
    { value: "rounded", label: "Rounded" },
  ];

  const gallery = $derived(app.layoutStyle === "gallery");
  const percent = $derived(Math.round(app.settings.borderWidth * 1000) / 10);
  const rangeFill = (value: number, min: number, max: number) =>
    `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%`;
  /** Bumped when the columns field should show the stored value again (the edit is done). */
  let tidy = $state(0);

  function applyColumns(raw: string): void {
    const text = raw.trim();
    app.setColumns(text === "" ? undefined : normaliseColumns(Number(text)));
  }

  function setBorderWidth(raw: string): void {
    const pct = Number(raw);
    app.settings.borderWidth = Number.isFinite(pct) ? Math.min(20, Math.max(0, pct)) / 100 : 0;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<section
  class="tabpanel"
  id="panel-style"
  role="tabpanel"
  aria-labelledby="tab-style"
  hidden={app.tab !== "style"}
>
  <section class="panel-card" aria-labelledby="layout-h">
    <h3 id="layout-h" class="card-title">{tr("Arrangement")}</h3>
    <fieldset class="cards layout-cards group" id="layout-cards" aria-labelledby="layout-h">
      <button
        type="button"
        class="card"
        id="layout-mosaic"
        title={tr("Mosaic: photos fill columns of different heights")}
        aria-pressed={!gallery}
        onclick={() => app.chooseLayout("mosaic")}
      >
        <span class="card-head">
          <svg viewBox="0 0 40 30" aria-hidden="true">
            <rect x="1" y="1" width="8" height="12" rx="1.5" />
            <rect x="1" y="15" width="8" height="14" rx="1.5" />
            <rect x="11" y="1" width="8" height="16" rx="1.5" />
            <rect x="11" y="19" width="8" height="10" rx="1.5" />
            <rect x="21" y="1" width="8" height="9" rx="1.5" />
            <rect x="21" y="12" width="8" height="17" rx="1.5" />
            <rect x="31" y="1" width="8" height="13" rx="1.5" />
            <rect x="31" y="16" width="8" height="13" rx="1.5" />
          </svg>
          <b>{tr("Mosaic")}</b>
        </span>
        <small>{tr("Photos fill columns of different heights.")}</small>
      </button>
      <button
        type="button"
        class="card"
        id="layout-gallery"
        title={tr("Gallery: one panel per photo")}
        aria-pressed={gallery}
        onclick={() => app.chooseLayout("gallery")}
      >
        <span class="card-head">
          <svg viewBox="0 0 40 30" aria-hidden="true">
            <rect x="1" y="1" width="17" height="16" rx="1.5" />
            <rect x="1" y="19" width="8" height="10" rx="1.5" />
            <rect x="11" y="19" width="7" height="10" rx="1.5" />
            <rect x="20" y="1" width="19" height="9" rx="1.5" />
            <rect x="20" y="12" width="9" height="17" rx="1.5" />
            <rect x="31" y="12" width="8" height="17" rx="1.5" />
          </svg>
          <b>{tr("Gallery")}</b>
        </span>
        <small>{tr("The collage is split into panels, one per photo.")}</small>
      </button>
    </fieldset>
    <div id="columns-block" class="columns-block" hidden={gallery}>
      <div class="inline-row">
        <label for="columns">{tr("Columns")}</label>
        <div class="stepper mini">
          <button
            type="button"
            id="columns-less"
            title={tr("One column fewer")}
            class="sq"
            aria-label="Fewer columns"
            onclick={() => app.stepColumns(-1)}
          >
            <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
          </button>
          <input
            id="columns"
            type="number"
            min="1"
            max={MAX_COLUMNS}
            step="1"
            inputmode="numeric"
            placeholder={app.columnsInUse === undefined
              ? tr("Auto")
              : tr("Auto · %(n)s", { n: app.columnsInUse })}
            title={tr("Type a number of columns, or leave empty for automatic")}
            use:showValue={{
              value: app.columns === undefined ? "" : String(app.columns),
              again: tidy,
            }}
            oninput={(e) => applyColumns(e.currentTarget.value)}
            onchange={(e) => {
              applyColumns(e.currentTarget.value);
              tidy++;
            }}
          />
          <button
            type="button"
            id="columns-more"
            title={tr("One column more")}
            class="sq"
            aria-label="More columns"
            onclick={() => app.stepColumns(1)}
          >
            <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <!-- Only needed once the columns are set by hand. -->
          <button
            type="button"
            id="columns-auto"
            class="mini-btn"
            title={tr("Let the layout choose the columns")}
            hidden={app.columns === undefined}
            onclick={() => app.setColumns(undefined)}
          >
            {tr("Auto")}
          </button>
        </div>
      </div>
      <p id="columns-note" class="hint sr-only">
        {app.columnsInUse !== undefined
          ? tr("Columns in use: %(n)s", { n: app.columnsInUse })
          : ""}
      </p>
    </div>
    <p id="gallery-note" class="hint" hidden={!gallery}>{tr("Gallery sizes its panels itself.")}</p>
    <div class="inline-row">
      <span
        id="crop-note"
        class="trim"
        title={tr("Lower means more of each photo is visible.")}
      >{app.layout ? tr("%(pct)s% of each photo is trimmed to fit.", { pct: app.cropPercent }) : ""}</span>
      <button
        type="button"
        id="regenerate"
        class="mini-btn"
        title={tr("Try a new arrangement of the same photos")}
        onclick={() => app.shuffle()}
      >
        <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 4v7h-7" />
        </svg>
        <span>{tr("Shuffle")}</span>
      </button>
    </div>
    <button
      type="button"
      id="shuffle-pages"
      title={tr("Mix the photos between the pages, keeping how many each has")}
      class="mini-btn"
      hidden={!app.book}
      onclick={() => app.shufflePages()}
    >
      <svg class="ico16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h11l-3-3M20 17H9l3 3" />
      </svg>
      <span>{tr("Shuffle photos between pages")}</span>
    </button>
  </section>

  <section class="panel-card" aria-labelledby="border-h">
    <h3 id="border-h" class="card-title">{tr("Border")}</h3>
    <div class="inline-row">
      <span id="bw-h" title={tr("A share of the collage's longer side. 0 removes the border.")}>
        {tr("Thickness")}
      </span>
      <input
        id="border-width"
        class="range"
        type="range"
        min="0"
        max="20"
        step="0.1"
        aria-labelledby="bw-h"
        title={tr("A share of the collage's longer side. 0 removes the border.")}
        style:--p={rangeFill(percent, 0, 20)}
        use:showValue={{ value: String(percent), again: app.restoreEpoch, sticky: true }}
        oninput={(e) => setBorderWidth(e.currentTarget.value)}
      />
      <output id="border-output" for="border-width">{percent}%</output>
    </div>
    <div class="inline-row">
      <span id="bc-h">{tr("Colour")}</span>
      <fieldset class="swatches group" id="swatches" aria-labelledby="bc-h">
        {#each SWATCHES as { name, color } (color)}
          <button
            type="button"
            data-color={color}
            aria-label={name}
            title={name}
            aria-pressed={app.settings.borderColor.toLowerCase() === color}
            style:background={color}
            onclick={() => (app.settings.borderColor = color)}
          ></button>
        {/each}
        <input
          id="border-color"
          class="custom-swatch"
          type="color"
          aria-label={tr("Custom colour")}
          title={tr("Custom colour")}
          value={app.settings.borderColor}
          oninput={(e) => (app.settings.borderColor = e.currentTarget.value)}
        />
      </fieldset>
    </div>
    <div class="inline-row">
      <span id="cs-h">{tr("Corners")}</span>
      <fieldset class="seg corners-seg group" id="corner-cards" aria-labelledby="cs-h">
        {#each CORNERS as { value, label } (value)}
          <button
            type="button"
            data-corner={value}
            title={tr(label)}
            aria-label={tr(label)}
            aria-pressed={app.settings.cornerStyle === value}
            onclick={() => (app.settings.cornerStyle = value)}
          >
            <span class="shape {value}"></span>
          </button>
        {/each}
      </fieldset>
    </div>
    <label class="sr-only">
      <span>{tr("Corner style")}</span>
      <select
        id="corner-style"
        tabindex="-1"
        use:showValue={{ value: app.settings.cornerStyle }}
        onchange={(e) => {
          const v = e.currentTarget.value;
          app.settings.cornerStyle = v === "slight" || v === "rounded" ? v : "none";
        }}
      >
        <option value="none">{tr("None")}</option>
        <option value="slight">{tr("Slightly rounded")}</option>
        <option value="rounded">{tr("Rounded")}</option>
      </select>
    </label>
    <label
      class="switch"
      for="outer-border"
      title={tr("Turn off to keep the border only between photos.")}
    >
      <span>{tr("Around the edge")}</span>
      <input
        id="outer-border"
        type="checkbox"
        checked={app.settings.outerBorder}
        onchange={(e) => (app.settings.outerBorder = e.currentTarget.checked)}
      />
    </label>
  </section>

  <details id="technical" class="technical">
    <summary>{tr("Technical configuration")}</summary>
    <label class="field">
      <span>{tr("Seed")}</span>
      <input
        id="seed"
        type="number"
        min="0"
        max="4294967295"
        step="1"
        inputmode="numeric"
        use:showValue={{ value: String(app.seed) }}
        onchange={(e) => {
          if (!app.setSeed(Number(e.currentTarget.value))) {
            e.currentTarget.value = String(app.seed);
          }
        }}
      />
    </label>
    <p class="hint">
      {tr(
        "The same photos, seed and number of columns always give the same layout. When photos are added, the seed of the best of 30 tries is shown here.",
      )}
    </p>
  </details>
</section>
