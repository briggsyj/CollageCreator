// SPDX-License-Identifier: GPL-2.0-or-later

import { t } from "../i18n";
import { app } from "./app-state.svelte";

/** Translate for display: reading the language here makes the text change with it. */
export function tr(key: string, params?: Record<string, string | number>): string {
  void app.lang;
  return t(key, params);
}
