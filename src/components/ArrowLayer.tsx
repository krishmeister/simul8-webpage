import { useMemo } from 'react';
import { CANVAS, nodeById } from '../data/diagram';
import { resolveArrowPath, type ResolvedArrow } from '../geometry';
import type { DiagramArrow } from '../types';
import styles from './ArrowLayer.module.css';

const LABEL_PAD = 96; // keep label centers far enough from the canvas edge to avoid clipping
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface Props {
  arrows: DiagramArrow[];
  layer: 'base' | 'overlay';
  focusMode: boolean;
  demoMode?: boolean;
  activeArrowIds: Set<string>;
}

interface Item {
  a: DiagramArrow;
  r: ResolvedArrow;
}

export default function ArrowLayer({ arrows, layer, focusMode, demoMode, activeArrowIds }: Props) {
  const resolved = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const a of arrows) {
      const from = nodeById.get(a.from);
      const to = nodeById.get(a.to);
      if (!from || !to) continue;
      out.push({ a, r: resolveArrowPath(from, to, a) });
    }
    return out;
  }, [arrows]);

  // Base layer draws everything; overlay only re-draws the lit arrows on top of nodes.
  const items = layer === 'overlay' ? resolved.filter(({ a }) => activeArrowIds.has(a.id)) : resolved;
  if (layer === 'overlay' && items.length === 0) return null;

  const m = (id: string) => `${id}-${layer}`;

  return (
    <svg
      className={`${styles.svg} ${layer === 'overlay' ? styles.overlay : styles.base}`}
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      width={CANVAS.w}
      height={CANVAS.h}
      aria-hidden="true"
    >
      <defs>
        <marker id={m('ah-flow')} className={styles.mFlow} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
        <marker id={m('ah-flow-active')} className={styles.mFlowActive} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
        <marker id={m('ah-calib')} className={styles.mCalib} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
        <marker id={m('ah-calib-active')} className={styles.mCalibActive} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
        <marker id={m('ah-cohort')} className={styles.mCohort} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
        <marker id={m('ah-cohort-active')} className={styles.mCohortActive} viewBox="0 0 10 10" refX="8.5" refY="5"
          markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0.5,0.8 L9.2,5 L0.5,9.2 Z" />
        </marker>
      </defs>

      {items.map(({ a, r }) => {
        const isActive = activeArrowIds.has(a.id);
        const isCalib = a.type === 'calibration';
        const isCohort = a.type === 'cohort';
        const isLoop = isCalib || isCohort; // both compounding loops: dashed, labels-on-highlight
        const dim = focusMode && !isActive;

        const typeClass = isCalib ? styles.calib : isCohort ? styles.cohort : styles.flow;
        const pathClass = [
          styles.path,
          typeClass,
          isActive ? styles.active : '',
          dim ? styles.dim : '',
          isActive && isLoop ? styles.animated : '',
          isActive && !isLoop && demoMode ? styles.flowAnimated : '',
        ]
          .filter(Boolean)
          .join(' ');

        const markerBase = isCalib ? 'ah-calib' : isCohort ? 'ah-cohort' : 'ah-flow';
        const markerEnd = `url(#${m(isActive ? `${markerBase}-active` : markerBase)})`;

        // Flow labels show in the resting view; loop labels appear only when their loop is highlighted.
        const showLabel =
          !!a.label && (layer === 'overlay' ? true : !focusMode && a.type === 'flow');
        const lp = a.labelPos ?? r.mid;
        const lx = clamp(lp.x, LABEL_PAD, CANVAS.w - LABEL_PAD);
        const anchor = a.labelAnchor ?? 'middle';

        return (
          <g key={a.id + layer}>
            <path d={r.d} className={pathClass} markerEnd={markerEnd} fill="none" />
            {showLabel && (
              <text
                x={lx}
                y={lp.y}
                className={[
                  styles.label,
                  isCalib ? styles.labelCalib : '',
                  isCohort ? styles.labelCohort : '',
                  isActive ? styles.labelActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                textAnchor={anchor}
                dominantBaseline="middle"
              >
                {a.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
