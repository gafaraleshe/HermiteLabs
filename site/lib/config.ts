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
