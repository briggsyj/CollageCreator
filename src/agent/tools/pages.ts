// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { BOOK_MAX_PAGES } from "../../core/book";
import { t } from "../../i18n";
import { wholeIn } from "../args";
import { type Kit, tool } from "../kit";
import { done, refused, waiting } from "../result";
import type { Outcome, Tool } from "../types";

export function pageTools(kit: Kit): Tool[] {
  const { app } = kit;
  const pageArg = (value: unknown): number | undefined => wholeIn(value, 1, app.pageCount);
  /** A question opened means waiting for the person; otherwise the action just happened. */
  const asked = (): Outcome =>
    app.dialog === "confirm" ? waiting(t("Waiting for the person to confirm.")) : done(t("Done."));
  return [
    tool("add_page", t("Add a blank page after the last one."), {}, () => {
      const busy = kit.busy();
      if (busy) return busy;
      if (!app.hasPhotos) return refused("no-photos", t("Add photos first."));
      if (app.pageCount >= BOOK_MAX_PAGES) {
        return refused("out-of-range", t("The most is %(n)s pages.", { n: BOOK_MAX_PAGES }));
      }
      app.addPage();
      return done(t("Added page %(n)s.", { n: app.pageCount }));
    }),
    tool(
      "move_page",
      t("Move a page one place left or right, with its photos."),
      {
        page: { type: "integer", minimum: 1 },
        direction: { type: "string", enum: ["left", "right"] },
      },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const page = pageArg(a.page);
        if (page === undefined || !app.book) {
          return refused("no-such-page", t("There are %(n)s page(s).", { n: app.pageCount }));
        }
        const by = a.direction === "left" ? -1 : a.direction === "right" ? 1 : 0;
        if (by === 0) return refused("bad-value", t("Direction is left or right."));
        if (page - 1 + by < 0 || page - 1 + by >= app.pageCount) {
          return refused("out-of-range", t("That page is already at the end."));
        }
        app.movePage(page - 1, by);
        return done(t("Moved."));
      },
      { required: ["page", "direction"] },
    ),
    tool(
      "set_page_count",
      t("Set the number of pages (1 to 20); the photos are shared evenly across them, in order."),
      { count: { type: "integer", minimum: 1, maximum: BOOK_MAX_PAGES } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const count = wholeIn(a.count, 1, BOOK_MAX_PAGES);
        if (count === undefined) {
          return refused("out-of-range", t("Pages: 1 to %(n)s.", { n: BOOK_MAX_PAGES }));
        }
        app.setPageCount(count);
        return done(t("%(n)s page(s).", { n: count }));
      },
      { required: ["count"] },
    ),
    tool(
      "remove_page",
      t("Remove a page; its photos move to a neighbouring page. The person is asked first."),
      { page: { type: "integer", minimum: 1 } },
      (a) => {
        const busy = kit.busy();
        if (busy) return busy;
        const page = pageArg(a.page);
        if (page === undefined || !app.book) {
          return refused("no-such-page", t("There is no page to remove there."));
        }
        app.askRemovePage(page - 1);
        return asked();
      },
      { required: ["page"] },
    ),
    tool(
      "shuffle_layout",
      t(
        "Make a new arrangement within each page, photos keeping their page. Asks the person first after hand edits.",
      ),
      {},
      () => {
        const busy = kit.busy();
        if (busy) return busy;
        if (!app.hasPhotos) return refused("no-photos", t("There are no photos."));
        app.askShuffle(false);
        return asked();
      },
    ),
    tool(
      "shuffle_between_pages",
      t("Mix the photos between pages, keeping each page's count. Needs two or more pages."),
      {},
      () => {
        const busy = kit.busy();
        if (busy) return busy;
        if (!app.book) return refused("not-supported", t("There is only one page."));
        app.askShuffle(true);
        return asked();
      },
    ),
  ];
}
