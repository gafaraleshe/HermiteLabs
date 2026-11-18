import type { Metadata } from "next";
import { LabsNav } from "@/components/labs-nav";
import { SiteFooter } from "@/components/footer";
import "./brand.css";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="hermite">
      <LabsNav />
      <main id="main" className="h-wrap" style={{ paddingBlock: "clamp(64px, 12vw, 160px)" }}>
        <span className="h-label">404</span>
        <h1 className="h-display" style={{ maxWidth: "14ch" }}>This page isn&apos;t here.</h1>
        <p className="h-body">It may have moved. HermiteCut now lives at cut.hermitelabs.com.</p>
        <div className="h-row">
          <a className="h-btn h-btn--solid" href="https://cut.hermitelabs.com">Go to HermiteCut</a>
          <a className="h-btn" href="/">Hermite Labs home</a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
