"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hands-on demo: four of HermiteCut's tools, in the browser. Each one
 * shows what the real tool does in Resolve: Ease (the speed-graph editor),
 * Beats (markers on the beat), Captions+ and 3×3 Align, and the templates and
 * sound library (the sounds are real files from HermiteCut's library).
 */
type Tab = "ease" | "beats" | "captions" | "templates";
const TABS: [Tab, string, string][] = [
  ["ease", "01. Ease", "Speed-graph editor"],
  ["beats", "02. Beats", "Beat markers"],
  ["captions", "03. Captions & Align", "Captions+ and 3×3 align"],
  ["templates", "04. Templates & Sound", "Grid Reveal, effects and sounds"],
];

/* ── Ease: a cubic Bézier speed graph, like the app's ── */
function bezier(t: number, x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const e = sx(u) - t;
    if (Math.abs(e) < 1e-5) break;
    const d = dx(u);
    if (Math.abs(d) < 1e-6) break;
    u -= e / d;
  }
  u = Math.max(0, Math.min(1, u));
  return ((ay * u + by) * u + cy) * u;
}

const PRESETS = [
  { name: "Ease Out", c: [0.16, 1, 0.3, 1] },
  { name: "Ease In Out", c: [0.65, 0, 0.35, 1] },
  { name: "Overshoot", c: [0.34, 1.45, 0.64, 1] },
  { name: "Whip", c: [0.85, 0, 0.15, 1] },
] as const;

const PAD = 28, SIZE = 184;
const toSvg = (x: number, y: number) => ({ x: PAD + x * SIZE, y: PAD + (1 - y) * SIZE });

function EaseStage({ c, run }: { c: number[]; run: number }) {
  const [x, setX] = useState(0);
  const [label, setLabel] = useState("Ready");
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let prev = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      const e = bezier(t, c[0]!, c[1]!, c[2]!, c[3]!);
      const w = stage.current ? stage.current.clientWidth * 0.55 : 240;
      setX(e * w);
      setLabel(t < 1 ? `Speed ${Math.min(240, Math.round(Math.abs(e - prev) * 2800))}%` : "Keyframe reached");
      prev = e;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [c, run]);
  return (
    <div ref={stage} className="relative w-full h-full flex items-center p-6">
      <div className="absolute left-[14%] right-[14%] top-1/2 h-px bg-studio-border-strong" />
      <div className="absolute left-[14%] px-4 py-3 rounded-xl bg-studio-surface border border-studio-accent shadow-ember-glow flex items-center gap-3 will-change-transform" style={{ transform: `translateX(${x.toFixed(1)}px)` }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-studio-accent to-studio-accent-deep text-white font-display font-black text-xs flex items-center justify-center">KEY</div>
        <div>
          <div className="font-display font-extrabold text-xs sm:text-sm text-white tracking-tight">TITLE_01</div>
          <div className="font-mono text-[10px] text-studio-accent">{label}</div>
        </div>
      </div>
    </div>
  );
}

