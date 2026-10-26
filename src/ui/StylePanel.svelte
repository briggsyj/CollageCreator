<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
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
  <section aria-labelledby="layout-h">
    <h3 id="layout-h">{tr("Layout")}</h3>
    <fieldset class="cards group" id="layout-cards" aria-labelledby="layout-h">
      <button
        type="button"
        class="card"
        id="layout-mosaic"
        aria-pressed={!gallery}
        onclick={() => app.chooseLayout("mosaic")}
      >
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
        <small>{tr("Photos fill columns of different heights.")}</small>
      </button>
      <button
        type="button"
        class="card"
        id="layout-gallery"
        aria-pressed={gallery}
        onclick={() => app.chooseLayout("gallery")}
      >
        <svg viewBox="0 0 40 30" aria-hidden="true">
          <rect x="1" y="1" width="17" height="16" rx="1.5" />
          <rect x="1" y="19" width="8" height="10" rx="1.5" />
          <rect x="11" y="19" width="7" height="10" rx="1.5" />
          <rect x="20" y="1" width="19" height="9" rx="1.5" />
          <rect x="20" y="12" width="9" height="17" rx="1.5" />
          <rect x="31" y="12" width="8" height="17" rx="1.5" />
        </svg>
        <b>{tr("Gallery")}</b>
        <small>{tr("The poster is split into panels, one per photo.")}</small>
      </button>
    </fieldset>
    <div id="columns-block" class="columns-block" hidden={gallery}>
      <label class="field" for="columns"><span>{tr("Columns")}</span></label>
      <div class="stepper">
        <button
          type="button"
          id="columns-less"
          class="sq"
          aria-label="Fewer columns"
          onclick={() => app.stepColumns(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <input
          id="columns"
          type="number"
          min="1"
          max={MAX_COLUMNS}
          step="1"
          inputmode="numeric"
          placeholder={tr("Auto")}
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
          class="sq"
          aria-label="More columns"
          onclick={() => app.stepColumns(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" id="columns-auto" onclick={() => app.setColumns(undefined)}>
          {tr("Automatic")}
        </button>
      </div>
      <p id="columns-note" class="hint">
        {app.columnsInUse !== undefined
          ? tr("Columns in use: %(n)s", { n: app.columnsInUse })
          : ""}
      </p>
    </div>
    <p id="gallery-note" class="hint" hidden={!gallery}>{tr("Gallery sizes its panels itself.")}</p>
    <p class="trim">
      <strong id="crop-note"
        >{app.layout ? tr("%(pct)s% of each photo is trimmed to fit.", { pct: app.cropPercent }) : ""}</strong
      >
      <span class="hint">{tr("Lower means more of each photo is visible.")}</span>
    </p>
    <button type="button" id="regenerate" class="wide" onclick={() => app.shuffle()}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11a8 8 0 1 0-2.3 5.7" />
        <path d="M20 4v7h-7" />
      </svg>
      <span>{tr("Shuffle layout")}</span>
    </button>
  </section>

  <section aria-labelledby="bw-h">
    <div class="rowhead">
      <h3 id="bw-h">{tr("Border thickness")}</h3>
      <output id="border-output" for="border-width">{percent}%</output>
    </div>
    <input
      id="border-width"
      class="range"
      type="range"
      min="0"
      max="20"
      step="0.1"
      aria-labelledby="bw-h"
      style:--p={rangeFill(percent, 0, 20)}
      use:showValue={{ value: String(percent), again: app.restoreEpoch, sticky: true }}
      oninput={(e) => setBorderWidth(e.currentTarget.value)}
    />
    <p class="hint">{tr("A share of the poster's longer side. 0 removes the border.")}</p>
  </section>

  <section aria-labelledby="bc-h">
    <h3 id="bc-h">{tr("Border colour")}</h3>
    <fieldset class="swatches group" id="swatches" aria-labelledby="bc-h">
      {#each SWATCHES as { name, color } (color)}
        <button
          type="button"
          data-color={color}
          aria-label={name}
          aria-pressed={app.settings.borderColor.toLowerCase() === color}
          style:background={color}
          onclick={() => (app.settings.borderColor = color)}
        ></button>
      {/each}
    </fieldset>
    <label class="custom-colour">
      <span>{tr("Custom…")}</span>
      <input
        id="border-color"
        type="color"
        value={app.settings.borderColor}
        oninput={(e) => (app.settings.borderColor = e.currentTarget.value)}
      />
    </label>
  </section>

  <section aria-labelledby="cs-h">
    <h3 id="cs-h">{tr("Corner style")}</h3>
    <fieldset class="cards corners group" id="corner-cards" aria-labelledby="cs-h">
      {#each CORNERS as { value, label } (value)}
        <button
          type="button"
          class="card"
          data-corner={value}
          aria-pressed={app.settings.cornerStyle === value}
          onclick={() => (app.settings.cornerStyle = value)}
        >
          <span class="shape {value}"></span>
          <span>{tr(label)}</span>
        </button>
      {/each}
    </fieldset>
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
  </section>

  <section>
    <label class="switch" for="outer-border">
      <span>{tr("Border around the whole collage")}</span>
      <input
        id="outer-border"
        type="checkbox"
        checked={app.settings.outerBorder}
        onchange={(e) => (app.settings.outerBorder = e.currentTarget.checked)}
      />
    </label>
    <p class="hint">{tr("Turn off to keep the border only between photos.")}</p>
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
