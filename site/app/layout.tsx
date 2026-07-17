import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hermite — Smooth Animation for DaVinci Resolve",
    template: "%s — Hermite",
  },
  description:
    "After Effects–style animation control for DaVinci Resolve: one-click motion presets, a bezier easing curve editor, speed-ramp tools, fully on-device auto-subtitling, and a swappable local AI layer.",
};

// Runs before paint so the correct theme is applied with no flash of the
// wrong colours. Honours ?theme=, then a saved choice, then the OS setting.
const themeScript = `(function(){try{var k='hermite-theme';var q=new URLSearchParams(location.search).get('theme');var t=(q==='dark'||q==='light')?q:localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
