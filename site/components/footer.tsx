import Link from "next/link";
import { HermiteMark } from "@/components/hermite-mark";
import { PRODUCTS } from "@/lib/products";
import { CREDIT, CUT_DOCS, CUT_REPO, CUT_SUPPORT, CUT_URL } from "@/lib/config";

/** The footer for every page, on both hermitelabs.com and cut.hermitelabs.com. */
export function SiteFooter() {
  return (
    <footer className="labs-footer site-footer">
      <div className="h-wrap">
        <div className="labs-footer-grid">
          <div>
            <a href="https://hermitelabs.com" className="labs-wordmark" style={{ fontSize: "17px" }}>
              <HermiteMark size={20} />
              Hermite<span>&nbsp;Labs</span>
            </a>
            <p className="h-body" style={{ fontSize: "12.5px", marginTop: "14px", maxWidth: "34ch" }}>
              Software for creative businesses.
            </p>
          </div>
          <nav aria-label="Products">
            <span className="h-label h-label--on">Products</span>
            <ul className="labs-footer-list">
              {PRODUCTS.map(p => (
                <li key={p.id}><a href={p.href}>{p.prefix}{p.suffix}</a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="HermiteCut">
            <span className="h-label h-label--on">HermiteCut</span>
            <ul className="labs-footer-list">
              <li><a href={CUT_DOCS}>Docs</a></li>
              <li><a href={`${CUT_URL}/changelog`}>Changelog</a></li>
              <li><a href={CUT_SUPPORT}>Support</a></li>
              <li><a href={CUT_REPO}>GitHub</a></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <span className="h-label h-label--on">Legal</span>
            <ul className="labs-footer-list">
              <li><Link href="/terms">Terms of sale</Link></li>
              <li><Link href="/eula">Licence (EULA)</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/refunds">Refunds</Link></li>
            </ul>
          </nav>
        </div>
        <div className="labs-footer-base">
          <span className="h-label">© {new Date().getFullYear()} Hermite Labs · Gaffy Studios Ltd</span>
          <a className="h-label site-credit" href={CREDIT.href}>{CREDIT.label}</a>
        </div>
      </div>
    </footer>
  );
}
