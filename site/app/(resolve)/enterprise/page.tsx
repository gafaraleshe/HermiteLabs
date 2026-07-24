import type { Metadata } from "next";
import Link from "next/link";
import { StagePage } from "@/components/stage-page";
import { ApiFragment } from "@/components/fragments";

export const metadata: Metadata = {
  title: "Enterprise API",
  description:
    "Hermite's engine as a cloud API with MCP integration — curve generation, transcription, and caption cleanup for your tools and agents.",
};

export default function EnterprisePage() {
  return (
    <StagePage stageId="enterprise" fragment={<ApiFragment />}>
      <section className="section-tight">
        <div className="callout">
          <strong>This is the cloud exception — on purpose.</strong> Everything
          else in Hermite runs on-device. The enterprise API is a separate
          product line for teams who explicitly want hosted processing:
          uploaded media, metered usage, its own data-retention policy. It
          shares Hermite&apos;s core engine, not its privacy posture — and we
          say so plainly rather than blending the two.{" "}
          <Link href="/docs" style={{ textDecoration: "underline" }}>
            Read the API docs preview →
          </Link>
        </div>
      </section>
    </StagePage>
  );
}
