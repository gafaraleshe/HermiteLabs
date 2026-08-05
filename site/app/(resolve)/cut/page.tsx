import type { Metadata } from "next";
import Link from "next/link";
import { changelog, stages, GITHUB_URL } from "@/lib/content";
import { WaitlistForm } from "@/components/waitlist";
import { CutPreview, CurveFigure } from "@/components/cut-preview";

/**
 * HermiteCut — the home page of cut.hermitelabs.com.
 *
 * Section order follows the reference landing page: announcement → oversized
 * hero with a dark product panel → capability ticker → feature bento → who
 * it's for → numbered process → social proof → plans → FAQ → closing CTA.
 *
 * Two swaps, both deliberate. Where the reference runs a testimonial carousel
 * this runs the real changelog: HermiteCut is pre-release and has no customers
 * to quote, and inventing them would be the one thing a build-in-the-open
 * product cannot do. Where the reference lists prices, this lists what is in
 * each tier and says pricing is set at launch — there are no prices yet.
 *
 * Everything else on the page is derived from data/roadmap.json and
 * data/changelog.json, so shipping a feature updates the copy.
 */

export const metadata: Metadata = {
  // Absolute: this page names the product itself, so the layout's
  // "%s — HermiteCut" template would only stutter.
  title: {
    absolute: "HermiteCut — motion, captions and speed ramps for DaVinci Resolve",
  },
  description:
    "After Effects–style motion control inside DaVinci Resolve: one-click presets, a real bezier curve editor and speed ramps, plus subtitles transcribed entirely on your own machine.",
  openGraph: {
    title: "HermiteCut — smooth motion inside DaVinci Resolve",
    description:
      "Presets, a real curve editor, speed ramps and on-device subtitles. In active development, built in the open.",
    url: "https://cut.hermitelabs.com",
    siteName: "HermiteCut",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://cut.hermitelabs.com" },
};

const TICKER = [
  "Slide-in presets",
  "Bezier curve editor",
  "Speed ramps",
  "Batch apply",
  "Fusion macros",
  "On-device transcription",
  "Voice activity detection",
  "Styled subtitle tracks",
  "Correction pass",
  "Speaker labels",
  "Local model picker",
  "Caption cleanup",
  "No uploads",
];

const AUDIENCES = [
  {
    title: "Solo creators",
    body: "Get the motion polish of a paid template pack without buying one, and captions without a subscription that reads your audio.",
  },
  {
    title: "Editors",
    body: "Stop rebuilding the same slide-in for the hundredth time. Shape a curve once, apply it to every clip you selected.",
  },
  {
    title: "Studios",
    body: "One install per workstation, a shared preset pack, and footage that never leaves the building on the way to a transcript.",
  },
  {
    title: "Teams building tools",
    body: "The same engine is exposed as a hosted API with MCP support, so your own agents can call it. Cloud, clearly labelled.",
  },
];

const STEPS = [
  {
    n: "Step 1",
    title: "Install the preset pack",
    body: "HermiteCut ships as a .drfx — a Fusion macro bundle you install by double-clicking with Resolve open. It works on free Resolve, it adds no background service, and it makes no network calls.",
  },
  {
    n: "Step 2",
    title: "Apply a preset",
    body: "Drop a preset on a clip and adjust it from the Inspector like any other Fusion tool. Slide-in from four directions, pop and scale, Ken Burns, fade-and-move combinations.",
  },
  {
    n: "Step 3",
    title: "Shape the curve",
    body: "When a preset isn't enough, the desktop app opens a real bezier editor with draggable handles and a preset library — linear, ease-in-out, overshoot, bounce — and writes the result straight back into Resolve.",
  },
  {
    n: "Step 4",
    title: "Keep the keyframes",
    body: "What lands on your timeline is ordinary Fusion keyframes. Nothing is locked to HermiteCut, nothing breaks when you uninstall it, and anyone opening the project can edit the animation by hand.",
  },
];

const FAQ = [
  {
    q: "Which version of DaVinci Resolve do I need?",
    a: "Resolve 19.1 or newer, on macOS or Windows, installed from blackmagicdesign.com. The Mac App Store build of Resolve does not support external script integration, so the desktop app cannot talk to it — the preset pack still installs, but the curve editor will not connect.",
  },
  {
    q: "Does it work on free Resolve, or do I need Studio?",
    a: "Both. The preset pack is Fusion macros with Inspector controls, which free Resolve runs without restriction. The curve and speed-ramp editors live in a separate desktop app that reaches Resolve through a bridge script launched from Workspace → Scripts — the route that works on free. On Studio the app can connect directly through the external scripting API as a faster path, but nothing is Studio-only.",
  },
  {
    q: "Does my footage or audio get uploaded anywhere?",
    a: "No. Transcription runs on your machine against a model you downloaded, and the motion side never touches the network at all. The one exception is the enterprise API, which is a separate product that processes data in the cloud on purpose — it is never part of the desktop install, and it is never on by default.",
  },
  {
    q: "Which transcription models can I use?",
    a: "A choice of sizes and families, so you can trade speed against accuracy on the hardware you actually have. Model weights are downloaded on first run from their official sources with the licence shown up front, never bundled into the installer, and the manager lists disk and RAM requirements before anything downloads.",
  },
  {
    q: "What is actually shipping today?",
    a: "HermiteCut is in active development and not yet released. The preset pack and the curve editor are the current build; on-device transcription is running end to end behind them. The roadmap marks every feature honestly as shipped, in development, or planned, and the changelog updates as the code does.",
  },
  {
    q: "Can I call HermiteCut from my own tooling?",
    a: "That is the enterprise API — curve generation, motion presets, transcription and caption cleanup as stateless HTTP endpoints, plus MCP integration so agents can call them as tools. It is planned rather than live, and the reference documentation is already in the docs section.",
  },
];

export default function CutHome() {
  const featureCount = stages.reduce((n, s) => n + s.features.length, 0);
  const building = stages
    .flatMap(s => s.features)
    .filter(f => f.status === "in-progress").length;

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hc-hero">
        <span className="hc-grid-bg" aria-hidden="true" />
        <div className="hc-wrap hc-hero-in">
          <Link className="hc-ann" href="/roadmap">
            <b>New</b>
            Preset pack and curve editor are building
            <i aria-hidden="true">→</i>
          </Link>

          {/* The stacked words share one grid cell, so the cell is as wide as
              the widest of them — keep the three close in length or the
              headline gains a hole. Only the first is exposed to assistive
              tech: the sentence has to read once, not three times. */}
          <h1 className="hc-title">
            Smooth{" "}
            <span className="hc-rotate">
              <span>motion</span>
              <span aria-hidden="true">easing</span>
              <span aria-hidden="true">ramps</span>
            </span>{" "}
            inside DaVinci Resolve
          </h1>

          <p className="hc-sub">
            HermiteCut brings After Effects–style motion control into Resolve —
            one-click presets, a real bezier curve editor, speed ramps — plus
            subtitles transcribed entirely on your own machine.
          </p>

          <WaitlistForm source="cut-hero" />

          <div className="hc-actions">
            <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
              Star on GitHub
            </a>
            <Link className="btn btn-secondary" href="/roadmap">
              See the roadmap
            </Link>
          </div>

          <p className="hc-fine">
            Resolve 19.1+ · Free and Studio · macOS and Windows
          </p>

          <CutPreview />
        </div>
      </section>

      {/* ── Capability ticker ────────────────────────────────────────────── */}
      <div className="hc-marquee" aria-hidden="true">
        <div className="hc-marquee-row">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span className="hc-chip" key={`${t}-${i}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Feature bento ────────────────────────────────────────────────── */}
      <section className="hc-sec hc-sec--flush" id="features">
        <div className="hc-wrap">
          <div className="hc-sec-head">
            <span className="hc-eyebrow">Built by an editor, for editors</span>
            <h2 className="hc-h2">Motion that takes a minute, not an afternoon</h2>
            <p className="hc-lede">
              Resolve is a colour and edit powerhouse with a Fusion page most
              editors open once and close again. HermiteCut puts the parts you
              actually wanted — easing, ramps, captions — where you already are.
            </p>
          </div>

          <div className="hc-bento">
            <article className="hc-tile hc-tile--lead">
              <div className="hc-tile-inner">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span className="hc-tile-n">01</span>
                  <h3>A curve editor you can see, not a number you guess</h3>
                  <p>
                    Draggable handles, a live preview, and a preset library —
                    linear, ease, ease-in-out, overshoot, bounce. Shape it once
                    and HermiteCut maps it to exact Fusion keyframes, so the
                    result is a normal animation anyone can pick up and edit.
                  </p>
                </div>
                <CurveFigure />
              </div>
            </article>

            <article className="hc-tile hc-tile--wide">
              <span className="hc-tile-n">02</span>
              <h3>Presets that are just keyframes</h3>
              <p>
                Slide-in from four directions, pop and scale, Ken Burns
                pan-zoom, fade-and-move combinations — installed as a .drfx
                Fusion macro bundle with Inspector controls, working on free
                Resolve with no service running in the background.
              </p>
            </article>

            <article className="hc-tile hc-tile--wide">
              <span className="hc-tile-n">03</span>
              <h3>Speed ramps with handles</h3>
              <p>
                Click-drag speed curves with ease handles and hold segments,
                modelled on the After Effects graph editor rather than on
                Resolve&apos;s retime controls. Select several clips and apply
                the same treatment to all of them at once.
              </p>
            </article>

            <article className="hc-tile">
              <span className="hc-tile-n">04</span>
              <h3>Captions without the upload</h3>
              <p>
                On-device transcription with voice activity detection so silence
                is skipped, styled subtitle tracks, and a waveform-and-text
                correction pass before a single word is written to the timeline.
              </p>
            </article>

            <article className="hc-tile">
              <span className="hc-tile-n">05</span>
              <h3>Your models, your machine</h3>
              <p>
                Pick the model that fits your RAM and GPU. Disk and memory
                requirements are shown before anything downloads, and weights
                come from their official sources under their own licence.
              </p>
            </article>

            <article className="hc-tile">
              <span className="hc-tile-n">06</span>
              <h3>One cloud exception, labelled</h3>
              <p>
                The enterprise API is deliberately separate: a hosted endpoint
                for teams who want cloud processing, with MCP integration for
                agents. It is never bundled into the desktop install.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="hc-sec hc-sec--tint">
        <div className="hc-wrap">
          <div className="hc-sec-head">
            <span className="hc-eyebrow">One toolkit, every kind of edit</span>
            <h2 className="hc-h2">Wherever the timeline is, this runs next to it</h2>
            <div className="hc-pills">
              <span className="hc-pill">Resolve 19.1+</span>
              <span className="hc-pill">Free &amp; Studio</span>
              <span className="hc-pill">macOS</span>
              <span className="hc-pill">Windows</span>
              <span className="hc-pill">.drfx</span>
              <span className="hc-pill">Fusion macros</span>
            </div>
          </div>

          <div className="hc-cols">
            {AUDIENCES.map(a => (
              <article className="hc-col" key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="hc-sec" id="process">
        <div className="hc-wrap">
          <div className="hc-sec-head">
            <span className="hc-eyebrow">How HermiteCut works</span>
            <h2 className="hc-h2">Four steps, and none of them are &ldquo;learn Fusion&rdquo;</h2>
          </div>

          <div className="hc-steps">
            {STEPS.map(s => (
              <article className="hc-step" key={s.n}>
                <span className="hc-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built in the open ────────────────────────────────────────────── */}
      <section className="hc-sec hc-sec--tint" id="progress">
        <div className="hc-wrap hc-log">
          <div>
            <span className="hc-eyebrow">Built in the open</span>
            <h2 className="hc-h2">No testimonials yet — here is the build instead</h2>
            <p className="hc-lede">
              HermiteCut is pre-release, so there is nobody to quote. What there
              is: a public roadmap where every feature is marked shipped, in
              development or planned, and a changelog that moves when the code
              does.
            </p>
            <div className="hc-actions hc-actions--start">
              <Link className="btn btn-primary" href="/roadmap">
                Full roadmap
              </Link>
              <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                Read the source
              </a>
            </div>
            <div className="hc-stats">
              <div className="hc-stat">
                <span className="hc-eyebrow">Stages</span>
                <b>{stages.length}</b>
              </div>
              <div className="hc-stat">
                <span className="hc-eyebrow">Features planned</span>
                <b>{featureCount}</b>
              </div>
              <div className="hc-stat">
                <span className="hc-eyebrow">In development</span>
                <b>{building}</b>
              </div>
            </div>
          </div>

          <div className="hc-log-list">
            {changelog.slice(0, 4).map(e => (
              <article className="hc-log-item" key={`${e.date}-${e.title}`}>
                <time dateTime={e.date}>{e.date}</time>
                <div>
                  <h4>{e.title}</h4>
                  <p>{e.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ────────────────────────────────────────────────────────── */}
      <section className="hc-sec" id="plans">
        <div className="hc-wrap">
          <div className="hc-sec-head">
            <span className="hc-eyebrow">Plans</span>
            <h2 className="hc-h2">What each tier will include</h2>
            <p className="hc-lede">
              Nothing is for sale yet, so there are no numbers on this page.
              These are the lines the three tiers are being built along; pricing
              is set at launch and announced to the waitlist first.
            </p>
          </div>

          <div className="hc-plans">
            <article className="hc-plan">
              <div className="hc-plan-top">
                <h3>Preset pack</h3>
              </div>
              <div className="hc-plan-price">
                Free<small>always</small>
              </div>
              <p>The motion toolkit, standalone. No account, no service, no network.</p>
              <ul className="hc-plan-list">
                <li>.drfx install for free Resolve and Studio</li>
                <li>Slide, pop, scale and Ken Burns presets</li>
                <li>Inspector-exposed controls on every macro</li>
                <li>Fusion keyframes you own outright</li>
              </ul>
              <Link className="btn btn-secondary" href="/motion">
                What&apos;s in it
              </Link>
            </article>

            <article className="hc-plan hc-plan--featured">
              <div className="hc-plan-top">
                <h3>Desktop app</h3>
                <span className="hc-plan-tag">Main build</span>
              </div>
              <div className="hc-plan-price">
                —<small>priced at launch</small>
              </div>
              <p>Everything in the preset pack, plus the editors and the on-device subtitle pipeline.</p>
              <ul className="hc-plan-list">
                <li>Bezier easing curve editor</li>
                <li>Speed-ramp graph editor and batch apply</li>
                <li>On-device transcription with model choice</li>
                <li>Correction pass before anything hits the timeline</li>
                <li>Local AI caption cleanup</li>
              </ul>
              <Link className="btn btn-primary" href="#waitlist">
                Join the waitlist
              </Link>
            </article>

            <article className="hc-plan">
              <div className="hc-plan-top">
                <h3>Enterprise API</h3>
              </div>
              <div className="hc-plan-price">
                —<small>usage based</small>
              </div>
              <p>The same engine, hosted. A separate product line for teams who want cloud processing.</p>
              <ul className="hc-plan-list">
                <li>Curve generation and preset application over HTTP</li>
                <li>Transcription and caption cleanup endpoints</li>
                <li>API keys, rate limits and usage dashboards</li>
                <li>MCP integration so agents can call it as a tool</li>
                <li data-off="">Processed in the cloud, by design</li>
              </ul>
              <Link className="btn btn-secondary" href="/enterprise">
                Read the positioning
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="hc-sec hc-sec--tint" id="faq">
        <div className="hc-wrap">
          <div className="hc-sec-head">
            <span className="hc-eyebrow">FAQ</span>
            <h2 className="hc-h2">The questions worth answering before you install</h2>
          </div>

          <div className="hc-faq">
            {FAQ.map(item => (
              <details className="hc-q" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <section className="hc-sec" id="waitlist">
        <div className="hc-wrap hc-final">
          <span className="hc-eyebrow">Get it when it lands</span>
          <h2 className="hc-h2">Smooth animation should not be a Fusion project</h2>
          <p className="hc-lede" style={{ marginInline: "auto" }}>
            Join the waitlist and you hear first when the preset pack is
            installable — no drip campaign, one email per release.
          </p>
          <WaitlistForm source="cut-footer" />
          <p className="hc-fine">Built in the open by Gaffy Studios · part of Hermite Labs</p>
        </div>
      </section>
    </main>
  );
}
