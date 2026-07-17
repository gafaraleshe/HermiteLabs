import { useState } from "react";
import { toCssBezier, toFusionKeys, type CubicBezier } from "../lib/easing";
import { applyEasing } from "../lib/bridge";

interface Props {
  cubic: CubicBezier;
  input: string;
  frames: number;
  valStart: number;
  valEnd: number;
}

/** Shows the exact Fusion keyframes the current curve produces, and applies
 * them to the selected node through the bridge. */
export function FusionReadout({ cubic, input, frames, valStart, valEnd }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const keys = toFusionKeys(cubic, 0, frames, valStart, valEnd);

  async function onApply() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await applyEasing({ input, keys });
      setStatus(res.ok ? `Applied to ${input}.` : res.message);
    } catch {
      setStatus("Couldn't reach the bridge — start it from Resolve's Scripts menu.");
    } finally {
      setBusy(false);
    }
  }

  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3));

  return (
    <div className="readout">
      <div className="readout-row">
        <span className="k">Timing</span>
        <code>{toCssBezier(cubic)}</code>
      </div>
      <div className="readout-keys">
        <span className="k">Fusion keyframes · {input}</span>
        {keys.map((key, i) => (
          <div className="kf-line" key={i}>
            <span className="frame">f{key.frame}</span>
            <span className="val">{fmt(key.value)}</span>
            <span className="handle">
              {key.rh ? `RH ${fmt(key.rh[0])}, ${fmt(key.rh[1])}` : ""}
              {key.lh ? `LH ${fmt(key.lh[0])}, ${fmt(key.lh[1])}` : ""}
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="apply-btn" onClick={onApply} disabled={busy}>
        {busy ? "Applying…" : "Apply to selected clip"}
      </button>
      {status && <p className="apply-status">{status}</p>}
    </div>
  );
}
