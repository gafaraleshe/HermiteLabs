import Link from "next/link";

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container docs-shell">
      <nav className="docs-nav" aria-label="Docs">
        <Link href="/docs">Overview</Link>
        <div className="group">
          <p className="label-upper" style={{ padding: "6px 10px" }}>
            Enterprise API
          </p>
          <Link href="/docs/api">API reference</Link>
        </div>
        <div className="group">
          <p className="label-upper" style={{ padding: "6px 10px" }}>
            Agents
          </p>
          <Link href="/docs/mcp">MCP &amp; Composio setup</Link>
        </div>
      </nav>
      <article className="docs-body">{children}</article>
    </div>
  );
}
