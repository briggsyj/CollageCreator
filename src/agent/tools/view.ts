// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { languages, t } from "../../i18n";
import type { Tab } from "../../ui/app-state.svelte";
import { numberIn } from "../args";
import { type Kit, tool } from "../kit";
import { done, refused } from "../result";
import type { Tool } from "../types";

const TABS: Tab[] = ["photos", "poster", "style", "save"];

export function viewTools(kit: Kit): Tool[] {
  const { app } = kit;
  return [
    tool(
      "open_tab",
      t("Open a step of the sidebar: photos, poster (pages and size), style or save."),
      { tab: { type: "string", enum: TABS } },
      (a) => {
        const tab = TABS.find((x) => x === a.tab);
        if (!tab) return refused("bad-value", t("Tabs: %(list)s.", { list: TABS.join(", ") }));
        app.setTab(tab, false);
        return done(t("Opened %(tab)s.", { tab: app.tab }));
      },
      { required: ["tab"] },
    ),
    tool(
      "zoom_view",
      t("Zoom the preview: to a percentage, by a factor, or fit the whole collage."),
      {
        percent: { type: "number", minimum: 1 },
        factor: { type: "number", exclusiveMinimum: 0 },
        fit: { type: "boolean" },
      },
      (a) => {
        if (a.fit === true) {
          app.fitView();
          return done(t("Fitted."));
        }
        const percent = a.percent === undefined ? undefined : numberIn(a.percent, 1, 10000);
        const factor = a.factor === undefined ? undefined : numberIn(a.factor, 0.01, 100);
        if (percent === undefined && factor === undefined) {
          return refused("bad-value", t("Give percent, factor or fit."));
        }
        app.zoomAtCentre(factor ?? (percent as number) / Math.max(1, app.zoomPercent));
        return done(t("Zoom: %(n)s%%.", { n: Math.round(app.zoomPercent) }));
      },
    ),
    tool(
      "pan_view",
      t("Move the preview by dx and dy screen pixels."),
      { dx: { type: "number" }, dy: { type: "number" } },
      (a) => {
        const dx = numberIn(a.dx ?? 0, -20000, 20000);
        const dy = numberIn(a.dy ?? 0, -20000, 20000);
        if (dx === undefined || dy === undefined) return refused("out-of-range", t("Too far."));
        app.panBy(dx, dy);
        return done(t("Moved."));
      },
    ),
    tool(
      "set_language",
      t("Change the language of the app. Codes: %(list)s.", { list: languages.join(", ") }),
      { code: { type: "string", enum: languages } },
      (a) => {
        const code = languages.find((l) => l === a.code);
        if (!code)
          return refused("bad-value", t("Languages: %(list)s.", { list: languages.join(", ") }));
        app.chooseLanguage(code);
        return done(t("Language: %(code)s.", { code }));
      },
      { required: ["code"] },
    ),
    tool(
      "open_dialog",
      t("Open the Help or About dialog."),
      { name: { type: "string", enum: ["help", "about"] } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        if (a.name !== "help" && a.name !== "about") {
          return refused("bad-value", t("The dialog is help or about."));
        }
        app.dialog = a.name;
        return done(t("Opened %(name)s.", { name: a.name }));
      },
      { required: ["name"] },
    ),
    tool("close_dialog", t("Close the Help or About dialog."), {}, () => {
      if (app.dialog !== "help" && app.dialog !== "about") {
        return refused("not-supported", t("No Help or About dialog is open."));
      }
      app.dialog = null;
      return done(t("Closed."));
    }),
  ];
}
