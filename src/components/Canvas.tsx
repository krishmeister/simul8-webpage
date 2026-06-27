import { useCallback, useEffect, useRef } from 'react';
// width reserved on the right for the docked demo controller (panel 340 + gaps)
const DEMO_RIGHT_INSET = 384;
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
import { CANVAS } from '../data/diagram';
import type { DiagramArrow, DiagramNode } from '../types';
import ArrowLayer from './ArrowLayer';
import NodeView from './Node';
import Controls from './Controls';
import styles from './Canvas.module.css';

interface Props {
  nodes: DiagramNode[];
  arrows: DiagramArrow[];
  selectedId: string | null;
  focusMode: boolean;
  calibrationMode: boolean;
  demoMode: boolean;
  showCalibration: boolean;
  activeNodeIds: Set<string>;
  activeArrowIds: Set<string>;
  onSelect: (id: string) => void;
  onClear: () => void;
  onToggleCalibration: () => void;
}

const MIN_SCALE = 0.08;
const MAX_SCALE = 2.4;

export default function Canvas(props: Props) {
  const apiRef = useRef<ReactZoomPanPinchRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const demoModeRef = useRef(props.demoMode);
  demoModeRef.current = props.demoMode;

  const fit = useCallback((animate = true) => {
    const api = apiRef.current;
    const el = containerRef.current;
    if (!api || !el) return;
    const vw = el.clientWidth;
    const vh = el.clientHeight;
    // In demo mode on desktop, reserve the right strip for the docked controller
    // and centre the diagram in the remaining (left) region so nothing is occluded.
    const rightInset = demoModeRef.current && vw > 640 ? DEMO_RIGHT_INSET : 0;
    const avail = vw - rightInset;
    const raw = Math.min(avail / CANVAS.w, vh / CANVAS.h) * 0.94;
    const scale = Math.max(MIN_SCALE, Math.min(raw, 1.2));
    const x = (avail - CANVAS.w * scale) / 2;
    const y = (vh - CANVAS.h * scale) / 2;
    api.setTransform(x, y, scale, animate ? 350 : 0);
  }, []);

  // Fit to screen on mount + whenever the viewport resizes.
  useEffect(() => {
    const id = requestAnimationFrame(() => fit(false));
    const onResize = () => fit(false);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [fit]);

  // Re-frame (animated) whenever demo mode toggles, so entering/leaving the demo
  // slides the diagram clear of (or back from) the docked panel.
  const firstFrame = useRef(true);
  useEffect(() => {
    if (firstFrame.current) {
      firstFrame.current = false;
      return;
    }
    fit(true);
  }, [props.demoMode, fit]);

  return (
    <div className={`${styles.container} touch-none`} ref={containerRef}>
      <TransformWrapper
        ref={apiRef}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        initialScale={0.3}
        limitToBounds={false}
        centerZoomedOut={false}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.08 }}
        pinch={{ step: 6 }}
        panning={{ velocityDisabled: false }}
      >
        <TransformComponent wrapperClass={styles.ttWrapper} contentClass={styles.ttContent}>
          <div
            className={styles.plane}
            style={{ width: CANVAS.w, height: CANVAS.h }}
            onPointerDown={(e) => {
              // tapping empty canvas clears selection
              if (e.target === e.currentTarget) props.onClear();
            }}
          >
            <ArrowLayer
              arrows={props.arrows}
              layer="base"
              focusMode={props.focusMode}
              demoMode={props.demoMode}
              activeArrowIds={props.activeArrowIds}
            />
            {props.nodes.map((n) => (
              <NodeView
                key={n.id}
                node={n}
                focusMode={props.focusMode}
                demo={props.demoMode}
                active={props.activeNodeIds.has(n.id)}
                selected={props.selectedId === n.id}
                onSelect={props.onSelect}
              />
            ))}
            <ArrowLayer
              arrows={props.arrows}
              layer="overlay"
              focusMode={props.focusMode}
              demoMode={props.demoMode}
              activeArrowIds={props.activeArrowIds}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>

      <Controls
        calibrationMode={props.calibrationMode}
        showCalibration={props.showCalibration}
        demoMode={props.demoMode}
        onToggleCalibration={props.onToggleCalibration}
        onZoomIn={() => apiRef.current?.zoomIn(0.25)}
        onZoomOut={() => apiRef.current?.zoomOut(0.25)}
        onFit={() => fit(true)}
      />
    </div>
  );
}
