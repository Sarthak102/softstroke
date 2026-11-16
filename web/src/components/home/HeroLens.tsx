"use client";

import type { ReactNode } from "react";

// The hero section: a 24px grid shows around the pointer.
export function HeroLens({ children }: { children: ReactNode }) {
  return (
    <section
      className="hero"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div className="hero-lens" aria-hidden />
      {children}
    </section>
  );
}
