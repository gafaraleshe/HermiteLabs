/**
 * The Hermite Labs product suite — the single source of truth for the parent
 * site's navigation, products index, and footer.
 */

export type ProductStatus = "Live" | "In development" | "Planned";

export type Product = {
  prefix: "Hermite";
  suffix: string;
  category: string;
  domain: string;
  href: string;
  external?: boolean;
  blurb: string;
  status: ProductStatus;
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
      "CRM and invoicing for creative businesses. Manage clients, create invoices, generate documents and send them from one workspace.",
    status: "Live",
    accent: "var(--flow)",
  },
  {
    prefix: "Hermite",
    suffix: "Cut",
    category: "DaVinci Resolve",
    domain: "",
    href: "/cut",
    blurb:
      "Motion and editing tooling for DaVinci Resolve, currently in development.",
    status: "In development",
    accent: "var(--cut)",
  },
  {
    prefix: "Hermite",
    suffix: "Mind",
    category: "AI tools",
    domain: "",
    href: "#products",
    blurb: "Planned local AI tooling across the Hermite suite.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Auth",
    category: "Authentication",
    domain: "",
    href: "#products",
    blurb: "Planned shared authentication across Hermite products.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Cloud",
    category: "Cloud services",
    domain: "",
    href: "#products",
    blurb: "Planned storage and hosting services for creative workflows.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Finance",
    category: "Smart budgeting",
    domain: "",
    href: "#products",
    blurb: "Planned budgeting and cashflow tooling for creative businesses.",
    status: "Planned",
    accent: null,
  },
  {
    prefix: "Hermite",
    suffix: "Analytics",
    category: "Business intelligence",
    domain: "",
    href: "#products",
    blurb: "Planned product and revenue analytics for studios.",
    status: "Planned",
    accent: null,
  },
];

/** Products with a real destination — used for navigation. */
export const NAV_PRODUCTS = PRODUCTS.filter(p => p.href !== "#products");

/** Products worth showing on the primary suite surface right now. */
export const VISIBLE_PRODUCTS = PRODUCTS.filter(
  p => p.status === "Live" || p.status === "In development",
);

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
