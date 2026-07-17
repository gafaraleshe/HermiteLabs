import Link from "next/link";
import { getStage, GITHUB_URL } from "@/lib/content";
import { RoadmapList, StatusBadge } from "@/components/site";

export function StagePage({
  stageId,
  fragment,
  children,
}: {
  stageId: string;
  fragment?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const stage = getStage(stageId);
  const darkCard = stage.color === "pink" || stage.color === "teal";
  return (
    <main className="container">
      <header className={`page-hero card-${stage.color}`}>
        <div className="stage-line">
          <span
            className={`badge-pill ${darkCard ? "badge-on-dark" : "badge-on-color"}`}
          >
            Stage {stage.stage} · {stage.version}
          </span>
          <StatusBadge status={stage.status} onDark={darkCard} onColor={!darkCard} />
        </div>
        <h1>{stage.tagline}</h1>
        <p className="lead">{stage.summary}</p>
        {fragment && (
          <div style={{ maxWidth: "480px", marginTop: "32px" }}>{fragment}</div>
        )}
      </header>

      <section className="section">
        <p className="label-upper">Feature roadmap — everything planned, honestly labeled</p>
        <h2 className="display-md" style={{ margin: "12px 0 32px" }}>
          What {stage.name} will do
        </h2>
        <RoadmapList features={stage.features} />
      </section>

      {children}

      <section className="section-tight">
        <div className="cta-band">
          <h2 className="display-md">Watch it come together</h2>
          <p style={{ marginTop: "12px", color: "var(--body)" }}>
            Hermite is built in the open — the roadmap and changelog update as
            the code does.
          </p>
          <div className="actions">
            <a
              className="btn btn-primary"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              Follow on GitHub
            </a>
            <Link className="btn btn-secondary" href="/roadmap">
              Full roadmap
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
