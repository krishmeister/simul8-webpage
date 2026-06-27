import { useCallback, useEffect, useMemo, useState } from 'react';
import { arrows, nodeById, nodes } from './data/diagram';
import { DEMO_SCENARIOS } from './data/demoScenarios';
import { mapDemoNodeIds } from './data/demoMapping';
import Canvas from './components/Canvas';
import DetailPanel from './components/DetailPanel';
import BiblePanel from './components/BiblePanel';
import DemoLauncher from './components/DemoLauncher';
import DemoPicker from './components/DemoPicker';
import DemoController from './components/DemoController';
import DemoOutput from './components/DemoOutput';
import Header from './components/Header';
import Legend from './components/Legend';
import styles from './App.module.css';

type DemoPhase = 'off' | 'picker' | 'playing';

// For arrow animation, the flow stages map to nodes that aren't always the arrow
// endpoints — bridge the input panels to the section frame and the engines to the header.
function arrowNodeSet(set: Set<string>): Set<string> {
  const s = new Set(set);
  const ids = [...s];
  if (ids.some((id) => id.startsWith('panel-'))) s.add('input-frame');
  if (s.has('engine-group') || ids.some((id) => id.startsWith('eng-'))) s.add('engine-header');
  return s;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [bibleOpen, setBibleOpen] = useState(false);

  const [demoPhase, setDemoPhase] = useState<DemoPhase>('off');
  const [demoScenarioId, setDemoScenarioId] = useState<string | null>(null);
  const [demoStage, setDemoStage] = useState(0);

  const demoScenario = useMemo(
    () => DEMO_SCENARIOS.find((s) => s.id === demoScenarioId) ?? null,
    [demoScenarioId],
  );

  const openBible = useCallback(() => setBibleOpen(true), []);
  const closeBible = useCallback(() => setBibleOpen(false), []);

  const select = useCallback(
    (id: string) => {
      if (demoPhase !== 'off') return; // demo mode owns the highlight
      setSelectedId((cur) => (cur === id ? null : id));
      setCalibrationMode(false);
    },
    [demoPhase],
  );

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const toggleCalibration = useCallback(() => {
    setCalibrationMode((v) => !v);
    setSelectedId(null);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedId(null);
    setCalibrationMode(false);
  }, []);

  // ── Demo controls ──────────────────────────────────────────────────────────
  const openDemoPicker = useCallback(() => {
    setSelectedId(null);
    setCalibrationMode(false);
    setBibleOpen(false);
    setDemoPhase('picker');
  }, []);

  const exitDemo = useCallback(() => {
    setDemoPhase('off');
    setDemoStage(0);
    setDemoScenarioId(null);
  }, []);

  const pickScenario = useCallback((id: string) => {
    setDemoScenarioId(id);
    setDemoStage(0);
    setDemoPhase('playing');
  }, []);

  // The flow is manual — the user steps with Next / Previous / the stage rail.
  const demoJump = useCallback((i: number) => setDemoStage(i), []);

  const demoPrev = useCallback(() => setDemoStage((s) => Math.max(0, s - 1)), []);

  const demoNext = useCallback(() => {
    setDemoStage((s) => (demoScenario ? Math.min(demoScenario.flow.length - 1, s + 1) : s));
  }, [demoScenario]);

  const demoReplay = useCallback(() => setDemoStage(0), []);

  // ESC returns to the default view in one keypress: closes the Bible and the
  // demo, clears selection, turns off the calibration highlight.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBibleOpen(false);
        setSelectedId(null);
        setCalibrationMode(false);
        setDemoPhase('off');
        setDemoStage(0);
        setDemoScenarioId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Which nodes/arrows are "lit" given the current focus.
  const { activeNodeIds, activeArrowIds } = useMemo(() => {
    const activeNodes = new Set<string>();
    const activeArrows = new Set<string>();

    // Demo flow takes priority.
    if (demoPhase === 'playing' && demoScenario) {
      const flow = demoScenario.flow;
      const stage = flow[demoStage];
      const cur = new Set(mapDemoNodeIds(stage.highlightNodeIds));
      if (cur.has('engine-group')) cur.add('engine-header'); // keep the header lit with its container
      cur.forEach((id) => activeNodes.add(id));
      if (demoStage > 0) {
        const prev = new Set(mapDemoNodeIds(flow[demoStage - 1].highlightNodeIds));
        const fromSet = arrowNodeSet(prev);
        const toSet = arrowNodeSet(cur);
        for (const a of arrows) {
          if (a.type !== 'calibration' && toSet.has(a.to) && fromSet.has(a.from)) {
            activeArrows.add(a.id);
          }
        }
      }
      return { activeNodeIds: activeNodes, activeArrowIds: activeArrows };
    }

    const lightArrowsTouchingActiveNodes = () => {
      // snapshot the seed members so adding endpoints mid-pass can't cascade
      const seed = new Set(activeNodes);
      for (const a of arrows) {
        if (seed.has(a.from) || seed.has(a.to)) {
          activeArrows.add(a.id);
          activeNodes.add(a.from);
          activeNodes.add(a.to);
        }
      }
    };
    if (calibrationMode) {
      for (const a of arrows) {
        if (a.type === 'calibration') {
          activeArrows.add(a.id);
          activeNodes.add(a.from);
          activeNodes.add(a.to);
        }
      }
    } else if (selectedId) {
      const sel = nodeById.get(selectedId);
      if (sel?.groupSelect && sel.group) {
        for (const n of nodes) if (n.group === sel.group) activeNodes.add(n.id);
        lightArrowsTouchingActiveNodes();
      } else {
        activeNodes.add(selectedId);
        for (const a of arrows) {
          if (a.from === selectedId || a.to === selectedId) {
            activeArrows.add(a.id);
            activeNodes.add(a.from);
            activeNodes.add(a.to);
          }
        }
      }
    }
    return { activeNodeIds: activeNodes, activeArrowIds: activeArrows };
  }, [selectedId, calibrationMode, demoPhase, demoStage, demoScenario]);

  const demoMode = demoPhase === 'playing';
  const demoOutputOpen = demoMode && demoScenario?.flow[demoStage]?.stage === 'output';
  const focusMode = calibrationMode || selectedId !== null || demoMode;
  const rawSelected = selectedId ? nodeById.get(selectedId) ?? null : null;
  const selectedNode =
    rawSelected?.groupSelect && rawSelected.group
      ? nodes.find((n) => n.group === rawSelected.group && n.variant === 'bar') ?? rawSelected
      : rawSelected;

  return (
    <div className={styles.app}>
      <Header onOpenBible={openBible} />
      <Canvas
        nodes={nodes}
        arrows={arrows}
        selectedId={selectedId}
        focusMode={focusMode}
        calibrationMode={calibrationMode}
        demoMode={demoMode}
        showCalibration={demoPhase === 'off'}
        activeNodeIds={activeNodeIds}
        activeArrowIds={activeArrowIds}
        onSelect={select}
        onClear={clearSelection}
        onToggleCalibration={toggleCalibration}
      />
      <Legend />
      <DetailPanel node={selectedNode} calibrationMode={calibrationMode} onClose={closePanel} />
      <BiblePanel open={bibleOpen} onClose={closeBible} />

      {demoPhase === 'off' && <DemoLauncher onClick={openDemoPicker} />}
      <DemoPicker open={demoPhase === 'picker'} onPick={pickScenario} onClose={exitDemo} />
      {demoMode && demoScenario && !demoOutputOpen && (
        <DemoController
          scenario={demoScenario}
          stageIndex={demoStage}
          onPrev={demoPrev}
          onNext={demoNext}
          onJump={demoJump}
          onExit={exitDemo}
        />
      )}
      {demoOutputOpen && demoScenario && (
        <DemoOutput
          key={demoScenario.id}
          scenario={demoScenario}
          onBack={demoPrev}
          onReplay={demoReplay}
          onExit={exitDemo}
        />
      )}
    </div>
  );
}
