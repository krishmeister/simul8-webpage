import { useMemo, useState } from 'react';
import type { Scenario } from '../data/demoScenarios';
import styles from './DemoOutput.module.css';

interface Props {
  scenario: Scenario;
  onBack: () => void;
  onReplay: () => void;
  onExit: () => void;
  onNext?: () => void;
}

type Tab = 'outcome' | 'journey' | 'interrogate' | 'share';

const TABS: { id: Tab; label: string }[] = [
  { id: 'outcome', label: 'Outcome' },
  { id: 'journey', label: 'Journey' },
  { id: 'interrogate', label: 'Interrogate & Adjust' },
  { id: 'share', label: 'Share' },
];

export default function DemoOutput({ scenario, onBack, onReplay, onExit, onNext }: Props) {
  const [tab, setTab] = useState<Tab>('outcome');
  const [slider, setSlider] = useState(0);
  const out = scenario.output;

  const confPct = useMemo(() => {
    const m = out.outcome.confidence.match(/(\d+)\s*%/);
    return m ? Math.min(100, Number(m[1])) : null;
  }, [out.outcome.confidence]);

  const adjusted = slider > 8;

  return (
    <>
      <div className={styles.backdrop} onClick={onExit} aria-hidden="true" />
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Output — ${scenario.company}`}
        data-testid="demo-output"
      >
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <span className={styles.kicker}>Output</span>
            <span className={styles.company}>{scenario.company}</span>
          </div>
          <div className={styles.headActions}>
            <button type="button" className={styles.ghost} onClick={onBack} data-testid="output-back">
              ‹ Back to flow
            </button>
            <button type="button" className={styles.ghost} onClick={onReplay}>
              ↻ Replay
            </button>
            {onNext && (
              <button type="button" className={styles.ghostNext} onClick={onNext} data-testid="output-next">
                See the loop close →
              </button>
            )}
            <button type="button" className={styles.close} onClick={onExit} aria-label="Exit demo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
              data-testid={`output-tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {tab === 'outcome' && (
            <div className={styles.outcome}>
              <div className={styles.outcomeMain}>
                <span className={styles.mostLikely}>Most likely</span>
                <span className={styles.headline}>{out.outcome.headline}</span>
              </div>
              <div className={styles.rangeWrap}>
                <div className={styles.rangeTrack}>
                  <div className={styles.rangeBand} />
                  <div className={styles.rangeMarker} />
                </div>
                <div className={styles.rangeCaption}>{out.outcome.range}</div>
              </div>
              <div className={styles.confRow}>
                <div className={styles.confBlock}>
                  <span className={styles.confLabel}>Confidence</span>
                  {confPct !== null && (
                    <div className={styles.confMeter}>
                      <div className={styles.confFill} style={{ width: `${confPct}%` }} />
                    </div>
                  )}
                  <span className={styles.confValue}>{out.outcome.confidence}</span>
                </div>
                <div className={styles.maturityBlock}>
                  <span className={styles.confLabel}>Maturity</span>
                  <span className={styles.maturityBadge}>{out.outcome.maturity}</span>
                </div>
              </div>
              <p className={styles.plain}>{out.outcome.plain}</p>
            </div>
          )}

          {tab === 'journey' && (
            <div className={styles.journey}>
              <h3 className={styles.sectionTitle}>Engine contributions</h3>
              <div className={styles.engines}>
                {out.journey.engines.map((e) => (
                  <div
                    key={e.engine}
                    className={`${styles.engine} ${e.fired ? '' : styles.notFired}`}
                    data-agreement={e.agreement ?? 'none'}
                  >
                    <div className={styles.engineHead}>
                      <span className={styles.engineName}>{e.engine}</span>
                      {e.fired ? (
                        <span className={styles.engineWeight}>{e.weight}%</span>
                      ) : (
                        <span className={styles.engineNotFired}>not fired</span>
                      )}
                    </div>
                    {e.fired && (
                      <div className={styles.weightTrack}>
                        <div className={styles.weightBar} style={{ width: `${e.weight ?? 0}%` }} />
                      </div>
                    )}
                    {e.fired && e.verdict && (
                      <div className={styles.verdictRow}>
                        {e.agreement && (
                          <span className={styles.agree} data-agreement={e.agreement}>
                            {e.agreement === 'agrees' ? 'agrees' : e.agreement === 'diverges' ? 'diverges' : 'neutral'}
                          </span>
                        )}
                        <span className={styles.verdict}>{e.verdict}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className={styles.sectionTitle}>Causal chain</h3>
              <div className={styles.chain}>
                {out.journey.causalChain.map((step, i) => (
                  <span key={i} className={styles.chainStep}>
                    <span className={styles.chainChip}>{step}</span>
                    {i < out.journey.causalChain.length - 1 && (
                      <span className={styles.chainArrow} aria-hidden="true">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>

              <h3 className={styles.sectionTitle}>Why this answer</h3>
              <p className={styles.narrative}>{out.journey.narrative}</p>

              <h3 className={styles.sectionTitle}>Evidence</h3>
              <div className={styles.evidence}>
                {out.journey.evidence.map((ev, i) => (
                  <span key={i} className={styles.evidenceTag}>
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === 'interrogate' && (
            <div className={styles.interrogate}>
              <span className={styles.sectionTitle}>Ask a "what if"</span>
              <p className={styles.prompt}>{out.interrogate.prompt}</p>
              <div className={styles.sliderRow}>
                <span className={styles.sliderEnd}>As asked</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slider}
                  onChange={(e) => setSlider(Number(e.target.value))}
                  className={styles.slider}
                  data-testid="interrogate-slider"
                  aria-label="Adjust the scenario"
                />
                <span className={styles.sliderEnd}>Adjusted</span>
              </div>
              <div
                className={`${styles.adjusted} ${adjusted ? styles.adjustedOn : ''}`}
                data-testid="interrogate-result"
              >
                {adjusted ? (
                  <>
                    <span className={styles.adjustedLabel}>Re-running…&nbsp; adjusted result</span>
                    <p className={styles.adjustedText}>{out.interrogate.adjustedResult}</p>
                  </>
                ) : (
                  <span className={styles.adjustedHint}>Drag the slider to re-run this scenario adjusted.</span>
                )}
              </div>
              <p className={styles.note}>{out.interrogate.note}</p>
            </div>
          )}

          {tab === 'share' && (
            <div className={styles.share}>
              <span className={styles.sectionTitle}>Export preview</span>
              <div className={styles.exportCard}>
                <div className={styles.exportBar} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className={styles.summary}>{out.share.summary}</p>
              </div>
              <div className={styles.formats}>
                {out.share.formats.map((f) => (
                  <button key={f} type="button" className={styles.formatBtn}>
                    <DownloadIcon />
                    {f}
                  </button>
                ))}
              </div>
              <span className={styles.exportNote}>Export is illustrative in this walkthrough.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2.5v7M5 7l3 3 3-3M3 12.5h10" />
    </svg>
  );
}
