import type { Metadata } from "next";
import Link from "next/link";
import { HermiteMark } from "@/components/hermite-mark";
import { LabsNav } from "@/components/labs-nav";
import { VISIBLE_PRODUCTS } from "@/lib/products";
import "./brand.css";

export const metadata: Metadata = {
  title: "HermiteFlow — Hermite Labs",
  description:
    "HermiteFlow is a CRM and invoicing platform for creative businesses. Manage clients, invoices, UK VAT, documents, email delivery, payment status and reminders in one workspace.",
  openGraph: {
    title: "HermiteFlow — Hermite Labs",
    description: "CRM and invoicing, built for creative businesses.",
    url: "https://hermitelabs.com",
    siteName: "Hermite Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://hermitelabs.com" },
};

const FLOW_FEATURES = [
  ["01", "Client management", "Keep client details organised and close to the work that depends on them."],
  ["02", "Invoicing", "Create professional invoices without moving between separate tools or spreadsheets."],
  ["03", "UK VAT", "Handle VAT-aware invoicing with the fields and calculations your UK business needs."],
  ["04", "PDF + email delivery", "Generate invoice documents and send them directly to clients from your workspace."],
  ["05", "Payment tracking + reminders", "See invoice status at a glance and keep follow-ups from getting lost."],
];

export default function Home() {
  const cut = VISIBLE_PRODUCTS.find(p => p.suffix === "Cut");

  return (
    <div className="hermite">
      <LabsNav />

      <main>
        <section className="h-hero">
          <div className="h-grid-overlay" aria-hidden="true" />
          <div className="h-wrap h-rise" style={{ position: "relative", zIndex: 1 }}>
            <span className="h-label h-label--flow">Hermite Labs / Flagship product</span>
            <h1 className="h-display" style={{ maxWidth: "12ch" }}>
              Hermite<span style={{ color: "var(--flow)" }}>Flow</span><span style={{ color: "var(--flow)" }}>.</span>
            </h1>
            <p className="h-hero-lead">CRM and invoicing, built for creative businesses.</p>
            <p className="h-body">
              Manage clients, create invoices, handle UK VAT, generate PDFs,
              send invoices by email, track payment status and keep reminders
              in one focused workspace.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--flow" href="https://flow.hermitelabs.com">
                Open HermiteFlow <span aria-hidden="true">→</span>
              </a>
              <a className="h-btn" href="#flow-features">See what it does</a>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "34px" }} aria-label="HermiteFlow capabilities">
              {["CLIENTS", "INVOICING", "UK VAT", "PDF + EMAIL", "REMINDERS"].map(item => (
                <span key={item} className="h-label" style={{ border: "1px solid rgba(58,220,200,.28)", color: "var(--flow)", padding: "7px 9px" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="flow-features">
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num h-sec-num--flow">01</span>
              <h2 className="h-h2">Everything between client and paid</h2>
            </div>
            <p className="h-body" style={{ marginBottom: "32px" }}>
              HermiteFlow keeps the operational side of a creative business in
              one place, so the process from client record to paid invoice is
              easier to follow and easier to manage.
            </p>
            {FLOW_FEATURES.map(([n, title, body]) => (
              <div className="h-feat" key={n}>
                <span className="h-feat-n" style={{ color: "var(--flow)" }}>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p className="h-body" style={{ fontSize: "13px" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">02</span>
              <h2 className="h-h2">Built around creative work</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "48px" }}>
              <div>
                <span className="h-label h-label--flow">The idea</span>
                <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1, letterSpacing: "-0.03em", marginTop: "16px", maxWidth: "18ch" }}>
                  Your creative work is the product. The admin should stay out of the way.
                </h3>
              </div>
              <p className="h-body">
                HermiteFlow is deliberately focused. It gives freelancers,
                studios and creative businesses a clear place to manage the
                client and invoicing work that surrounds every project —
                without turning the workspace into another complicated business
                system.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">03</span>
              <h2 className="h-h2">Hermite Labs</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "48px", alignItems: "start" }}>
              <p className="h-body">
                Hermite Labs is the studio behind HermiteFlow — building
                focused software for the practical side of creative work.
                HermiteFlow is the product that is ready today.
              </p>
              {cut && (
                <div className="h-cell" style={{ borderTop: "2px solid var(--cut)" }}>
                  <span className="h-label" style={{ color: "var(--cut)" }}>Next up / In development</span>
                  <h3 className="h-prod-name">Hermite<span style={{ color: "var(--cut)" }}>Cut</span></h3>
                  <p className="h-body" style={{ fontSize: "13px", margin: "12px 0 18px" }}>{cut.blurb}</p>
                  <Link className="h-btn" href="/cut">Follow HermiteCut <span aria-hidden="true">→</span></Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="h-wrap">
            <span className="h-label h-label--flow">Start with Flow</span>
            <h2 className="h-display" style={{ fontSize: "clamp(42px, 7vw, 82px)", maxWidth: "15ch" }}>
              Get back to the work.
            </h2>
            <p className="h-body">
              Open HermiteFlow and keep your clients, invoices and payment
              workflow in one place.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--flow" href="https://flow.hermitelabs.com">
                Open HermiteFlow <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="labs-footer">
        <div className="h-wrap">
          <div className="labs-footer-grid">
            <div>
              <span className="labs-wordmark" style={{ fontSize: "17px" }}>
                <HermiteMark size={20} />
                Hermite<span>&nbsp;Labs</span>
              </span>
              <p className="h-body" style={{ fontSize: "12.5px", marginTop: "14px", maxWidth: "34ch" }}>
                Software for creative businesses. Built by Gaffy Studios.
              </p>
            </div>
            <div>
              <span className="h-label h-label--on">Products</span>
              <ul className="labs-footer-list">
                <li><a href="https://flow.hermitelabs.com">HermiteFlow</a></li>
                <li><Link href="/cut">HermiteCut</Link><span style={{ color: "var(--ink-600)" }}> · in development</span></li>
              </ul>
            </div>
            <div>
              <span className="h-label h-label--on">Explore</span>
              <ul className="labs-footer-list">
                <li><Link href="/roadmap">Roadmap</Link></li>
                <li><Link href="/docs">Docs</Link></li>
                <li><a href="https://github.com/gafaraleshe/hermite">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="labs-footer-base">
            <span className="h-label">© {new Date().getFullYear()} Hermite Labs</span>
            <span className="h-label">hermitelabs.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
