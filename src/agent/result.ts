// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { Outcome, RefusalCode, ToolResult } from "./types";

export const done = (message: string, data?: unknown): Outcome => ({
  status: "done",
  message,
  data,
});

/** A confirmation is open for the person; the action happens only if they confirm. */
export const waiting = (message: string): Outcome => ({ status: "waiting", message });

export const refused = (code: RefusalCode, message: string): Outcome => ({
  status: "refused",
  code,
  message,
});

/** The browser-facing result: JSON text, flagged as an error when refused. */
export function toResult(outcome: Outcome): ToolResult {
  const body =
    outcome.status === "refused"
      ? { ok: false, status: outcome.status, code: outcome.code, message: outcome.message }
      : { ok: true, status: outcome.status, message: outcome.message, data: outcome.data };
  return {
    content: [{ type: "text", text: JSON.stringify(body) }],
    ...(outcome.status === "refused" ? { isError: true } : {}),
  };
}
