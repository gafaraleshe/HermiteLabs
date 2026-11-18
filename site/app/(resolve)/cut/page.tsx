import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/site";
import { Preview } from "@/components/cut/preview";
import { Live } from "@/components/cut/live";
import { TemplateGallery } from "@/components/cut/gallery";
import { TimeFxShowcase } from "@/components/cut/timefx";
import { TimingDemo } from "@/components/cut/timing";
import { StickyBar } from "@/components/cut/sticky-bar";
import {
  CUT_DOWNLOAD,
  CUT_REPO,
  CUT_ROADMAP,
  FAQ,
  PROGRESS_V2,
  SHARED_CONTROLS,
  SPECS,
  TOOLS_V1,
  templates,
} from "@/lib/cut";
import "./cut.css";

export const metadata: Metadata = {
  title: "HermiteCut — the editing toolkit for DaVinci Resolve",
  description:
    "Seven editing tools in one panel inside DaVinci Resolve, and a pack of effects, time effects, transitions and titles with Post / Pre / Both timing. Free and open source.",
  alternates: { canonical: "https://hermitelabs.com/cut" },
};

const FAMILIES: { name: string; sub: string; href: string }[] = [
  { name: "Flashes", sub: "Hits on the cut", href: "#templates" },
  { name: "Shakes", sub: "Camera energy", href: "#templates" },
  { name: "Blurs", sub: "Focus and speed", href: "#templates" },
  { name: "Motion", sub: "Punches, slides, pops", href: "#templates" },
  { name: "Glitch", sub: "Digital damage", href: "#templates" },
  { name: "Film & Light", sub: "Burns, leaks, looks", href: "#templates" },
  { name: "Time FX", sub: "Bend time", href: "#time-fx" },
  { name: "Transitions", sub: "Whips to wipes", href: "#templates" },
  { name: "Titles", sub: "Credits and more", href: "#templates" },
];

function count(fn: (t: (typeof templates)[number]) => boolean) {
  return templates.filter(fn).length;
}

const COUNTS: Record<string, number> = {
  "Time FX": count(t => t.family === "Time FX"),
  Transitions: count(t => t.kind === "transition"),
  Titles: count(t => t.kind === "title"),
};
for (const f of ["Flashes", "Shakes", "Blurs", "Motion", "Glitch", "Film & Light"]) {
  COUNTS[f] = count(t => t.kind === "effect" && t.family === f);
}

const ANCHORS = [
  ["overview", "Overview"],
  ["tools", "Tools"],
  ["templates", "Templates"],
  ["time-fx", "Time FX"],
  ["controls", "Controls"],
  ["install", "Install"],
  ["faq", "FAQ"],
] as const;

