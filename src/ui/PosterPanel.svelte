<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { normaliseSplit, SPLIT_SIDE_MIN } from "../core/split";
  import { showValue } from "./actions";
  import { app } from "./app-state.svelte";
  import {
    findPreset,
    type Orientation,
    orientationOf,
    PRESETS,
    SIZE_CHOICES,
    sizeOf,
  } from "./presets";
  import { tr } from "./tr.svelte";

  const shape = $derived<Orientation>(app.portrait ? "portrait" : "landscape");
  const orientation = $derived(orientationOf(app.settings.width, app.settings.height));
  const presetIndex = $derived(findPreset(app.settings.width, app.settings.height));
  const GROUPS = { screen: "Screen", print: "Print" } as const;
  const groups = $derived(
    (["screen", "print"] as const).map((group) => ({
      group,
      choices: SIZE_CHOICES.filter((c) => c.group === group),
    })),
  );
  const split = $derived(app.settings.splitImages);
  const side = $derived(app.settings.height);

  function sizeFromFields(form: HTMLElement): void {
    const width = Number((form.querySelector("#width") as HTMLInputElement).value);
    const height = Number((form.querySelector("#height") as HTMLInputElement).value);
    app.customSize = true;
    app.commitSize(width, height);
  }

  let row: HTMLElement;
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<section
  class="tabpanel"
  id="panel-poster"
  role="tabpanel"
  aria-labelledby="tab-poster"
  hidden={app.tab !== "poster"}
