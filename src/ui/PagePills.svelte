<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { SPLIT_MARGIN } from "../render/splitmarks";
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  /** Narrower than this a page has no room for its pill; the Photos step has the same buttons. */
  const FULL = 190;
  const COMPACT = 136;

  const box = $derived(app.posterBox);
  const pages = $derived(app.layout?.pages ?? []);
  /** A page made for a post has cut marks above it; the pill sits above those. */
  const lift = $derived(app.isSplit ? SPLIT_MARGIN + 10 : 10);
</script>

{#if box && app.hasPhotos && app.book}
    {#each pages as page, k (k)}
      {@const width = page.w * box.w}
      {@const count = app.pageCounts[k] ?? 0}
      {#if width >= COMPACT}
        <div
          class="page-pill"
          class:compact={width < FULL}
          role="group"
          aria-label={tr("Page %(n)s of %(total)s", { n: k + 1, total: pages.length })}
          style:left={`${box.x + (page.x + page.w / 2) * box.w}px`}
          style:top={`${box.y - lift}px`}
        >
          {#if width >= FULL}
            <span class="page-label">
              {tr("Page %(n)s", { n: k + 1 })}
              <span class="page-count">· {count}</span>
            </span>
          {/if}
          <button
            type="button"
            class="icon-btn page-left"
            aria-label={tr("Move page %(n)s left", { n: k + 1 })}
            disabled={k === 0}
            onclick={() => app.movePage(k, -1)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button
            type="button"
            class="icon-btn page-right"
            aria-label={tr("Move page %(n)s right", { n: k + 1 })}
            disabled={k === pages.length - 1}
            onclick={() => app.movePage(k, 1)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
          <button
            type="button"
            class="icon-btn page-save"
            aria-label={tr("Save page %(n)s", { n: k + 1 })}
            disabled={count === 0}
            onclick={() => void app.save(k)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn page-remove"
            aria-label={tr("Remove page %(n)s", { n: k + 1 })}
            onclick={() => app.askRemovePage(k)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      {/if}
    {/each}
{/if}

{#if app.hasPhotos && app.pageCount < app.maxPages}
    <button
      type="button"
      id="add-page-tile"
      class="add-page"
      onclick={() => app.addPage()}
    >
      <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      <span>{tr("Add page")}</span>
    </button>
{/if}
