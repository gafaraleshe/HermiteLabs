"use client";

import { useState } from "react";

/**
 * The Apply at / Frames / Curve controls, drawn with the same maths the
 * templates use (HermiteCut tools/fusegen/packs/common.py: effect_raw and
 * effect_curve). The curve is 1 at the clip edge and 0 where the clip is
 * untouched.
 */
const MODES = ["Post", "Pre", "Both", "Whole"] as const;
const CURVES = ["Linear", "Smooth", "Ease Out", "Ease In", "Snap", "Overshoot"] as const;
const CLIP = 100;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function raw(mode: number, frames: number, f: number) {
  const F = Math.max(1, frames);
  const post = clamp01(1 - f / F);
  const pre = clamp01(1 - (CLIP - 1 - f) / F);
  return mode === 0 ? post : mode === 1 ? pre : mode === 2 ? Math.max(post, pre) : 1;
}

function shape(curve: number, e: number) {
  switch (curve) {
    case 0: return e;
    case 1: return e * e * (3 - 2 * e);
    case 2: return e ** 3;
    case 3: return 1 - (1 - e) ** 3;
    case 4: return e ** 6;
    default: return 2.70158 * e ** 3 - 1.70158 * e ** 2;
  }
}

const NOTES = [
  "Post: the effect hits on the cut in, then lets go.",
  "Pre: the effect builds into the cut out.",
  "Both: a hit at each end of the clip.",
  "Whole: the effect runs for the whole clip.",
];

export function TimingDemo() {
  const [mode, setMode] = useState(0);
  const [frames, setFrames] = useState(12);
  const [curve, setCurve] = useState(2);
  const W = 600, H = 130, top = 16, base = 126;
  const y = (v: number) => base - (base - top) * v;
  const pts = Array.from({ length: CLIP }, (_, f) => {
    const v = shape(curve, raw(mode, frames, f));
    return [(f / (CLIP - 1)) * W, y(v)] as const;
  });
  const path = pts.map(([x, yy], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`).join(" ");
  const fx = (f: number) => (f / (CLIP - 1)) * W;
  const windows =
    mode === 3 ? [[0, CLIP - 1]] :
    mode === 0 ? [[0, Math.min(CLIP - 1, frames - 1)]] :
    mode === 1 ? [[Math.max(0, CLIP - frames), CLIP - 1]] :
    [[0, Math.min(CLIP - 1, frames - 1)], [Math.max(0, CLIP - frames), CLIP - 1]];

  return (
    <div className="hc-timing">
      <div className="hc-timing-controls">
        <div>
          <span className="label-upper">Apply at</span>
          <div className="hc-seg" role="group" aria-label="Apply at">
            {MODES.map((m, i) => (
              <button key={m} type="button" aria-pressed={mode === i} onClick={() => setMode(i)}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span className="label-upper">Frames · {frames}</span>
          <input type="range" min={1} max={48} value={frames} disabled={mode === 3}
            onChange={e => setFrames(+e.target.value)} />
        </label>
        <label>
          <span className="label-upper">Curve</span>
          <select value={curve} onChange={e => setCurve(+e.target.value)}>
            {CURVES.map((c, i) => (
              <option key={c} value={i}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="hc-timing-graph" role="img"
        aria-label={`Effect strength across a 100-frame clip: ${MODES[mode]}, ${frames} frames, ${CURVES[curve]} curve`}>
        {windows.map(([a, b], i) => (
          <rect key={i} x={fx(a)} y={top - 10} width={Math.max(2, fx(b) - fx(a))} height={base - top + 10} className="win" />
        ))}
        <line x1="0" x2={W} y1={base} y2={base} className="axis" />
        <path d={path} className="curve" />
      </svg>
      <div className="hc-timing-ticks" aria-hidden="true">
        <span>Cut in</span>
        <span>100-frame clip</span>
        <span>Cut out</span>
      </div>
      <p className="hc-fx-note">{NOTES[mode]} Outside the shaded window the clip is left exactly as it was.</p>
    </div>
  );
}
