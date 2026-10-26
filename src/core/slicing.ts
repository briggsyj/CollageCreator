// SPDX-License-Identifier: GPL-2.0-or-later

import { type Rng, shuffle } from "./rng";
import type { Layout, LayoutPage, LayoutPhoto, Placement, Rect } from "./types";

/*
Gallery layout: the poster is cut into panels, one per photo, by a slicing tree.

Every inner node of the tree cuts its rectangle in two, either side by side
("side") or one above the other ("stack"); every leaf is a photo. Cuts run edge
to edge, so the panels tile the poster exactly with no gaps.

The tree is built from the bottom up. Each photo starts as its own panel. The
two neighbouring groups with the fewest photos are joined (ties are broken at
random), side by side or stacked, whichever gives a group whose shape is closer
to the shape the group should have for the whole poster to come out right. A
group's shape (height / width) is exactly what its photos need to be shown
uncropped: side by side, widths add at one height; stacked, heights add at one
width. Each cut is placed mostly where both sides get their photos' own shape and
partly where they get equal room, moved towards the group that asked for more
(Wider and Taller are weights). Finally the tree is improved by trying small
changes (turning a cut, swapping two photos) and keeping those that bring the
group's shape closer to the poster's and the panels closer in size. The search over
many such trees keeps the one that crops the photos least.
*/

type Direction = "side" | "stack";

interface Leaf {
  kind: "leaf";
  photoIndex: number;
  /** Height / width of the photo. */
  ratio: number;
  weight: number;
  count: 1;
}

interface Cut {
  kind: "cut";
  direction: Direction;
  first: TreeNode;
  second: TreeNode;
  /** Height / width of a rectangle both groups fit with no cropping. */
  ratio: number;
  weight: number;
  count: number;
  /** The first group's share of the width ("side") or height ("stack") of this cut. */
  share: number;
}

type TreeNode = Leaf | Cut;

/** Keep every panel at least this share of its parent, so none is squeezed to a sliver. */
const MIN_SHARE = 0.04;

/** How much a cut follows the photos' shapes (1) rather than giving each photo equal room (0). */
const SHAPE_BIAS = 0.8;

/** Work out a cut's shape, weight, count and where it is placed from its two sides. */
function measure(cut: Cut): void {
  const { first, second } = cut;
  cut.weight = first.weight + second.weight;
  cut.count = first.count + second.count;
  let share: number;
  // How much more room than its natural size each side asks for, on average. With no
  // requests it is 1 and the cut gives both sides exactly their photos' shapes.
  const askFirst = first.weight / first.count;
  const askSecond = second.weight / second.count;
  if (cut.direction === "side") {
    const a = askFirst / first.ratio;
    const b = askSecond / second.ratio;
    cut.ratio = 1 / (1 / first.ratio + 1 / second.ratio);
    share = a / (a + b);
  } else {
    const a = askFirst * first.ratio;
    const b = askSecond * second.ratio;
    cut.ratio = first.ratio + second.ratio;
    share = a / (a + b);
  }
  // Blend with an even split by number of photos (weighted by what they ask for), so panels
  // stay of similar size at the price of a little cropping.
  const even = first.weight / (first.weight + second.weight);
  share = SHAPE_BIAS * share + (1 - SHAPE_BIAS) * even;
  cut.share = Math.min(1 - MIN_SHARE, Math.max(MIN_SHARE, share));
}

function join(first: TreeNode, second: TreeNode, direction: Direction): Cut {
  const cut: Cut = {
    kind: "cut",
    direction,
    first,
    second,
    ratio: 1,
    weight: 1,
    count: 1,
    share: 0.5,
  };
  measure(cut);
  return cut;
}

/** Measure every cut under `node`, bottom up. */
function measureAll(node: TreeNode): void {
  if (node.kind === "leaf") return;
  measureAll(node.first);
  measureAll(node.second);
  measure(node);
}

function leafFor(photo: LayoutPhoto, photoIndex: number): Leaf {
  const span = photo.span;
  return {
    kind: "leaf",
    photoIndex,
    ratio: photo.height / photo.width,
    // A photo that asks for more room gets a panel that many times larger.
    weight: (span?.columns ?? 1) * (span?.rows ?? 1),
    count: 1,
  };
}

function buildTree(photos: readonly LayoutPhoto[], posterRatio: number, rng: Rng): TreeNode {
  const n = photos.length;
  const nodes: TreeNode[] = photos.map((p, i) => leafFor(p, i));
  shuffle(nodes, rng);
  const logPoster = Math.log(posterRatio);
  while (nodes.length > 1) {
    // Join the neighbours with the fewest photos between them: this keeps the tree balanced.
    let fewest = Number.POSITIVE_INFINITY;
    let candidates: number[] = [];
    for (let i = 0; i + 1 < nodes.length; i++) {
      const count = (nodes[i] as TreeNode).count + (nodes[i + 1] as TreeNode).count;
      if (count < fewest) {
        fewest = count;
        candidates = [i];
      } else if (count === fewest) {
        candidates.push(i);
      }
    }
    const at = rng.choice(candidates);
    const first = nodes[at] as TreeNode;
    const second = nodes[at + 1] as TreeNode;
    // A group of k photos out of n should be about as tall as poster ratio ^ (k / n), so that
    // the last join gives the poster's own shape.
    const wanted = (logPoster * (first.count + second.count)) / n;
    const side = join(first, second, "side");
    const stack = join(first, second, "stack");
    const sideIsCloser =
      Math.abs(Math.log(side.ratio) - wanted) <= Math.abs(Math.log(stack.ratio) - wanted);
    // Now and then take the other cut, so that the search sees a variety of trees.
    const useSide = rng.random() < 0.15 ? !sideIsCloser : sideIsCloser;
    nodes.splice(at, 2, useSide ? side : stack);
  }
  const root = nodes[0] as TreeNode;
  refine(root, posterRatio, rng);
  return root;
}

