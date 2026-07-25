/**
 * The Hermite Labs product suite — the single source of truth for the parent
 * site's navigation, products index, and footer.
 *
 * Naming follows the brand system: "Hermite" + one short concrete noun, joined,
 * with no space. HermiteFlow, not "Hermite Flow".
 *
 * `accent` is set ONLY for products the brand system has allocated a colour to
 * — flow (#3ADCC8), cut (#FF7A45), mind (#9B8AFB). Everything else stays
 * monochrome. Do not invent an accent for an unallocated product; allocate it
 * in the brand system first.
 */

export type ProductStatus = "Live" | "In development" | "Planned";

export type Product = {
  /** Wordmark split so the product half can take the accent. */
  prefix: "Hermite";
  suffix: string;
  category: string;
  domain: string;
  href: string;
  external?: boolean;
  blurb: string;
  status: ProductStatus;
  /** Allocated accent, or null for monochrome. */
  accent: string | null;
};

export const PRODUCTS: Product[] = [
  {
    prefix: "Hermite",
    suffix: "Flow",
    category: "CRM + invoicing",
    domain: "flow.hermitelabs.com",
    href: "https://flow.hermitelabs.com",
    external: true,
    blurb:
      "Bookings to paid invoices, on autopilot. A CRM and billing engine for creative studios, built on a versioned public API.",
    status: "Live",
    accent: "var(--flow)",
  },
  {
    prefix: "Hermite",
    suffix: "Cut",
    category: "DaVinci Resolve",
    domain: "cut.hermitelabs.com",
    href: "/cut",
    blurb:
      "After Effects-style motion control inside Resolve — presets, a real easing curve editor, speed ramps — plus on-device subtitling.",
    status: "In development",
    accent: "var(--cut)",
  },
  {
    prefix: "Hermite",
    suffix: "Mind",
    category: "AI tools",
    domain: "mind.hermitelabs.com",
    href: "/ai",
    blurb:
      "A swappable local AI layer across the suite. You pick the models, you see what is installed, and nothing is uploaded.",
    status: "Planned",
    accent: "var(--mind)",
  },
  {
    prefix: "Hermite",
    suffix: "Auth",
    category: "Authentication",
    domain: "auth.hermitelabs.com",
    href: "#products",
    blurb: "One sign-in across every Hermite Labs product. SSO-ready.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Cloud",
    category: "Cloud services",
    domain: "cloud.hermitelabs.com",
    href: "#products",
    blurb: "Storage, delivery and hosting for your files, galleries and sites.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Finance",
    category: "Smart budgeting",
    domain: "finance.hermitelabs.com",
    href: "#products",
    blurb:
      "Budgeting and cashflow built for an irregular creative income, not a salary.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Analytics",
    category: "Business intelligence",
    domain: "analytics.hermitelabs.com",
    href: "#products",
    blurb: "Product and revenue analytics — a PostHog for your studio.",
    status: "Planned",
    accent: null,
  },
];

/** Products with somewhere real to go — used for the nav menu. */
export const NAV_PRODUCTS = PRODUCTS.filter(p => p.href !== "#products");

export const PRINCIPLES = [
  {
    n: "01",
    title: "One system, many surfaces",
    body: "Every product inherits the same grid, type and spacing, and is distinguished by exactly one accent. The parent stays monochrome — colour is a product-level privilege.",
  },
  {
    n: "02",
    title: "On-device wherever it can be",
    body: "Transcription and AI assistance run locally. Cloud features are optional, opt-in, and labelled as such rather than assumed.",
  },
  {
    n: "03",
    title: "An API before a dashboard",
    body: "Surfaces are built on the same public, versioned APIs you get — key-scoped, rate-limited and documented, rather than bolted on afterwards.",
  },
  {
    n: "04",
    title: "Built in the open",
    body: "The roadmap, the changelog and most of the source are public. Progress is visible while it is still in progress.",
  },
];
