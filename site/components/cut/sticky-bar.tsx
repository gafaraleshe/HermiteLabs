"use client";

import { useEffect, useState } from "react";
import { CUT_DOWNLOAD, POLAR_CHECKOUT_URL } from "@/lib/config";

/** A slim bar with the download button, shown once the hero has scrolled away. */
export function StickyBar({ watch }: { watch: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(watch);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);
  return (
    <div className={`hc-sticky${show ? " is-on" : ""}`} aria-hidden={!show}>
      <div className="container hc-sticky-inner">
        <span className="hc-sticky-name">
          Hermite<span style={{ color: "var(--accent)" }}>Cut</span>
          <span className="label-upper">Windows & Mac</span>
        </span>
        <span className="hc-sticky-cta">
          <a className={POLAR_CHECKOUT_URL ? "btn btn-secondary" : "btn btn-primary"} href={CUT_DOWNLOAD} tabIndex={show ? 0 : -1}>Download</a>
          {POLAR_CHECKOUT_URL && <a className="btn btn-primary" href={POLAR_CHECKOUT_URL} tabIndex={show ? 0 : -1}>Buy</a>}
        </span>
      </div>
    </div>
  );
}
