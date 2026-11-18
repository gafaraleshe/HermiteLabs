"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "@/components/cut/preview";

/* ───────────────────────── Grid Reveal (hero feature) ─────────────────────────
 * The same cell maths as the Fusion templates (HermiteCut
 * tools/fusegen/packs/gridreveal.py): order per cell, stagger, then a shape.
 */
type Look = { name: string; order: number; anim: number; spread: number; lines: boolean; flash?: boolean; steps?: number; glow?: boolean };
const LOOKS: Look[] = [
  { name: "Clean Reveal", order: 2, anim: 1, spread: 0.75, lines: true },
  { name: "Spiral In", order: 4, anim: 1, spread: 0.8, lines: true },
  { name: "Centre Burst", order: 3, anim: 1, spread: 0.7, lines: false },
  { name: "Beat", order: 0, anim: 0, spread: 0.9, lines: true, steps: 8 },
  { name: "Glitch", order: 5, anim: 0, spread: 0.9, lines: true },
  { name: "White Flash", order: 2, anim: 0, spread: 0.85, lines: true, flash: true },
  { name: "Neon", order: 3, anim: 2, spread: 0.75, lines: true, glow: true },
  { name: "Mosaic Out", order: 3, anim: 4, spread: 0.7, lines: false },
];

function order(i: number, j: number, C: number, R: number, o: number) {
  const dx = i + 0.5 - C / 2, dy = j + 0.5 - R / 2;
  if (o === 0) return ((R - 1 - j) * C + i) / Math.max(1, C * R - 1);
  if (o === 2) return (i + (R - 1 - j)) / Math.max(1, C + R - 2);
  if (o === 3) return Math.hypot(dx, dy) / Math.hypot(C / 2, R / 2);
  if (o === 4) return Math.min(1, (Math.max(Math.abs(dx), Math.abs(dy)) - 0.5 + (Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) / (Math.max(C, R) / 2));
  const h = Math.sin((i * 131 + j * 7919 + 17) * 12.9898) * 43758.5453;
  return h - Math.floor(h);
}

function paintScene(ctx: CanvasRenderingContext2D, W: number, H: number, b: boolean) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, b ? "#1f2b4d" : "#2a2f3a");
  g.addColorStop(1, b ? "#3d2f6b" : "#5a4636");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = b ? "#d8d0ff" : "#e6b07a";
  ctx.beginPath();
  ctx.arc(W * (b ? 0.28 : 0.74), H * 0.33, H * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = b ? "#151a2e" : "#1b1d22";
  ctx.beginPath();
  ctx.moveTo(0, H * 0.7);
  for (let k = 0; k <= 8; k++) ctx.lineTo((W * k) / 8, H * (0.6 + 0.09 * Math.sin(k * 1.7 + (b ? 2 : 0))));
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
}

