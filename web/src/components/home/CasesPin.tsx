"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Vertical scroll moves the track sideways while the section is pinned (plain sticky, no library).
// Under 768px or with reduced motion it is a swipeable row instead (CSS).
export function CasesPin({ count, head, children }: { count: number; head: ReactNode; children: ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const s = sec.current!, t = track.current!;
    let travel = 0, pinned = false, raf = 0;
    const layout = () => {
      pinned = innerWidth >= 768 && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      t.style.transform = "none";
      if (!pinned) return void (s.style.height = "");
      // Travel so the last card ends on the same gutter the first one starts on.
      const first = t.firstElementChild!.getBoundingClientRect(), last = t.lastElementChild!.getBoundingClientRect();
      travel = Math.max(0, last.right + first.left - innerWidth);
      s.style.height = `calc(100svh + ${travel}px)`;
      onScroll();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!pinned || !travel) return setP(0);
        const k = Math.max(0, Math.min(1, -s.getBoundingClientRect().top / travel));
        t.style.transform = `translate3d(${-k * travel}px,0,0)`;
        setP(k);
      });
    };
    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const idx = Math.min(count - 1, Math.round(p * (count - 1)));
  return (
    <section className="cases" id="cases" ref={sec}>
      <div className="cases-pin">
        <div className="wrap cases-head">
          <div>{head}</div>
          <div className="cases-progress">
            <span className="meta">{String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            <span className="cases-bar"><i style={{ "--p": p } as React.CSSProperties} /></span>
          </div>
        </div>
        <div className="cases-track" ref={track}>{children}</div>
      </div>
    </section>
  );
}
