import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP & Composio setup",
  description:
    "Connect Hermite as a tool for Cursor or a custom agent via MCP and Composio.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="code-block">
      <code>{children}</code>
    </pre>
  );
}

export default function McpGuide() {
  return (
    <>
      <h1>MCP &amp; Composio setup</h1>
      <p style={{ marginTop: "16px" }}>
        Hermite&apos;s enterprise API registers as a{" "}
        <strong>Composio toolkit</strong>, which means any MCP-compatible agent
        — Cursor, or something you build — can call Hermite&apos;s
        capabilities as ordinary tool calls: generate an easing curve,
        transcribe a file, clean up captions.
      </p>
      <div className="callout callout-warning" style={{ margin: "24px 0" }}>
        <strong>Preview.</strong> This guide describes the integration as
        designed; it becomes usable when Stage 4 ships. The tool names and
        flows below are the contract we&apos;re building against.
      </div>

      <h2 id="how">How it fits together</h2>
      <p>
        Model Context Protocol (MCP) is the open standard agents use to
        discover and call external tools. Rather than hand-building and
        hosting our own MCP server, Hermite registers its API as a toolkit on
        Composio, which handles auth, tool discovery, and execution for
        MCP clients. You authenticate once with your Hermite API key; your
        agent sees a set of <code className="inline">HERMITE_*</code> tools.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Wraps</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code className="inline">HERMITE_GENERATE_CURVE</code>
            </td>
            <td>POST /v1/curves/generate</td>
          </tr>
          <tr>
            <td>
              <code className="inline">HERMITE_APPLY_PRESET</code>
            </td>
            <td>POST /v1/presets/apply</td>
          </tr>
          <tr>
            <td>
              <code className="inline">HERMITE_TRANSCRIBE</code>
            </td>
            <td>POST /v1/transcribe</td>
          </tr>
          <tr>
            <td>
              <code className="inline">HERMITE_CLEANUP_CAPTIONS</code>
            </td>
            <td>POST /v1/captions/cleanup</td>
          </tr>
        </tbody>
      </table>

      <h2 id="http">HTTP MCP endpoint</h2>
      <p>
        Any client that speaks MCP over HTTP connects to Composio&apos;s
        endpoint directly:
      </p>
      <Code>{`https://mcp.composio.dev/hermite?api_key=<your-composio-key>`}</Code>
      <p>
        Add that URL as a custom connector or remote MCP server in your
        client&apos;s settings. It then discovers the four tools automatically.
      </p>

      <h2 id="cursor">Cursor</h2>
      <p>
        In <code className="inline">.cursor/mcp.json</code> at your project
        root (or globally in <code className="inline">~/.cursor/mcp.json</code>):
      </p>
      <Code>{`{
  "mcpServers": {
    "hermite": {
      "url": "https://mcp.composio.dev/hermite?api_key=<your-composio-key>"
    }
  }
}`}</Code>

      <h2 id="custom">Custom agent (Composio SDK)</h2>
      <Code>{`import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const tools = await composio.tools.get("default", {
  toolkits: ["HERMITE"],
});

// Hand the tools array to your LLM call; execute results with:
const result = await composio.tools.execute("HERMITE_GENERATE_CURVE", {
  arguments: { preset: "overshoot", duration_frames: 24 },
});`}</Code>

      <h2 id="prompts">Example agent prompts</h2>
      <ul>
        <li>
          &quot;Transcribe <code className="inline">interview.wav</code> with
          speaker labels, clean up the punctuation, and give me an SRT.&quot;
        </li>
        <li>
          &quot;Generate an overshoot easing curve over 18 frames and apply a
          slide-in-left preset for a 1080p clip.&quot;
        </li>
        <li>
          &quot;Batch-clean the captions in this JSON and flag any segment you
          changed significantly.&quot;
        </li>
      </ul>

      <p style={{ marginTop: "32px" }}>
        Endpoint shapes live in the{" "}
        <Link href="/docs/api" style={{ textDecoration: "underline" }}>
          API reference
        </Link>
        .
      </p>
    </>
  );
}
