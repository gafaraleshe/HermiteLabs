import type { Metadata } from "next";
import { StagePage } from "@/components/stage-page";
import { CaptionsFragment } from "@/components/fragments";

export const metadata: Metadata = {
  title: "Subs",
  description:
    "On-device transcription and captioning for DaVinci Resolve — no cloud calls, ever.",
};

export default function SubsPage() {
  return (
    <StagePage stageId="subs" fragment={<CaptionsFragment />}>
      <section className="section-tight">
        <div className="callout">
          <strong>On-device means on-device.</strong> Transcription runs on
          your hardware with models you choose and can inspect on disk. There
          is no upload step, no processing server, no &quot;anonymized
          sample&quot; — the audio path never touches a network. That&apos;s
          not a settings toggle; it&apos;s the architecture.
        </div>
      </section>
    </StagePage>
  );
}
