import Link from "next/link";
import { stages, currentFocus, GITHUB_URL } from "@/lib/content";
import { Changelog, StatusBadge } from "@/components/site";
import { WaitlistForm } from "@/components/waitlist";
import {
  ApiFragment,
  CaptionsFragment,
  CurveFragment,
  HeroIllustration,
  ModelsFragment,
} from "@/components/fragments";

const fragments: Record<string, React.ReactNode> = {
  motion: <CurveFragment />,
  subs: <CaptionsFragment />,
  ai: <ModelsFragment />,
  enterprise: <ApiFragment />,
};

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="badge-pill">
              <span className="dot dot-in-progress" />
              In active development — built in the open
            </span>
            <h1 className="display-xl" style={{ marginTop: "16px" }}>
              Smooth animation for DaVinci Resolve
            </h1>
            <p className="body-lead">
              Hermite brings After Effects–style motion control into Resolve —
              one-click presets, a real easing curve editor, speed ramps — plus
              auto-subtitles and an AI layer that run entirely on your machine.
            </p>
            <WaitlistForm source="site-hero" />
            <div className="hero-actions">
              <a
                className="btn btn-secondary"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                Follow on GitHub
              </a>
              <Link className="btn btn-secondary" href="/roadmap">
                See the roadmap
              </Link>
            </div>
          </div>
          <div className="hero-illustration-card">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ── Build-in-progress strip ── */}
      <section className="section-tight">
        <div className="container">
          <div className="status-strip">
            <div>
              <p className="label-upper">Now building</p>
              <h2 className="display-sm" style={{ marginTop: "8px" }}>
                {currentFocus.name}
              </h2>
              <p style={{ marginTop: "8px", color: "var(--muted)" }}>
                Stage {currentFocus.stage} of 4 · {currentFocus.tagline}
              </p>
              <div style={{ marginTop: "16px" }}>
                <StatusBadge status={currentFocus.status} />
              </div>
            </div>
            <div>
              <p className="label-upper" style={{ marginBottom: "16px" }}>
                Latest from the build
              </p>
              <Changelog limit={3} />
            </div>
          </div>
        </div>
      </section>

      {/* ── The four pillars ── */}
      <section className="section">
        <div className="container">
          <p className="label-upper">The full picture</p>
          <h2 className="display-lg" style={{ margin: "12px 0 40px", maxWidth: "26ch" }}>
            Four stages. Each one useful on its own.
          </h2>
          <div className="card-grid">
            {stages.map(stage => (
              <div key={stage.id} className={`feature-card card-${stage.color}`}>
                <span className="card-kicker">
                  Stage {stage.stage} · {stage.version}
                </span>
                <h3>{stage.name}</h3>
                <p>{stage.summary}</p>
                {fragments[stage.id]}
                <div className="card-cta">
                  <Link href={`/${stage.id}`}>
                    Explore {stage.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy positioning ── */}
      <section className="section-tight">
        <div className="container">
          <div className="cta-band">
            <p className="label-upper">On-device, for real</p>
            <h2 className="display-md" style={{ margin: "12px auto 0", maxWidth: "24ch" }}>
              Your footage and audio never leave your machine
            </h2>
            <p
              style={{
                margin: "16px auto 0",
                maxWidth: "42rem",
                color: "var(--body)",
              }}
            >
              Transcription and AI assistance run locally — you pick the models,
              you see what&apos;s installed, and nothing is uploaded. Optional
              cloud features are exactly that: optional, opt-in, and labeled.
              The enterprise API is a separate product for teams who want cloud
              processing on purpose.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" href="/subs">
                How Subs stays local
              </Link>
              <Link className="btn btn-secondary" href="/enterprise">
                The cloud exception
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
