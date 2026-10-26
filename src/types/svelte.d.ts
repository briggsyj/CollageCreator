// SPDX-License-Identifier: GPL-2.0-or-later

declare module "*.svelte" {
  import type { Component } from "svelte";

  const component: Component;
  export default component;
}