export default function CutPage() {
  const effects = count(t => t.kind === "effect");
  return (
    <>
      <main className="hc-page">
        {/* ── Hero ── */}
        <section className="hc-hero" id="top">
          <div className="container">
            <p className="hc-crumbs">
              <span>DaVinci Resolve</span> / <span>HermiteCut</span>
            </p>
            <div className="hc-hero-grid">
              <div className="hc-hero-copy">
                <span className="badge-pill">
                  <span className="dot dot-in-progress" />
                  1.0 available · 2.0 in development
                </span>
                <h1 className="display-xl">HermiteCut</h1>
                <p className="hc-tagline">The all-in-one editing toolkit for DaVinci Resolve.</p>
                <p className="body-lead">
                  Seven tools in one panel inside Resolve: easing, alignment,
                  motion, bounce, beat markers, captions and 67 one-click
                  actions. Version 2.0 adds {templates.length} effects,
                  transitions and titles you drop on a clip and shape in the
                  Inspector.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-primary" href={CUT_DOWNLOAD}>
                    Download 1.0 for Windows
                  </a>
                  <a className="btn btn-secondary" href="#templates">
                    See the templates
                  </a>
                </div>
                <p className="hc-trust">
                  Free and open source (MIT) · DaVinci Resolve Studio 19+ · No account, nothing uploaded
                </p>
              </div>

              <Live className="hc-inspector" as="div">
                <Preview kind="glowflash" label="Glow Flash on a clip" />
                <div className="hc-insp-panel" aria-hidden="true">
                  <div className="hc-insp-title">
                    <span className="label-upper">Inspector</span>
                    <span>Glow Flash</span>
                  </div>
                  <div className="hc-insp-row">
                    <span>Apply at</span>
                    <span className="hc-insp-seg">
                      <b>Post</b><i>Pre</i><i>Both</i><i>Whole</i>
                    </span>
                  </div>
                  <div className="hc-insp-row">
                    <span>Frames</span>
                    <span className="hc-insp-slider" style={{ "--v": "0.25" } as React.CSSProperties}><em />10</span>
                  </div>
                  <div className="hc-insp-row">
                    <span>Curve</span>
                    <span className="hc-insp-val">Ease Out</span>
                  </div>
                  <div className="hc-insp-row">
                    <span>Strength</span>
                    <span className="hc-insp-slider" style={{ "--v": "0.5" } as React.CSSProperties}><em />1.0</span>
                  </div>
                </div>
              </Live>
            </div>
          </div>
        </section>

        {/* ── In-page navigation ── */}
        <nav className="hc-anchors" aria-label="On this page">
          <div className="container">
            {ANCHORS.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <a className="hc-anchors-cta" href={CUT_DOWNLOAD}>
              Download
            </a>
          </div>
        </nav>

        {/* ── Overview ── */}
        <section className="section-tight" id="overview">
          <div className="container">
            <dl className="hc-specs">
              {SPECS.map(s => (
                <div key={s.k}>
                  <dt className="label-upper">{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="hc-families">
              {FAMILIES.map(f => (
                <a key={f.name} href={f.href} className="hc-family">
                  <span className="hc-family-name">
                    {f.name}
                    <span className="hc-count">{COUNTS[f.name]}</span>
                  </span>
                  <span className="hc-family-sub">{f.sub}</span>
                </a>
              ))}
            </div>

            <div className="hc-overview">
              <h2 className="display-md">
                One panel for the edit. One pack for the look.
              </h2>
              <div className="hc-overview-cols">
                <div>
                  <StatusBadge status="shipped" />
                  <h3 className="title-md">HermiteCut 1.0</h3>
                  <p>
                    A panel that floats over the Edit, Fusion and Color pages
                    (Workspace → Workflow Integrations → HermiteCut). Its tools
                    act on the clips you have selected, in one click.
                  </p>
                </div>
                <div>
                  <StatusBadge status="in-progress" />
                  <h3 className="title-md">HermiteCut 2.0</h3>
                  <p>
                    {effects} effects and time effects, {COUNTS.Transitions}{" "}
                    transitions and {COUNTS.Titles} titles as native Fusion
                    templates: drag and drop from the Effects library, then shape
                    them in the Inspector. Plus a sound-effects library, Shorts
                    tools and a standalone app for Windows and macOS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tools ── */}
        <section className="section" id="tools">
          <div className="container">
            <p className="label-upper">Available now · 1.0</p>
            <h2 className="display-md hc-h2">Seven tools, one panel</h2>
            <div className="hc-tools">
              {TOOLS_V1.map((t, i) => (
                <div key={t.name} className="hc-tool">
                  <span className="hc-tool-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="title-md">{t.name}</h3>
                  <p>{t.line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Templates ── */}
        <section className="section" id="templates">
          <div className="container">
            <p className="label-upper">Coming in 2.0 · {templates.length} templates</p>
            <h2 className="display-md hc-h2">Drop it on a clip. Shape it in the Inspector.</h2>
            <p className="body-lead hc-lead">
              Every template is a native Fusion macro, so it installs with the
              rest of Resolve&apos;s effects and works with no extra plugins.
              Effects hit at the start or end of a clip, transitions sit on a
              cut, and titles have their text, colour and animation grouped in
              the Inspector.
            </p>
            <TemplateGallery />
          </div>
        </section>

        {/* ── Time FX ── */}
        <section className="section" id="time-fx">
          <div className="container">
            <p className="label-upper">Time FX</p>
            <h2 className="display-md hc-h2">Five effects that bend time</h2>
            <p className="body-lead hc-lead">
              Slow shutter, echoes, colour trails, stutters and streaks, built
              from the frames around the one you are on. Try a style to see how
              each one changes the motion.
            </p>
            <TimeFxShowcase />
          </div>
        </section>

        {/* ── Controls ── */}
        <section className="section" id="controls">
          <div className="container">
            <p className="label-upper">Controls</p>
            <h2 className="display-md hc-h2">The same controls on every template</h2>
            <p className="body-lead hc-lead">
              Learn them once. Apply at decides where an effect hits, Frames
              how long it lasts, and Curve how it eases. Outside that window
              your clip is untouched.
            </p>
            <TimingDemo />
            <div className="hc-controls">
              {SHARED_CONTROLS.map(group => (
                <div key={group.kind} className="hc-controls-col">
                  <h3 className="title-md">{group.kind}</h3>
                  <dl>
                    {group.items.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Install ── */}
        <section className="section" id="install">
          <div className="container">
            <p className="label-upper">Install</p>
            <h2 className="display-md hc-h2">Up and running in a minute</h2>
            <div className="hc-install">
              <div>
                <h3 className="title-md">HermiteCut 1.0 · Windows</h3>
                <ol className="hc-steps">
                  <li>
                    <b>Download</b> the latest zip from{" "}
                    <a href={CUT_DOWNLOAD}>GitHub Releases</a> and unzip it.
                  </li>
                  <li>
                    <b>Quit Resolve</b>, then run <code className="inline">Install HermiteCut.exe</code>.
                  </li>
                  <li>
                    <b>Open Resolve</b> and choose Workspace → Workflow Integrations → HermiteCut.
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="title-md">Template pack · 2.0</h3>
                <ol className="hc-steps">
                  <li>
                    <b>Install</b> HermiteCut.drfx: double-click it with Resolve open, or let the app&apos;s Setup screen do it.
                  </li>
                  <li>
                    <b>Restart Resolve</b>, so it picks up the new templates.
                  </li>
                  <li>
                    <b>Drag and drop</b> from the Effects library onto a clip, a cut or the timeline.
                  </li>
                </ol>
              </div>
            </div>

            <table className="hc-req">
              <thead>
                <tr>
                  <th />
                  <th>1.0 panel</th>
                  <th>2.0 templates</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>DaVinci Resolve</th>
                  <td>Studio 19 or newer (tested on 21.2)</td>
                  <td>21.x, built for free and Studio</td>
                </tr>
                <tr>
                  <th>Windows</th>
                  <td>Windows 10 or 11, with an installer</td>
                  <td>Installer (.exe)</td>
                </tr>
                <tr>
                  <th>macOS</th>
                  <td>Manual install</td>
                  <td>.dmg for Apple Silicon and Intel</td>
                </tr>
                <tr>
                  <th>Format</th>
                  <td>Workflow Integration plugin</td>
                  <td>Fusion templates (.drfx), no OFX plugins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 2.0 progress ── */}
        <section className="section-tight" id="progress">
          <div className="container">
            <p className="label-upper">Built in the open</p>
            <h2 className="display-sm hc-h2">Where 2.0 is</h2>
            <div className="roadmap-list">
              {PROGRESS_V2.map(p => (
                <div className="roadmap-item" key={p.item}>
                  <h4>{p.item}</h4>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
            <p className="hc-fx-note">
              Full plan: <a href={CUT_ROADMAP}>the HermiteCut roadmap</a>.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section" id="faq">
          <div className="container hc-faq-wrap">
            <h2 className="display-md">FAQ</h2>
            <div className="hc-faq">
              {FAQ.map(f => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="section-tight">
          <div className="container">
            <div className="cta-band">
              <p className="label-upper">HermiteCut</p>
              <h2 className="display-md" style={{ marginTop: "12px" }}>
                Edit faster. Make it look like you meant it.
              </h2>
              <div className="actions">
                <a className="btn btn-primary" href={CUT_DOWNLOAD}>
                  Download 1.0
                </a>
                <a className="btn btn-secondary" href={CUT_REPO} target="_blank" rel="noreferrer">
                  Follow on GitHub
                </a>
              </div>
            </div>

            <div className="hc-more">
              <p className="label-upper">More from Hermite Labs</p>
              <div className="hc-more-grid">
                <Link href="/motion" className="hc-more-card">
                  <span className="title-sm">Hermite Motion</span>
                  <span>Easing and speed ramps for Fusion keyframes.</span>
                </Link>
                <Link href="/subs" className="hc-more-card">
                  <span className="title-sm">Hermite Subs</span>
                  <span>On-device transcription and captions.</span>
                </Link>
                <a href="https://flow.hermitelabs.com" className="hc-more-card">
                  <span className="title-sm">HermiteFlow</span>
                  <span>Bookings to paid invoices, for creative studios.</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <StickyBar watch="top" />
    </>
  );
}
