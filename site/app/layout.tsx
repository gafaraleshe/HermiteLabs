import type { Metadata } from "next";
import "./globals.css";

/**
 * Root layout: document shell only.
 *
 * Chrome lives with each surface — the Hermite Labs parent site brings its own
 * (app/page.tsx), and the HermiteCut product pages keep the Clay header and
 * footer via app/(resolve)/layout.tsx.
 */
export const metadata: Metadata = {
  title: {
    default: "Hermite Labs — software for creative businesses",
    template: "%s — Hermite Labs",
  },
  description:
    "Hermite Labs builds the tools that run a modern studio. One system, many surfaces: HermiteFlow for billing, HermiteCut for Resolve, HermiteMind for AI.",
};

// Runs before paint so the correct theme is applied with no flash of the
// wrong colours. Honours ?theme=, then a saved choice, then the OS setting.
const themeScript = `(function(){try{var k='hermite-theme';var q=new URLSearchParams(location.search).get('theme');var t=(q==='dark'||q==='light')?q:localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The brand system specifies Inter and JetBrains Mono; both stacks
            fell through to system-ui on any machine without them installed,
            which is most of them. Loaded at runtime rather than through
            next/font so the build has no network dependency. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
