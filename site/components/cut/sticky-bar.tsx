"use client";

import { useEffect, useState } from "react";
import { CUT_DOWNLOAD } from "@/lib/cut";

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
          <span className="label-upper">1.0 · Free · Windows</span>
        </span>
        <a className="btn btn-primary" href={CUT_DOWNLOAD} tabIndex={show ? 0 : -1}>
          Download
        </a>
      </div>
    </div>
  );
}