function EasePanel({ c, setC, preset, setPreset }: { c: number[]; setC: (c: number[]) => void; preset: string; setPreset: (p: string) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<0 | 1 | null>(null);
  const move = useCallback((clientX: number, clientY: number) => {
    if (drag.current === null || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (((clientX - r.left) / r.width) * 240 - PAD) / SIZE));
    const ny = Math.max(-0.35, Math.min(1.5, 1 - (((clientY - r.top) / r.height) * 240 - PAD) / SIZE));
    const next = [...c];
    next[drag.current * 2] = +nx.toFixed(2);
    next[drag.current * 2 + 1] = +ny.toFixed(2);
    setC(next);
    setPreset("Custom");
  }, [c, setC, setPreset]);
  useEffect(() => {
    const mm = (e: PointerEvent) => move(e.clientX, e.clientY);
    const up = () => { drag.current = null; };
    window.addEventListener("pointermove", mm);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", mm); window.removeEventListener("pointerup", up); };
  }, [move]);
  const p1 = toSvg(c[0]!, c[1]!), p2 = toSvg(c[2]!, c[3]!);
  const handle = (i: 0 | 1, p: { x: number; y: number }) => (
    <g className="cursor-grab active:cursor-grabbing" transform={`translate(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`} onPointerDown={e => { e.preventDefault(); drag.current = i; }} style={{ touchAction: "none" }}>
      <circle r="14" fill="transparent" />
      <circle r="7" fill="#FF4F1F" stroke="#fff" strokeWidth="2" />
      <text x="10" y="-6" fill="#F3F5F8" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="600">P{i + 1}</text>
    </g>
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display font-extrabold text-lg text-studio-text">Speed graph</h3>
          <p className="text-xs text-studio-muted">Drag <span className="text-studio-accent font-mono">P1 / P2</span>, or pick a preset. The app has 30, plus your own.</p>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-studio-bg border border-studio-border text-studio-accent shrink-0">{c.map(v => v.toFixed(2)).join(", ")}</span>
      </div>
      <div className="relative w-full max-w-[260px] mx-auto aspect-square rounded-xl bg-studio-bg border border-studio-border p-2 select-none">
        <svg ref={svg} viewBox="0 0 240 240" className="w-full h-full overflow-visible touch-none" role="img" aria-label="Speed graph editor">
          <g stroke="#1E232D">{[28, 74, 120, 166, 212].map(v => <g key={v}><line x1="28" y1={v} x2="212" y2={v} /><line x1={v} y1="28" x2={v} y2="212" /></g>)}</g>
          <line x1="28" y1="212" x2="212" y2="28" stroke="#2C3342" strokeWidth="1.2" strokeDasharray="4 4" />
          <line x1="28" y1="212" x2={p1.x} y2={p1.y} stroke="#949BA8" strokeWidth="1.5" />
          <line x1="212" y1="28" x2={p2.x} y2={p2.y} stroke="#949BA8" strokeWidth="1.5" />
          <path d={`M 28 212 C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, 212 28`} fill="none" stroke="#FF6B35" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="28" cy="212" r="4.5" fill="#F3F5F8" /><circle cx="212" cy="28" r="4.5" fill="#F3F5F8" />
          {handle(0, p1)}{handle(1, p2)}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map(pr => (
          <button key={pr.name} type="button" onClick={() => { setC([...pr.c]); setPreset(pr.name); }}
            className={`px-3 py-2 rounded-lg bg-studio-bg hover:bg-studio-elevated border text-left transition-all cursor-pointer ${preset === pr.name ? "border-studio-accent" : "border-studio-border"}`}>
            <div className="font-semibold text-xs text-studio-text">{pr.name}</div>
            <div className="font-mono text-[10px] text-studio-muted">{pr.c.map(v => v.toFixed(2)).join(", ")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Beats: markers on every beat, bar or eight ── */
const WAVE = [0.22, 0.34, 0.94, 0.36, 0.48, 0.25, 0.84, 0.3, 0.24, 0.42, 0.98, 0.38, 0.54, 0.28, 0.88, 0.34, 0.2, 0.4, 0.92, 0.33, 0.5, 0.27, 0.82, 0.29, 0.26, 0.44, 0.96, 0.36, 0.52, 0.31, 0.9, 0.24];
type Every = "beat" | "bar" | "eight";
const isMark = (i: number, every: Every) => i % 2 === 0 && (every === "beat" || (every === "bar" && i % 8 === 2) || (every === "eight" && i % 16 === 2));

function BeatsCanvas({ every, placed }: { every: Every; placed: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const cv = ref.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const w = r.width, h = r.height, slot = w / WAVE.length, bw = Math.max(2, slot * 0.62);
    WAVE.forEach((a, i) => {
      const mark = isMark(i, every);
      const bh = Math.max(6, a * (h - 14));
      ctx.fillStyle = mark && placed ? "#FF6B35" : "rgba(34,197,94,.65)";
      ctx.fillRect(i * slot + (slot - bw) / 2, h - bh, bw, bh);
      if (mark && placed) {
        ctx.fillStyle = "#38bdf8";
        const x = i * slot + slot / 2;
        ctx.beginPath(); ctx.moveTo(x - 5, 0); ctx.lineTo(x + 5, 0); ctx.lineTo(x, 7); ctx.fill();
      }
    });
  }, [every, placed]);
  useEffect(() => { draw(); window.addEventListener("resize", draw); return () => window.removeEventListener("resize", draw); }, [draw]);
  return <canvas ref={ref} className="w-full h-full block" aria-label="Song waveform with beat markers" />;
}

/* ── Captions and align ── */
const ALIGN = [
  ["items-start justify-start", "Top left", "↖"], ["items-start justify-center", "Top centre", "↑"], ["items-start justify-end", "Top right", "↗"],
  ["items-center justify-start", "Left", "←"], ["items-center justify-center", "Centre", "●"], ["items-center justify-end", "Right", "→"],
  ["items-end justify-start", "Bottom left", "↙"], ["items-end justify-center", "Lower third", "↓"], ["items-end justify-end", "Bottom right", "↘"],
] as const;
type CapStyle = "pop" | "highlight" | "clean";

function Caption({ style, k }: { style: CapStyle; k: number }) {
  if (style === "pop") return <div key={k} className="px-4 py-2 rounded-lg bg-gradient-to-r from-studio-accent to-studio-accent-deep text-white font-display font-black text-lg sm:text-2xl uppercase tracking-tight shadow-lg animate-caption-pop">Every word <span className="underline decoration-2">lands</span> on time.</div>;
  if (style === "highlight") return <div key={k} className="px-4 py-2.5 rounded-xl bg-black/85 border border-studio-border-strong text-white font-display font-extrabold text-base sm:text-xl uppercase tracking-wide animate-caption-pop">Every word <span className="px-2 py-0.5 rounded bg-studio-green text-black">lands</span> on time.</div>;
  return <div key={k} className="px-4 py-1.5 rounded bg-black/75 text-studio-text font-medium text-sm sm:text-lg animate-caption-pop">Every word lands on time.</div>;
}

/* ── Templates and sound ── */
const TEMPLATES = [
  { id: "grid", name: "Grid Reveal", note: "11 looks · transition" },
  { id: "shutter", name: "Slow Shutter", note: "180–1440° · Time FX" },
  { id: "flash", name: "Glow Flash", note: "Flashes · effect" },
  { id: "credit", name: "Credit Neon", note: "Music-video credits · title" },
] as const;
const SOUNDS = [
  { name: "Whoosh Fast", src: "/cut/sfx/whoosh-fast.mp3" },
  { name: "Impact Hit", src: "/cut/sfx/impact-hit.mp3" },
  { name: "Riser 3s", src: "/cut/sfx/riser-3s-02.mp3" },
];

function TemplateStage({ id, k }: { id: string; k: number }) {
  if (id === "grid") {
    return (
      <div key={k} className="flex flex-col items-center">
        <div className="grid grid-cols-6 gap-1.5 w-64 sm:w-80">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className={`h-7 sm:h-9 rounded border animate-tile ${(i + Math.floor(i / 6)) % 2 ? "bg-studio-surface border-studio-border-strong" : "bg-studio-accent/30 border-studio-accent"}`} style={{ animationDelay: `${((i % 6) + Math.floor(i / 6)) * 45}ms` }} />
          ))}
        </div>
        <div className="mt-4 font-mono text-xs text-studio-accent uppercase tracking-wider">Grid Reveal · diagonal sweep</div>
      </div>
    );
  }
  if (id === "shutter") {
    return (
      <div key={k} className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="px-6 py-3 rounded-xl border border-cyan-400/40 text-cyan-300/40 font-display font-black text-2xl -translate-x-6">MOTION</div>
          <div className="absolute px-6 py-3 rounded-xl border border-studio-accent/60 text-studio-accent/70 font-display font-black text-2xl -translate-x-2">MOTION</div>
          <div className="absolute px-6 py-3 rounded-xl bg-studio-surface border border-white text-white font-display font-black text-2xl translate-x-2 animate-caption-pop">MOTION</div>
        </div>
        <div className="mt-6 font-mono text-xs text-studio-accent uppercase tracking-wider">Slow Shutter · 360° trail</div>
      </div>
    );
  }
  if (id === "flash") {
    return (
      <div key={k} className="flex flex-col items-center">
        <div className="w-64 sm:w-80 h-28 rounded-xl bg-gradient-to-r from-studio-accent via-amber-200 to-white flex items-center justify-center shadow-ember-glow animate-caption-pop">
          <span className="font-display font-black text-xl text-black tracking-tight">GLOW FLASH ON THE CUT</span>
        </div>
        <div className="mt-4 font-mono text-xs text-studio-accent uppercase tracking-wider">Glow Flash · Post · 8 frames</div>
      </div>
    );
  }
  return (
    <div key={k} className="text-center animate-caption-pop">
      <div className="font-mono text-[10px] tracking-[0.3em] text-studio-accent uppercase mb-1">Artist</div>
      <div className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white uppercase" style={{ textShadow: "0 0 18px rgba(255,107,53,.65)" }}>Nova</div>
      <div className="font-mono text-[11px] tracking-[0.2em] text-studio-muted uppercase mt-1">Midnight · Directed by Gafar</div>
    </div>
  );
}

export function Playground() {
  const [tab, setTab] = useState<Tab>("ease");
  const [run, setRun] = useState(0);
  const [c, setC] = useState<number[]>([0.16, 1, 0.3, 1]);
  const [preset, setPreset] = useState("Ease Out");
  const [every, setEvery] = useState<Every>("beat");
  const [placed, setPlaced] = useState(false);
  const [align, setAlign] = useState(4);
  const [cap, setCap] = useState<CapStyle>("pop");
  const [tpl, setTpl] = useState("grid");
  const [playing, setPlaying] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => audio.current?.pause(), []);
  const marks = WAVE.filter((_, i) => isMark(i, every)).length;
  const play = (s: (typeof SOUNDS)[number]) => {
    audio.current?.pause();
    const a = new Audio(s.src);
    audio.current = a;
    setPlaying(s.name);
    a.onended = () => setPlaying(null);
    a.play().catch(() => setPlaying(null));
  };

  return (
    <div className="rounded-2xl bg-studio-surface border border-studio-border-strong shadow-panel-depth overflow-hidden">
      <div className="bg-studio-viewer border-b border-studio-border px-3 sm:px-5 pt-3 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="HermiteCut tools">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setRun(r => r + 1); }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-t-lg font-mono text-xs font-medium border-t border-x transition-all whitespace-nowrap cursor-pointer ${tab === id ? "bg-studio-surface text-studio-text border-studio-border" : "text-studio-muted border-transparent hover:text-studio-text"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-2 pb-2 font-mono text-[11px] text-studio-muted">
          <span className="w-2 h-2 rounded-full bg-studio-green" /> Runs in your browser
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-4 sm:p-6 bg-studio-viewer border-b lg:border-b-0 lg:border-r border-studio-border flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-studio-surface border border-studio-border font-mono text-[10px] text-studio-muted">PROGRAM MONITOR</span>
            <span className="font-mono text-[11px] text-studio-accent">{TABS.find(t => t[0] === tab)![2]}</span>
          </div>
          <div className="relative w-full aspect-video rounded-xl nle-monitor-bg border border-studio-border-strong overflow-hidden flex items-center justify-center">
            <div className="absolute inset-4 border border-white/[0.06] rounded-lg pointer-events-none" />
            {tab === "ease" && <EaseStage c={c} run={run} />}
            {tab === "beats" && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-studio-surface border-2 flex flex-col items-center justify-center transition-colors ${placed ? "border-studio-accent" : "border-studio-border-strong"}`}>
                  <span className="font-mono text-[10px] uppercase text-studio-muted">Markers</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-studio-text mt-0.5">{placed ? marks : "—"}</span>
                  <span className="font-mono text-[10px] text-studio-accent mt-1">every {every}</span>
                </div>
                <p className="font-mono text-[11px] text-studio-muted mt-4">HermiteCut finds the beat and drops a marker on it, ready to cut to.</p>
              </div>
            )}
            {tab === "captions" && (
              <div className={`absolute inset-0 p-6 sm:p-8 flex ${ALIGN[align]![0]}`}>
                <div className="max-w-[85%]"><Caption style={cap} k={align * 10 + ["pop", "highlight", "clean"].indexOf(cap) + run * 100} /></div>
              </div>
            )}
            {tab === "templates" && <TemplateStage id={tpl} k={run} />}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={() => setRun(r => r + 1)} className="px-3 py-1.5 rounded-lg bg-studio-accent hover:bg-studio-accent-deep text-white font-mono text-xs font-medium transition-colors cursor-pointer shrink-0">↻ Replay</button>
            <div className="flex-1 h-2 rounded-full bg-studio-surface border border-studio-border overflow-hidden"><div className="h-full w-full bg-studio-accent/60" /></div>
            <span className="font-mono text-[11px] text-studio-muted shrink-0">1.50s</span>
          </div>
        </div>

        <div className="lg:col-span-5 p-4 sm:p-6 bg-studio-surface flex flex-col justify-between">
          {tab === "ease" && <EasePanel c={c} setC={v => { setC(v); setRun(r => r + 1); }} preset={preset} setPreset={setPreset} />}
          {tab === "beats" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-studio-text">Beat markers</h3>
                <p className="text-xs text-studio-muted mt-1">Analyse the song on the timeline, then mark every beat, every bar or every eight.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["beat", "bar", "eight"] as const).map(m => (
                  <button key={m} type="button" onClick={() => { setEvery(m); setPlaced(false); }}
                    className={`py-2 px-2 rounded-lg bg-studio-bg border font-mono text-xs cursor-pointer ${every === m ? "border-studio-accent text-studio-text" : "border-studio-border text-studio-muted"}`}>
                    Every {m}
                  </button>
                ))}
              </div>
              <div className="rounded-xl bg-studio-bg border border-studio-border p-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] text-studio-muted mb-2">
                  <span>A1 · SCORE.WAV</span>
                  <span className="text-studio-accent">{placed ? `${marks} markers placed` : `${marks} beats found`}</span>
                </div>
                <div className="w-full h-24"><BeatsCanvas every={every} placed={placed} /></div>
              </div>
              <button type="button" onClick={() => setPlaced(true)} className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-semibold text-sm shadow-ember-glow transition-all cursor-pointer active:scale-[0.98]">
                Add beat markers
              </button>
            </div>
          )}
          {tab === "captions" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-studio-text">Captions+ &amp; 3×3 Align</h3>
                <p className="text-xs text-studio-muted mt-1">Animated word captions from your subtitles, and one-click placement on a 3×3 grid.</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-studio-muted">3×3 align</span>
                  <span className="font-mono text-[11px] text-studio-accent">{ALIGN[align]![1]}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-[210px] mx-auto p-2.5 rounded-xl bg-studio-bg border border-studio-border">
                  {ALIGN.map(([, name, glyph], i) => (
                    <button key={name} type="button" aria-label={name} aria-pressed={align === i} onClick={() => setAlign(i)}
                      className={`h-11 rounded-lg border flex items-center justify-center font-mono text-xs cursor-pointer ${align === i ? "bg-studio-accent/20 border-studio-accent text-studio-accent font-bold" : "bg-studio-surface hover:bg-studio-elevated border-studio-border text-studio-muted"}`}>
                      {glyph}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-studio-muted block mb-2">Caption style</span>
                <div className="grid grid-cols-3 gap-2">
                  {([["pop", "Bold pop"], ["highlight", "Word highlight"], ["clean", "Clean subtitle"]] as const).map(([id, name]) => (
                    <button key={id} type="button" onClick={() => setCap(id)} className={`py-2.5 px-2 rounded-lg bg-studio-bg border font-semibold text-xs cursor-pointer ${cap === id ? "border-studio-accent text-studio-text" : "border-studio-border text-studio-muted"}`}>{name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "templates" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-studio-text">Templates &amp; sound</h3>
                <p className="text-xs text-studio-muted mt-1">91 Fusion templates in Resolve&apos;s Effects library, and 81 sound effects made in-house.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.id} type="button" onClick={() => { setTpl(t.id); setRun(r => r + 1); }} className={`p-2.5 rounded-lg bg-studio-bg border text-left cursor-pointer transition-all ${tpl === t.id ? "border-studio-accent" : "border-studio-border"}`}>
                    <div className="font-semibold text-xs text-studio-text">{t.name}</div>
                    <div className={`font-mono text-[10px] ${tpl === t.id ? "text-studio-accent" : "text-studio-muted"}`}>{t.note}</div>
                  </button>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-studio-muted">From the sound library</span>
                  <span className="font-mono text-[10px] text-studio-green">{playing ? `Playing: ${playing}` : "Tap to play"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SOUNDS.map(s => (
                    <button key={s.name} type="button" onClick={() => play(s)} className={`py-3 px-2 rounded-xl bg-studio-bg hover:bg-studio-elevated border text-center transition-all cursor-pointer active:scale-95 ${playing === s.name ? "border-studio-accent" : "border-studio-border hover:border-studio-accent"}`}>
                      <div className="text-studio-accent font-mono text-xs mb-0.5">▶ Play</div>
                      <div className="font-semibold text-xs text-studio-text">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
