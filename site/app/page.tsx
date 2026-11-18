import type { Metadata } from "next";
import { LabsNav } from "@/components/labs-nav";
import { SiteFooter } from "@/components/footer";
import { PRODUCTS, PRINCIPLES } from "@/lib/products";
import "./brand.css";

export const metadata: Metadata = {
  title: { absolute: "Hermite Labs — software for creative businesses" },
  description:
    "Hermite Labs makes software for creative businesses: HermiteCut, the editing toolkit for DaVinci Resolve, and HermiteFlow, CRM and invoicing for studios.",
  openGraph: {
    title: "Hermite Labs — software for creative businesses",
    description: "HermiteCut for DaVinci Resolve. HermiteFlow for running the studio.",
    url: "https://hermitelabs.com",
    siteName: "Hermite Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://hermitelabs.com" },
};

export default function Home() {
  const featured = PRODUCTS.find(p => p.featured)!;
  const rest = PRODUCTS.filter(p => !p.featured);
  return (
    // No data-product: the parent carries no accent, by rule.
    <div className="hermite">
      <a className="skip-link" href="#main">Skip to content</a>
      <LabsNav />
      <main id="main">
        <section className="h-hero">
          <div className="h-grid-overlay" aria-hidden="true" />
          <div className="h-wrap h-rise" style={{ position: "relative", zIndex: 1 }}>
            <span className="h-label">Hermite Labs — by Gaffy Studios</span>
            <h1 className="h-display" style={{ maxWidth: "15ch" }}>
              The parent is silent. <em>The products speak in colour.</em>
            </h1>
            <p className="h-body">
              Hermite Labs makes software for creative businesses: tools for the
              edit, and tools for running the studio around it. One design
              language across all of it.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--solid" href={featured.href}>{featured.cta}</a>
              <a className="h-btn" href="#products">All products</a>
            </div>
          </div>
        </section>

        <section id="products">
          <div className="h-wrap">
            <div className="h-sec-head">
              <span className="h-sec-num">01</span>
              <h2 className="h-h2">Products</h2>
            </div>
            <a className="hub-feature" href={featured.href} data-product={featured.id}>
              <div>
                <span className="h-label" style={{ color: featured.accent }}>Featured · {featured.category}</span>
                <h3 className="hub-name">{featured.prefix}<span style={{ color: featured.accent }}>{featured.suffix}</span></h3>
                <p className="hub-tagline">{featured.tagline}</p>
                <p className="h-body">{featured.blurb}</p>
                <span className="hub-cta" style={{ color: featured.accent }}>{featured.cta} →</span>
              </div>
              <ul className="hub-points" aria-label={`${featured.prefix}${featured.suffix} highlights`}>
                {featured.points.map(pt => <li key={pt}>{pt}</li>)}
              </ul>
            </a>
            <div className="hub-list">
              {rest.map(p => (
                <a key={p.id} className="hub-card" href={p.href}>
                  <span className="h-label">{p.category}</span>
                  <h3 className="hub-name sm">{p.prefix}<span style={{ color: p.accent }}>{p.suffix}</span></h3>
                  <p className="h-body">{p.blurb}</p>
                  <span className="hub-cta" style={{ color: p.accent }}>{p.cta} →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

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
                  <p className="h-body" style={{ fontSize: "13px" }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
