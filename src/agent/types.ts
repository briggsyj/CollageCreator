// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/** A photo as an assistant names it: page and position, both counting from 1, in reading order. */
export interface PhotoRef {
  page: number;
  position: number;
}

export type RefusalCode =
  | "no-such-photo"
  | "no-such-page"
  | "out-of-range"
  | "busy"
  | "no-photos"
  | "crop-needs-one-photo"
  | "not-supported"
  | "bad-value";

/** What a tool did, before it is turned into the browser's result shape. */
export type Outcome =
  | { status: "done" | "waiting"; message: string; data?: unknown }
  | { status: "refused"; code: RefusalCode; message: string };

/** The result a WebMCP tool returns (the same shape as an MCP tool result). */
export interface ToolResult {
  content: ({ type: "text"; text: string } | { type: "image"; data: string; mimeType: string })[];
  isError?: boolean;
}

export interface JsonSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: { readOnlyHint?: boolean };
  execute(args: Record<string, unknown>): Promise<ToolResult> | ToolResult;
}
