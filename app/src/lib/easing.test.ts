import {
  bounceOut,
  cubicBezierY,
  PRESETS,
  samplePath,
  toCssBezier,
  toFusionKeys,
  type CubicBezier,
} from "./easing";

describe("cubicBezierY", () => {
  const linear: CubicBezier = [0, 0, 1, 1];
  const easeOut: CubicBezier = [0, 0, 0.58, 1];
  const overshoot: CubicBezier = [0.34, 1.56, 0.64, 1];

  it("pins the endpoints for any curve", () => {
    for (const p of PRESETS) {
      if (!p.cubic) continue;
      expect(cubicBezierY(p.cubic, 0)).toBe(0);
      expect(cubicBezierY(p.cubic, 1)).toBe(1);
    }
  });

  it("is the identity for a linear curve", () => {
    expect(cubicBezierY(linear, 0.5)).toBeCloseTo(0.5, 3);
    expect(cubicBezierY(linear, 0.25)).toBeCloseTo(0.25, 3);
  });

  it("runs ahead of linear for ease-out", () => {
    // Ease-out is fast early, so at the midpoint it has covered > half.
    expect(cubicBezierY(easeOut, 0.5)).toBeGreaterThan(0.5);
  });

  it("exceeds 1 somewhere for an overshoot curve", () => {
    const peak = Math.max(...samplePath({ id: "o", label: "o", cubic: overshoot }).map((p) => p.y));
    expect(peak).toBeGreaterThan(1);
  });
});

describe("bounceOut", () => {
  it("lands exactly on the endpoints", () => {
    expect(bounceOut(0)).toBeCloseTo(0, 5);
    expect(bounceOut(1)).toBeCloseTo(1, 5);
  });

  it("stays within [0, 1]", () => {
    for (let i = 0; i <= 20; i++) {
      const y = bounceOut(i / 20);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1.0001);
    }
  });
});

describe("toFusionKeys", () => {
  it("maps control points straight onto handle positions", () => {
    const cb: CubicBezier = [0.25, 0.1, 0.5, 1];
    const keys = toFusionKeys(cb, 0, 24, 0, 1);
    expect(keys[0]).toEqual({ frame: 0, value: 0, rh: [6, 0.1] });
    expect(keys[1]).toEqual({ frame: 24, value: 1, lh: [12, 1] });
  });

  it("scales handles into a non-zero start frame and value range", () => {
    const cb: CubicBezier = [0.5, 0.5, 0.5, 0.5];
    const keys = toFusionKeys(cb, 10, 30, 1, 2);
    // start + 0.5*20 = 20 frames; 1 + 0.5*1 = 1.5 value
    expect(keys[0].rh).toEqual([20, 1.5]);
    expect(keys[1].lh).toEqual([20, 1.5]);
  });
});

describe("toCssBezier", () => {
  it("formats a readable timing function", () => {
    expect(toCssBezier([0.34, 1.56, 0.64, 1])).toBe("cubic-bezier(0.34, 1.56, 0.64, 1)");
  });
});
