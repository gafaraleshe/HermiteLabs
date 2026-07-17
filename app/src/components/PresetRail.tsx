import { PRESETS } from "../lib/easing";

interface Props {
  activeId: string;
  onPick: (id: string) => void;
}

export function PresetRail({ activeId, onPick }: Props) {
  return (
    <div className="preset-rail">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`preset-chip${p.id === activeId ? " active" : ""}`}
          onClick={() => onPick(p.id)}
        >
          <MiniCurve id={p.id} />
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Tiny inline preview of each preset curve for the rail. */
function MiniCurve({ id }: { id: string }) {
  const preset = PRESETS.find((p) => p.id === id)!;
  const S = 34;
  const pad = 6;
  const pts: string[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = preset.cubic
      ? cubicPreview(preset.cubic, x)
      : preset.sampled
        ? preset.sampled(x)
        : x;
    const sx = pad + x * S;
    const sy = pad + (1 - Math.min(1.2, Math.max(-0.2, y))) * S;
    pts.push(`${i === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
  }
  return (
    <svg className="mini-curve" viewBox={`0 0 ${S + pad * 2} ${S + pad * 2}`} aria-hidden="true">
      <path d={pts.join(" ")} fill="none" />
    </svg>
  );
}

function cubicPreview(cb: readonly [number, number, number, number], t: number): number {
  // Lightweight duplicate of the sampler to keep this presentational component
  // free of the drag/apply machinery.
  const [x1, y1, x2, y2] = cb;
  let lo = 0;
  let hi = 1;
  let u = t;
  for (let i = 0; i < 20; i++) {
    u = (lo + hi) / 2;
    const mu = 1 - u;
    const xx = 3 * mu * mu * u * x1 + 3 * mu * u * u * x2 + u * u * u;
    if (xx < t) lo = u;
    else hi = u;
  }
  const mu = 1 - u;
  return 3 * mu * mu * u * y1 + 3 * mu * u * u * y2 + u * u * u;
}
