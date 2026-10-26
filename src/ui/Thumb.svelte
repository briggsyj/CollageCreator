<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<script lang="ts">
  import { drawPhotoCover } from "../render/draw";

  const SIZE = 160;
  let { bitmap }: { bitmap: ImageBitmap } = $props();
  let canvas: HTMLCanvasElement;

  $effect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    drawPhotoCover(ctx, bitmap, bitmap.width, bitmap.height, { x: 0, y: 0, w: SIZE, h: SIZE });
  });
</script>

<canvas bind:this={canvas} width={SIZE} height={SIZE} aria-hidden="true"></canvas>
