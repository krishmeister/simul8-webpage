import type { DiagramNode, Side, Point } from './types';

export type Pt = Point;

/** Point on a node's bounding box for a given side + fractional offset (0..1). */
export function anchorPoint(node: DiagramNode, side: Side, offset = 0.5): Pt {
  const { x, y } = node.position;
  const { w, h } = node.size;
  switch (side) {
    case 'top':
      return { x: x + w * offset, y };
    case 'bottom':
      return { x: x + w * offset, y: y + h };
    case 'left':
      return { x, y: y + h * offset };
    case 'right':
      return { x: x + w, y: y + h * offset };
  }
}

/** Push a bézier control handle outward from an anchor in the side's direction. */
function handle(p: Pt, side: Side, k: number): Pt {
  switch (side) {
    case 'top':
      return { x: p.x, y: p.y - k };
    case 'bottom':
      return { x: p.x, y: p.y + k };
    case 'left':
      return { x: p.x - k, y: p.y };
    case 'right':
      return { x: p.x + k, y: p.y };
  }
}

/** Choose sensible default anchor sides based on relative node centers. */
function pickSides(a: DiagramNode, b: DiagramNode): { from: Side; to: Side } {
  const acx = a.position.x + a.size.w / 2;
  const acy = a.position.y + a.size.h / 2;
  const bcx = b.position.x + b.size.w / 2;
  const bcy = b.position.y + b.size.h / 2;
  const dx = bcx - acx;
  const dy = bcy - acy;
  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy >= 0 ? { from: 'bottom', to: 'top' } : { from: 'top', to: 'bottom' };
  }
  return dx >= 0 ? { from: 'right', to: 'left' } : { from: 'left', to: 'right' };
}

export interface ResolvedArrow {
  d: string;
  p1: Pt;
  p2: Pt;
  mid: Pt;
}

export interface PathOpts {
  fromSide?: Side;
  toSide?: Side;
  fromOffset?: number;
  toOffset?: number;
  curve?: number;
  via?: Pt[];
}

function fmt(p: Pt): string {
  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
}

/** A point `dist` along the segment from `a` toward `b` (clamped to ~half the segment). */
function towards(a: Pt, b: Pt, dist: number): Pt {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const t = Math.min(dist, len * 0.49) / len;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Build an orthogonal-ish path through points with rounded corners. */
function roundedPath(points: Pt[], radius = 20): string {
  if (points.length < 2) return '';
  if (points.length === 2) return `M${fmt(points[0])} L${fmt(points[1])}`;
  let d = `M${fmt(points[0])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const a = towards(cur, prev, radius);
    const b = towards(cur, next, radius);
    d += ` L${fmt(a)} Q${fmt(cur)} ${fmt(b)}`;
  }
  d += ` L${fmt(points[points.length - 1])}`;
  return d;
}

/** Midpoint of the longest segment in a polyline (best spot for a routed label). */
function longestSegmentMid(points: Pt[]): Pt {
  let best = { x: points[0].x, y: points[0].y };
  let bestLen = -1;
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    if (len > bestLen) {
      bestLen = len;
      best = { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 };
    }
  }
  return best;
}

/** Build the path + label midpoint for an arrow between two nodes. */
export function resolveArrowPath(a: DiagramNode, b: DiagramNode, opts: PathOpts = {}): ResolvedArrow {
  const auto = pickSides(a, b);
  const fromSide = opts.fromSide ?? auto.from;
  const toSide = opts.toSide ?? auto.to;
  const p1 = anchorPoint(a, fromSide, opts.fromOffset ?? 0.5);
  const p2 = anchorPoint(b, toSide, opts.toOffset ?? 0.5);

  // Routed (waypoint) path — used for the calibration loop and the industry bus.
  if (opts.via && opts.via.length > 0) {
    const points = [p1, ...opts.via, p2];
    return { d: roundedPath(points, 18), p1, p2, mid: longestSegmentMid(points) };
  }

  // Smooth cubic bézier — the default for data-flow arrows.
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const k = Math.min(Math.max(dist * 0.42, 36), 220) * (opts.curve ?? 1);
  const c1 = handle(p1, fromSide, k);
  const c2 = handle(p2, toSide, k);
  const mid: Pt = {
    x: 0.125 * p1.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * p2.x,
    y: 0.125 * p1.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * p2.y,
  };
  return { d: `M${fmt(p1)} C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`, p1, p2, mid };
}
