import { HermiteMark } from "@/components/hermite-mark";
import { CUT_DOCS, CUT_DOWNLOAD, CUT_SUPPORT, CUT_URL, HUB_URL, POLAR_CHECKOUT_URL } from "@/lib/config";

/** HermiteCut's top bar: the lockup, a few links, and Download / Buy. */
export function CutNav() {
  return (
    <header className="labs-nav cut-nav">
      <div className="labs-nav-in h-wrap">
        <a href={HUB_URL} className="labs-wordmark" aria-label="Hermite Labs home">
          <HermiteMark size={22} product="cut" title="Hermite Labs" />
          <span className="cut-lockup">Hermite<span>Cut</span></span>
        </a>
        <nav className="labs-links cut-links" aria-label="HermiteCut">
          <a href={`${CUT_URL}/#grid-reveal`}>Grid Reveal</a>
          <a href={`${CUT_URL}/#templates`}>Templates</a>
          <a href={`${CUT_URL}/#sound`}>Sound</a>
          <a href={`${CUT_URL}/#claude`}>Claude</a>
          <a href={CUT_DOCS}>Docs</a>
          <a href={`${CUT_URL}/changelog`}>Changelog</a>
          <a href={CUT_SUPPORT}>Support</a>
        </nav>
        <div className="cut-nav-cta">
          <a className="h-btn cut-btn-ghost" href={CUT_DOWNLOAD}>Download</a>
          {POLAR_CHECKOUT_URL && <a className="h-btn cut-btn" href={POLAR_CHECKOUT_URL}>Buy</a>}
        </div>
      </div>
    </header>
  );
}
