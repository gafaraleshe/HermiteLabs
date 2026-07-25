"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_URL } from "@/lib/content";
import { HermiteMark } from "@/components/hermite-mark";

const LINKS = [
  ["/motion", "Motion"],
  ["/subs", "Subs"],
  ["/ai", "AI"],
  ["/enterprise", "Enterprise"],
  ["/roadmap", "Roadmap"],
  ["/docs", "Docs"],
] as const;

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("hermite-theme", next);
    } catch {
      /* private mode — theme just won't persist */
    }
  }

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle theme"
      }
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="top-nav">
      <div className="container">
        {/* Product lockup: accent lands on the right crossbar segment only.
            Links to /cut, the product home — "/" is Hermite Labs. */}
        <Link href="/cut" className="nav-wordmark" onClick={close}>
          <HermiteMark size={26} product="cut" title="HermiteCut" />
          Hermite<span style={{ color: "var(--accent)" }}>Cut</span>
        </Link>

        <div className="nav-links">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <a
            className="btn btn-secondary nav-github"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </a>
          <button
            type="button"
            className="hamburger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu-wrap" id="mobile-menu">
          <div className="container mobile-menu">
            {LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="m-link"
                onClick={close}
              >
                {label}
              </Link>
            ))}
            <a
              className="btn btn-secondary"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              onClick={close}
            >
              Star on GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
