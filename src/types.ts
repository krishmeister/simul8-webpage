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
  | 'group' // a translucent container enclosing a set of nodes (the engine ensemble)
  | 'engine' // prediction & simulation engine card
  | 'vault'; // vault cards (the log / calibration)

// A small pill rendered in a node's badge row. `kind` picks the visual style:
//   ai    -> the unified "AI · LLM" marker (same colour everywhere the LLM operates)
//   solid -> a solid, high-contrast badge (e.g. "deterministic", like the no-LLM marker)
//   soft  -> a soft tinted pill (the default tag look)
export interface NodeBadge {
  text: string;
  kind: 'ai' | 'solid' | 'soft';
}

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
  tagStyle?: 'soft' | 'solid'; // head-tag rendering for subboxes (default soft); 'solid' matches the vault's Moat badge
  badges?: NodeBadge[]; // a row of small pills under the subtitle (e.g. the split AI/deterministic badge)
  ai?: boolean; // marks a node where the LLM operates -> renders an "AI · LLM" badge
  tools?: string; // monospace tools/frameworks line (engine cards)
  badge?: string; // e.g. "+ Monte Carlo"
  active?: boolean; // the highlighted "active wedge" (D2C)
  group?: string; // membership in a selectable group (e.g. the engine ensemble)
  groupSelect?: boolean; // clicking this node selects/highlights its whole group
  numbered?: boolean; // render items as numbered cards (output layer)
  kicker?: string; // overrides the detail-panel kicker label (default derives from variant)
  fullDescription?: string; // the complete paragraph shown in the detail panel
  interactive?: boolean; // false => decorative, ignores clicks (frames)
  z?: number; // stacking order
}

// 'flow' = the always-on data flow. 'calibration' (purple) and 'cohort' (teal) are
// the two compounding loops — each dashed, faint at rest, lit by its own toggle.
export type ArrowType = 'flow' | 'calibration' | 'cohort';

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
