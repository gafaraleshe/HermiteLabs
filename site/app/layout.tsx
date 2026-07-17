import type { Metadata } from "next";
import { Nav, Footer } from "@/components/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hermite — Smooth Animation for DaVinci Resolve",
    template: "%s — Hermite",
  },
  description:
    "After Effects–style animation control for DaVinci Resolve: one-click motion presets, a bezier easing curve editor, speed-ramp tools, fully on-device auto-subtitling, and a swappable local AI layer.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
