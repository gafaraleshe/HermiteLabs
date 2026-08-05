import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/site";
import "./cut-theme.css";

/**
 * Chrome for the HermiteCut product surface — everything served from
 * cut.hermitelabs.com.
 *
 * `data-product="cut"` sets the accent; `hermite-cut` carries the theme (see
 * cut-theme.css): a warm paper canvas by default, the Hermite ink ramp in dark
 * mode, one green accent in both.
 *
 * Route groups do not affect URLs, so these pages live at /cut, /motion,
 * /subs, /ai, /enterprise, /roadmap and /docs. middleware.ts maps the
 * subdomain root onto /cut and hands the apex's copies of those paths over to
 * this host, so the group has exactly one public home.
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://cut.hermitelabs.com"),
  title: {
    default: "HermiteCut — motion and captions for DaVinci Resolve",
    template: "%s — HermiteCut",
  },
  description:
    "After Effects–style motion control inside DaVinci Resolve, plus subtitles transcribed on your own machine. Part of Hermite Labs.",
};

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
