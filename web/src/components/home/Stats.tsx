"use client";

import { useEffect, useRef } from "react";
import { ICON_COUNT } from "@/lib/count";

const STATS = [
  { to: Number(ICON_COUNT), dec: 0, unit: "", label: "icons, each in two styles" },
  { to: 9, dec: 0, unit: "", label: "ways to install, from React to Flutter" },
  { to: 0.4, dec: 1, unit: "", label: "KB per icon, about" },
  { to: 24, dec: 0, unit: "px", label: "grid behind every shape" },
];

// Figures count up once, when the band scrolls into view. Server HTML holds the final numbers.
export function Stats() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = [...(root.current?.querySelectorAll<HTMLElement>("[data-to]") ?? [])];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400), ease = 1 - Math.pow(1 - k, 4);
        els.forEach((el) => (el.textContent = (Number(el.dataset.to) * ease).toFixed(Number(el.dataset.dec))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);
  return (
    <section className="stats" ref={root}>
      <div className="wrap stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <b><span data-to={s.to} data-dec={s.dec}>{s.to.toFixed(s.dec)}</span>{s.unit && <small>{s.unit}</small>}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
