// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { Tool } from "./types";

/** The part of the browser's WebMCP object this app uses. */
interface ModelContext {
  registerTool(tool: Tool, options?: { signal?: AbortSignal }): unknown;
  unregisterTool?(name: string): unknown;
}

/**
 * The browser's tool registry, if it has one. Chrome's early preview puts it on `navigator`; the
 * community draft describes it on `document`, so both are tried.
 */
export function findModelContext(): ModelContext | undefined {
  const holders = [globalThis.navigator, globalThis.document] as unknown as (
    | { modelContext?: ModelContext }
    | undefined
  )[];
  return holders.map((h) => h?.modelContext).find((c) => typeof c?.registerTool === "function");
}

export function agentSupported(): boolean {
  return findModelContext() !== undefined;
}

/** Register the tools; the returned function removes them again. Does nothing without WebMCP. */
export function registerAll(tools: readonly Tool[]): () => void {
  const context = findModelContext();
  if (!context) return () => {};
  const controller = new AbortController();
  const names: string[] = [];
  for (const tool of tools) {
    try {
      context.registerTool(tool, { signal: controller.signal });
      names.push(tool.name);
    } catch {
      // A browser that rejects the options form may still take the plain one.
      try {
        context.registerTool(tool);
        names.push(tool.name);
      } catch {
        // This tool is not offered; the others still are.
      }
    }
  }
  return () => {
    controller.abort();
    for (const name of names) {
      try {
        context.unregisterTool?.(name);
      } catch {
        // Already gone.
      }
    }
  };
}
