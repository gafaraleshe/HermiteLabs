"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero picture: a Resolve-style window with the HermiteCut panel docked
 * beside the timeline. An illustration of the workflow (the clip names are
 * HermiteCut's own templates), animated with a moving playhead.
 */
export function HeroPreview({ version }: { version: string }) {
  const [playing, setPlaying] = useState(true);
  const [p, setP] = useState(0.28);
  const raf = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (playing) setP(v => (v + dt / 16000) % 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const frames = Math.floor(p * 8 * 24);
  const tc = `01:00:0${Math.floor(frames / 24)}:${String(frames % 24).padStart(2, "0")}`;
  const cycle = (p * 4) % 1;
  const lift = (1 - (1 - Math.pow(1 - cycle, 3))) * 10;
  const clip = "rounded px-1.5 flex items-center font-mono text-[10px] truncate border";

  return (
    <div className="rounded-2xl bg-studio-surface border border-studio-border-strong shadow-panel-depth overflow-hidden">
      <div className="px-4 py-3 bg-studio-viewer border-b border-studio-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]/85" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/85" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]/85" />
          <span className="ml-2 font-mono text-xs text-studio-muted truncate">DaVinci Resolve — Music_Video_v06</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-studio-green/10 border border-studio-green/30 font-mono text-[11px] text-studio-green">
            <span className="w-1.5 h-1.5 rounded-full bg-studio-green" />
            HERMITECUT CONNECTED
          </span>
          <span className="font-mono text-xs text-studio-accent bg-studio-bg px-2.5 py-1 rounded border border-studio-border tabular-nums">{tc}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-studio-border flex flex-col">
          <div className="relative h-52 sm:h-64 nle-monitor-bg flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-5 border border-dashed border-white/10 rounded pointer-events-none" />
            <div className="absolute top-3 left-4 font-mono text-[10px] text-studio-muted uppercase tracking-wider">Timeline viewer · 3840×2160 · 24 fps</div>
            <button
              type="button"
              onClick={() => setPlaying(v => !v)}
              className="absolute top-3 right-4 px-2.5 py-1 rounded bg-studio-surface/90 hover:bg-studio-elevated border border-studio-border font-mono text-[11px] text-studio-text cursor-pointer transition-colors"
            >
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <div className="relative z-10 px-6 py-4 rounded-xl bg-studio-surface/95 border border-studio-border-strong shadow-2xl flex items-center gap-4" style={{ transform: `translateY(${lift.toFixed(1)}px)` }}>
              <div className="w-10 h-10 rounded-lg bg-studio-accent/15 border border-studio-accent/40 flex items-center justify-center text-studio-accent font-display font-black text-base">HC</div>
              <div>
                <div className="font-mono text-[10px] text-studio-accent uppercase tracking-widest">Ease out · 0.16, 1.00, 0.30, 1.00</div>
                <div className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">Credit Neon · Artist</div>
              </div>
            </div>
          </div>

          <div className="relative bg-studio-viewer p-4 border-t border-studio-border select-none">
            <div className="flex justify-between font-mono text-[10px] text-studio-muted/70 pb-2 border-b border-studio-border/60 mb-2.5">
              <span>01:00:00:00</span><span>01:00:02:00</span><span>01:00:04:00</span><span>01:00:06:00</span><span>01:00:08:00</span>
            </div>
            <div className="relative space-y-2 py-1">
              <div className="absolute top-0 bottom-0 w-0.5 bg-studio-accent z-20 pointer-events-none" style={{ left: `calc(2.5rem + (100% - 2.5rem) * ${p.toFixed(4)})` }}>
                <div className="w-3 h-3 -ml-[5px] -mt-1 bg-studio-accent rotate-45 rounded-[1px]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-mono text-[10px] text-studio-muted shrink-0">V2</span>
                <div className="flex-1 grid grid-cols-12 gap-1.5 h-6">
                  <div className={`${clip} col-span-3 bg-purple-500/20 border-purple-400/40 text-purple-200`}>Grid Reveal · Spiral</div>
                  <div className={`${clip} col-span-4 col-start-5 bg-studio-accent/20 border-studio-accent/50 text-orange-200`}>Credit Neon</div>
                  <div className={`${clip} col-span-3 col-start-10 bg-purple-500/20 border-purple-400/40 text-purple-200`}>Slow Shutter 360°</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-mono text-[10px] text-studio-muted shrink-0">V1</span>
                <div className="flex-1 grid grid-cols-8 gap-1 h-7">
                  {["A001_C04", "A001_C09", "B004_HERO_WIDE", "C012_CU", "C015_PAN", "A009_OUTRO"].map((n, i) => (
                    <div key={n} className={`${clip} ${i === 2 || i === 5 ? "col-span-2" : ""} bg-sky-500/20 border-sky-400/40 text-sky-200`}>{n}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-mono text-[10px] text-studio-muted shrink-0">A1</span>
                <div className="flex-1 h-7 rounded bg-studio-green/10 border border-studio-green/30 px-2 flex items-center justify-between overflow-hidden">
                  <span className="font-mono text-[10px] text-studio-green shrink-0 mr-2">Score.wav · beat markers</span>
                  <div className="flex items-center gap-[3px] h-4 flex-1 justify-end opacity-85">
                    {[2, 4, 1.5, 3.5, 4, 2, 3, 4, 2, 3.5, 4, 2].map((h, i) => (
                      <span key={i} className={`w-1 rounded-full ${h === 4 ? "bg-studio-accent" : "bg-studio-green"}`} style={{ height: `${h * 4}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-studio-panel p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-studio-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-studio-accent" />
                <span className="font-display font-extrabold text-xs tracking-wider uppercase text-studio-text">HermiteCut panel</span>
              </div>
              <span className="font-mono text-[10px] text-studio-muted">v{version}</span>
            </div>
            <div className="rounded-xl bg-studio-bg border border-studio-border p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase text-studio-muted">Speed graph</span>
                <span className="font-mono text-[10px] text-studio-accent">EASE OUT</span>
              </div>
              <svg viewBox="0 0 180 74" className="w-full h-16 overflow-visible" aria-hidden="true">
                <line x1="10" y1="64" x2="170" y2="64" stroke="#1E232D" />
                <line x1="10" y1="10" x2="170" y2="10" stroke="#1E232D" />
                <line x1="10" y1="64" x2="36" y2="10" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="170" y1="10" x2="58" y2="10" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M 10 64 C 36 10, 58 10, 170 10" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="10" cy="64" r="3.5" fill="#F3F5F8" /><circle cx="170" cy="10" r="3.5" fill="#F3F5F8" />
                <circle cx="36" cy="10" r="3.5" fill="#FF4F1F" /><circle cx="58" cy="10" r="3.5" fill="#FF4F1F" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-studio-surface border border-studio-border">
                <div className="font-mono text-[10px] text-studio-muted">BEATS</div>
                <div className="font-semibold text-xs text-studio-text mt-0.5">Markers every bar</div>
              </div>
              <div className="p-2.5 rounded-lg bg-studio-surface border border-studio-border">
                <div className="font-mono text-[10px] text-studio-muted">ALIGN</div>
                <div className="font-semibold text-xs text-studio-text mt-0.5">3×3 · lower third</div>
              </div>
            </div>
          </div>
          <a href="#playground" className="w-full py-2.5 px-3 rounded-lg bg-studio-accent/15 hover:bg-studio-accent/25 border border-studio-accent/40 text-studio-accent font-mono text-xs font-medium text-center transition-colors">
            Try the tools below →
          </a>
        </div>
      </div>
    </div>
  );
}
