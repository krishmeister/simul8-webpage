import { useTheme } from '../useTheme';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <div className={styles.brand}>
          <span className={styles.mark}>Simul8</span>
          <span className={styles.sep} aria-hidden="true" />
          <span className={styles.tagline}>calibrated decision-intelligence · architecture</span>
        </div>
        <button
          type="button"
          className={styles.theme}
          onClick={toggle}
          data-testid="theme-toggle"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light theme' : 'Dark theme'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
      <p className={styles.hint}>
        <span>Drag to pan</span>
        <span>·</span>
        <span>Scroll / pinch to zoom</span>
        <span>·</span>
        <span>Tap any node</span>
      </p>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
