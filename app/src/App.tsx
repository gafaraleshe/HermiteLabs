import { useMemo, useState } from "react";
import { CurveEditor } from "./components/CurveEditor";
import { PresetRail } from "./components/PresetRail";
import { ConnectionBar } from "./components/ConnectionBar";
import { FusionReadout } from "./components/FusionReadout";
import { SubsPanel } from "./components/SubsPanel";
import { presetById, type CubicBezier } from "./lib/easing";

type Tab = "easing" | "speed" | "subs";

const EASING_TARGETS = ["Size", "Angle", "Blend"] as const;
const TARGET_DEFAULTS: Record<string, { from: number; to: number }> = {
  Size: { from: 0, to: 1 },
  Angle: { from: 0, to: 90 },
  Blend: { from: 0, to: 1 },
  Speed: { from: 100, to: 40 },
};

function initialTab(): Tab {
  const t = new URLSearchParams(window.location.search).get("tab");
  return t === "speed" || t === "subs" ? t : "easing";
}

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [activeId, setActiveId] = useState("overshoot");
  const [cubic, setCubic] = useState<CubicBezier | null>(
    presetById("overshoot")?.cubic ?? null,
  );
  const [target, setTarget] = useState<string>("Size");
  const [frames, setFrames] = useState(24);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);

  const preset = presetById(activeId)!;
  const speed = tab === "speed";
  const input = speed ? "Speed" : target;

  function pickPreset(id: string) {
    setActiveId(id);
    setCubic(presetById(id)?.cubic ?? null);
  }

  function switchTab(next: Tab) {
    setTab(next);
    if (next === "subs") return;
    const d = TARGET_DEFAULTS[next === "speed" ? "Speed" : target];
    setFrom(d.from);
    setTo(d.to);
  }

  function switchTarget(next: string) {
    setTarget(next);
    const d = TARGET_DEFAULTS[next];
    setFrom(d.from);
    setTo(d.to);
  }

  const editorPreset = useMemo(
    () => (cubic ? { ...preset, cubic } : preset),
    [preset, cubic],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <span className="name">Hermite</span>
          <span className="tag">v0.1</span>
        </div>
        <ConnectionBar />
      </header>

      <div className="tabs">
        <button
          type="button"
          className={`tab${tab === "easing" ? " active" : ""}`}
          onClick={() => switchTab("easing")}
        >
          Easing curve
        </button>
        <button
          type="button"
          className={`tab${tab === "speed" ? " active" : ""}`}
          onClick={() => switchTab("speed")}
        >
          Speed ramp
        </button>
        <button
          type="button"
          className={`tab${tab === "subs" ? " active" : ""}`}
          onClick={() => switchTab("subs")}
        >
          Subs
        </button>
      </div>

      {tab === "subs" ? (
        <SubsPanel />
      ) : (
      <main className="layout">
        <section className="panel editor-panel">
          <div className="panel-head">
            <h2>{speed ? "Speed profile" : "Easing"}</h2>
            <p>
              {speed
                ? "Shape the retime curve — flat is constant speed, dips are slow-motion."
                : "Drag the handles, or start from a preset below."}
            </p>
          </div>
          <div className="curve-frame">
            <CurveEditor preset={editorPreset} cubic={cubic} onChange={setCubic} />
          </div>
          <PresetRail activeId={activeId} onPick={pickPreset} />
        </section>

        <section className="panel controls-panel">
          <div className="panel-head">
            <h2>Apply</h2>
            <p>Maps the curve to exact Fusion keyframes on the selected clip.</p>
          </div>

          <div className="fields">
            {!speed && (
              <label className="field">
                <span>Target input</span>
                <select value={target} onChange={(e) => switchTarget(e.target.value)}>
                  {EASING_TARGETS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              <span>Duration (frames)</span>
              <input
                type="number"
                min={1}
                value={frames}
                onChange={(e) => setFrames(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <label className="field">
              <span>{speed ? "Speed from %" : "From"}</span>
              <input type="number" value={from} onChange={(e) => setFrom(Number(e.target.value))} />
            </label>
            <label className="field">
              <span>{speed ? "Speed to %" : "To"}</span>
              <input type="number" value={to} onChange={(e) => setTo(Number(e.target.value))} />
            </label>
          </div>

          {cubic ? (
            <FusionReadout
              cubic={cubic}
              input={input}
              frames={frames}
              valStart={from}
              valEnd={to}
            />
          ) : (
            <div className="notice">
              <strong>{preset.label}</strong> is a multi-segment curve, so it
              applies as a sampled keyframe sequence rather than two handles.
              Sampled write-back is a fast-follow — pick a single-curve preset to
              apply now.
            </div>
          )}

          {speed && cubic && (
            <p className="hint">
              Speed-ramp write-back drives a Retime / Time node — that bridge
              endpoint is still landing, so Apply reports back rather than
              committing. The curve itself is exact.
            </p>
          )}
        </section>
      </main>
      )}
    </div>
  );
}
