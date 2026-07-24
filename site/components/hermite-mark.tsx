/**
 * The Hermite mark — an `H` built from two rails and a severed crossbar.
 *
 * The gap is a *cut*: a nod to the editing origin of the company, and shorthand
 * for what every Hermite product does — split a process at the right point and
 * rejoin it cleanly.
 *
 * Geometry is fixed on a 48x48 grid and must not be redrawn. The accent applies
 * to the right crossbar segment only, and only on product surfaces.
 */
export type HermiteProduct = "flow" | "cut" | "mind";

const ACCENT: Record<HermiteProduct, string> = {
  flow: "var(--flow)",
  cut: "var(--cut)",
  mind: "var(--mind)",
};

export function HermiteMark({
  size = 22,
  product,
  title = "Hermite Labs",
}: {
  size?: number;
  /** Omit for the parent brand — hermitelabs.com is monochrome by rule. */
  product?: HermiteProduct;
  title?: string;
}) {
  const fg = "currentColor";
  const accent = product ? ACCENT[product] : fg;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      style={{ flexShrink: 0 }}
    >
      <rect x="8" y="7" width="6" height="34" rx="3" fill={fg} />
      <rect x="34" y="7" width="6" height="34" rx="3" fill={fg} />
      <rect x="8" y="21" width="12" height="6" rx="3" fill={fg} />
      <rect x="28" y="21" width="12" height="6" rx="3" fill={accent} />
    </svg>
  );
}
