import type { Metadata } from "next";
import { StatusBar, StudioFooter, StudioHeader } from "@/components/studio/chrome";
import { BuyButton, Price, RegionProvider } from "@/components/studio/pricing";
import { PRINCIPLES } from "@/lib/products";
import { counts } from "@/lib/cut";
import { cutVersion } from "@/lib/cut-version";
import { CHECKOUT_LIVE, CUT_URL, FLOW_URL, HUB_URL } from "@/lib/config";
import "./studio.css";

export const metadata: Metadata = {
  title: { absolute: "Hermite Labs — precision software for editors and creative studios" },
  description:
    "Hermite Labs builds fast, single-purpose tools: HermiteCut, effects, motion and sound for DaVinci Resolve, and HermiteFlow, clients and invoicing for creative studios.",
  openGraph: {
    title: "Hermite Labs — precision software for editors and creative studios",
    description: "HermiteCut for DaVinci Resolve. HermiteFlow for running the studio.",
    url: HUB_URL,
    siteName: "Hermite Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: HUB_URL },
};

const card = "rounded-3xl bg-studio-surface shadow-panel-depth p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden";
const fact = "p-3 rounded-xl bg-studio-bg border border-studio-border";

export default function Home() {
  const version = cutVersion();
  return (
    <RegionProvider>
      <div className="studio">
        <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-studio-accent focus:text-white" href="#main">Skip to content</a>
        <StatusBar version={version} />
        <StudioHeader current="hub" />
        <main id="main">
          <section className="relative studio-grid-bg border-b border-studio-border pt-14 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
            <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[720px] h-[340px] rounded-full bg-studio-accent/10 blur-[130px]" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-surface border border-studio-border mb-6">
                  <span className="w-2 h-2 rounded-full bg-studio-green" />
                  <span className="font-mono text-xs uppercase tracking-wider text-studio-muted">Hermite Labs · independent creator software studio</span>
                </div>
                <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-[1.04] text-studio-text mb-5">
                  Precision software for working editors &amp; creative studios.
                </h1>
                <p className="text-base sm:text-xl text-studio-muted leading-relaxed mb-10">
                  Fast, single-purpose tools without bloat: effects, motion and sound inside DaVinci Resolve, and the clients and invoices for the studio around the edit.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* HermiteCut */}
                <div className={`${card} border border-studio-accent/50`}>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-studio-accent to-studio-accent-deep" />
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-studio-accent/15 border border-studio-accent/40 text-studio-accent font-semibold">FLAGSHIP 01 · DAVINCI RESOLVE</span>
                      <span className="font-mono text-xs text-studio-green flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-studio-green" />v{version} LIVE</span>
                    </div>
                    <h2 className="font-display font-black text-3xl text-studio-text tracking-tight mb-2">HermiteCut</h2>
                    <p className="font-mono text-xs text-studio-muted mb-4">cut.hermitelabs.com · macOS &amp; Windows</p>
                    <p className="text-sm sm:text-base text-studio-muted leading-relaxed mb-6">
                      {counts.templates} effects, transitions and titles with Grid Reveal, {counts.sounds} sound effects, a speed-graph editor,
                      beat markers, captions and 3×3 align, in one click inside DaVinci Resolve. Now works with Claude.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 mb-8 font-mono text-xs">
                      <div className={fact}>
                        <div className="text-studio-muted text-[10px]">LICENCE</div>
                        <div className="text-studio-text font-semibold mt-0.5">{CHECKOUT_LIVE ? <>One-time (<Price />)</> : "Free download"}</div>
                      </div>
                      <div className={fact}>
                        <div className="text-studio-muted text-[10px]">COMPATIBILITY</div>
                        <div className="text-studio-text font-semibold mt-0.5">Resolve Free &amp; Studio</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={CUT_URL} className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-display font-black text-sm uppercase tracking-wider shadow-ember-glow text-center transition-all">
                      Explore HermiteCut →
                    </a>
                    <BuyButton short label="Buy" className="py-3.5 px-5 rounded-xl bg-studio-bg hover:bg-studio-elevated border border-studio-border-strong text-studio-text font-mono text-xs font-semibold text-center transition-colors" />
                  </div>
                </div>

                {/* HermiteFlow */}
                <div className={`${card} border border-studio-border-strong`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-semibold">FLAGSHIP 02 · STUDIO OPERATIONS</span>
                      <span className="font-mono text-xs text-sky-300">WEB APP</span>
                    </div>
                    <h2 className="font-display font-black text-3xl text-studio-text tracking-tight mb-2">HermiteFlow</h2>
                    <p className="font-mono text-xs text-studio-muted mb-4">flow.hermitelabs.com · clients &amp; invoicing</p>
                    <p className="text-sm sm:text-base text-studio-muted leading-relaxed mb-6">
                      Bookings to paid invoices, on autopilot: clients, invoices with UK VAT, PDF and email delivery, payment tracking and
                      reminders in one workspace, built for creative businesses.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 mb-8 font-mono text-xs">
                      <div className={fact}>
                        <div className="text-studio-muted text-[10px]">CORE</div>
                        <div className="text-studio-text font-semibold mt-0.5">Clients · Invoices</div>
                      </div>
                      <div className={fact}>
                        <div className="text-studio-muted text-[10px]">BUILT FOR</div>
                        <div className="text-studio-text font-semibold mt-0.5">UK VAT · reminders</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={FLOW_URL} className="flex-1 py-3.5 px-5 rounded-xl bg-studio-elevated hover:bg-studio-border-strong border border-studio-border-strong text-studio-text font-display font-black text-sm uppercase tracking-wider text-center transition-colors">
                      Open HermiteFlow ↗
                    </a>
                    <a href={CUT_URL} className="py-3.5 px-5 rounded-xl bg-studio-bg hover:bg-studio-elevated border border-studio-border text-studio-muted hover:text-studio-text font-mono text-xs text-center transition-colors">
                      See HermiteCut
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRINCIPLES.map(p => (
                  <div key={p.n} className="rounded-2xl bg-studio-surface/80 border border-studio-border p-5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-studio-accent">{p.n} · {p.title}</div>
                    <p className="text-xs sm:text-sm text-studio-muted mt-2 leading-relaxed">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <StudioFooter />
      </div>
    </RegionProvider>
  );
}
