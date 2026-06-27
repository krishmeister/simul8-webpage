import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Scenario, StageId, FlowStage } from '../data/demoScenarios';
import type { ComponentContribution } from '../data/demoScenariosExpanded';
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
  'input-external': 'External Data',
  'input-category': 'Category Data',
  'input-product': 'Product Data',
  'input-linking': 'Data Linking',
  accumulate: 'Accumulate',
  subtaskA: 'Intent Inference',
  subtaskB: 'Method',
  engines: 'Engines',
  fusion: 'Fusion',
  output: 'Output',
  resolve: 'Resolve',
};

function isInputStage(s: StageId) {
  return s.startsWith('input-');
}

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

      <Rail flow={flow} stageIndex={stageIndex} onJump={onJump} />

      <div className={styles.body}>
        <p className={styles.caption}>{stage.caption}</p>
        <ClampText text={stage.detail} lines={4} className={styles.detail} />

        {isInputStage(stage.stage) && stage.inputComponentDetail && (
          <SubBoxList comp={stage.inputComponentDetail} />
        )}

        {stage.stage === 'accumulate' && (
          <div className={styles.intentCallout}>
            <span className={styles.intentLabel}>The question</span>
            <p className={styles.intentText}>{scenario.question}</p>
          </div>
        )}

        {stage.stage === 'resolve' && stage.resolvedOutcome && (
          <div className={styles.resolvePanel}>
            <ResolveRow label="Predicted" value={stage.resolvedOutcome.predicted} />
            <ResolveRow label="Actual" value={stage.resolvedOutcome.actual} />
            <ResolveRow label="Gap" value={stage.resolvedOutcome.gap} />
            <ResolveRow label="Update" value={stage.resolvedOutcome.update} />
          </div>
        )}
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

// ---- Rail ----

interface RailProps {
  flow: FlowStage[];
  stageIndex: number;
  onJump: (i: number) => void;
}

function Rail({ flow, stageIndex, onJump }: RailProps) {
  let inputGroupHeaderRendered = false;
  const activeRef = useRef<HTMLButtonElement>(null);

  // The rail is height-capped and scrolls; keep the current stage in view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [stageIndex]);

  return (
    <div className={styles.rail} role="tablist" aria-label="Flow stages">
      {flow.map((s, i) => {
        if (isInputStage(s.stage)) {
          const showHeader = !inputGroupHeaderRendered;
          if (showHeader) inputGroupHeaderRendered = true;
          const inputActive = isInputStage(flow[stageIndex]?.stage);
          return (
            <span key={`wrapper-${s.stage}`}>
              {showHeader && (
                <span
                  className={[
                    styles.railGroup,
                    inputActive ? styles.railGroupActive : '',
                  ].filter(Boolean).join(' ')}
                  aria-hidden="true"
                >
                  Input
                </span>
              )}
              <button
                key={s.stage}
                ref={i === stageIndex ? activeRef : undefined}
                type="button"
                role="tab"
                aria-selected={i === stageIndex}
                className={[
                  styles.railItem,
                  styles.railSub,
                  i === stageIndex ? styles.current : '',
                  i < stageIndex ? styles.done : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onJump(i)}
                data-testid={`demo-stage-${s.stage}`}
              >
                <span className={styles.dot} aria-hidden="true" />
                {STAGE_LABEL[s.stage]}
              </button>
            </span>
          );
        }

        return (
          <button
            key={s.stage}
            ref={i === stageIndex ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={i === stageIndex}
            className={[
              styles.railItem,
              i === stageIndex ? styles.current : '',
              i < stageIndex ? styles.done : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onJump(i)}
            data-testid={`demo-stage-${s.stage}`}
          >
            <span className={styles.dot} aria-hidden="true" />
            {STAGE_LABEL[s.stage]}
          </button>
        );
      })}
    </div>
  );
}

// ---- Sub-box list (input stages) ----

interface SubBoxListProps {
  comp: ComponentContribution;
}

function SubBoxList({ comp }: SubBoxListProps) {
  return (
    <div className={styles.subBoxList}>
      {comp.subBoxes.map((sb) => (
        <div
          key={sb.box}
          className={[styles.subBoxItem, sb.relevant ? styles.subBoxRelevant : styles.subBoxDim].join(' ')}
        >
          <span className={styles.subBoxDot} aria-hidden="true" />
          <div className={styles.subBoxContent}>
            <span className={styles.subBoxName}>{sb.box}</span>
            {sb.relevant ? (
              <ClampText
                text={sb.contributed}
                lines={3}
                className={styles.subBoxContrib}
                wrapClassName={styles.subBoxContribWrap}
              />
            ) : (
              <span className={styles.subBoxNotUsed}>not used for this question</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Resolve row ----

function ResolveRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.resolveRow}>
      <span className={styles.resolveLabel}>{label}</span>
      <ClampText text={value} lines={3} className={styles.resolveValue} />
    </div>
  );
}

// ---- Read-more / show-less clamp ----
// Collapses long copy to `lines` lines with an inline expander. The expander
// only appears when the text actually overflows the clamp (measured against the
// collapsed box). Used for the stage detail, sub-box contributions and the
// resolve values — the longest content in the panel.
interface ClampTextProps {
  text: string;
  lines: number;
  className?: string;
  wrapClassName?: string;
}

function ClampText({ text, lines, className, wrapClassName }: ClampTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  // Measure overflow only while collapsed (when expanded the box has no clamp,
  // so scrollHeight === clientHeight and the measure would be meaningless).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, lines, expanded]);

  // Collapse back to the top whenever the underlying text changes (stage change).
  useEffect(() => setExpanded(false), [text]);

  const pClass = [className, styles.clampLine, expanded ? styles.clampOpen : '']
    .filter(Boolean)
    .join(' ');
  const pStyle: CSSProperties | undefined = expanded
    ? undefined
    : ({ WebkitLineClamp: lines } as CSSProperties);

  return (
    <div className={[styles.clampWrap, wrapClassName].filter(Boolean).join(' ')}>
      <p ref={ref} className={pClass} style={pStyle}>
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          className={styles.readMore}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

// ---- Icons ----

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
