import { useCallback, useEffect, useMemo, useState } from 'react';
import { arrows, nodeById, nodes } from './data/diagram';
import Canvas from './components/Canvas';
import DetailPanel from './components/DetailPanel';
import Header from './components/Header';
import Legend from './components/Legend';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calibrationMode, setCalibrationMode] = useState(false);

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

  // ESC returns to the default, unfocused state in one keypress.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
    if (calibrationMode) {
      for (const a of arrows) {
        if (a.type === 'calibration') {
          activeArrows.add(a.id);
          activeNodes.add(a.from);
          activeNodes.add(a.to);
        }
      }
    } else if (selectedId) {
      activeNodes.add(selectedId);
      for (const a of arrows) {
        if (a.from === selectedId || a.to === selectedId) {
          activeArrows.add(a.id);
          activeNodes.add(a.from);
          activeNodes.add(a.to);
        }
      }
    }
    return { activeNodeIds: activeNodes, activeArrowIds: activeArrows };
  }, [selectedId, calibrationMode]);

  const focusMode = calibrationMode || selectedId !== null;
  const selectedNode = selectedId ? nodeById.get(selectedId) ?? null : null;

  return (
    <div className={styles.app}>
      <Header />
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
    </div>
  );
}
