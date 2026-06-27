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
import Header from './components/Header';
import Legend from './components/Legend';
import styles from './App.module.css';

type DemoPhase = 'off' | 'picker' | 'playing';
const STAGE_MS = 3000;

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
  const [demoPlaying, setDemoPlaying] = useState(false);

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
    setDemoPlaying(false);
    setDemoStage(0);
    setDemoScenarioId(null);
  }, []);

  const pickScenario = useCallback((id: string) => {
    setDemoScenarioId(id);
    setDemoStage(0);
    setDemoPlaying(true);
    setDemoPhase('playing');
  }, []);

  const demoTogglePlay = useCallback(() => {
    if (!demoScenario) return;
    const last = demoScenario.flow.length - 1;
    if (!demoPlaying && demoStage >= last) {
      setDemoStage(0);
      setDemoPlaying(true);
    } else {
      setDemoPlaying((p) => !p);
    }
  }, [demoScenario, demoPlaying, demoStage]);

  const demoJump = useCallback((i: number) => {
    setDemoStage(i);
    setDemoPlaying(false);
  }, []);

  const demoPrev = useCallback(() => {
    setDemoStage((s) => Math.max(0, s - 1));
    setDemoPlaying(false);
  }, []);

  const demoNext = useCallback(() => {
    setDemoStage((s) => (demoScenario ? Math.min(demoScenario.flow.length - 1, s + 1) : s));
    setDemoPlaying(false);
  }, [demoScenario]);

  // Auto-advance the flow while playing.
  useEffect(() => {
    if (demoPhase !== 'playing' || !demoPlaying || !demoScenario) return;
    if (demoStage >= demoScenario.flow.length - 1) return;
    const t = setTimeout(() => setDemoStage((s) => s + 1), STAGE_MS);
    return () => clearTimeout(t);
  }, [demoPhase, demoPlaying, demoStage, demoScenario]);

  // ESC returns to the default view in one keypress: closes the Bible and the
  // demo, clears selection, turns off the calibration highlight.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBibleOpen(false);
        setSelectedId(null);
        setCalibrationMode(false);
        setDemoPhase('off');
        setDemoPlaying(false);
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
      {demoMode && demoScenario && (
        <DemoController
          scenario={demoScenario}
          stageIndex={demoStage}
          playing={demoPlaying}
          onTogglePlay={demoTogglePlay}
          onPrev={demoPrev}
          onNext={demoNext}
          onJump={demoJump}
          onExit={exitDemo}
        />
      )}
    </div>
  );
}
