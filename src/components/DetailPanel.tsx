import type { DiagramNode } from '../types';
import styles from './DetailPanel.module.css';

interface Props {
  node: DiagramNode | null;
  calibrationMode: boolean;
  onClose: () => void;
}

const VARIANT_LABEL: Record<string, string> = {
  title: 'Platform',
  industry: 'Industry',
  bar: 'Layer',
  panel: 'Input component',
  source: 'Data source',
  subbox: 'Orchestrator',
  engine: 'Engine',
  vault: 'The Vault',
};

export default function DetailPanel({ node, calibrationMode, onClose }: Props) {
  const open = calibrationMode || node !== null;

  return (
    <>
      <div
        className={`${styles.scrim} ${open ? styles.scrimOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.panel} ${open ? styles.open : ''} ${calibrationMode ? styles.left : ''}`}
        data-color={calibrationMode ? 'purple' : node?.color ?? 'neutral'}
        role="dialog"
        aria-label="Details"
        aria-hidden={!open}
      >
        <div className={styles.grab} aria-hidden="true" />
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close details">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {calibrationMode ? (
          <div className={styles.body}>
            <span className={styles.kicker}>The hero interaction</span>
            <h2 className={styles.title}>The Calibration Loop</h2>
            <p className={styles.lede}>
              This is how Simul8 earns trust instead of asserting it. Five connectors form a closed
              learning loop — highlighted on the canvas now.
            </p>
            <ul className={styles.loopList}>
              <li><b>Calibration → Method Selection</b> — tells Sub-task B which methods to trust.</li>
              <li><b>Calibration → Fusion</b> — tells the chairperson how to weight each engine.</li>
              <li><b>Method Selection → The Log</b> — writes its routing decision.</li>
              <li><b>Fusion → The Log</b> — writes its weighting decision.</li>
              <li><b>Output → The Log</b> — writes the resolved prediction, closing the loop.</li>
            </ul>
            <p className={styles.foot}>
              Calibration then compares predicted vs. actual, regrades accuracy and honesty, and
              updates the weights — so the next prediction is routed and fused better than the last.
            </p>
          </div>
        ) : node ? (
          <div className={styles.body}>
            <div className={styles.kickerRow}>
              <span className={styles.kicker}>{VARIANT_LABEL[node.variant] ?? 'Node'}</span>
              {node.tag && <span className={styles.tag}>{node.tag}</span>}
              {node.badge && <span className={styles.tag}>{node.badge}</span>}
            </div>
            <h2 className={styles.title}>{node.title}</h2>
            {node.subtitle && <p className={styles.lede}>{node.subtitle}</p>}
            {node.fullDescription && <p className={styles.foot}>{node.fullDescription}</p>}
            {node.items && (
              <ul className={styles.loopList}>
                {node.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </aside>
    </>
  );
}
