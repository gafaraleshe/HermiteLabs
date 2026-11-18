import type { Metadata } from "next";
import { Live } from "@/components/cut/live";
import { TemplateGallery } from "@/components/cut/gallery";
import { TimeFxShowcase } from "@/components/cut/timefx";
import { TimingDemo } from "@/components/cut/timing";
import { StickyBar } from "@/components/cut/sticky-bar";
import { Compare, GridRevealDemo, SoundCards, StyleShowcase } from "@/components/cut/interactive";
import { COMPAT, FAQ, TOOLS, counts, sounds } from "@/lib/cut";
import { CUT_DOWNLOAD, CUT_PRICE, CUT_URL, POLAR_CHECKOUT_URL } from "@/lib/config";
import "./cut.css";

export const metadata: Metadata = {
  title: { absolute: "HermiteCut — effects, transitions and sound for DaVinci Resolve" },
  description: `${counts.templates} templates with Post / Pre timing, Grid Reveal, ${counts.sounds} sound effects, motion, beats and captions for DaVinci Resolve. Windows and macOS.`,
  alternates: { canonical: CUT_URL },
  openGraph: {
    title: "HermiteCut — the editing toolkit for DaVinci Resolve",
    description: "Effects, transitions, titles, Grid Reveal and sound, applied in one click inside Resolve.",
    url: CUT_URL,
    siteName: "HermiteCut",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const SECTIONS = [
  ["overview", "Overview"], ["effects", "Effects"], ["transitions", "Transitions"], ["grid-reveal", "Grid Reveal"],
  ["titles", "Titles"], ["sound", "Sound"], ["tools", "Tools"], ["faq", "FAQ"],
] as const;

const EFFECT_STYLES = [
  { label: "Flash", kind: "glowflash", note: "Flashes that hit on the cut: white, colour, glow, a single frame or a strobe." },
  { label: "Shake", kind: "quake", note: "Camera energy: twitch, XY, vertical and zoom shakes, earthquake and handheld drift." },
  { label: "Blur", kind: "whipblur", note: "Defocus pulls, zoom streaks, whip blur and dreamy glow blur." },
  { label: "Glitch", kind: "glitch", note: "RGB split, torn digital slices, VHS, invert and pixelate." },
  { label: "Film", kind: "burn", note: "Film burns (fast and slow), light leaks, gate weave, vignette pulses, film look and letterbox." },
];
const TRANSITION_STYLES = [
  { label: "Whip", kind: "t-whip", note: "Fast whip pans with motion blur, in any direction." },
  { label: "Spin", kind: "t-spin", note: "A full spin with blur from one shot into the next." },
  { label: "Light", kind: "t-flare", note: "Lens flares, light wipes, burns and leaks that carry the cut." },
  { label: "Glitch", kind: "t-rgb", note: "Chromatic splits, glitches, negatives and liquid displacement." },
  { label: "Shutter", kind: "t-shutter", note: "Shutter blades that snap shut and open on the next shot." },
];
const TITLE_STYLES = [
  { label: "Credit", kind: "title-rise", note: "Music-video credits with Song, Artist, Directed By and Credit fields, in six styles." },
  { label: "Neon", kind: "title-neon", note: "Neon credits and locations that flicker on." },
  { label: "Cinematic", kind: "title-cinematic", note: "Wide-tracked film titles with a subtitle line." },
  { label: "Social", kind: "title-social", note: "Handles, subscribe buttons and lower thirds." },
  { label: "Captions", kind: "title-caption", note: "Bold animated captions, built from your subtitles by Captions+." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HermiteCut",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Windows 10, Windows 11, macOS 12+",
    description: `The editing toolkit for DaVinci Resolve: ${counts.templates} templates, Grid Reveal and ${counts.sounds} sound effects.`,
    url: CUT_URL,
    downloadUrl: CUT_DOWNLOAD,
    publisher: { "@type": "Organization", name: "Hermite Labs", url: "https://hermitelabs.com" },
    ...(CUT_PRICE ? { offers: { "@type": "Offer", price: CUT_PRICE.replace(/[^0-9.]/g, ""), priceCurrency: "GBP" } } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

function Ctas({ big = false }: { big?: boolean }) {
  return (
    <div className="h-row cut-ctas">
      {POLAR_CHECKOUT_URL ? (
        <>
          <a className={`h-btn cut-btn${big ? " is-big" : ""}`} href={POLAR_CHECKOUT_URL}>Buy HermiteCut{CUT_PRICE ? ` · ${CUT_PRICE}` : ""}</a>
          <a className="h-btn cut-btn-ghost" href={CUT_DOWNLOAD}>Download</a>
        </>
      ) : (
        <a className={`h-btn cut-btn${big ? " is-big" : ""}`} href={CUT_DOWNLOAD}>Download HermiteCut</a>
      )}
      <a className="h-btn cut-btn-ghost" href="#grid-reveal">See Grid Reveal</a>
    </div>
  );
}

export default function CutPage() {
  return (
    <>
      <main id="main" className="hc-page cut-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* ── Hero ── */}
        <section className="h-hero cut-hero" id="top">
          <div className="h-grid-overlay" aria-hidden="true" />
          <div className="h-wrap cut-hero-grid">
            <div>
              <span className="h-label cut-label">DaVinci Resolve · Toolkit</span>
              <h1 className="h-display">Hermite<span className="cut-accent">Cut</span></h1>
              <p className="cut-promise">Effects, transitions, titles, Grid Reveal, sound and captions, in one click inside Resolve.</p>
              {CUT_PRICE && POLAR_CHECKOUT_URL && <p className="cut-price">{CUT_PRICE}</p>}
              <Ctas big />
              <p className="cut-trust">{POLAR_CHECKOUT_URL ? "Secure checkout · Instant download · Windows & macOS" : "Instant download · Windows & macOS · No account"}</p>
            </div>
            <Live className="cut-hero-demo"><GridRevealDemo /></Live>
          </div>
          <div className="h-wrap">
            <ul className="stats" aria-label="What you get">
              <li><b>{counts.templates}</b><span>effects, transitions & titles</span></li>
              <li><b>{counts.sounds}</b><span>sound effects, made in-house</span></li>
              <li><b>{TOOLS.length}</b><span>one-click tools</span></li>
              <li><b>Win + Mac</b><span>app and Resolve panel</span></li>
            </ul>
          </div>
        </section>

        <nav className="cut-sections" aria-label="On this page">
          <div className="h-wrap">
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </div>
        </nav>

        {/* ── Overview ── */}
        <section id="overview" className="cut-sec">
          <div className="h-wrap cut-two">
            <div>
              <div className="h-sec-head"><span className="h-sec-num">01</span><h2 className="h-h2">Drop it on a clip. Shape it in the Inspector.</h2></div>
              <p className="h-body">
                Every template is a native Fusion macro, so it sits in Resolve&apos;s Effects library with no extra plugins.
                Effects hit at the start of a clip (Post), the end (Pre), both, or across it. Transitions sit on a cut.
                Titles keep their text, colour and animation in neat Inspector groups. Or do it all from the HermiteCut app in one click.
              </p>
              <ul className="ticks">
                <li>Apply at Post / Pre / Both / Whole, with frames, curve and strength on every effect</li>
                <li>Your clip is untouched outside the effect&apos;s window</li>
                <li>Undo removes everything HermiteCut added</li>
              </ul>
            </div>
            <div>
              <Compare after="filmlook" label="Film Look" />
              <p className="cut-note">Illustration. Renders from Resolve replace these previews soon.</p>
            </div>
          </div>
        </section>

        {/* ── Effects ── */}
        <section id="effects" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">02</span><h2 className="h-h2">Effects that hit on the cut</h2></div>
            <p className="h-body cut-lead">{counts.effects} effects and time effects, each with the same Apply at, Frames, Curve and Strength controls.</p>
            <Live><StyleShowcase styles={EFFECT_STYLES} /></Live>
            <h3 className="cut-h3">Time FX</h3>
            <TimeFxShowcase />
            <h3 className="cut-h3">Timing you can see</h3>
            <TimingDemo />
          </div>
        </section>

        {/* ── Transitions ── */}
        <section id="transitions" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">03</span><h2 className="h-h2">Transitions with direction, blur, glow and flash</h2></div>
            <p className="h-body cut-lead">{counts.transitions} transitions, {counts.grid > 0 ? "including the Grid Reveal looks" : ""}. Put one on a cut, then pick the direction, curve, blur, glow and flash.</p>
            <Live><StyleShowcase styles={TRANSITION_STYLES} /></Live>
          </div>
        </section>

        {/* ── Grid Reveal ── */}
        <section id="grid-reveal" className="cut-sec cut-feature">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">04</span><h2 className="h-h2">Grid Reveal</h2></div>
            <p className="h-body cut-lead">
              The next shot arrives cell by cell. Pick a look, set the cells, and HermiteCut builds the whole Fusion setup for you:
              the order cells switch in, how each one animates, and grid lines that sit exactly on the cells at any resolution,
              including 9:16. Or let a moving subject drive the cells with Hand Track.
            </p>
            <Live><GridRevealDemo /></Live>
            <ul className="feature-grid">
              <li><b>11 looks</b><span>Clean Reveal, Spiral In, Centre Burst, Beat, Glitch, White Flash, Neon, Mosaic Out, Light Reveal, Diagonal Sweep, Collage</span></li>
              <li><b>Every order</b><span>Row, column, diagonal, centre out, spiral, random or by brightness, with stagger and beat steps</span></li>
              <li><b>Smooth cells</b><span>Pop, scale with overshoot, fade, wipe, shrink or flip, with gap, rounded corners and a white flash</span></li>
              <li><b>Hand Track</b><span>A subject drives the cells (luma or Magic Mask), revealing the shot underneath, a colour, a blur or an inversion</span></li>
            </ul>
          </div>
        </section>

        {/* ── Titles ── */}
        <section id="titles" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">05</span><h2 className="h-h2">Titles for music videos and socials</h2></div>
            <p className="h-body cut-lead">{counts.titles} animated titles, grouped in the Inspector as Text, Colour, Title Styling, Film Look and Animation. Save your own presets in the app.</p>
            <Live><StyleShowcase styles={TITLE_STYLES} /></Live>
          </div>
        </section>

        {/* ── Templates (all) ── */}
        <section id="templates" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">06</span><h2 className="h-h2">All {counts.templates} templates</h2></div>
            <TemplateGallery />
          </div>
        </section>

        {/* ── Sound ── */}
        <section id="sound" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">07</span><h2 className="h-h2">{counts.sounds} sound effects, made in-house</h2></div>
            <p className="h-body cut-lead">Whooshes, risers, impacts, camera shutters, glitches, film and tape, made in code so they are yours to use in anything. Place them on the playhead, every cut or every marker. Have a listen:</p>
            <SoundCards samples={sounds.samples} />
          </div>
        </section>

        {/* ── Tools ── */}
        <section id="tools" className="cut-sec">
          <div className="h-wrap">
            <div className="h-sec-head"><span className="h-sec-num">08</span><h2 className="h-h2">And the tools you reach for every day</h2></div>
            <ul className="tools-grid">
              {TOOLS.map((t, i) => (
                <li key={t.name}><span className="h-label">{String(i + 1).padStart(2, "0")}</span><b>{t.name}</b><span>{t.line}</span></li>
              ))}
            </ul>
            <ol className="steps" aria-label="How it works">
              <li><b>Install</b><span>Run the installer, then Setup → Install everything.</span></li>
              <li><b>Open in Resolve</b><span>The app, or Workspace → Workflow Integrations → HermiteCut.</span></li>
              <li><b>Click</b><span>Select clips and apply. Undo removes it all.</span></li>
            </ol>
          </div>
        </section>

        {/* ── Compatibility + pricing ── */}
        <section id="get" className="cut-sec">
          <div className="h-wrap cut-two">
            <div className="card-flat">
              <span className="h-label">Compatibility</span>
              <dl className="compat">
                {COMPAT.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
            <div className="card-flat price-card">
              <span className="h-label">{POLAR_CHECKOUT_URL ? "HermiteCut licence" : "HermiteCut 2"}</span>
              {/* ─── CHECKOUT SLOT: the price and Buy button appear here once
                   POLAR_CHECKOUT_URL (and CUT_PRICE) are set in lib/config.ts. ─── */}
              <p className="price">{POLAR_CHECKOUT_URL && CUT_PRICE ? CUT_PRICE : "Download"}</p>
              <ul className="ticks">
                <li>{counts.templates} templates, Grid Reveal and {counts.sounds} sound effects</li>
                <li>The app for Windows and macOS, plus the Resolve panel</li>
                <li>Updates through GitHub Releases</li>
                <li>Use it on up to two of your computers</li>
              </ul>
              <Ctas />
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="cut-sec">
          <div className="h-wrap cut-faq">
            <div className="h-sec-head"><span className="h-sec-num">09</span><h2 className="h-h2">FAQ</h2></div>
            <div className="hc-faq">
              {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
            </div>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="cut-sec cut-close">
          <div className="h-wrap">
            <h2 className="h-display cut-close-title">Make the edit look like you meant it.</h2>
            <Ctas big />
          </div>
        </section>
      </main>
      <StickyBar watch="top" />
    </>
  );
}
