// SPDX-License-Identifier: GPL-2.0-or-later

import { mount } from "svelte";
import App from "./ui/App.svelte";

const target = document.getElementById("root");
if (!target) throw new Error("missing #root");
mount(App, { target });
