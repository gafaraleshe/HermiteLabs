import type { Metadata } from "next";
import Link from "next/link";
import { HermiteMark } from "@/components/hermite-mark";
import { LabsNav } from "@/components/labs-nav";
import { PRODUCTS, VISIBLE_PRODUCTS, PRINCIPLES } from "@/lib/products";
import "./brand.css";

export const metadata: Metadata = {
  title: "Hermite Labs — software for creative businesses",
  description:
    "Hermite Labs builds software for creative businesses. HermiteFlow is available now, with additional products in development.",
  openGraph: {
    title: "Hermite Labs — software for creative businesses",
    description:
      "Software for creative businesses. HermiteFlow is available now, with additional products in development.",
    url: "https://hermitelabs.com",
    siteName: "Hermite Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://hermitelabs.com" },
};

export default function Home() {
  const live = PRODUCTS.filter(p => p.status === "Live").length;
  const building = PRODUCTS.filter(p => p.status === "In development").length;

  return (
    <div className="hermite">
      <LabsNav />

      <main>
        {/* ── Hero ── */}
        <section className="h-hero">
          <div className="h-grid-overlay" aria-hidden />
          <div className="h-wrap h-rise" style={{ position: "relative" }}>
            <span className="h-label">Hermite Labs — by Gaffy Studios</span>
            <h1 className="h-display" style={{ maxWidth: "16ch" }}>
              The parent is quiet. <em>The products do the work.</em>
            </h1>
            <p className="h-body">
              Hermite Labs builds focused software for creative businesses. The
              suite starts with HermiteFlow for client management and invoicing,
              with additional products developed in the open.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--solid" href="https://flow.hermitelabs.com">
                Open HermiteFlow
              </a>
              <a className="h-btn" href="#products">
                Explore the suite
              </a>
            </div>

            <div
              style={{
                display: "flex",
                gap: "28px",
                flexWrap: "wrap",
                marginTop: "44px",
              }}
            >
              <div>
                <span className="h-label">Available now</span>
                <div className="h-stat">{live}</div>
              </div>
              <div>
                <span className="h-label">In development</span>
                <div className="h-stat">{building}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 01 The suite ── */}
        <section id="products">
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">01</span>
              <h2 className="h-h2">The suite</h2>
            </div>
            <p className="h-body" style={{ marginBottom: "32px" }}>
              What is available or actively being built is shown here. Planned
              concepts stay off the primary product surface until they have a
              real destination.
            </p>

            <div className="h-grid h-grid--suite">
              {VISIBLE_PRODUCTS.map(p => {
                const inner = (
                  <>
                    <span className="h-badge" style={{ alignSelf: "flex-start" }}>
                      <span
                        className="h-dot"
                        style={{
                          background: p.accent ?? "var(--ink-500)",
                          boxShadow: p.accent ? `0 0 10px ${p.accent}` : undefined,
                        }}
                      />
                      {p.status}
                    </span>
                    <h3 className="h-prod-name">
                      {p.prefix}
                      <span style={{ color: p.accent ?? "var(--ink-600)" }}>
                        {p.suffix}
                      </span>
                    </h3>
                    <span className="h-label">{p.category}</span>
                    <p
                      className="h-body"
                      style={{ fontSize: "13px", margin: "12px 0 16px", flex: 1 }}
                    >
                      {p.blurb}
                    </p>
                    {p.domain && <code className="h-domain">{p.domain}</code>}
                  </>
                );

                const tint = p.accent
                  ? ({ ["--tint" as string]: p.accent } as React.CSSProperties)
                  : undefined;

                if (p.external) {
                  return (
                    <a
                      key={p.suffix}
                      className="h-cell"
                      data-tint=""
                      style={tint}
                      href={p.href}
                    >
                      {inner}
                    </a>
                  );
                }
                return (
                  <Link
                    key={p.suffix}
                    className="h-cell"
                    data-tint=""
                    style={tint}
                    href={p.href}
                  >
                    {inner}
                  </Link>
                );
              })}
              {VISIBLE_PRODUCTS.length % 4 !== 0 && (
                <div className="h-cell h-cell-empty" aria-hidden />
              )}
            </div>
          </div>
        </section>

        {/* ── 02 How we build ── */}
        <section>
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">02</span>
              <h2 className="h-h2">How we build</h2>
            </div>
            {PRINCIPLES.map(p => (
              <div className="h-feat" key={p.n}>
                <span className="h-feat-n">{p.n}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p className="h-body" style={{ fontSize: "13px" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 Closing ── */}
        <section>
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">03</span>
              <h2 className="h-h2">Start where it helps most</h2>
            </div>
            <p className="h-body">
              HermiteFlow is available now. HermiteCut is in development and is
              presented separately until its product surface is ready.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--solid" href="https://flow.hermitelabs.com">
                Open HermiteFlow
              </a>
              <Link className="h-btn" href="/cut">
                Follow HermiteCut
              </Link>
              <Link className="h-btn h-btn--ghost" href="/roadmap">
                Roadmap
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="labs-footer">
        <div className="h-wrap">
          <div className="labs-footer-grid">
            <div>
              <span className="labs-wordmark" style={{ fontSize: "17px" }}>
                <HermiteMark size={20} />
                Hermite<span>&nbsp;Labs</span>
              </span>
              <p
                className="h-body"
                style={{ fontSize: "12.5px", marginTop: "14px", maxWidth: "34ch" }}
              >
                Software for creative businesses. Built by Gaffy Studios.
              </p>
            </div>

            <div>
              <span className="h-label h-label--on">Products</span>
              <ul className="labs-footer-list">
                {VISIBLE_PRODUCTS.map(p => (
                  <li key={p.suffix}>
                    {p.external ? (
                      <a href={p.href}>
                        {p.prefix}
                        {p.suffix}
                      </a>
                    ) : (
                      <Link href={p.href}>
                        {p.prefix}
                        {p.suffix}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="h-label h-label--on">Company</span>
              <ul className="labs-footer-list">
                <li>
                  <Link href="/roadmap">Roadmap</Link>
                </li>
                <li>
                  <Link href="/docs">Docs</Link>
                </li>
                <li>
                  <a href="https://github.com/gafaraleshe/hermite">GitHub</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="labs-footer-base">
            <span className="h-label">
              © {new Date().getFullYear()} Hermite Labs
            </span>
            <span className="h-label">hermitelabs.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
