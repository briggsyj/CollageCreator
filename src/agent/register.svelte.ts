// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { AppState } from "../ui/app-state.svelte";
import { agentSupported, registerAll } from "./context";
import { makeKit } from "./kit";
import { pageTools } from "./tools/pages";
import { photoTools } from "./tools/photos";
import { readTools } from "./tools/read";
import { saveTools } from "./tools/save";
import { sizeTools } from "./tools/size";
import { styleTools } from "./tools/style";
import { viewTools } from "./tools/view";
import type { Tool } from "./types";

/** Every tool the app offers an assistant. */
export function buildTools(app: AppState): Tool[] {
  const kit = makeKit(app);
  return [
    ...readTools(kit),
    ...photoTools(kit),
    ...pageTools(kit),
    ...styleTools(kit),
    ...sizeTools(kit),
    ...viewTools(kit),
    ...saveTools(kit),
  ];
}

/**
 * Offer the app's actions to the browser's assistant, if the browser has WebMCP. The tools are
 * registered again when the language changes, so their descriptions follow it.
 */
export function registerAgentTools(app: AppState): void {
  if (!agentSupported()) return;
  let remove: () => void = () => {};
  $effect.root(() => {
    $effect(() => {
      void app.lang;
      remove();
      remove = registerAll(buildTools(app));
    });
  });
  addEventListener("pagehide", () => remove());
}
