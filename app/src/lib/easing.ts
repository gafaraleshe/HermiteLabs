/**
 * Easing math — the substance of Hermite Motion.
 *
 * A curve is a CSS-style cubic-bezier [x1, y1, x2, y2] (endpoints fixed at
 * (0,0) and (1,1)). The key trick: the same control points map directly onto
 * DaVinci Fusion BezierSpline keyframe handles, so a curve shaped in the editor
 * becomes exact keyframes on a Resolve node. `toFusionKeys` is that bridge.
 *
 * This mirrors the Python generator in `fusion-macros/`; when `/core` is
 * extracted (plan milestone 8) both sides import one copy from there.
 */

export type CubicBezier = readonly [number, number, number, number];

export interface EasingPreset {
  id: string;
  label: string;
  /** Present for single-cubic curves — these are editable in the curve editor. */
  cubic?: CubicBezier;
  /** Present for multi-segment curves (e.g. bounce) — shown read-only. */
  sampled?: (t: number) => number;
}

export const PRESETS: EasingPreset[] = [
  { id: "linear", label: "Linear", cubic: [0, 0, 1, 1] },
  { id: "ease", label: "Ease", cubic: [0.25, 0.1, 0.25, 1] },
  { id: "ease-in", label: "Ease In", cubic: [0.42, 0, 1, 1] },
  { id: "ease-out", label: "Ease Out", cubic: [0, 0, 0.58, 1] },
  { id: "ease-in-out", label: "Ease In-Out", cubic: [0.42, 0, 0.58, 1] },
  { id: "overshoot", label: "Overshoot", cubic: [0.34, 1.56, 0.64, 1] },
  { id: "bounce", label: "Bounce", sampled: bounceOut },
];

export function presetById(id: string): EasingPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

function bezComponent(a: number, b: number, u: number): number {
  // Cubic bezier component with the outer control points at 0 and 1.
  const mu = 1 - u;
  return 3 * mu * mu * u * a + 3 * mu * u * u * b + u * u * u;
}

/** Solve the parametric u where X(u) = x, by bisection (robust for overshoot). */
function solveU(cb: CubicBezier, x: number): number {
  const [x1, , x2] = cb;
  let lo = 0;
  let hi = 1;
  let u = x;
  for (let i = 0; i < 32; i++) {
    u = (lo + hi) / 2;
    const xx = bezComponent(x1, x2, u);
    if (Math.abs(xx - x) < 1e-6) break;
    if (xx < x) lo = u;
    else hi = u;
  }
  return u;
}

/** Eased value y in [0..~] for input progress t in [0,1]. */
export function cubicBezierY(cb: CubicBezier, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const [, y1, , y2] = cb;
  return bezComponent(y1, y2, solveU(cb, t));
}

/** The standard "bounce out" easing (piecewise, not a single cubic). */
export function bounceOut(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) {
    t -= 1.5 / d1;
    return n1 * t * t + 0.75;
  }
  if (t < 2.5 / d1) {
    t -= 2.25 / d1;
    return n1 * t * t + 0.9375;
  }
  t -= 2.625 / d1;
  return n1 * t * t + 0.984375;
}

export interface PlotPoint {
  x: number;
  y: number;
}

/** Sample a preset into points for drawing (x,y in easing space, y may exceed 1). */
export function samplePath(easing: EasingPreset, steps = 48): PlotPoint[] {
  const pts: PlotPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = easing.cubic
      ? cubicBezierY(easing.cubic, x)
      : easing.sampled
        ? easing.sampled(x)
        : x;
    pts.push({ x, y });
  }
  return pts;
}

export interface FusionKey {
  frame: number;
  value: number;
  /** Right handle (time, value) — outgoing tangent. */
  rh?: [number, number];
  /** Left handle (time, value) — incoming tangent. */
  lh?: [number, number];
}

/**
 * Convert a cubic-bezier curve into the two Fusion keyframes (with handles)
 * that reproduce it on a value ramp from (frameStart, valStart) to
 * (frameEnd, valEnd). The control points scale straight into handle positions.
 */
export function toFusionKeys(
  cb: CubicBezier,
  frameStart: number,
  frameEnd: number,
  valStart: number,
  valEnd: number,
): FusionKey[] {
  const [x1, y1, x2, y2] = cb;
  const df = frameEnd - frameStart;
  const dv = valEnd - valStart;
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return [
    {
      frame: frameStart,
      value: round(valStart),
      rh: [round(frameStart + x1 * df), round(valStart + y1 * dv)],
    },
    {
      frame: frameEnd,
      value: round(valEnd),
      lh: [round(frameStart + x2 * df), round(valStart + y2 * dv)],
    },
  ];
}

/** CSS timing-function string for the current curve (handy readout). */
export function toCssBezier(cb: CubicBezier): string {
  return `cubic-bezier(${cb.map((n) => Math.round(n * 100) / 100).join(", ")})`;
}
