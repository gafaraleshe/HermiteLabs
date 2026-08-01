import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Technical documentation for the Hermite enterprise API and MCP/Composio integration.",
};

export default function DocsIndex() {
  return (
    <>
      <h1>Hermite documentation</h1>
      <p style={{ marginTop: "16px" }}>
        Technical documentation for the <strong>Hermite enterprise API</strong>{" "}
        (Stage 4) — the cloud-hosted product line that exposes Hermite&apos;s
        engine programmatically — and for connecting Hermite to AI agents over
        MCP.
      </p>
      <div className="callout callout-warning" style={{ marginTop: "24px" }}>
        <strong>Status: draft.</strong> The enterprise API is Stage 4 of the
        roadmap and is not live yet. These pages are the design contract we are
        building against — endpoints, auth, and limits may change before
        launch. The desktop plugin (Motion, Subs, AI) needs none of this and
        never calls these endpoints.
      </div>

      <h2>Sections</h2>
      <ul>
        <li>
          <Link href="/docs/api" style={{ textDecoration: "underline" }}>
            API reference
          </Link>{" "}
          — endpoints, authentication, rate limits, and example
          requests/responses.
        </li>
        <li>
          <Link href="/docs/mcp" style={{ textDecoration: "underline" }}>
            MCP &amp; Composio setup
          </Link>{" "}
          — connect Hermite as a tool for Cursor or a custom agent.
        </li>
      </ul>

      <h2>The two product lines, briefly</h2>
      <p>
        Hermite&apos;s desktop product (Motion, Subs, AI) runs fully on-device
        — media never leaves the editor&apos;s machine. The enterprise API is
        the deliberate exception: hosted processing for teams who want to call
        curve generation, transcription, and caption cleanup from their own
        pipelines and agents. If you&apos;re an editor, you want the{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          plugin
        </Link>
        ; if you&apos;re building tooling, you&apos;re in the right place.
      </p>
    </>
  );
}
