import styles from './Legend.module.css';

const TINTS: { key: string; label: string }[] = [
  { key: 'blue', label: 'External' },
  { key: 'green', label: 'Category' },
  { key: 'amber', label: 'Product / Orchestrator' },
  { key: 'purple', label: 'Linking / Vault' },
  { key: 'pink', label: 'Engines' },
  { key: 'yellow', label: 'Output' },
];

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.row}>
        <span className={styles.flowLine} aria-hidden="true" />
        <span className={styles.label}>Data flow</span>
      </div>
      <div className={styles.row}>
        <span className={styles.calibLine} aria-hidden="true" />
        <span className={styles.label}>Calibration loop</span>
      </div>
      <span className={styles.rule} aria-hidden="true" />
      <div className={styles.tints}>
        {TINTS.map((t) => (
          <span key={t.key} className={styles.tint} data-color={t.key}>
            <i aria-hidden="true" />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
