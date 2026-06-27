import { DEMO_INTRO, DEMO_SCENARIOS } from '../data/demoScenarios';
import styles from './DemoPicker.module.css';

interface Props {
  open: boolean;
  onPick: (id: string) => void;
  onClose: () => void;
}

export default function DemoPicker({ open, onPick, onClose }: Props) {
  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.modal} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={DEMO_INTRO.title}
        aria-hidden={!open}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <header className={styles.head}>
          <span className={styles.kicker}>See it in action</span>
          <h2 className={styles.title}>{DEMO_INTRO.title}</h2>
          <p className={styles.subtitle}>{DEMO_INTRO.subtitle}</p>
          <p className={styles.disclaimer}>
            <span className={styles.disclaimerDot} aria-hidden="true" />
            {DEMO_INTRO.disclaimer}
          </p>
        </header>

        <div className={styles.grid}>
          {DEMO_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.card}
              onClick={() => onPick(s.id)}
              data-testid={`demo-scenario-${s.id}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.company}>{s.company}</span>
                <span className={styles.category}>{s.category}</span>
              </div>
              <span className={styles.operator}>{s.operator}</span>
              <span className={styles.persona}>{s.persona}</span>
              <p className={styles.question}>{s.question}</p>
              <span className={styles.cta}>
                Play this scenario
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.2v9.6c0 .6.66.96 1.16.62l7.2-4.8a.75.75 0 0 0 0-1.24l-7.2-4.8A.75.75 0 0 0 5 3.2Z" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
