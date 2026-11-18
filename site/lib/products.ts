/**
 * The Hermite Labs products: the one file that drives the hub
 * (hermitelabs.com), the navigation and the footers.
 *
 * To add a new drop: add an entry here, give it an accent in app/brand.css
 * (`--<id>`), and add its page under app/. Only list products that are live:
 * no placeholders.
 */
import { CUT_URL, FLOW_URL } from "@/lib/config";

export type Product = {
  id: "cut" | "flow";
  prefix: "Hermite";
  suffix: string;
  category: string;
  href: string;
  external: boolean;
  tagline: string;
  blurb: string;
  /** CSS variable holding the product accent. */
  accent: string;
  featured?: boolean;
  points: string[];
  cta: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "cut",
    prefix: "Hermite",
    suffix: "Cut",
    category: "DaVinci Resolve toolkit",
    href: CUT_URL,
    external: true,
    tagline: "Effects, transitions, titles and sound for DaVinci Resolve, in one app.",
    blurb:
      "A Resolve panel and a desktop app for Windows and macOS: 91 templates with Post / Pre timing, Grid Reveal, 81 sound effects, motion, beat markers and captions.",
    accent: "var(--cut)",
    featured: true,
    points: ["91 templates", "Grid Reveal", "81 sound effects", "Works with Claude", "Windows & Mac"],
    cta: "Explore HermiteCut",
  },
  {
    id: "flow",
    prefix: "Hermite",
    suffix: "Flow",
    category: "CRM + invoicing",
    href: FLOW_URL,
    external: true,
    tagline: "CRM and invoicing, built for creative businesses.",
    blurb:
      "Bookings to paid invoices, on autopilot: clients, invoices, UK VAT, PDF and email delivery, payment tracking and reminders in one workspace.",
    accent: "var(--flow)",
    points: ["Clients", "Invoicing", "UK VAT", "Reminders"],
    cta: "Open HermiteFlow",
  },
];

export const PRINCIPLES = [
  {
    n: "01",
    title: "One system, many surfaces",
    body: "Every product shares the same grid, type and spacing, and is told apart by exactly one accent colour. The parent stays monochrome.",
  },
  {
    n: "02",
    title: "On your machine wherever it can be",
    body: "HermiteCut works through Resolve on your computer. Nothing is uploaded and there is no account to make.",
  },
  {
    n: "03",
    title: "Built in the open",
    body: "Source, changelogs and releases are public, so you can see exactly what changed and when.",
  },
];
