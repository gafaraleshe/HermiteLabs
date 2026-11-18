"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CHECKOUT_LIVE, CUT_DOWNLOAD, CUT_PRICE_GBP, CUT_PRICE_USD, POLAR_CHECKOUT_URL, POLAR_CHECKOUT_URL_USD } from "@/lib/config";

/**
 * HermiteCut's price by region (£ for the UK and elsewhere, $ for the US),
 * shared by every price on the page. The region comes from the visitor's own
 * choice, else their time zone and language. Buy buttons go to the real Polar
 * checkout; until a checkout link is set, they offer the free download instead.
 */
export type Region = "UK" | "US";
const KEY = "hc-region";

const Ctx = createContext<{ region: Region; setRegion: (r: Region) => void }>({ region: "UK", setRegion: () => {} });

function detect(): Region {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "UK" || saved === "US") return saved;
  } catch { /* private mode */ }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("America/") || navigator.language === "en-US") return "US";
  } catch { /* old browser */ }
  return "UK";
}

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, set] = useState<Region>("UK");
  useEffect(() => set(detect()), []);
  const setRegion = (r: Region) => {
    set(r);
    try { localStorage.setItem(KEY, r); } catch { /* ignore */ }
  };
  return <Ctx.Provider value={{ region, setRegion }}>{children}</Ctx.Provider>;
}

export function useRegion() {
  return useContext(Ctx);
}

export function priceFor(region: Region) {
  return region === "US" ? CUT_PRICE_USD : CUT_PRICE_GBP;
}

export function checkoutFor(region: Region) {
  return region === "US" && POLAR_CHECKOUT_URL_USD ? POLAR_CHECKOUT_URL_USD : POLAR_CHECKOUT_URL;
}

/** The price for the visitor's region. */
export function Price() {
  const { region } = useRegion();
  return <>{priceFor(region)}</>;
}

/** 🇬🇧 £30 / 🇺🇸 $50 switch. */
export function RegionToggle({ size = "sm", long = false }: { size?: "sm" | "md"; long?: boolean }) {
  const { region, setRegion } = useRegion();
  const pad = size === "md" ? "px-3.5 py-1.5" : "px-2.5 py-1";
  return (
    <div className="inline-flex items-center p-0.5 rounded-full bg-studio-surface border border-studio-border" role="group" aria-label="Currency">
      {(["UK", "US"] as const).map(r => (
        <button
          key={r}
          type="button"
          aria-pressed={region === r}
          onClick={() => setRegion(r)}
          className={`${pad} rounded-full font-mono text-xs font-medium transition-all cursor-pointer ${region === r ? "bg-studio-accent text-white" : "text-studio-muted hover:text-studio-text"}`}
        >
          {r === "UK" ? "🇬🇧" : "🇺🇸"} {long ? `${r} ` : ""}{priceFor(r)}
        </button>
      ))}
    </div>
  );
}

/**
 * The main call to action. With checkout live: "Buy HermiteCut — £30" to
 * Polar. Before that: the free download.
 */
export function BuyButton({ className = "", label = "Buy HermiteCut", short = false }: { className?: string; label?: string; short?: boolean }) {
  const { region } = useRegion();
  if (!CHECKOUT_LIVE) {
    return (
      <a className={className} href={CUT_DOWNLOAD}>
        {short ? "Download" : "Download HermiteCut"}
      </a>
    );
  }
  return (
    <a className={className} href={checkoutFor(region)}>
      {label} — <span className="font-mono">{priceFor(region)}</span>
    </a>
  );
}
