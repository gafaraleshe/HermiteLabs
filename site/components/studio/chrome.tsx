import { BuyButton, Price, RegionToggle } from "@/components/studio/pricing";
import { CHECKOUT_LIVE, CREDIT, CUT_REPO, CUT_URL, FLOW_URL, HUB_URL } from "@/lib/config";

/** The Hermite Labs mark: a Hermite spline between two handles. */
export function HermiteSpline({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="4" y1="19" x2="10" y2="5" stroke="#64748B" strokeWidth="1.4" strokeDasharray="2 2" />
      <line x1="20" y1="5" x2="14" y2="19" stroke="#64748B" strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M4 19 C 10 5, 14 19, 20 5" stroke="#FF6B35" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="4" cy="19" r="2.3" fill="#F3F5F8" />
      <circle cx="20" cy="5" r="2.3" fill="#F3F5F8" />
      <circle cx="10" cy="5" r="1.8" fill="#FF4F1F" />
      <circle cx="14" cy="19" r="1.8" fill="#FF4F1F" />
    </svg>
  );
}

/** The thin status bar above the header: what's live, and how buying works. */
export function StatusBar({ version }: { version: string }) {
  return (
    <div className="w-full bg-studio-surface border-b border-studio-border">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-studio-green">
          <span className="w-2 h-2 rounded-full bg-studio-green animate-pulse" />
          HermiteCut {version} live
        </span>
        <span className="text-studio-border-strong hidden sm:inline">|</span>
        <p className="font-mono text-[11px] tracking-wider uppercase text-studio-text/90">
          {CHECKOUT_LIVE ? (
            <>One-time licence (<span className="text-studio-accent font-semibold"><Price /></span>) · Secure checkout by Polar · Instant download</>
          ) : (
            <>Now works with Claude · Free download · Windows &amp; macOS</>
          )}
        </p>
      </div>
    </div>
  );
}

type Route = "hub" | "cut";

/** One header for every Hermite Labs site, with the route pills between them. */
export function StudioHeader({ current }: { current: Route }) {
  const pill = (on: boolean) =>
    `px-2.5 sm:px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all ${on ? "bg-studio-elevated text-studio-text border border-studio-border-strong" : "text-studio-muted hover:text-studio-text"}`;
  return (
    <header className="sticky top-0 z-40 w-full bg-studio-bg/90 backdrop-blur-xl border-b border-studio-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <a href={HUB_URL} className="flex items-center gap-2.5 group shrink-0" aria-label="Hermite Labs home">
            <span className="w-9 h-9 rounded-lg bg-studio-surface border border-studio-border group-hover:border-studio-accent/70 flex items-center justify-center transition-colors">
              <HermiteSpline />
            </span>
            <span className="leading-none hidden sm:block">
              <span className="font-display font-black tracking-tight text-base text-studio-text block">HERMITE LABS</span>
              <span className="font-mono text-[10px] text-studio-muted">{current === "cut" ? "cut.hermitelabs.com" : "hermitelabs.com"}</span>
            </span>
          </a>
          <nav className="inline-flex items-center p-1 rounded-full bg-studio-surface border border-studio-border shrink-0" aria-label="Hermite Labs sites">
            <a href={HUB_URL} className={pill(current === "hub")} aria-current={current === "hub" ? "page" : undefined}>
              Hub
            </a>
            <a href={CUT_URL} className={pill(current === "cut")} aria-current={current === "cut" ? "page" : undefined}>
              Cut
            </a>
            <a href={FLOW_URL} className={`${pill(false)} hover:text-studio-flow`}>
              Flow <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {CHECKOUT_LIVE && <span className="hidden md:inline-flex"><RegionToggle /></span>}
          <BuyButton
            short
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-semibold text-xs sm:text-sm transition-all shadow-ember-glow active:scale-[0.98]"
          />
        </div>
      </div>
    </header>
  );
}

/** One footer for every Hermite Labs site. */
export function StudioFooter() {
  const link = "hover:text-studio-text transition-colors";
  return (
    <footer className="py-12 bg-studio-bg border-t border-studio-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <HermiteSpline size={18} />
            <span className="font-display font-black tracking-tight text-sm text-studio-text">HERMITE LABS</span>
            {CHECKOUT_LIVE && <span className="font-mono text-xs text-studio-muted">· Checkout by Polar (merchant of record)</span>}
          </div>
          <p className="font-mono text-[11px] text-studio-muted mt-1.5">
            © 2026 Hermite Labs · Gaffy Studios Ltd · <a className="hover:text-studio-text" href={CREDIT.href}>{CREDIT.label}</a>
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-studio-muted" aria-label="Footer">
          <a className={link} href={`${HUB_URL}/terms`}>Terms</a>
          <a className={link} href={`${HUB_URL}/privacy`}>Privacy</a>
          <a className={link} href={`${HUB_URL}/eula`}>EULA</a>
          <a className={link} href={`${HUB_URL}/refunds`}>Refunds</a>
          <a className={link} href={`${CUT_URL}/changelog`}>Changelog</a>
          <a className={link} href={`${CUT_REPO}/issues`}>Support</a>
          <span className="text-studio-border-strong">|</span>
          <a className="text-studio-text hover:text-studio-accent transition-colors" href={HUB_URL}>Hermite Labs</a>
          <a className="text-studio-text hover:text-studio-accent transition-colors" href={CUT_URL}>HermiteCut</a>
          <a className="text-studio-accent hover:underline" href={FLOW_URL}>HermiteFlow ↗</a>
        </nav>
      </div>
    </footer>
  );
}
