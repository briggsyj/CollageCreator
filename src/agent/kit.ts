// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import { t } from "../i18n";
import type { AppState } from "../ui/app-state.svelte";
import { type PageIndex, resolvePhoto, resolvePhotos } from "./args";
import { refused, toResult } from "./result";
import { pageIndex } from "./snapshot";
import type { JsonSchema, Outcome, Tool } from "./types";

export type Args = Record<string, unknown>;

/** What every tool file gets: the app, and the checks tools share. */
export interface Kit {
  app: AppState;
  pages(): PageIndex;
  /** A refusal while a question is open for the person or a save is running, else undefined. */
  busy(): Outcome | undefined;
  photo(ref: unknown): { index: number } | Outcome;
  photos(refs: unknown): { indices: number[] } | Outcome;
}

export function makeKit(app: AppState): Kit {
  return {
    app,
    pages: () => pageIndex(app),
    busy() {
      if (app.dialog === "confirm") {
        return refused("busy", t("A question is open for the person; wait for their answer."));
      }
      if (app.dialog === "progress") {
        return refused("busy", t("A save is running; wait for it or cancel it."));
      }
      return undefined;
    },
    photo(ref) {
      const one = resolvePhoto(ref, pageIndex(app));
      return one.ok ? { index: one.index } : refused(one.code, one.message);
    },
    photos(refs) {
      const many = resolvePhotos(refs, pageIndex(app));
      return many.ok ? { indices: many.indices } : refused(many.code, many.message);
    },
  };
}

export const isOutcome = (x: object): x is Outcome => "status" in x;

/** A tool whose handler returns an Outcome; the result shape and read-only flag are added. */
export function tool(
  name: string,
  description: string,
  properties: Record<string, unknown>,
  run: (args: Args) => Outcome | Promise<Outcome>,
  options: { required?: string[]; readOnly?: boolean } = {},
): Tool {
  const inputSchema: JsonSchema = {
    type: "object",
    properties,
    ...(options.required ? { required: options.required } : {}),
    additionalProperties: false,
  };
  return {
    name,
    description,
    inputSchema,
    ...(options.readOnly ? { annotations: { readOnlyHint: true } } : {}),
    async execute(args) {
      try {
        return toResult(await run(args ?? {}));
      } catch (err) {
        return toResult(refused("bad-value", err instanceof Error ? err.message : String(err)));
      }
    },
  };
}

/** The JSON schema for one photo reference. */
export const photoRef = {
  type: "object",
  description: "A photo: its page and its position on that page, both counting from 1.",
  properties: {
    page: { type: "integer", minimum: 1 },
    position: { type: "integer", minimum: 1 },
  },
  required: ["page", "position"],
  additionalProperties: false,
} as const;

export const photoRefs = {
  type: "array",
  items: photoRef,
  minItems: 1,
  description: "Photos, each as { page, position }.",
} as const;
