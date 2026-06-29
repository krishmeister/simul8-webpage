import { useEffect, useState } from 'react';
import type { DiagramNode } from '../types';
import styles from './DetailPanel.module.css';

interface Props {
  node: DiagramNode | null;
  calibrationMode: boolean;
  cohortMode: boolean;
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

export default function DetailPanel({ node, calibrationMode, cohortMode, onClose }: Props) {
  const loopMode = calibrationMode || cohortMode;
  const open = loopMode || node !== null;
  // On mobile a loop explainer is a compact peek sheet so the lit loop stays
  // visible above it; tapping the grab handle expands it for the full text.
  // It always (re)opens collapsed.
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (loopMode) setExpanded(false);
  }, [loopMode]);

  return (
    <>
      <div
        // No scrim for a loop peek — the whole point is to keep the canvas
        // (and its lit loop) visible behind the compact sheet on mobile.
        className={`${styles.scrim} ${open && !loopMode ? styles.scrimOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.panel} ${open ? styles.open : ''} ${
          loopMode ? `${styles.left} ${styles.loop}` : ''
        } ${expanded ? styles.expanded : ''}`}
        data-color={calibrationMode ? 'purple' : cohortMode ? 'cohort' : node?.color ?? 'neutral'}
        role="dialog"
        aria-label="Details"
        aria-hidden={!open}
      >
        <button
          type="button"
          className={styles.grab}
          data-testid="sheet-grab"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
          aria-expanded={expanded}
        />
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
              This is how Simul8 earns trust instead of asserting it. Seven connectors form a closed
              learning loop — highlighted on the canvas now.
            </p>
            <ul className={styles.loopList}>
              <li><b>Calibration → Method Selection</b> — tells Sub-task B which methods to trust.</li>
              <li><b>Calibration → Fusion</b> — tells the chairperson how to weight each engine.</li>
              <li><b>Method Selection → The Log</b> — writes its routing decision.</li>
              <li><b>Fusion → The Log</b> — writes its weighting decision.</li>
              <li><b>Output → The Log</b> — logs the resolved outcome.</li>
              <li><b>Output → Calibration</b> — feeds the resolved outcome in directly.</li>
              <li><b>The Log → Calibration</b> — calibration reads the record to grade it.</li>
            </ul>
            <p className={styles.foot}>
              Calibration then compares predicted vs. actual, regrades accuracy and honesty, and
              updates the weights — so the next prediction is routed and fused better than the last.
            </p>
          </div>
        ) : cohortMode ? (
          <div className={styles.body}>
            <span className={styles.kicker}>The second compounding loop</span>
            <h2 className={styles.title}>The Cohort Aggregation Loop</h2>
            <p className={styles.lede}>
              The calibration loop sharpens <i>weights</i>; this one sharpens <i>priors</i>. Every
              operator's data, anonymized and pooled to cohort level, enriches the Category warehouse
              for everyone — highlighted on the canvas now.
            </p>
            <ul className={styles.loopList}>
              <li><b>Product Data → Anonymize &amp; Aggregate</b> — the operator's own four sources.</li>
              <li><b>Ask the User → Anonymize &amp; Aggregate</b> — their declared gap-fills.</li>
              <li><b>Output → Anonymize &amp; Aggregate</b> — the same resolved outcome that feeds Calibration, branching here too.</li>
              <li><b>Anonymize &amp; Aggregate → Cohort Aggregation</b> — anonymized cohort patterns.</li>
              <li><b>Helium-ish tool → Cohort Aggregation</b> — the existing cohort-data tool, as one input.</li>
              <li><b>Cohort Aggregation → Category Data</b> — enriches the priors every prediction starts from.</li>
            </ul>
            <p className={styles.foot}>
              An LLM only touches extraction; a deterministic, auditable step makes the privacy
              guarantee. No individual operator is identifiable, and no operator sees another's data —
              yet everyone's predictions get sharper as the pool grows. That is Moat III.
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