function cuts(node: TreeNode, out: Cut[] = []): Cut[] {
  if (node.kind === "cut") {
    out.push(node);
    cuts(node.first, out);
    cuts(node.second, out);
  }
  return out;
}

/** Areas of the panels, each divided by the room its photo asked for. */
function panelAreas(node: TreeNode, w: number, h: number, out: number[]): void {
  if (node.kind === "leaf") {
    out.push((w * h) / node.weight);
    return;
  }
  if (node.direction === "side") {
    panelAreas(node.first, w * node.share, h, out);
    panelAreas(node.second, w * (1 - node.share), h, out);
  } else {
    panelAreas(node.first, w, h * node.share, out);
    panelAreas(node.second, w, h * (1 - node.share), out);
  }
}

/**
 * How far a tree is from a good Gallery: how much its group shape differs from the poster's
 * (every panel would have to be stretched by that much), plus how unevenly the panels are
 * sized (a few huge panels beside slivers is a poor collage even if no photo is cropped).
 */
function treeCost(root: TreeNode, posterRatio: number): number {
  const areas: number[] = [];
  panelAreas(root, 1, posterRatio, areas);
  const logs = areas.map((a) => Math.log(a));
  const mean = logs.reduce((sum, x) => sum + x, 0) / logs.length;
  const spread = Math.sqrt(logs.reduce((sum, x) => sum + (x - mean) ** 2, 0) / logs.length);
  return 3 * Math.abs(Math.log(root.ratio) - Math.log(posterRatio)) + spread;
}

/**
 * Improve a tree by small random changes (turn a cut the other way, swap two photos),
 * keeping a change when it lowers `treeCost`.
 */
function refine(root: TreeNode, posterRatio: number, rng: Rng): void {
  if (root.kind === "leaf") return;
  const inner = cuts(root);
  const all = leaves(root);
  // Each round costs time in proportion to the number of photos; keep a try near 10 ms.
  const rounds = Math.min(1500, Math.max(150, Math.round(60000 / all.length)));
  let current = treeCost(root, posterRatio);
  for (let i = 0; i < rounds && current > 1e-3; i++) {
    if (rng.random() < 0.5) {
      const cut = rng.choice(inner);
      const turn = () => {
        cut.direction = cut.direction === "side" ? "stack" : "side";
        measureAll(root);
      };
      turn();
      const next = treeCost(root, posterRatio);
      if (next <= current) current = next;
      else turn();
    } else if (all.length > 1) {
      const a = rng.choice(all);
      const b = rng.choice(all);
      if (a === b) continue;
      swapContents(a, b);
      measureAll(root);
      const next = treeCost(root, posterRatio);
      if (next <= current) current = next;
      else {
        swapContents(a, b);
        measureAll(root);
      }
    }
  }
}

function swapContents(a: Leaf, b: Leaf): void {
  [a.photoIndex, b.photoIndex] = [b.photoIndex, a.photoIndex];
  [a.ratio, b.ratio] = [b.ratio, a.ratio];
  [a.weight, b.weight] = [b.weight, a.weight];
}

function leaves(node: TreeNode, out: Leaf[] = []): Leaf[] {
  if (node.kind === "leaf") out.push(node);
  else {
    leaves(node.first, out);
    leaves(node.second, out);
  }
  return out;
}

function place(node: TreeNode, rect: Rect, out: Placement[]): void {
  if (node.kind === "leaf") {
    out.push({ photoIndex: node.photoIndex, cell: rect });
    return;
  }
  if (node.direction === "side") {
    const w = rect.w * node.share;
    place(node.first, { x: rect.x, y: rect.y, w, h: rect.h }, out);
    // The second panel takes what is left, so the two always add up to the whole.
    place(node.second, { x: rect.x + w, y: rect.y, w: rect.w - w, h: rect.h }, out);
  } else {
    const h = rect.h * node.share;
    place(node.first, { x: rect.x, y: rect.y, w: rect.w, h }, out);
    place(node.second, { x: rect.x, y: rect.y + h, w: rect.w, h: rect.h - h }, out);
  }
}

/** A Gallery arrangement: a slicing tree over the poster. */
export class SlicingPage implements LayoutPage {
  constructor(
    private readonly root: TreeNode | null,
    private ratio: number,
  ) {}

  setTargetRatio(ratio: number): void {
    this.ratio = ratio;
  }

  swapPhotos(a: number, b: number): void {
    if (!this.root) return;
    const all = leaves(this.root);
    const leafA = all.find((l) => l.photoIndex === a);
    const leafB = all.find((l) => l.photoIndex === b);
    if (!leafA || !leafB) return;
    [leafA.photoIndex, leafB.photoIndex] = [leafB.photoIndex, leafA.photoIndex];
  }

  toLayout(): Layout {
    const placements: Placement[] = [];
    if (this.root) place(this.root, { x: 0, y: 0, w: 1, h: this.ratio }, placements);
    return { width: 1, height: this.ratio, placements };
  }
}

/**
 * Build a Gallery arrangement for these photos (sizes after EXIF orientation).
 * `posterRatio` is poster height / width. The same photos, ratio and rng sequence
 * always give the same arrangement.
 */
export function generateSlicingLayout(
  photos: readonly LayoutPhoto[],
  posterRatio: number,
  rng: Rng,
): SlicingPage {
  if (photos.length === 0) return new SlicingPage(null, posterRatio);
  return new SlicingPage(buildTree(photos, posterRatio, rng), posterRatio);
}
