import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  samplePath,
  type CubicBezier,
  type EasingPreset,
} from "../lib/easing";

/**
 * Interactive bezier easing editor. Endpoints are fixed at (0,0) and (1,1);
 * the two inner control points drag freely (y can exceed [0,1] for overshoot).
 * For sampled presets (bounce) the curve is drawn read-only with no handles.
 */

const S = 260; // plot square side, in easing units mapped 1:1 to svg units
const PAD_X = 26;
const PAD_TOP = 70; // headroom above 1.0 for overshoot
const PAD_BOTTOM = 40; // room below 0 for undershoot

const px = (x: number) => x * S;
const py = (y: number) => (1 - y) * S;

interface Props {
  preset: EasingPreset;
  cubic: CubicBezier | null;
  onChange?: (cb: CubicBezier) => void;
}

export function CurveEditor({ preset, cubic, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<0 | 1 | null>(null);

  const editable = Boolean(cubic) && Boolean(onChange);
  const pts = samplePath(preset, 64);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x)} ${py(p.y)}`).join(" ");

  function toEasing(e: ReactPointerEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: pt.x / S, y: 1 - pt.y / S };
  }

  function onMove(e: ReactPointerEvent) {
    if (dragging.current === null || !cubic || !onChange) return;
    const p = toEasing(e);
    if (!p) return;
    const x = Math.min(1, Math.max(0, p.x));
    const y = Math.min(1.7, Math.max(-0.7, p.y));
    const next: CubicBezier =
      dragging.current === 0
        ? [x, y, cubic[2], cubic[3]]
        : [cubic[0], cubic[1], x, y];
    onChange(next);
  }

  function startDrag(handle: 0 | 1) {
    return (e: ReactPointerEvent) => {
      if (!editable) return;
      dragging.current = handle;
      (e.target as Element).setPointerCapture(e.pointerId);
    };
  }

  function endDrag(e: ReactPointerEvent) {
    dragging.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  }

  const gridVals = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      ref={svgRef}
      className="curve-svg"
      viewBox={`${-PAD_X} ${-PAD_TOP} ${S + PAD_X * 2} ${S + PAD_TOP + PAD_BOTTOM}`}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      role="img"
      aria-label={`${preset.label} easing curve`}
    >
      {/* grid */}
      {gridVals.map((g) => (
        <g key={g} className="grid">
          <line x1={px(0)} y1={py(g)} x2={px(1)} y2={py(g)} />
          <line x1={px(g)} y1={py(0)} x2={px(g)} y2={py(1)} />
        </g>
      ))}
      {/* 0 and 1 reference band */}
      <line className="axis" x1={px(0)} y1={py(0)} x2={px(1)} y2={py(0)} />
      <line className="axis" x1={px(0)} y1={py(1)} x2={px(1)} y2={py(1)} />

      {/* handle guides + control points (editable curves only) */}
      {cubic && (
        <>
          <line className="guide" x1={px(0)} y1={py(0)} x2={px(cubic[0])} y2={py(cubic[1])} />
          <line className="guide" x1={px(1)} y1={py(1)} x2={px(cubic[2])} y2={py(cubic[3])} />
        </>
      )}

      {/* the curve */}
      <path className="curve" d={d} fill="none" />

      {/* endpoints */}
      <circle className="endpoint" cx={px(0)} cy={py(0)} r={5} />
      <circle className="endpoint" cx={px(1)} cy={py(1)} r={5} />

      {/* draggable handles */}
      {cubic && (
        <>
          <circle
            className={`handle${editable ? "" : " locked"}`}
            cx={px(cubic[0])}
            cy={py(cubic[1])}
            r={9}
            onPointerDown={startDrag(0)}
          />
          <circle
            className={`handle${editable ? "" : " locked"}`}
            cx={px(cubic[2])}
            cy={py(cubic[3])}
            r={9}
            onPointerDown={startDrag(1)}
          />
        </>
      )}
    </svg>
  );
}
