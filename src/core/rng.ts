// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

/** The random source used by the layout generator. */
export interface Rng {
  /** Uniform float in [0, 1). */
  random(): number;
  /** Uniform pick from a non-empty list. */
  choice<T>(items: readonly T[]): T;
}

/** Deterministic generator (mulberry32): the same seed always gives the same sequence. */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  const random = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    random,
    choice<T>(items: readonly T[]): T {
      return items[Math.floor(random() * items.length)] as T;
    },
  };
}

/** Fisher-Yates shuffle, in place. */
export function shuffle<T>(items: T[], rng: Rng): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [items[i], items[j]] = [items[j] as T, items[i] as T];
  }
}

export function randomSeed(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] as number;
}
