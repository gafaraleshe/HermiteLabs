import type { Metadata } from "next";
import Link from "next/link";
import { HermiteMark } from "@/components/hermite-mark";
import "./brand.css";

export const metadata: Metadata = {
  title: "Hermite Labs — software for creative businesses",
  description:
    "Hermite Labs builds the tools that run a modern studio. One system, many surfaces: HermiteFlow for billing, HermiteCut for Resolve, HermiteMind for AI.",
};

type Product = {
  name: string;
  suffix: string;
  category: string;
  domain: string;
  href: string;
  external?: boolean;
  blurb: string;
  status: "Live" | "In development" | "Planned";
  /** Only accents allocated in the brand system. Never invent a new one. */
  tint: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Hermite",
    suffix: "Flow",
    category: "Billing & invoicing",
    domain: "flow.hermitelabs.com",
    href: "https://flow.hermitelabs.com",
    external: true,
    blurb:
      "Turn bookings into paid invoices automatically. A CRM and billing engine for creative studios, built on a versioned public API.",
    status: "Live",
    tint: "var(--flow)",
  },
  {
    name: "Hermite",
    suffix: "Cut",
    category: "DaVinci Resolve",
    domain: "cut.hermitelabs.com",
    href: "/cut",
    blurb:
      "After Effects–style motion control inside Resolve — presets, a real easing curve editor, speed ramps — plus on-device subtitling.",
    status: "In development",
    tint: "var(--cut)",
  },
  {
    name: "Hermite",
    suffix: "Mind",
    category: "AI",
    domain: "mind.hermitelabs.com",
    href: "/ai",
    blurb:
      "A swappable local AI layer across the suite. You pick the models, you see what is installed, and nothing is uploaded.",
    status: "Planned",
    tint: "var(--mind)",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "One system, many surfaces",
    body: "Every product inherits the same grid, type, and spacing, and is distinguished by exactly one accent. The parent is monochrome; colour is a product-level privilege.",
  },
  {
    n: "02",
    title: "On-device wherever it can be",
    body: "Transcription and AI assistance run locally. Cloud features are optional, opt-in, and labelled as such.",
  },
  {
    n: "03",
    title: "An API before a dashboard",
    body: "Surfaces are built on the same public, versioned APIs you get — key-scoped and documented, rather than bolted on afterwards.",
  },
  {
    n: "04",
    title: "Built in the open",
    body: "The roadmap, the changelog, and most of the source are public. Progress is visible while it is still in progress.",
  },
];

export default function Home() {
  return (
    // No data-product: the parent site carries no accent, by rule.
    <div className="hermite">
      {/* ── Nav ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,9,10,.82)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div
          className="h-wrap"
          style={{
            height: "58px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "11px",
              textDecoration: "none",
              color: "var(--paper)",
              fontWeight: 600,
              fontSize: "19px",
              letterSpacing: "-0.035em",
            }}
          >
            <HermiteMark size={22} />
            Hermite
            <span style={{ color: "var(--ink-600)", fontWeight: 500, marginLeft: "-6px" }}>
              {" "}
              Labs
            </span>
          </Link>
          <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a className="h-label" href="#products">
              Products
            </a>
            <Link className="h-label" href="/roadmap">
              Roadmap
            </Link>
            <Link className="h-label" href="/docs">
              Docs
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="h-hero">
          <div className="h-grid-overlay" aria-hidden />
          <div className="h-wrap h-rise" style={{ position: "relative" }}>
            <span className="h-label">Hermite Labs — by Gaffy Studios</span>
            <h1 className="h-display" style={{ maxWidth: "16ch" }}>
              The parent is silent.{" "}
              <em>The products speak in color.</em>
            </h1>
            <p className="h-body">
              Hermite Labs builds the tools that run a modern studio — billing,
              editing, and an AI layer that stays on your machine. One design
              language across all of it, so moving between products never feels
              like moving between companies.
            </p>
            <div className="h-row">
              <a
                className="h-btn h-btn--solid"
                href="https://flow.hermitelabs.com"
              >
                Start with HermiteFlow
              </a>
              <a className="h-btn" href="#products">
                Explore the suite
              </a>
            </div>
          </div>
        </section>

        {/* ── 01 Products ── */}
        <section id="products">
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">01</span>
              <h2 className="h-h2">The suite</h2>
            </div>
            <p className="h-body" style={{ marginBottom: "32px" }}>
              Each product stands on its own. Together they share an account, an
              API surface, and a design system.
            </p>

            <div className="h-grid">
              {PRODUCTS.map(p => {
                const inner = (
                  <>
                    <span
                      className="h-badge"
                      style={{ alignSelf: "flex-start" }}
                    >
                      <span
                        className="h-dot"
                        style={{ ["--tint" as string]: p.tint }}
                      />
                      {p.status}
                    </span>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        margin: "14px 0 4px",
                        color: "var(--ink-900)",
                      }}
                    >
                      {p.name}
                      <span style={{ color: p.tint }}>{p.suffix}</span>
                    </h3>
                    <span className="h-label">{p.category}</span>
                    <p
                      className="h-body"
                      style={{ fontSize: "13px", margin: "12px 0 16px", flex: 1 }}
                    >
                      {p.blurb}
                    </p>
                    <code
                      style={{
                        fontFamily: "var(--mono-brand)",
                        fontSize: "11px",
                        color: "var(--ink-600)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {p.domain}
                    </code>
                  </>
                );

                return p.external ? (
                  <a
                    key={p.suffix}
                    className="h-cell"
                    data-tint=""
                    style={{ ["--tint" as string]: p.tint }}
                    href={p.href}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={p.suffix}
                    className="h-cell"
                    data-tint=""
                    style={{ ["--tint" as string]: p.tint }}
                    href={p.href}
                  >
                    {inner}
                  </Link>
                );
              })}
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
            <div>
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
              HermiteFlow is live today. HermiteCut is in active development and
              you can follow it as it is built.
            </p>
            <div className="h-row">
              <a
                className="h-btn h-btn--solid"
                href="https://flow.hermitelabs.com"
              >
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

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid var(--hairline)",
            padding: "34px 0 60px",
          }}
        >
          <div
            className="h-wrap"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "11px",
                color: "var(--ink-600)",
              }}
            >
              <HermiteMark size={18} />
              <span className="h-label">
                Hermite Labs — software for creative businesses
              </span>
            </span>
            <span className="h-label">Gaffy Studios</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
