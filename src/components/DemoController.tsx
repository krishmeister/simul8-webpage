import type { Scenario, StageId } from '../data/demoScenarios';
import styles from './DemoController.module.css';

interface Props {
  scenario: Scenario;
  stageIndex: number;
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
      <div className={styles.head}>
        <div className={styles.meta}>
          <span className={styles.company}>{scenario.company}</span>
          <span className={styles.counter}>
            Stage {stageIndex + 1} / {flow.length}
          </span>
        </div>
        <button type="button" className={styles.exit} onClick={onExit} data-testid="demo-exit" aria-label="Exit demo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
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

      <div className={styles.transport}>
        <button type="button" className={styles.prev} onClick={onPrev} disabled={atStart} data-testid="demo-prev">
          <PrevIcon />
          Previous
        </button>
        <button type="button" className={styles.next} onClick={onNext} disabled={atEnd} data-testid="demo-next">
          Next
          <NextIcon />
        </button>
      </div>
    </div>
  );
}

function PrevIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}
