import type { Metadata } from "next";
import { StagePage } from "@/components/stage-page";
import { CurveFragment } from "@/components/fragments";

export const metadata: Metadata = {
  title: "Motion",
  description:
    "One-click motion presets, a bezier easing curve editor, and speed-ramp tools for DaVinci Resolve.",
};

export default function MotionPage() {
  return (
    <StagePage stageId="motion" fragment={<CurveFragment />}>
      <section className="section-tight">
        <div className="callout">
          <strong>Why this needs to exist:</strong> Resolve can do smooth
          animation — but only if you hand-edit splines in Fusion&apos;s node
          graph. Hermite Motion packages that power the way editors expect it:
          pick a preset, drag a curve, done. The preset pack installs as a
          standard <code className="inline">.drfx</code> — double-click with
          Resolve open — and works in <strong>free Resolve</strong>, not just
          Studio.
        </div>
      </section>
    </StagePage>
  );
}
