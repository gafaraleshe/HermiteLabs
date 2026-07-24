import type { Metadata } from "next";
import { StagePage } from "@/components/stage-page";
import { ModelsFragment } from "@/components/fragments";

export const metadata: Metadata = {
  title: "AI",
  description:
    "A swappable local AI layer for DaVinci Resolve — pick the model that fits your machine.",
};

export default function AiPage() {
  return (
    <StagePage stageId="ai" fragment={<ModelsFragment />}>
      <section className="section-tight">
        <div className="callout">
          <strong>Honest about hardware.</strong> Local models cost RAM and
          disk, and running them next to Resolve is a real budget. The model
          manager shows requirements <em>before</em> you download, defaults to
          the smallest viable model, and never installs anything silently. If
          you opt into the cloud pass, it&apos;s a visible switch — never a
          fallback.
        </div>
      </section>
    </StagePage>
  );
}
