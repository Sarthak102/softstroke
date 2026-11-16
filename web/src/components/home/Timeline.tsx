"use client";

import { useEffect, useRef } from "react";

// The line fills as the list scrolls past, lighting each release it reaches.
export function Timeline({ items }: { items: { v: string; date: string | null; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = root.current;
        if (!el) return;
        const r = el.getBoundingClientRect(), line = innerHeight * 0.7;
        el.style.setProperty("--p", String(Math.max(0, Math.min(1, (line - r.top) / r.height))));
        el.querySelectorAll<HTMLElement>(".tl-item:not(.next)").forEach((it) => it.classList.toggle("lit", it.getBoundingClientRect().top + 12 < line));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="timeline" ref={root} data-reveal>
      <span className="tl-line"><i /></span>
      {items.map((it) => (
        <div key={it.v} className={`tl-item ${it.date ? "" : "next"}`}>
          <div className="tl-top"><b>{it.v}</b>{it.date ? <span className="meta">{it.date}</span> : <span className="tag">In progress</span>}</div>
          <p>{it.body}</p>
        </div>
      ))}
    </div>
  );
}
