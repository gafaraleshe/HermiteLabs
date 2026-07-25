"use client";

import Link from "next/link";
import { useState } from "react";
import { HermiteMark } from "@/components/hermite-mark";
import { PRODUCTS } from "@/lib/products";

/**
 * Hermite Labs parent navigation.
 *
 * Monochrome throughout — the parent site carries no accent. Product accents
 * appear only as the small status dot beside each product in the menu, which
 * identifies rather than decorates.
 */
export function LabsNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="labs-nav">
      <div className="h-wrap labs-nav-in">
        <Link href="/" className="labs-wordmark" onClick={close}>
          <HermiteMark size={22} />
          Hermite<span>&nbsp;Labs</span>
        </Link>

        <nav className="labs-links">
          <div className="labs-menu">
            <button
              type="button"
              className="h-label labs-menu-btn"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen(o => !o)}
            >
              Products
              <svg
                width="9"
                height="6"
                viewBox="0 0 9 6"
                fill="none"
                aria-hidden="true"
                style={{
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 180ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <path
                  d="M1 1l3.5 3.5L8 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {open && (
              <div className="labs-menu-panel" role="menu">
                {PRODUCTS.map(p => {
                  const inner = (
                    <>
                      <span
                        className="labs-menu-dot"
                        style={{
                          background: p.accent ?? "var(--ink-500)",
                          boxShadow: p.accent
                            ? `0 0 8px ${p.accent}`
                            : undefined,
                        }}
                        aria-hidden
                      />
                      <span className="labs-menu-name">
                        {p.prefix}
                        <span style={{ color: p.accent ?? "var(--ink-600)" }}>
                          {p.suffix}
                        </span>
                      </span>
                      <span className="labs-menu-meta">
                        {p.status === "Live" ? p.category : p.status}
                      </span>
                    </>
                  );
                  return p.external ? (
                    <a
                      key={p.suffix}
                      href={p.href}
                      className="labs-menu-item"
                      onClick={close}
                      role="menuitem"
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      key={p.suffix}
                      href={p.href}
                      className="labs-menu-item"
                      onClick={close}
                      role="menuitem"
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link className="h-label" href="/roadmap" onClick={close}>
            Roadmap
          </Link>
          <Link className="h-label" href="/docs" onClick={close}>
            Docs
          </Link>
          <a className="h-btn labs-nav-cta" href="https://flow.hermitelabs.com">
            Open Flow
          </a>
        </nav>
      </div>
    </header>
  );
}
