import type { Metadata } from "next";
import { StudioFooter, StudioHeader } from "@/components/studio/chrome";
import { RegionProvider } from "@/components/studio/pricing";
import { CUT_URL, FLOW_URL, HUB_URL } from "@/lib/config";
import "./studio.css";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  const btn = "py-3 px-5 rounded-xl font-display font-black text-sm uppercase tracking-wider text-center transition-all";
  return (
    <RegionProvider>
      <div className="studio">
        <StudioHeader current="hub" />
        <main id="main" className="studio-grid-bg border-b border-studio-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <span className="font-mono text-xs uppercase tracking-widest text-studio-accent block mb-2">404</span>
            <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-studio-text">This page isn&apos;t here.</h1>
            <p className="text-studio-muted mt-4 mb-8">It may have moved. HermiteCut lives at cut.hermitelabs.com and HermiteFlow at flow.hermitelabs.com.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a className={`${btn} bg-gradient-to-r from-studio-accent to-studio-accent-deep text-white shadow-ember-glow`} href={CUT_URL}>Go to HermiteCut</a>
              <a className={`${btn} bg-studio-elevated border border-studio-border-strong text-studio-text`} href={FLOW_URL}>HermiteFlow ↗</a>
              <a className={`${btn} bg-studio-bg border border-studio-border text-studio-muted`} href={HUB_URL}>Hermite Labs home</a>
            </div>
          </div>
        </main>
        <StudioFooter />
      </div>
    </RegionProvider>
  );
}
