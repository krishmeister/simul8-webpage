import { nodeById } from './diagram';

// ---------------------------------------------------------------------------
// The demo scenarios (src/data/demoScenarios.ts) reference nodes by placeholder
// ids. This is the single source of truth mapping those to the real diagram
// node ids. Verified against diagram.ts — every placeholder resolves.
// ---------------------------------------------------------------------------
export const DEMO_NODE_MAP: Record<string, string> = {
  'external-data': 'panel-external',
  'category-data': 'panel-category',
  'product-data': 'panel-product',
  'data-linking': 'panel-linking',
  'accumulated-input': 'accumulated',
  'subtask-a': 'subtask-a',
  'ask-user': 'ask-user',
  'subtask-b': 'subtask-b',
  'engine-group': 'engine-group',
  'engine-timeseries': 'eng-timeseries',
  'engine-bayesian': 'eng-bayesian',
  'engine-causal': 'eng-causal',
  'engine-abm': 'eng-abm',
  'engine-systemdynamics': 'eng-sysdyn',
  'engine-supervised': 'eng-supervised',
  fusion: 'fusion',
  output: 'output',
  'vault-log': 'vault-log',
  'vault-calibration': 'vault-calibration',
};

/** Map one placeholder id to a real diagram node id (or itself if already real). null if unknown. */
export function mapDemoNodeId(id: string): string | null {
  const real = DEMO_NODE_MAP[id] ?? id;
  return nodeById.has(real) ? real : null;
}

/** Map a stage's highlightNodeIds to real ids, dropping (and warning on) any that don't resolve. */
export function mapDemoNodeIds(ids: string[]): string[] {
  const out: string[] = [];
  for (const id of ids) {
    const real = mapDemoNodeId(id);
    if (real) out.push(real);
    else console.warn(`[demo] no diagram node for placeholder id "${id}"`);
  }
  return out;
}
