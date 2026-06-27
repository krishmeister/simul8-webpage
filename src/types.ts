// ---------------------------------------------------------------------------
// Data model for the Simul8 architecture diagram.
// The entire diagram is described by `nodes` and `arrows` in data/diagram.ts.
// Components are dumb renderers over this model — edit the data, not the views.
// ---------------------------------------------------------------------------

export type Side = 'top' | 'bottom' | 'left' | 'right';

export type ColorKey =
  | 'blue'
  | 'green'
  | 'amber'
  | 'purple'
  | 'pink'
  | 'yellow'
  | 'slate'
  | 'neutral';

export type NodeVariant =
  | 'title' // the Simul8 wordmark
  | 'industry' // industry chips
  | 'frame' // decorative bordered container (orchestrator / vault / input section)
  | 'bar' // full-width banded section (accumulated / fusion / output / engine header)
  | 'panel' // input-data sub-panel header
  | 'source' // a single source line-item under a panel
  | 'subbox' // orchestrator sub-task boxes
  | 'overlay' // a translucent layer/band spanning a group (the listening layer)
  | 'engine' // prediction & simulation engine card
  | 'vault'; // vault cards (the log / calibration)

export interface DiagramNode {
  id: string;
  variant: NodeVariant;
  position: { x: number; y: number };
  size: { w: number; h: number };
  color?: ColorKey;
  title: string;
  subtitle?: string;
  items?: string[];
  tag?: string; // e.g. "TSFM", "XGBoost", "Moat I"
  ai?: boolean; // marks a node where the LLM operates -> renders an "AI · LLM" badge
  tools?: string; // monospace tools/frameworks line (engine cards)
  badge?: string; // e.g. "+ Monte Carlo"
  active?: boolean; // the highlighted "active wedge" (D2C)
  numbered?: boolean; // render items as numbered cards (output layer)
  fullDescription?: string; // the complete paragraph shown in the detail panel
  interactive?: boolean; // false => decorative, ignores clicks (frames)
  z?: number; // stacking order
}

export type ArrowType = 'flow' | 'calibration';

export interface Point {
  x: number;
  y: number;
}

export interface DiagramArrow {
  id: string;
  from: string;
  to: string;
  type: ArrowType;
  label?: string;
  fromSide?: Side;
  toSide?: Side;
  fromOffset?: number; // 0..1 position along the chosen side
  toOffset?: number;
  curve?: number; // multiplier on the bézier handle length
  via?: Point[]; // explicit waypoints -> rounded-corner routed path (used for the calibration loop + the industry bus)
  labelPos?: Point; // manual label placement (overrides the auto midpoint) — keeps labels off node edges/canvas edge
  labelAnchor?: 'start' | 'middle' | 'end';
}
