<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<script lang="ts">
  import { languages } from "../i18n";
  import { pullToClose } from "./actions";
  import { app, type Tab } from "./app-state.svelte";
  import PhotosPanel from "./PhotosPanel.svelte";
  import PosterPanel from "./PosterPanel.svelte";
  import SaveBlock from "./SaveBlock.svelte";
  import SelectedDock from "./SelectedDock.svelte";
  import StylePanel from "./StylePanel.svelte";
  import { tr } from "./tr.svelte";

  const TAB_TITLES: Record<Tab, string> = {
    photos: "Photos",
    poster: "Poster",
    style: "Style",
    save: "Save image",
  };

  let sheet: HTMLElement;
  let saveBlock: HTMLElement | undefined = $state();
  let tabList: HTMLElement;
  /** On wide screens the tab bar floats over the step once it is scrolled. */
  let lifted = $state(false);

  /** Raise a sheet from the bottom of the screen (see .rise in the stylesheet). */
  $effect(() => {
    if (app.riseToken === 0) return;
    const el = app.tab === "save" ? saveBlock : sheet;
    if (!el) return;
    el.classList.remove("rise");
    void el.offsetWidth;
    el.classList.add("rise");
  });

  // A new step starts at its top.
  $effect(() => {
    void app.tab;
    sheet.scrollTop = 0;
    lifted = false;
  });

  function arrowKeys(e: KeyboardEvent): void {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const buttons = [...tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter(
      (b) => b.offsetParent !== null,
    );
    const names = buttons.map((b) => b.id.replace("tab-", "") as Tab);
    const at = names.indexOf(app.tab);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = names[(at + step + names.length) % names.length];
    if (!next) return;
    e.preventDefault();
    app.setTab(next, false);
    buttons[names.indexOf(next)]?.focus();
  }

  function languageName(code: string): string {
    try {
      const tag = code.replace("_", "-");
      return new Intl.DisplayNames([tag], { type: "language" }).of(tag) ?? code;
    } catch {
      return code;
    }
  }

  const selected = (name: Tab) => name === app.tab && (!app.narrow || app.sheetOpen);
</script>

<svelte:document
  onclick={(e) => {
    if (!app.menuOpen) return;
    if (e.target instanceof Node && (e.target as Element).closest?.("#util")) return;
    app.closeMenu();
  }}
/>

<aside class="side panel" aria-label="Controls">
  <div class="brand">
    <h1>Collage Creator</h1>
    <div class="brand-actions">
      <button
        type="button"
        id="help-open-head"
        class="icon-btn help-btn"
        aria-haspopup="dialog"
        aria-label="Help"
        onclick={() => (app.dialog = "help")}
      >
        ?
      </button>
      <button
        type="button"
        id="menu-open"
        class="icon-btn menu-btn"
        aria-expanded={app.menuOpen}
        aria-controls="util"
        aria-label="Menu: language and about"
        onclick={(e) => {
          e.stopPropagation();
          app.menuOpen = !app.menuOpen;
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
    </div>
  </div>

  <!-- svelte-ignore a11y_interactive_supports_focus, a11y_no_noninteractive_element_interactions -->
  <div
    class="tabs"
    class:lifted
    id="tabs"
    role="tablist"
    aria-label="Settings"
    bind:this={tabList}
    onkeydown={arrowKeys}
  >
    <button
      type="button"
      role="tab"
      id="tab-photos"
      aria-controls="panel-photos"
      aria-selected={selected("photos")}
      tabindex={app.tab === "photos" ? 0 : -1}
      onclick={() => app.setTab("photos", true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="m21 16-5-5-9 8" />
      </svg>
      <span><span class="num">1. </span><span>{tr("Photos")}</span></span>
    </button>
    <button
      type="button"
      role="tab"
      id="tab-poster"
      aria-controls="panel-poster"
      aria-selected={selected("poster")}
      tabindex={app.tab === "poster" ? 0 : -1}
      onclick={() => app.setTab("poster", true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 3v18M3 12h9M12 8h9" />
      </svg>
      <span><span class="num">2. </span><span>{tr("Poster")}</span></span>
    </button>
    <button
      type="button"
      role="tab"
      id="tab-style"
      aria-controls="panel-style"
      aria-selected={selected("style")}
      tabindex={app.tab === "style" ? 0 : -1}
      onclick={() => app.setTab("style", true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"
        />
      </svg>
      <span><span class="num">3. </span><span>{tr("Style")}</span></span>
    </button>
    <button
      type="button"
      role="tab"
      id="tab-save"
      class="tab-save"
      aria-controls="save-block"
      aria-selected={selected("save")}
      tabindex={app.tab === "save" ? 0 : -1}
      onclick={() => app.setTab("save", true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
      <span>{tr("Save")}</span>
    </button>
  </div>

  <div
    class="sheet"
    id="sheet"
    bind:this={sheet}
    onscroll={() => (lifted = sheet.scrollTop > 1)}
  >
    <div class="sheet-head" use:pullToClose={() => app.setTab(app.tab, true)}>
      <span class="grab" aria-hidden="true"></span>
      <h2 id="sheet-title">{tr(TAB_TITLES[app.tab])}</h2>
      <button type="button" id="sheet-close" class="link" onclick={() => app.setTab(app.tab, true)}>
        {tr("Close")}
      </button>
    </div>
    <PhotosPanel />
    <PosterPanel />
    <StylePanel />
  </div>

  <SelectedDock />
  <SaveBlock bind:block={saveBlock} />

  <div class="util" id="util">
    <div class="util-row">
      <label class="inline">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span class="sr-only">{tr("Language")}</span>
        <select
          id="language"
          value={app.lang}
          onchange={(e) => app.chooseLanguage(e.currentTarget.value)}
        >
          {#each languages as code (code)}
            <option value={code}>{languageName(code)}</option>
          {/each}
        </select>
      </label>
      <button type="button" id="about-open" class="link" onclick={() => (app.dialog = "about")}>
        {tr("About")}
      </button>
    </div>
  </div>
</aside>
