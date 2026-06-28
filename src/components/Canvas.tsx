import { useCallback, useEffect, useRef } from 'react';
// width reserved on the right for the docked demo controller (panel 340 + gaps)
const DEMO_RIGHT_INSET = 384;
// vertical space reserved at the top for the fixed header overlay so the
// diagram's title + industries row aren't clipped beneath it on the fit.
const HEADER_INSET_DESKTOP = 104;
const HEADER_INSET_MOBILE = 84;
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
  dimmedNodeIds: Set<string>;
  onSelect: (id: string) => void;
  onClear: () => void;
  onToggleCalibration: () => void;
}

const MIN_SCALE = 0.08;
const MAX_SCALE = 2.4;
// Exponential zoom for ctrl+wheel (trackpad pinch). Higher sensitivity makes a
// sustained pinch zoom continuously and responsively (Figma-feel) rather than
// creeping in tiny steps. The step is multiplicative and scales with the event's
// deltaY magnitude, so a faster/bigger pinch zooms more.
const ZOOM_SENSITIVITY = 0.01;
// Cap the per-event multiplicative step so a single coarse mouse ctrl+wheel notch
// (deltaY ~100) doesn't jump wildly, while a trackpad pinch (small deltas) stays smooth.
const MAX_ZOOM_STEP = 1.8;
// Per-frame easing toward the target scale. Each animation frame moves the live
// scale ZOOM_LERP of the way to the accumulated target, so the zoom glides to a
// stop (Figma-feel) instead of snapping to every wheel event. ~5–8 frames to settle.
const ZOOM_LERP = 0.2;

export default function Canvas(props: Props) {
  const apiRef = useRef<ReactZoomPanPinchRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const demoModeRef = useRef(props.demoMode);
  demoModeRef.current = props.demoMode;

  // Smooth-zoom interpolation state. Each wheel/pinch event accumulates a target
  // scale and the screen anchor to hold fixed; an rAF loop eases the live scale
  // toward that target so the visible motion glides rather than stepping.
  const zoomTarget = useRef<{ scale: number; px: number; py: number } | null>(null);
  const zoomRAF = useRef<number | null>(null);

  const stopZoomAnim = useCallback(() => {
    if (zoomRAF.current != null) cancelAnimationFrame(zoomRAF.current);
    zoomRAF.current = null;
    zoomTarget.current = null;
  }, []);

  const fit = useCallback((animate = true) => {
    // A programmatic fit/reset must not fight an in-flight zoom ease.
    stopZoomAnim();
    const api = apiRef.current;
    const el = containerRef.current;
    if (!api || !el) return;
    const vw = el.clientWidth;
    const vh = el.clientHeight;
    // Guard against running before layout is measured — a zero/stale size would
    // produce a bogus transform and leave the diagram clipped at the top-left.
    if (vw === 0 || vh === 0) return;
    // In demo mode on desktop, reserve the right strip for the docked controller
    // and centre the diagram in the remaining (left) region so nothing is occluded.
    const rightInset = demoModeRef.current && vw > 640 ? DEMO_RIGHT_INSET : 0;
    // Always reserve the top strip for the fixed header so the title isn't clipped.
    const topInset = vw > 640 ? HEADER_INSET_DESKTOP : HEADER_INSET_MOBILE;
    const avail = vw - rightInset;
    const availH = vh - topInset;
    const raw = Math.min(avail / CANVAS.w, availH / CANVAS.h) * 0.94;
    const scale = Math.max(MIN_SCALE, Math.min(raw, 1.2));
    const x = (avail - CANVAS.w * scale) / 2;
    const y = topInset + (availH - CANVAS.h * scale) / 2;
    api.setTransform(x, y, scale, animate ? 350 : 0);
  }, [stopZoomAnim]);

  // Fit to screen once the container has been measured, then on every resize.
  // A ResizeObserver (rather than a one-shot rAF) guarantees the first fit runs
  // against real dimensions — fit() itself no-ops on a zero/stale size — so the
  // diagram is correctly framed from the first paint instead of clipped top-left.
  useEffect(() => {
    const el = containerRef.current;
    const ro = new ResizeObserver(() => fit(false));
    if (el) ro.observe(el);
    // rAF covers the common case where layout is ready on the next frame.
    const id = requestAnimationFrame(() => fit(false));
    const onResize = () => fit(false);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
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

  // Figma/trackpad-style gestures. The library's own wheel handling is disabled
  // (wheel.disabled) so we own the wheel: a plain two-finger scroll pans
  // (deltaX/deltaY), a pinch arrives as a wheel with ctrlKey set and zooms
  // centered on the pointer. We attach a non-passive native listener because
  // React's synthetic onWheel is passive and can't preventDefault — without
  // preventDefault the page itself would scroll. Click-drag pan and touch
  // pinch are still handled by the library (panning / pinch configs).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // One eased frame: move the live scale a fraction toward the target while
    // holding the pointer's content-point fixed on screen. Re-reading the live
    // transform every frame keeps it pointer-centered and lets a concurrent
    // two-finger pan compose cleanly.
    const step = () => {
      const api = apiRef.current;
      const tgt = zoomTarget.current;
      if (!api || !tgt) {
        zoomRAF.current = null;
        return;
      }
      const { scale, positionX, positionY } = api.instance.transformState;
      let next = scale + (tgt.scale - scale) * ZOOM_LERP;
      // Settle: once within a hair of the target, snap and end the loop.
      if (Math.abs(tgt.scale - next) <= Math.max(0.0006, tgt.scale * 0.004)) {
        next = tgt.scale;
      }
      const cx = (tgt.px - positionX) / scale;
      const cy = (tgt.py - positionY) / scale;
      api.setTransform(tgt.px - cx * next, tgt.py - cy * next, next, 0);
      if (next === tgt.scale) {
        zoomTarget.current = null;
        zoomRAF.current = null;
        return;
      }
      zoomRAF.current = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      const api = apiRef.current;
      if (!api) return;
      e.preventDefault();
      const { scale, positionX, positionY } = api.instance.transformState;
      if (e.ctrlKey) {
        // pinch → ease zoom toward the pointer, keeping that point fixed on screen
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const rawFactor = Math.exp(-e.deltaY * ZOOM_SENSITIVITY);
        const factor = Math.max(1 / MAX_ZOOM_STEP, Math.min(MAX_ZOOM_STEP, rawFactor));
        // Accumulate onto the pending target (or the live scale if idle) so a
        // fast/sustained pinch still travels far; the eased step() animates there.
        const base = zoomTarget.current ? zoomTarget.current.scale : scale;
        const target = Math.max(MIN_SCALE, Math.min(MAX_SCALE, base * factor));
        zoomTarget.current = { scale: target, px, py };
        if (zoomRAF.current == null) zoomRAF.current = requestAnimationFrame(step);
      } else {
        // two-finger scroll → pan both axes (immediate, no easing)
        api.setTransform(positionX - e.deltaX, positionY - e.deltaY, scale, 0);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (zoomRAF.current != null) cancelAnimationFrame(zoomRAF.current);
      zoomRAF.current = null;
    };
  }, []);

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
        wheel={{ disabled: true }}
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
                demoDimmed={props.dimmedNodeIds.has(n.id)}
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
        onZoomIn={() => {
          stopZoomAnim();
          apiRef.current?.zoomIn(0.25);
        }}
        onZoomOut={() => {
          stopZoomAnim();
          apiRef.current?.zoomOut(0.25);
        }}
        onFit={() => fit(true)}
      />
    </div>
  );
}
