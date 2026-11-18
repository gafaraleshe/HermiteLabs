/**
 * Site-wide settings. Change values here, not in the pages.
 */
export const HUB_URL = "https://hermitelabs.com";
export const CUT_URL = "https://cut.hermitelabs.com";

export const CUT_REPO = "https://github.com/gafaraleshe/HermiteCut";
/** "Download" always points at the latest GitHub Release. */
export const CUT_DOWNLOAD = `${CUT_REPO}/releases/latest`;
export const CUT_DOCS = `${CUT_REPO}#readme`;
export const CUT_SUPPORT = `${CUT_REPO}/issues`;

/**
 * ─── CHECKOUT ───────────────────────────────────────────────────────────────
 * The Polar checkout link for HermiteCut. While this is empty, every "Buy"
 * button is hidden and the pages show "Download" only. Paste the link from
 * Polar (Products → HermiteCut → Checkout link), or set
 * NEXT_PUBLIC_POLAR_CHECKOUT_URL in Vercel, then redeploy.
 */
export const POLAR_CHECKOUT_URL = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL || "";
/** Shown on the pricing card and in the hero once checkout is live. */
export const CUT_PRICE = process.env.NEXT_PUBLIC_CUT_PRICE || "";

export const COMPANY = {
  name: "Gaffy Studios Ltd",
  brand: "Hermite Labs",
  // TODO(owner): registered office address and company number for the legal pages.
  address: "",
  companyNumber: "",
  email: "", // TODO(owner): a support / legal contact address
};

export const CREDIT = { label: "Made by Gafar · Gaffy Studios", href: "https://gaffystudios.com/" };