>
  <section aria-labelledby="pages-h" id="pages-block" hidden={!app.book}>
    <h3 id="pages-h">{tr("Pages")}</h3>
    <p class="hint" id="pages-count">
      {tr("%(pages)s page(s), %(photos)s photo(s)", {
        pages: app.pageCount,
        photos: app.photos.length,
      })}
    </p>
    <div class="field">
      <span>{tr("Photos per page")}</span>
      <div class="stepper">
        <button
          type="button"
          id="per-page-less"
          class="sq"
          aria-label={tr("Fewer photos per page")}
          disabled={app.perPage <= app.perPageMin}
          onclick={() => app.setPerPage(app.perPage - 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <input
          id="per-page"
          type="number"
          min={app.perPageMin}
          max={app.perPageMax}
          step="1"
          inputmode="numeric"
          use:showValue={{ value: String(app.perPage), again: app.sizeEpoch }}
          onchange={(e) => {
            app.setPerPage(Number(e.currentTarget.value));
            e.currentTarget.value = String(app.perPage);
          }}
        />
        <button
          type="button"
          id="per-page-more"
          class="sq"
          aria-label={tr("More photos per page")}
          disabled={app.perPage >= app.perPageMax}
          onclick={() => app.setPerPage(app.perPage + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </div>
    <button
      type="button"
      id="spread-pages"
      class="wide"
      disabled={!app.hasPhotos}
      onclick={() => app.spreadPhotos()}
    >
      {tr("Spread evenly")}
    </button>
    <p class="hint">
      {tr(
        "New photos fill the pages in order and a page is added when all are full. Add a page with the button under the last page. Each page is saved as its own image; several are saved as a zip.",
      )}
    </p>
  </section>

  <section aria-labelledby="size-h">
    <h3 id="size-h">{tr("Output image size")}</h3>
    <fieldset id="size-choices" class="choices group" aria-labelledby="size-h">
      {#each groups as { group, choices } (group)}
        <p class="group-label">{tr(GROUPS[group])}</p>
        {#each choices as choice (choice.id)}
          {@const size = sizeOf(choice, shape)}
          <button
            type="button"
            class="chip"
            data-choice={choice.id}
            aria-pressed={app.activeSize === choice.id}
            onclick={() => app.chooseNamedSize(choice.id)}
          >
            <span>{tr(choice.label)}</span>
            <small>{size.width} × {size.height}</small>
          </button>
        {/each}
      {/each}
      <p class="group-label">{tr("Social")}</p>
      <button
        type="button"
        class="chip"
        data-choice="post"
        aria-pressed={app.activeSize === "post"}
        onclick={() => app.chooseInstagramPost()}
      >
        <span>{tr("Instagram post")}</span>
        <small>{tr("Several square images")}</small>
      </button>
      <button
        type="button"
        class="chip wide-chip"
        data-choice="custom"
        aria-pressed={app.activeSize === "custom"}
        onclick={() => {
          app.chooseCustomSize();
          row.querySelector<HTMLInputElement>("#width")?.focus();
        }}
      >
        <span>{tr("Custom")}</span>
      </button>
    </fieldset>
    <fieldset class="seg group" id="orientation" aria-label="Orientation">
      <button
        type="button"
        id="orient-landscape"
        aria-pressed={orientation === "landscape"}
        disabled={split > 1}
        onclick={() => app.turn(false)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" /></svg>
        <span>{tr("Landscape")}</span>
      </button>
      <button
        type="button"
        id="orient-portrait"
        aria-pressed={orientation === "portrait"}
        disabled={split > 1}
        onclick={() => app.turn(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2" /></svg>
        <span>{tr("Portrait")}</span>
      </button>
    </fieldset>
    <div class="size-row" bind:this={row}>
      <label class="field">
        <span><span>{tr("Width")}</span> (px)</span>
        <input
          id="width"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          disabled={split > 1}
          use:showValue={{ value: String(app.settings.width), again: app.sizeEpoch }}
          oninput={(e) => sizeFromFields(e.currentTarget.closest(".size-row") as HTMLElement)}
          onchange={(e) => sizeFromFields(e.currentTarget.closest(".size-row") as HTMLElement)}
        />
      </label>
      <span class="times" aria-hidden="true">×</span>
      <label class="field">
        <span><span>{tr("Height")}</span> (px)</span>
        <input
          id="height"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          disabled={split > 1}
          use:showValue={{ value: String(app.settings.height), again: app.sizeEpoch }}
          oninput={(e) => sizeFromFields(e.currentTarget.closest(".size-row") as HTMLElement)}
          onchange={(e) => sizeFromFields(e.currentTarget.closest(".size-row") as HTMLElement)}
        />
      </label>
    </div>
    <div id="split-controls" class="split-controls" hidden={split <= 1}>
      <div class="field">
        <span>{tr("Number of images")}</span>
        <div class="stepper">
          <button
            type="button"
            id="split-less"
            class="sq"
            aria-label="Fewer images"
            disabled={split <= app.splitMin}
            onclick={() => app.setSplit(split - 1, side, true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
          </button>
          <input
            id="split-count"
            type="number"
            min="2"
            max="20"
            step="1"
            inputmode="numeric"
            use:showValue={{ value: String(split), again: app.sizeEpoch }}
            onchange={(e) => {
              const n = normaliseSplit(Number(e.currentTarget.value));
              if (n === 0) e.currentTarget.value = String(split);
              else app.setSplit(n, side, true);
            }}
          />
          <button
            type="button"
            id="split-more"
            class="sq"
            aria-label="More images"
            disabled={split >= app.splitMax}
            onclick={() => app.setSplit(split + 1, side, true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
      </div>
      <label class="field">
        <span>{tr("Size of each image (px)")}</span>
        <input
          id="split-size"
          type="number"
          min="16"
          step="1"
          inputmode="numeric"
          use:showValue={{ value: String(side), again: app.sizeEpoch }}
          onchange={(e) => {
            const value = Number(e.currentTarget.value);
            if (Number.isFinite(value) && value >= SPLIT_SIDE_MIN) app.setSplit(split, value, true);
            else e.currentTarget.value = String(side);
          }}
        />
      </label>
      <p id="split-hint" class="hint">
        {tr(
          "The collage is made as one wide picture and cut into %(n)s squares when you save. Use Columns to change how it is arranged.",
          { n: split },
        )}
      </p>
    </div>
    <p id="book-size-hint" class="hint" hidden={!app.book}>
      {tr("In a book, this is the size of each page.")}
    </p>
    <p id="size-note" class="hint">{app.sizeNote}</p>
    <p id="split-note" class="hint" hidden={split <= 1}>
      {tr(
        "Dashed lines mark where the collage is split into %(n)s images of %(px)s × %(px)s pixels. They are saved as a zip, numbered _1 to _%(n)s from left to right.",
        { n: split, px: side },
      )}
    </p>
    <!-- The list behind the buttons above: kept in step with them, for keyboards and tests. -->
    <label class="sr-only">
      <span>{tr("Apply a template:")}</span>
      <select
        id="preset"
        tabindex="-1"
        use:showValue={{
          value: presetIndex >= 0 ? String(presetIndex) : "custom",
          again: app.sizeEpoch,
        }}
        onchange={(e) => {
          const p = PRESETS[Number(e.currentTarget.value)];
          app.customSize = false;
          if (p) app.chooseSize(p.width, p.height);
        }}
      >
        {#each PRESETS as p, i (p.label)}
          <option value={String(i)}>{p.label}</option>
        {/each}
        <option value="custom">—</option>
      </select>
    </label>
  </section>
</section>
