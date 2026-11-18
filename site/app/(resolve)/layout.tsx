import { StatusBar, StudioFooter, StudioHeader } from "@/components/studio/chrome";
import { RegionProvider } from "@/components/studio/pricing";
import { cutVersion } from "@/lib/cut-version";
import "../studio.css";

/**
 * Chrome for HermiteCut's site (cut.hermitelabs.com): the studio design shared
 * with hermitelabs.com. See middleware.ts for the host routing.
 */
export default function CutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RegionProvider>
      <div className="studio" data-product="cut">
        <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-studio-accent focus:text-white" href="#main">Skip to content</a>
        <StatusBar version={cutVersion()} />
        <StudioHeader current="cut" />
        {children}
        <StudioFooter />
      </div>
    </RegionProvider>
  );
}
