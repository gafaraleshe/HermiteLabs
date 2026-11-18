"use client";

import { useEffect, useRef } from "react";

/** Adds `is-live` while the element is on screen, so preview animations only
 *  run when someone can see them. */
export function Live({
  className = "",
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      el?.classList.add("is-live");
      return;
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => el.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
