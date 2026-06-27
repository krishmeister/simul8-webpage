import styles from './Controls.module.css';

interface Props {
  calibrationMode: boolean;
  showCalibration: boolean;
  demoMode: boolean;
  onToggleCalibration: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export default function Controls({
  calibrationMode,
  showCalibration,
  demoMode,
  onToggleCalibration,
  onZoomIn,
  onZoomOut,
  onFit,
}: Props) {
  return (
    <>
      {showCalibration && (
        <button
          type="button"
          className={`${styles.calib} ${calibrationMode ? styles.calibOn : ''}`}
          onClick={onToggleCalibration}
          data-testid="calib-toggle"
          aria-pressed={calibrationMode}
        >
          <span className={styles.dot} aria-hidden="true" />
          {calibrationMode ? 'Hide calibration loop' : 'Show calibration loop'}
        </button>
      )}

      <div className={`${styles.zoom} ${demoMode ? styles.zoomDemo : ''}`}>
        <button type="button" onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">
          <PlusIcon />
        </button>
        <span className={styles.divider} aria-hidden="true" />
        <button type="button" onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">
          <MinusIcon />
        </button>
        <span className={styles.divider} aria-hidden="true" />
        <button type="button" onClick={onFit} aria-label="Reset / fit to screen" title="Fit to screen">
          <FitIcon />
        </button>
      </div>
    </>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 3.5v11M3.5 9h11" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3.5 9h11" />
    </svg>
  );
}
function FitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 2.5h-4v4M11.5 2.5h4v4M6.5 15.5h-4v-4M11.5 15.5h4v-4" />
    </svg>
  );
}
