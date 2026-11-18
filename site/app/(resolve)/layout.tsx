import { Announce } from "@/components/announce";
import { CutNav } from "@/components/cut/nav";
import { SiteFooter } from "@/components/footer";
import "../brand.css";
import "./cut-theme.css";

/**
 * Chrome for HermiteCut's site (cut.hermitelabs.com). The brand system with
 * HermiteCut's accent (#b9acff); see middleware.ts for the host routing.
 */
export default function CutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hermite hermite-cut" data-product="cut">
      <a className="skip-link" href="#main">Skip to content</a>
      <Announce />
      <CutNav />
      {children}
      <SiteFooter />
    </div>
  );
}
