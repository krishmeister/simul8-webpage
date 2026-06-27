import type { Scenario, StageId } from '../data/demoScenarios';
import styles from './DemoController.module.css';

interface Props {
  scenario: Scenario;
  stageIndex: number;
  playing: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  onExit: () => void;
}

const STAGE_LABEL: Record<StageId, string> = {
  input: 'Input',
  accumulate: 'Accumulate',
  subtaskA: 'Intent',
  subtaskB: 'Method',
  engines: 'Engines',
  fusion: 'Fusion',
  output: 'Output',
};

export default function DemoController({
  scenario,
  stageIndex,
  playing,
  onTogglePlay,
  onPrev,
  onNext,
  onJump,
  onExit,
}: Props) {
  const flow = scenario.flow;
  const stage = flow[stageIndex];
  const atStart = stageIndex === 0;
  const atEnd = stageIndex === flow.length - 1;

  return (
    <div className={styles.bar} data-testid="demo-controller">
      <div className={styles.topRow}>
        <div className={styles.meta}>
          <span className={styles.company}>{scenario.company}</span>
          <span className={styles.counter}>
            Stage {stageIndex + 1} / {flow.length}
          </span>
        </div>
        <div className={styles.transport}>
          <button type="button" onClick={onPrev} disabled={atStart} aria-label="Previous stage" title="Previous">
            <PrevIcon />
          </button>
          <button
            type="button"
            className={styles.playBtn}
            onClick={onTogglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            data-testid="demo-playpause"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" onClick={onNext} disabled={atEnd} aria-label="Next stage" title="Next">
            <NextIcon />
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={styles.exit} onClick={onExit} data-testid="demo-exit">
            Exit
          </button>
        </div>
      </div>

      <div className={styles.rail} role="tablist" aria-label="Flow stages">
        {flow.map((s, i) => (
          <button
            key={s.stage}
            type="button"
            role="tab"
            aria-selected={i === stageIndex}
            className={[
              styles.railItem,
              i === stageIndex ? styles.current : '',
              i < stageIndex ? styles.done : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onJump(i)}
            data-testid={`demo-stage-${s.stage}`}
          >
            <span className={styles.dot} aria-hidden="true" />
            {STAGE_LABEL[s.stage]}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <p className={styles.caption}>{stage.caption}</p>
        <p className={styles.detail}>{stage.detail}</p>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.5 3.2v9.6c0 .6.66.96 1.16.62l7.2-4.8a.75.75 0 0 0 0-1.24l-7.2-4.8A.75.75 0 0 0 4.5 3.2Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="3" height="10" rx="1" />
      <rect x="9" y="3" width="3" height="10" rx="1" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3.5 5.5 8l4.5 4.5M5.5 8H13" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5M10.5 8H3" />
    </svg>
  );
}
