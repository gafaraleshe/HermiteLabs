import { StudioFooter, StudioHeader } from "@/components/studio/chrome";
import { RegionProvider } from "@/components/studio/pricing";
import "../studio.css";
import "../brand.css";
import "./legal.css";

/** Terms, privacy, refunds and the EULA, in the studio chrome shared by every Hermite Labs site. */
export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RegionProvider>
      <div className="studio">
        <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-studio-accent focus:text-white" href="#main">Skip to content</a>
        <StudioHeader current="hub" />
        <div className="hermite legal-wrap">{children}</div>
        <StudioFooter />
      </div>
    </RegionProvider>
  );
}
