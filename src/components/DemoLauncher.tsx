import { DEMO_INTRO } from '../data/demoScenarios';
import styles from './DemoLauncher.module.css';

interface Props {
  onClick: () => void;
}

export default function DemoLauncher({ onClick }: Props) {
  return (
    <button type="button" className={styles.launcher} onClick={onClick} data-testid="demo-launcher">
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.play} aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M4.5 3.2v9.6c0 .6.66.96 1.16.62l7.2-4.8a.75.75 0 0 0 0-1.24l-7.2-4.8A.75.75 0 0 0 4.5 3.2Z" />
        </svg>
      </span>
      {DEMO_INTRO.buttonLabel}
    </button>
  );
}
