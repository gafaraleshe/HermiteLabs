import { Header } from "@/components/header";
import { Footer } from "@/components/site";
import "./cut-theme.css";

/**
 * Chrome for the HermiteCut product pages.
 *
 * `data-product="cut"` sets the accent; `hermite-cut` re-points the Clay
 * tokens at the Hermite ink ramp (see cut-theme.css). Between them the whole
 * product surface inherits the brand system — same grid, type and spacing as
 * the parent site, distinguished by exactly one accent (#FF7A45).
 *
 * Route groups do not affect URLs, so every path here is unchanged:
 * /motion, /subs, /ai, /enterprise, /roadmap, /docs and /cut.
 *
 * These pages are ready to move to cut.hermitelabs.com as-is.
 */
export default function ResolveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hermite-cut" data-product="cut">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
