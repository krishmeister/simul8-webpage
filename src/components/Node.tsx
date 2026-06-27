import { memo } from 'react';
import type { DiagramNode } from '../types';
import styles from './Node.module.css';

interface Props {
  node: DiagramNode;
  focusMode: boolean;
  active: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}

function NodeView({ node, focusMode, active, selected, onSelect }: Props) {
  const interactive = node.interactive !== false;
  const dim = focusMode && !active;

  const cls = [
    styles.node,
    styles[node.variant],
    node.active ? styles.wedge : '',
    selected ? styles.selected : '',
    active && !selected ? styles.active : '',
    dim ? styles.dim : '',
    interactive ? '' : styles.nonInteractive,
  ]
    .filter(Boolean)
    .join(' ');

  const handleSelect = () => interactive && onSelect(node.id);

  return (
    <div
      className={cls}
      data-color={node.color ?? 'neutral'}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.w,
        height: node.size.h,
        zIndex: node.z ?? (node.variant === 'frame' ? 2 : 10),
      }}
      onClick={interactive ? handleSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect();
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-label={node.title || undefined}
    >
      <NodeBody node={node} />
    </div>
  );
}

function NodeBody({ node }: { node: DiagramNode }) {
  switch (node.variant) {
    case 'title':
      return (
        <div className={styles.titleBody}>
          <span className={styles.wordmark}>{node.title}</span>
          {node.subtitle && <span className={styles.titleSub}>{node.subtitle}</span>}
        </div>
      );

    case 'industry':
      return (
        <div className={styles.industryBody}>
          <span className={styles.industryName}>{node.title}</span>
          {node.subtitle && <span className={styles.wedgeTag}>{node.subtitle}</span>}
        </div>
      );

    case 'frame':
      return node.title ? <span className={styles.frameLabel}>{node.title}</span> : null;

    case 'bar':
      return (
        <div className={styles.barBody}>
          <div className={styles.barHead}>
            <span className={styles.barTitle}>{node.title}</span>
            {node.subtitle && <span className={styles.barSub}>{node.subtitle}</span>}
          </div>
          {node.items && (
            <div className={node.numbered ? styles.cardRow : styles.moveRow}>
              {node.items.map((it, i) => (
                <div key={i} className={node.numbered ? styles.outCard : styles.move}>
                  {node.numbered && <span className={styles.num}>{i + 1}</span>}
                  <span className={styles.itemText}>{it}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'panel':
      return (
        <div className={styles.panelBody}>
          <span className={styles.panelTitle}>{node.title}</span>
          {node.subtitle && <span className={styles.panelSub}>{node.subtitle}</span>}
        </div>
      );

    case 'source':
      return (
        <div className={styles.sourceBody}>
          <span className={styles.sourceTitle}>{node.title}</span>
          {node.subtitle && <span className={styles.sourceSub}>{node.subtitle}</span>}
        </div>
      );

    case 'subbox':
      return (
        <div className={styles.boxBody}>
          <div className={styles.boxHead}>
            <span className={styles.boxTitle}>{node.title}</span>
            {node.tag && <span className={styles.tag}>{node.tag}</span>}
          </div>
          {node.subtitle && <span className={styles.boxSub}>{node.subtitle}</span>}
        </div>
      );

    case 'engine':
      return (
        <div className={styles.boxBody}>
          <div className={styles.boxHead}>
            <span className={styles.boxTitle}>{node.title}</span>
            {node.tag && <span className={styles.tag}>{node.tag}</span>}
          </div>
          {node.subtitle && <span className={styles.boxSub}>{node.subtitle}</span>}
          {node.badge && <span className={styles.badge}>{node.badge}</span>}
        </div>
      );

    case 'vault':
      return (
        <div className={styles.boxBody}>
          <div className={styles.boxHead}>
            <span className={styles.boxTitle}>{node.title}</span>
            {node.tag && <span className={styles.tagSolid}>{node.tag}</span>}
          </div>
          {node.subtitle && <span className={styles.boxSub}>{node.subtitle}</span>}
        </div>
      );

    default:
      return <span>{node.title}</span>;
  }
}

export default memo(NodeView);
