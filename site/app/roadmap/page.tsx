import type { Metadata } from "next";
import Link from "next/link";
import { stages } from "@/lib/content";
import { Changelog, RoadmapList, StatusBadge } from "@/components/site";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "The full Hermite roadmap across all four stages — what's shipped, what's in development, and what's coming.",
};

export default function RoadmapPage() {
  return (
    <main className="container">
      <header style={{ padding: "64px 0 0", maxWidth: "44rem" }}>
        <p className="label-upper">Roadmap</p>
        <h1 className="display-lg" style={{ marginTop: "12px" }}>
          The whole plan, honestly labeled
        </h1>
        <p className="body-lead" style={{ marginTop: "16px" }}>
          Hermite ships in four stages, each independently useful. Everything
          below is the full eventual feature set — statuses tell you what&apos;s
          real today versus what&apos;s coming, straight from the repo.
        </p>
      </header>

      {stages.map(stage => (
        <section className="section" key={stage.id} id={stage.id}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <p className="label-upper">
              Stage {stage.stage} · {stage.version}
            </p>
            <StatusBadge status={stage.status} />
          </div>
          <h2 className="display-md" style={{ margin: "8px 0 4px" }}>
            <Link href={`/${stage.id}`}>{stage.name}</Link>
          </h2>
          <p style={{ margin: "0 0 24px", color: "var(--muted)", maxWidth: "40rem" }}>
            {stage.summary}
          </p>
          <RoadmapList features={stage.features} />
        </section>
      ))}

      <section className="section" id="changelog">
        <p className="label-upper">Changelog</p>
        <h2 className="display-md" style={{ margin: "12px 0 32px" }}>
          Latest from the build
        </h2>
        <div className="status-strip" style={{ gridTemplateColumns: "1fr" }}>
          <Changelog />
        </div>
      </section>
    </main>
  );
}
