/**
 * Site-wide settings. Change values here, not in the pages.
 */
/** The hub. Vercel serves it on www (the bare domain redirects there). */
export const HUB_URL = "https://www.hermitelabs.com";
export const FLOW_URL = "https://flow.hermitelabs.com";
export const CUT_URL = "https://cut.hermitelabs.com";

export const CUT_REPO = "https://github.com/gafaraleshe/HermiteCut";
/** "Download" always points at the latest GitHub Release. */
export const CUT_DOWNLOAD = `${CUT_REPO}/releases/latest`;
/** Direct downloads of the latest release's installers. */
export const CUT_DOWNLOAD_WIN = `${CUT_DOWNLOAD}/download/HermiteCut-Windows-Setup.exe`;
export const CUT_DOWNLOAD_MAC = `${CUT_DOWNLOAD}/download/HermiteCut-Mac-arm64.dmg`;
export const CUT_DOWNLOAD_MAC_INTEL = `${CUT_DOWNLOAD}/download/HermiteCut-Mac-x64.dmg`;
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
/** Buying is on once the checkout link is set. */
export const CHECKOUT_LIVE = Boolean(POLAR_CHECKOUT_URL);
/**
 * HermiteCut's one-time price by region (the owner's pricing, Nov 2026):
 * £30 in the UK and elsewhere, $50 in the US. Override in Vercel with
 * NEXT_PUBLIC_CUT_PRICE_GBP / NEXT_PUBLIC_CUT_PRICE_USD.
 */
export const CUT_PRICE_GBP = process.env.NEXT_PUBLIC_CUT_PRICE_GBP || "£30";
export const CUT_PRICE_USD = process.env.NEXT_PUBLIC_CUT_PRICE_USD || "$50";
/** Optional second Polar link for US buyers; the main link is used if empty. */
export const POLAR_CHECKOUT_URL_USD = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL_USD || "";
/** Kept for older pages: the UK price, shown only once checkout is live. */
export const CUT_PRICE = POLAR_CHECKOUT_URL ? CUT_PRICE_GBP : "";

export const COMPANY = {
  name: "Gaffy Studios Ltd",
  brand: "Hermite Labs",
  // TODO(owner): registered office address and company number for the legal pages.
  address: "",
  companyNumber: "",
  email: "", // TODO(owner): a support / legal contact address
};

export const CREDIT = { label: "Made by Gafar · Gaffy Studios", href: "https://gaffystudios.com/" };
