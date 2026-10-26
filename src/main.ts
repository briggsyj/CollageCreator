// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { mount } from "svelte";
import App from "./ui/App.svelte";

const target = document.getElementById("root");
if (!target) throw new Error("missing #root");
mount(App, { target });
