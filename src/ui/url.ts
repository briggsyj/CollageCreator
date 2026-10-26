// SPDX-License-Identifier: GPL-2.0-or-later

const PARAM = "seed";
const MAX_SEED = 0xffffffff;

/** The seed in a URL's query string, or undefined if there is none or it is not a usable number. */
export function parseSeed(search: string): number | undefined {
  const raw = new URLSearchParams(search).get(PARAM);
  if (raw === null || !/^\d{1,10}$/.test(raw)) return undefined;
  const seed = Number(raw);
  return seed <= MAX_SEED ? seed : undefined;
}

/** `href` with its seed set to `seed`; everything else (path, other parameters, hash) is kept. */
export function withSeed(href: string, seed: number): string {
  const url = new URL(href);
  url.searchParams.set(PARAM, String(seed));
  return url.toString();
}
