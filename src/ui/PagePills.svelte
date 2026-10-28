<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { SPLIT_MARGIN } from "../render/splitmarks";
  import { app } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  /** Narrower than this a page has no room for its pill; the Photos step has the same buttons. */
  // A little wider than each kind of pill, so neighbouring pills never touch.
  const FULL = 240;
  const COMPACT = 156;

  const box = $derived(app.posterBox);
  const pages = $derived(app.layout?.pages ?? []);
  /** A page made for a post has cut marks above it; the pill sits above those. */
  const lift = $derived(app.isSplit ? SPLIT_MARGIN + 10 : 10);
  const below = $derived(app.isSplit ? SPLIT_MARGIN + 12 : 12);
  /** Under the last page, at its right edge. */
  const addAt = $derived(box ? { left: box.x + box.w, top: box.y + box.h + below } : null);
  /**
   * Where the add button was when the pointer came onto it. Adding a page makes every page
   * smaller, so the button would move away from under the pointer; it stays put until the
   * pointer leaves, so a second click lands on it too.
   */
  let held = $state<{ left: number; top: number } | null>(null);
  const addPos = $derived(held ?? addAt);
  /** The last page's width on screen: the add button hides when the pills would (zoomed out). */
  const lastWidth = $derived.by(() => {
    if (!box) return 0;
    const last = pages[pages.length - 1];
    return last ? last.w * box.w : box.w;
  });
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
            title={tr("Move page %(n)s left", { n: k + 1 })}
            aria-label={tr("Move page %(n)s left", { n: k + 1 })}
            disabled={k === 0}
            onclick={() => app.movePage(k, -1)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button
            type="button"
            class="icon-btn page-right"
            title={tr("Move page %(n)s right", { n: k + 1 })}
            aria-label={tr("Move page %(n)s right", { n: k + 1 })}
            disabled={k === pages.length - 1}
            onclick={() => app.movePage(k, 1)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
          <button
            type="button"
            class="icon-btn page-save"
            title={tr("Save page %(n)s", { n: k + 1 })}
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
            title={tr("Remove page %(n)s", { n: k + 1 })}
            aria-label={tr("Remove page %(n)s", { n: k + 1 })}
            onclick={() => app.askRemovePage(k)}
          >
            <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      {/if}
    {/each}
{/if}

{#if box && app.hasPhotos && app.pageCount < app.maxPages && lastWidth >= COMPACT}
    <button
      type="button"
      id="add-page-tile"
      title={tr("Add a blank page after the last one")}
      class="add-page"
      style:left={`${addPos?.left ?? 0}px`}
      style:top={`${addPos?.top ?? 0}px`}
      onpointerenter={() => (held = addAt)}
      onpointerleave={() => (held = null)}
      onclick={() => app.addPage()}
    >
      <svg class="page-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      <span>{tr("Add page")}</span>
    </button>
{/if}
