"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Marks [data-reveal] blocks and [data-split] headings with .in when they scroll into view (CSS does the motion).
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.in), [data-split]:not(.in), .wordmark:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
