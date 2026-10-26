// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

declare module "*.svelte" {
  import type { Component } from "svelte";

  const component: Component;
  export default component;
}
