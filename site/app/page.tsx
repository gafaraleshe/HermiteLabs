import type { Metadata } from "next";
import { Announce } from "@/components/announce";
import { LabsNav } from "@/components/labs-nav";
import { SiteFooter } from "@/components/footer";
import { PRODUCTS, PRINCIPLES, type Product } from "@/lib/products";
import { countFor, counts } from "@/lib/cut";
import { cutVersion } from "@/lib/cut-version";
import { CUT_PRICE, CUT_URL, HUB_URL, POLAR_CHECKOUT_URL } from "@/lib/config";
import "./brand.css";

export const metadata: Metadata = {
  title: { absolute: "Hermite Labs — tools for working creators" },
  description:
    "Hermite Labs makes tools for working creators: HermiteCut, effects, transitions, titles and sound for DaVinci Resolve, and HermiteFlow, clients and invoicing for the studio.",
  openGraph: {
    title: "Hermite Labs — tools for working creators",
    description: "HermiteCut for DaVinci Resolve. HermiteFlow for running the studio.",
    url: HUB_URL,
    siteName: "Hermite Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: HUB_URL },
};

/** What a product costs, as the shelf shows it. Only real prices: no placeholders. */
function priceFor(p: Product): string {
  if (p.id === "cut") return POLAR_CHECKOUT_URL && CUT_PRICE ? CUT_PRICE : "Free download";
  return "Web app";
}

/** A small, drawn picture of each product (no stock imagery). */
function ProductArt({ id }: { id: Product["id"] }) {
  if (id === "cut") {
    return (
      <div className="art art-cut" aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => <i key={i} style={{ animationDelay: `${((i % 8) + Math.floor(i / 8)) * 90}ms` }} />)}
      </div>
    );
  }
  return (
    <div className="art art-flow" aria-hidden="true">
      <div className="inv">
        <b>Invoice</b>
        <span /><span /><span className="short" />
        <em>Paid</em>
      </div>
    </div>
  );
}

export default function Home() {
  const version = cutVersion();
  const collection = [
    { name: "Effects", n: countFor("effects"), href: `${CUT_URL}/#effects`, note: "Flashes, shakes, blurs, glitch, film" },
    { name: "Transitions", n: countFor("transitions"), href: `${CUT_URL}/#transitions`, note: "Whips, spins, light, shutters" },
    { name: "Grid Reveal", n: countFor("grid"), href: `${CUT_URL}/#grid-reveal`, note: "The cell-by-cell reveal, 11 looks" },
    { name: "Titles", n: countFor("titles"), href: `${CUT_URL}/#titles`, note: "Credits, neon, cinematic, social" },
    { name: "Time FX", n: countFor("timefx"), href: `${CUT_URL}/#templates`, note: "Slow shutter, echo, prism, stutter" },
    { name: "Sound effects", n: counts.sounds, href: `${CUT_URL}/#sound`, note: "Whooshes, risers, impacts, glitches" },
  ];
  return (
    // No data-product: the parent carries no accent, by rule.
    <div className="hermite store">
      <a className="skip-link" href="#main">Skip to content</a>
      <Announce />
      <LabsNav />
      <main id="main">
        <section className="store-hero">
          <div className="h-grid-overlay" aria-hidden="true" />
          <div className="h-wrap h-rise store-hero-in">
            <span className="h-label">Hermite Labs · by Gaffy Studios</span>
            <h1 className="store-title">Tools for <em>working</em> creators.</h1>
            <p className="h-body store-sub">
              Effects, transitions, titles and sound for DaVinci Resolve, and the clients and invoices for the studio
              around the edit. Made to be used every day.
            </p>
            <div className="h-row">
              <a className="h-btn h-btn--solid" href="#shop">Shop the tools</a>
              <a className="h-btn" href={CUT_URL}>HermiteCut{version ? ` ${version}` : ""} →</a>
            </div>
          </div>
        </section>

        <section id="shop" className="store-sec">
          <div className="h-wrap">
            <div className="store-head">
              <h2 className="h-h2">The tools</h2>
              <span className="h-label">{PRODUCTS.length} products</span>
            </div>
            <div className="shelf">
              {PRODUCTS.map(p => (
                <a key={p.id} className="shelf-card" href={p.href} data-product={p.id} style={{ ["--acc" as string]: p.accent }}>
                  <div className="shelf-media"><ProductArt id={p.id} /></div>
                  <div className="shelf-body">
                    <span className="h-label">{p.category}</span>
                    <h3 className="shelf-name">{p.prefix}<span>{p.suffix}</span></h3>
                    <p className="shelf-line">{p.tagline}</p>
                    <ul className="shelf-points">{p.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
                    <div className="shelf-foot">
                      <span className="shelf-price">{priceFor(p)}</span>
                      <span className="shelf-cta">{p.cta} →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="store-sec" data-product="cut">
          <div className="h-wrap">
            <div className="store-head">
              <h2 className="h-h2">The HermiteCut collection</h2>
              <a className="h-label store-more" href={CUT_URL}>Everything in HermiteCut →</a>
            </div>
            <div className="collection">
              {collection.map(c => (
                <a key={c.name} className="tile" href={c.href}>
                  <span className="tile-n">{c.n}</span>
                  <span className="tile-name">{c.name}</span>
                  <span className="tile-note">{c.note}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="store-sec">
          <div className="h-wrap">
            <ul className="works" aria-label="Works with">
              <li><b>DaVinci Resolve</b><span>20 or newer, free or Studio</span></li>
              <li><b>Windows</b><span>10 and 11, 64-bit</span></li>
              <li><b>macOS</b><span>Apple Silicon and Intel</span></li>
              <li><b>Claude</b><span>Ask it to edit with you</span></li>
            </ul>
            <ul className="assure">
              <li><b>Instant download</b><span>Straight from the release page, for Windows and Mac.</span></li>
              <li><b>Updates in the open</b><span>Every change is in the <a href={`${CUT_URL}/changelog`}>changelog</a>.</span></li>
              <li><b>14-day refunds</b><span>If something you buy doesn&apos;t work for you. <a href={`${HUB_URL}/refunds`}>Refund policy</a>.</span></li>
            </ul>
          </div>
        </section>

        <section className="store-sec">
          <div className="h-wrap">
            <div className="store-head">
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
