import type { Metadata } from "next";
import { HeroPreview } from "@/components/studio/hero-preview";
import { Playground } from "@/components/studio/playground";
import { BuyButton, Price, RegionToggle } from "@/components/studio/pricing";
import { FAQ, countFor, counts } from "@/lib/cut";
import { cutVersion } from "@/lib/cut-version";
import { CHECKOUT_LIVE, CUT_DOWNLOAD, CUT_DOWNLOAD_MAC, CUT_DOWNLOAD_WIN, CUT_PRICE_GBP, CUT_PRICE_USD, CUT_URL, HUB_URL, POLAR_PORTAL_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: { absolute: "HermiteCut — effects, motion and sound for DaVinci Resolve" },
  description: `${counts.templates} effects, transitions and titles, Grid Reveal, ${counts.sounds} sound effects, a speed-graph editor, beat markers, captions and 3×3 align, inside DaVinci Resolve. Windows and macOS.`,
  alternates: { canonical: CUT_URL },
  openGraph: {
    title: "HermiteCut — precision motion & cuts for DaVinci Resolve",
    description: "Effects, transitions, titles, Grid Reveal, sound, beats and captions, applied in one click inside Resolve.",
    url: CUT_URL,
    siteName: "HermiteCut",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const TICKER = ["Grid Reveal", `${counts.templates} templates`, "Speed-graph easing", "Beat markers", "Captions+", "3×3 align", "Time FX", `${counts.sounds} sound effects`, "Works with Claude", "9:16 shorts"];

const INCLUDED = [
  "The app (Windows & macOS) and the Resolve panel",
  `${counts.templates} templates, including Grid Reveal`,
  "Speed-graph Ease, Bounce and Motion presets",
  "Beat markers and Captions+",
  "3×3 Align, layouts and 67 one-click actions",
  `${counts.sounds} sound effects and your own asset library`,
  "Works with Claude, on your computer",
  "Two computers, Windows or Mac",
];

const MATRIX: [string, string, string][] = [
  ["Effects, transitions, titles and Grid Reveal", "✓", "✓"],
  ["Sound library and asset library", "✓", "✓"],
  ["Ease, Bounce, Motion, Align and Actions (in the app)", "✓", "✓"],
  ["Beat markers", "✓", "✓"],
  ["Captions from your subtitles (.srt)", "✓", "✓"],
  ["Speech-to-text captions", "—", "✓ (Resolve's own)"],
  ["The panel inside Resolve (Workflow Integrations)", "Use the app", "✓"],
  ["Smart Reframe for 9:16 shorts", "—", "✓"],
  ["Works with Claude (MCP)", "✓", "✓"],
];

const MANUAL = [
  "Open the clip on the Fusion page and add a Transform node",
  "Set start and end keyframes on position, zoom and angle",
  "Open the spline editor and drag the handles by eye",
  "Repeat for every clip, and keep the curves consistent",
  "Scrub the song on Fairlight to find each beat",
  "Build each caption and title by hand, word by word",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HermiteCut",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Windows 10, Windows 11, macOS 12+",
  url: CUT_URL,
  downloadUrl: CHECKOUT_LIVE ? `${CUT_URL}/#purchase` : CUT_DOWNLOAD,
  publisher: { "@type": "Organization", name: "Hermite Labs", url: HUB_URL },
  ...(CHECKOUT_LIVE
    ? { offers: [
        { "@type": "Offer", price: CUT_PRICE_GBP.replace(/[^0-9.]/g, ""), priceCurrency: "GBP" },
        { "@type": "Offer", price: CUT_PRICE_USD.replace(/[^0-9.]/g, ""), priceCurrency: "USD" },
      ] }
    : { offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } }),
};

const btnHot = "inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-semibold text-base transition-all shadow-ember-glow active:scale-[0.98]";
const btnQuiet = "inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-studio-surface hover:bg-studio-elevated border border-studio-border-strong text-studio-text font-medium text-base transition-all";
const eyebrow = "font-mono text-xs uppercase tracking-widest text-studio-accent block mb-2";
const h2 = "font-display font-black text-3xl sm:text-5xl tracking-tight text-studio-text";

export default function CutPage() {
  const version = cutVersion();
  const tiles = [
    ["Effects", countFor("effects"), "Flashes, shakes, blurs, glitch, film"],
    ["Transitions", countFor("transitions"), "Whips, spins, light, shutters"],
    ["Grid Reveal", countFor("grid"), "The cell-by-cell reveal, 11 looks"],
    ["Titles", countFor("titles"), "Credits, neon, cinematic, social"],
    ["Time FX", countFor("timefx"), "Slow shutter, echo, prism, stutter"],
    ["Sound effects", counts.sounds, "Whooshes, risers, impacts, glitches"],
  ] as const;
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative studio-grid-bg border-b border-studio-border pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[340px] rounded-full bg-studio-accent/10 blur-[125px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-studio-muted mb-4">
              <a className="hover:text-studio-text" href={HUB_URL}>Hermite Labs</a> / DaVinci Resolve / <span className="text-studio-text">HermiteCut</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-surface border border-studio-border mb-6">
              <span className="w-2 h-2 rounded-full bg-studio-green" />
              <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-studio-muted">DaVinci Resolve 20+ · Free &amp; Studio · macOS &amp; Windows</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[66px] tracking-tight leading-[1.02] text-studio-text mb-6">
              Precision motion &amp; cuts.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-studio-text to-studio-muted">Built for working editors.</span>
            </h1>
            <p className="text-base sm:text-xl text-studio-muted leading-relaxed max-w-2xl mx-auto mb-9">
              {counts.templates} effects, transitions and titles, Grid Reveal, {counts.sounds} sound effects, a speed-graph editor, beat markers,
              captions and 3×3 align, inside DaVinci Resolve.{" "}
              <span className="text-studio-text font-medium">{CHECKOUT_LIVE ? "Pay once. Keep it." : "Free to download."}</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-5">
              {CHECKOUT_LIVE ? (
                <BuyButton className={`w-full sm:w-auto ${btnHot}`} />
              ) : (
                <>
                  <a className={`w-full sm:w-auto ${btnHot}`} href={CUT_DOWNLOAD_WIN}>Download for Windows</a>
                  <a className={`w-full sm:w-auto ${btnHot}`} href={CUT_DOWNLOAD_MAC}>Download for Mac</a>
                </>
              )}
              <a className={`w-full sm:w-auto ${btnQuiet}`} href="#playground">Try the demo <span className="text-studio-accent font-mono">↓</span></a>
            </div>
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 rounded-xl bg-studio-surface/70 border border-studio-border font-mono text-[11px] text-studio-muted">
              {CHECKOUT_LIVE ? (
                <><span className="text-studio-text font-semibold">Checkout by Polar</span><span>·</span><span>VAT and sales tax handled</span><span>·</span><span>Instant download</span><span>·</span><span>14-day refunds</span></>
              ) : (
                <><span className="text-studio-text font-semibold">Version {version}</span><span>·</span><span>Instant download</span><span>·</span><span>No account</span><span>·</span><a className="hover:text-studio-text" href={CUT_DOWNLOAD}>Intel Mac &amp; all files</a></>
              )}
            </div>
          </div>
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <HeroPreview version={version} />
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="marquee-wrap w-full bg-studio-surface border-b border-studio-border py-3.5 overflow-hidden select-none" aria-hidden="true">
        <div className="marquee-track flex w-max animate-marquee font-editorial font-extrabold text-xs sm:text-sm tracking-widest uppercase text-studio-text">
          {[0, 1].map(k => (
            <div key={k} className="flex items-center gap-6 pr-6">
              {TICKER.map(t => <span key={t} className="flex items-center gap-6"><span>{t}</span><span className="text-studio-accent">×</span></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* Playground */}
      <section id="playground" className="py-16 sm:py-24 border-b border-studio-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className={eyebrow}>Hands-on</span>
              <h2 className={h2}>Try the tools in your browser.</h2>
            </div>
            <p className="text-sm sm:text-base text-studio-muted max-w-md">Drag the speed-graph handles, drop beat markers, place captions on the 3×3 grid, preview templates and play real sounds from the library.</p>
          </div>
          <Playground />
        </div>
      </section>

      {/* What's inside */}
      <section id="inside" className="py-16 sm:py-24 border-b border-studio-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className={eyebrow}>What&apos;s inside</span>
            <h2 className={h2}>The whole kit, in one app.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiles.map(([name, n, note]) => (
              <div key={name} className="p-5 rounded-2xl bg-studio-surface border border-studio-border">
                <div className="font-display font-black text-4xl tracking-tight text-studio-accent">{n}</div>
                <div className="font-semibold text-studio-text mt-1">{name}</div>
                <div className="text-sm text-studio-muted mt-1">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manual vs HermiteCut */}
      <section id="compare" className="py-16 sm:py-24 border-b border-studio-border studio-grid-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className={eyebrow}>Your workflow</span>
            <h2 className={h2}>From a dozen steps per clip<br className="hidden sm:inline" /> to one click.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 rounded-2xl bg-studio-surface/70 border border-studio-border p-6 flex flex-col justify-between opacity-90">
              <div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400">BY HAND IN RESOLVE</span>
                <h3 className="font-display font-extrabold text-lg text-studio-text mt-4 mb-3">The repetitive way</h3>
                <ol className="space-y-2 text-sm text-studio-muted list-decimal list-inside">{MANUAL.map(m => <li key={m}>{m}</li>)}</ol>
              </div>
              <div className="mt-6 pt-4 border-t border-studio-border font-mono text-[11px] text-studio-muted">Slow · inconsistent curves from clip to clip</div>
            </div>
            <div className="lg:col-span-7 rounded-2xl bg-studio-surface border border-studio-accent/60 shadow-ember-glow p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-studio-green/15 border border-studio-green/30 text-studio-green font-semibold">WITH HERMITECUT</span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-studio-text mt-4 mb-3">Select clips on the Edit page. Click once.</h3>
                <p className="text-sm text-studio-muted leading-relaxed mb-6">
                  HermiteCut writes the keyframes with your chosen curve, adds templates and transitions at the cuts, drops beat markers
                  and builds animated captions, straight into your timeline without leaving the Edit page. The same curve on every clip, every time.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                  {["Ease and Bounce on Fusion keyframes", "Motion presets on clips: slide, pop, punch, Ken Burns", "Templates on every selected clip", "Sounds on the playhead, cuts or markers"].map(x => (
                    <li key={x} className="flex gap-2 text-studio-text"><span className="text-studio-accent">✓</span>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-studio-border flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-studio-muted">Works on the Edit page you already use</span>
                <a href="#purchase" className="font-mono text-xs text-studio-accent hover:underline font-semibold">{CHECKOUT_LIVE ? <>Get HermiteCut (<Price />) →</> : "Get HermiteCut →"}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claude */}
      <section id="claude" className="py-16 sm:py-24 border-b border-studio-border scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className={eyebrow}>New in 2.1</span>
            <h2 className={h2}>Edit with Claude.</h2>
            <p className="text-studio-muted leading-relaxed mt-4">
              Ask in plain words and Claude uses HermiteCut&apos;s tools in Resolve: it reads your timeline, finds the right template or
              sound, and applies it to the clips you&apos;ve selected. It runs on your computer only, through HermiteCut&apos;s local MCP server, with a private key.
            </p>
            <ol className="mt-6 space-y-2 text-sm text-studio-text list-decimal list-inside">
              <li>Open HermiteCut and go to <b>Setup → Claude</b>.</li>
              <li>Copy the setup for <b>Claude Desktop</b> or <b>Claude Code</b> and paste it in.</li>
              <li>Select some clips in Resolve and ask.</li>
            </ol>
          </div>
          <ul className="grid gap-3">
            {["Add a Whip transition at every cut of the selected clips, and a whoosh on each cut.", "Put a Glow Flash on the first frame of each clip, 8 frames long.", "Insert a Credit Neon title at the playhead: artist Nova, song Midnight.", "Make a 9:16 short of this timeline with Smart Reframe."].map(q => (
              <li key={q} className="p-4 rounded-xl bg-studio-surface border border-studio-border text-studio-text">
                <span className="font-mono text-[10px] uppercase tracking-wider text-studio-accent block mb-1">You ask</span>&ldquo;{q}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compatibility */}
      <section id="compatibility" className="py-16 sm:py-24 border-b border-studio-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={eyebrow}>Compatibility</span>
            <h2 className={h2}>Resolve Free and Studio.</h2>
            <p className="text-sm sm:text-base text-studio-muted mt-3">
              The app, the templates and the sound library work in the free version of DaVinci Resolve. A few features use tools that only Resolve Studio has.
            </p>
          </div>
          <div className="rounded-2xl bg-studio-surface border border-studio-border-strong overflow-hidden shadow-panel-depth">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-studio-viewer border-b border-studio-border font-mono text-xs uppercase tracking-wider">
                    <th className="py-4 px-5 text-studio-muted">Feature</th>
                    <th className="py-4 px-5 text-studio-text">Resolve (free) 20+</th>
                    <th className="py-4 px-5 text-studio-accent">Resolve Studio 20+</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-border text-sm">
                  {MATRIX.map(([f, free, studio]) => (
                    <tr key={f}>
                      <td className="py-3.5 px-5 font-medium text-studio-text">{f}</td>
                      <td className={`py-3.5 px-5 font-mono text-xs ${free.startsWith("✓") ? "text-studio-green" : "text-studio-muted"}`}>{free}</td>
                      <td className={`py-3.5 px-5 font-mono text-xs ${studio.startsWith("✓") ? "text-studio-green" : "text-studio-muted"}`}>{studio}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-studio-text">Computers</td>
                    <td className="py-3.5 px-5 font-mono text-xs text-studio-muted" colSpan={2}>Windows 10 or 11 (64-bit) · macOS 12 or newer, Apple Silicon and Intel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase */}
      <section id="purchase" className="py-16 sm:py-24 border-b border-studio-border studio-grid-bg scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className={eyebrow}>{CHECKOUT_LIVE ? "One-time licence · Polar checkout" : "Get HermiteCut"}</span>
            <h2 className={h2}>One payment. Everything unlocked.</h2>
          </div>
          <div className="relative rounded-3xl bg-studio-surface border border-studio-border-strong shadow-panel-depth overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-studio-accent via-orange-400 to-studio-accent-deep" />
            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-studio-border">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-green/15 border border-studio-green/30 font-mono text-xs font-medium text-studio-green mb-3">
                    {CHECKOUT_LIVE ? "ONE-TIME PAYMENT · NO SUBSCRIPTION" : "FREE DOWNLOAD TODAY"}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-black text-5xl sm:text-6xl tracking-tight text-studio-text">{CHECKOUT_LIVE ? <Price /> : "Free"}</span>
                    <span className="font-mono text-sm text-studio-muted">{CHECKOUT_LIVE ? "one-time · updates for version 2" : `version ${version}`}</span>
                  </div>
                  <p className="font-mono text-[11px] text-studio-muted mt-1.5">
                    {CHECKOUT_LIVE ? "VAT and US sales tax are handled by Polar at checkout" : `The licence (${CUT_PRICE_GBP} / ${CUT_PRICE_USD}, one-time) goes on sale soon`}
                  </p>
                </div>
                {CHECKOUT_LIVE && (
                  <div className="self-start sm:self-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-studio-muted block mb-1.5 sm:text-right">Region</span>
                    <RegionToggle size="md" long />
                  </div>
                )}
              </div>
              <div className="py-8 border-b border-studio-border">
                <div className="font-mono text-xs uppercase tracking-wider text-studio-muted mb-4">Included:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
                  {INCLUDED.map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-studio-accent/15 border border-studio-accent/40 text-studio-accent flex items-center justify-center shrink-0 text-xs">✓</span>
                      <span className="text-studio-text font-medium">{i}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                {CHECKOUT_LIVE ? (
                  <BuyButton label="Buy with Polar" className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-display font-black text-base sm:text-lg tracking-wide uppercase transition-all shadow-ember-glow flex items-center justify-center gap-3 active:scale-[0.99]" />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a href={CUT_DOWNLOAD_WIN} className="py-4 px-6 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-display font-black text-base tracking-wide uppercase transition-all shadow-ember-glow text-center">Download for Windows</a>
                    <a href={CUT_DOWNLOAD_MAC} className="py-4 px-6 rounded-xl bg-gradient-to-r from-studio-accent to-studio-accent-deep hover:opacity-95 text-white font-display font-black text-base tracking-wide uppercase transition-all shadow-ember-glow text-center">Download for Mac</a>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-xs text-studio-muted text-center">
                  <span>{CHECKOUT_LIVE ? "Licence key by email" : "Instant download"}</span><span>·</span><span>Two computers</span><span>·</span><a className="hover:text-studio-text" href={`${HUB_URL}/refunds`}>14-day refunds</a>
                </div>
                {CHECKOUT_LIVE && POLAR_PORTAL_URL && (
                  <p className="mt-3 text-center font-mono text-xs"><a className="text-studio-accent hover:underline" href={POLAR_PORTAL_URL}>Already bought? Get your key and downloads →</a></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 border-b border-studio-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className={eyebrow}>Questions</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-studio-text">Frequently asked questions.</h2>
          </div>
          <div className="space-y-3">
            {[
              ...FAQ,
              { q: `Why ${CUT_PRICE_GBP} in the UK and ${CUT_PRICE_USD} in the US?`, a: `Hermite Labs is based in the UK, with simple flat prices: ${CUT_PRICE_GBP} for the UK and elsewhere, ${CUT_PRICE_USD} in the US. It is a one-time payment, with no subscription.` },
              { q: "Can Claude use it?", a: "Yes. HermiteCut 2.1 runs a small MCP server on your computer while it's open. Setup → Claude copies the setup for Claude Desktop or Claude Code, and Claude can then read your timeline and apply templates, transitions, titles and sounds to the clips you select." },
            ].map(f => (
              <details key={f.q} className="group rounded-xl bg-studio-surface border border-studio-border overflow-hidden">
                <summary className="list-none w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-studio-elevated/60 transition-colors">
                  <span className="font-semibold text-sm sm:text-base text-studio-text">{f.q}</span>
                  <span className="font-mono text-studio-accent text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-studio-muted leading-relaxed border-t border-studio-border/60 pt-3">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
