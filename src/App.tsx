import { useCallback, useEffect, useMemo, useState } from 'react';
import { arrows, nodeById, nodes } from './data/diagram';
import Canvas from './components/Canvas';
import DetailPanel from './components/DetailPanel';
import BiblePanel from './components/BiblePanel';
import Header from './components/Header';
import Legend from './components/Legend';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [bibleOpen, setBibleOpen] = useState(false);

  const openBible = useCallback(() => setBibleOpen(true), []);
  const closeBible = useCallback(() => setBibleOpen(false), []);

  const select = useCallback((id: string) => {
    setSelectedId((cur) => (cur === id ? null : id));
    setCalibrationMode(false);
  }, []);

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const toggleCalibration = useCallback(() => {
    setCalibrationMode((v) => !v);
    setSelectedId(null);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedId(null);
    setCalibrationMode(false);
  }, []);

  // ESC returns to the default, unfocused state in one keypress:
  // closes the Bible, clears selection, turns off the calibration highlight.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBibleOpen(false);
        setSelectedId(null);
        setCalibrationMode(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Which nodes/arrows are "lit" given the current focus.
  const { activeNodeIds, activeArrowIds } = useMemo(() => {
    const activeNodes = new Set<string>();
    const activeArrows = new Set<string>();
    const lightArrowsTouchingActiveNodes = () => {
      // snapshot the seed members so adding endpoints mid-pass can't cascade
      // (otherwise lighting fusion/subB would drag in the whole calibration loop)
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
        // group selection: light the whole ensemble + every connector touching it
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
  }, [selectedId, calibrationMode]);

  const focusMode = calibrationMode || selectedId !== null;
  const rawSelected = selectedId ? nodeById.get(selectedId) ?? null : null;
  // For a group selection, the detail panel shows the group's header description.
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
        activeNodeIds={activeNodeIds}
        activeArrowIds={activeArrowIds}
        onSelect={select}
        onClear={clearSelection}
        onToggleCalibration={toggleCalibration}
      />
      <Legend />
      <DetailPanel node={selectedNode} calibrationMode={calibrationMode} onClose={closePanel} />
      <BiblePanel open={bibleOpen} onClose={closeBible} />
    </div>
  );
}
