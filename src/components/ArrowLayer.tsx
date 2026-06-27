import { useMemo } from 'react';
import { CANVAS, nodeById } from '../data/diagram';
import { resolveArrowPath, type ResolvedArrow } from '../geometry';
import type { DiagramArrow } from '../types';
import styles from './ArrowLayer.module.css';

interface Props {
  arrows: DiagramArrow[];
  layer: 'base' | 'overlay';
  focusMode: boolean;
  activeArrowIds: Set<string>;
}

interface Item {
  a: DiagramArrow;
  r: ResolvedArrow;
}

export default function ArrowLayer({ arrows, layer, focusMode, activeArrowIds }: Props) {
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
      </defs>

      {items.map(({ a, r }) => {
        const isActive = activeArrowIds.has(a.id);
        const isCalib = a.type === 'calibration';
        const dim = focusMode && !isActive;

        const pathClass = [
          styles.path,
          isCalib ? styles.calib : styles.flow,
          isActive ? styles.active : '',
          dim ? styles.dim : '',
          isActive && isCalib ? styles.animated : '',
        ]
          .filter(Boolean)
          .join(' ');

        const markerEnd = isActive
          ? isCalib
            ? `url(#${m('ah-calib-active')})`
            : `url(#${m('ah-flow-active')})`
          : isCalib
            ? `url(#${m('ah-calib')})`
            : `url(#${m('ah-flow')})`;

        const showLabel = !!a.label && (layer === 'overlay' ? true : !focusMode);

        return (
          <g key={a.id + layer}>
            <path d={r.d} className={pathClass} markerEnd={markerEnd} fill="none" />
            {showLabel && (
              <text
                x={r.mid.x}
                y={r.mid.y}
                className={[styles.label, isCalib ? styles.labelCalib : '', isActive ? styles.labelActive : '']
                  .filter(Boolean)
                  .join(' ')}
                textAnchor="middle"
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