export function GridRevealDemo() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [look, setLook] = useState(0);
  const [cells, setCells] = useState(14);
  const state = useRef({ look: LOOKS[0], cells: 14, t0: 0, live: true });
  useEffect(() => { state.current.look = LOOKS[look]; state.current.cells = cells; state.current.t0 = performance.now(); }, [look, cells]);

  useEffect(() => {
    const cv = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => { state.current.live = e.isIntersecting; });
    io.observe(cv);
    const A = document.createElement("canvas"), B = document.createElement("canvas");
    let raf = 0, size = "";
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!state.current.live && size) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
      if (!W || !H) return;
      if (`${W}x${H}` !== size) {
        size = `${W}x${H}`;
        cv.width = A.width = B.width = W; cv.height = A.height = B.height = H;
        paintScene(A.getContext("2d")!, W, H, false);
        paintScene(B.getContext("2d")!, W, H, true);
      }
      const ctx = cv.getContext("2d")!;
      const L = state.current.look, C = state.current.cells, R = Math.max(1, Math.round((C * H) / W));
      const cw = W / C, ch = H / R;
      const t = reduce ? 0.62 : ((performance.now() - state.current.t0) / 2800) % 1.35;
      let P = Math.min(1, t);
      if (L.steps) P = Math.floor(P * L.steps + 1e-4) / L.steps;
      ctx.drawImage(A, 0, 0);
      for (let i = 0; i < C; i++) for (let j = 0; j < R; j++) {
        const o = Math.min(1, Math.max(0, order(i, j, C, R, L.order)));
        const p = Math.min(1, Math.max(0, (P - o * L.spread) / Math.max(1e-4, 1 - L.spread)));
        const x = i * cw, y = j * ch;
        const blit = (sx: number, sy: number, sw: number, sh: number) => sw > 0 && sh > 0 && ctx.drawImage(B, sx, sy, sw, sh, sx, sy, sw, sh);
        if (L.anim === 0 && p > 0.5) blit(x, y, cw, ch);
        else if (L.anim === 1 && p > 0) {
          const e = Math.min(1, 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2);
          blit(x + (cw * (1 - e)) / 2, y + (ch * (1 - e)) / 2, cw * e, ch * e);
        } else if (L.anim === 2 && p > 0) { ctx.globalAlpha = p; blit(x, y, cw, ch); ctx.globalAlpha = 1; }
        else if (L.anim === 4) {
          blit(x, y, cw, ch);
          const s = 1 - p;
          if (s > 0) ctx.drawImage(A, x + (cw * (1 - s)) / 2, y + (ch * (1 - s)) / 2, cw * s, ch * s, x + (cw * (1 - s)) / 2, y + (ch * (1 - s)) / 2, cw * s, ch * s);
        }
        if (L.flash && p > 0 && p < 0.35) { ctx.fillStyle = `rgba(255,255,255,${1 - p / 0.35})`; ctx.fillRect(x, y, cw, ch); }
      }
      if (L.lines) {
        const vis = Math.min(1, 3 * P) * Math.min(1, 3 * (1 - P)) * 0.8 + (reduce ? 0.6 : 0);
        ctx.save();
        ctx.strokeStyle = L.glow ? `rgba(185,172,255,${Math.min(1, vis)})` : `rgba(255,255,255,${Math.min(1, vis)})`;
        if (L.glow) { ctx.shadowColor = "#b9acff"; ctx.shadowBlur = 12 * dpr; }
        ctx.lineWidth = Math.max(1, dpr * 1.5);
        ctx.beginPath();
        const grow = Math.min(1, 3 * P);
        for (let i = 0; i <= C; i++) { const X = Math.round(i * cw) + 0.5; ctx.moveTo(X, H); ctx.lineTo(X, H - H * grow); }
        for (let j = 0; j <= R; j++) { const Y = Math.round(j * ch) + 0.5; ctx.moveTo(0, Y); ctx.lineTo(W * grow, Y); }
        ctx.stroke();
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <div className="gr-demo">
      <canvas ref={ref} className="gr-canvas" role="img" aria-label={`Grid Reveal, ${LOOKS[look].name} look, ${cells} cells across`} />
      <div className="gr-controls">
        <div className="pills" role="group" aria-label="Grid Reveal look">
          {LOOKS.map((l, i) => (
            <button key={l.name} type="button" className="pill" aria-pressed={i === look} onClick={() => setLook(i)}>{l.name}</button>
          ))}
        </div>
        <label className="gr-cells">
          <span className="h-label">Cells across · {cells}</span>
          <input type="range" min={4} max={28} value={cells} onChange={e => setCells(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}

/* ───────────────────────── Before / after ───────────────────────── */
export function Compare({ after, label }: { after: string; label: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="compare">
      <div className="compare-layer"><Preview kind="original" /></div>
      <div className="compare-layer" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><Preview kind={after} /></div>
      <div className="compare-bar" style={{ left: `${pos}%` }} aria-hidden="true" />
      <span className="compare-tag left">Original</span>
      <span className="compare-tag right">{label}</span>
      <input className="compare-range" type="range" min={0} max={100} value={pos} aria-label={`Drag to compare the original with ${label}`}
        onChange={e => setPos(+e.target.value)} />
    </div>
  );
}

/* ───────────────────────── Showcase with style pills ───────────────────────── */
export function StyleShowcase({ styles }: { styles: { label: string; kind: string; note: string }[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="showcase">
      <div className="showcase-stage"><Preview kind={styles[i].kind} label={styles[i].label} /></div>
      <div className="pills" role="group" aria-label="Style">
        {styles.map((s, k) => (
          <button key={s.label} type="button" className="pill" aria-pressed={k === i} onClick={() => setI(k)}>{s.label}</button>
        ))}
      </div>
      <p className="showcase-note">{styles[i].note}</p>
    </div>
  );
}

/* ───────────────────────── Sound cards ───────────────────────── */
type Sample = { name: string; category: string; seconds: number; src: string; peaks: number[] };

export function SoundCards({ samples }: { samples: Sample[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => audio.current?.pause(), []);
  function toggle(s: Sample) {
    if (playing === s.name) { audio.current?.pause(); setPlaying(null); return; }
    audio.current?.pause();
    const a = new Audio(s.src);
    a.ontimeupdate = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    a.onended = () => { setPlaying(null); setProgress(0); };
    audio.current = a;
    setProgress(0);
    setPlaying(s.name);
    a.play().catch(() => setPlaying(null));
  }
  return (
    <ul className="sounds">
      {samples.map(s => {
        const on = playing === s.name;
        return (
          <li key={s.name} className={`sound${on ? " is-on" : ""}`}>
            <button type="button" className="sound-btn" aria-pressed={on} aria-label={`${on ? "Stop" : "Play"} ${s.name}`} onClick={() => toggle(s)}>
              <svg viewBox="0 0 16 16" aria-hidden="true">{on ? <rect x="4" y="4" width="8" height="8" rx="1" /> : <path d="M5 3.5v9l7.5-4.5z" />}</svg>
            </button>
            <div className="sound-meta">
              <span className="sound-name">{s.name}</span>
              <span className="h-label">{s.category} · {s.seconds.toFixed(1)} s</span>
            </div>
            <svg className="wave" viewBox="0 0 96 24" preserveAspectRatio="none" aria-hidden="true">
              {s.peaks.map((p, k) => (
                <rect key={k} x={k * 2} y={12 - Math.max(0.6, p * 11)} width="1.2" height={Math.max(1.2, p * 22)}
                  className={on && k / s.peaks.length <= progress ? "w-on" : ""} />
              ))}
            </svg>
          </li>
        );
      })}
    </ul>
  );
}
