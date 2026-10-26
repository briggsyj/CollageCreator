// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

import type { WorkerReady, WorkerRequest, WorkerResponse } from "./protocol";

type Distribute<T> = T extends unknown ? Omit<T, "id"> : never;
type Job = {
  req: Distribute<WorkerRequest>;
  resolve: (r: WorkerResponse) => void;
  reject: (e: unknown) => void;
};

/** A small, bounded pool of image workers. At most one job runs per worker. */
export class WorkerPool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: Job[] = [];
  private running = new Map<Worker, { id: number; job: Job }>();
  private nextId = 1;
  private terminated = false;
  private readyCount = 0;
  private resolveReady: () => void = () => {};
  /** Resolves when every worker has loaded its script, so the pool no longer needs the network. */
  readonly ready: Promise<void> = new Promise((resolve) => {
    this.resolveReady = resolve;
  });

  constructor(readonly size: number = defaultPoolSize()) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(new URL("./export.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<WorkerResponse | WorkerReady>) => {
        if (e.data.kind === "ready") {
          if (++this.readyCount === size) this.resolveReady();
        } else {
          this.onDone(worker, e.data);
        }
      };
      worker.onerror = (e) => this.onCrash(worker, e.message);
      this.workers.push(worker);
      this.idle.push(worker);
    }
  }

  run(req: Distribute<WorkerRequest>): Promise<WorkerResponse> {
    if (this.terminated) return Promise.reject(new DOMException("Pool terminated", "AbortError"));
    return new Promise((resolve, reject) => {
      this.queue.push({ req, resolve, reject });
      this.pump();
    });
  }

  /** Reject every queued and running job and stop the workers. */
  terminate(): void {
    this.terminated = true;
    const err = new DOMException("Cancelled", "AbortError");
    for (const job of this.queue) job.reject(err);
    for (const { job } of this.running.values()) job.reject(err);
    this.queue = [];
    this.running.clear();
    for (const w of this.workers) w.terminate();
    this.workers = [];
    this.idle = [];
  }

  private pump(): void {
    while (this.idle.length && this.queue.length) {
      const worker = this.idle.pop() as Worker;
      const job = this.queue.shift() as Job;
      const id = this.nextId++;
      this.running.set(worker, { id, job });
      worker.postMessage({ ...job.req, id } as WorkerRequest);
    }
  }

  private onDone(worker: Worker, res: WorkerResponse): void {
    const entry = this.running.get(worker);
    if (!entry || entry.id !== res.id) return;
    this.running.delete(worker);
    this.idle.push(worker);
    entry.job.resolve(res);
    this.pump();
  }

  private onCrash(worker: Worker, message: string): void {
    const entry = this.running.get(worker);
    if (!entry) return;
    this.running.delete(worker);
    this.idle.push(worker);
    entry.job.reject(new Error(message || "Worker error"));
    this.pump();
  }
}

export function defaultPoolSize(): number {
  return Math.max(2, Math.min(4, navigator.hardwareConcurrency || 2));
}
