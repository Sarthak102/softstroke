"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NAMES = [
  "home", "search", "heart", "bell", "camera", "chat", "calendar", "bookmark", "music", "settings",
  "user", "sparkles", "mail", "folder", "star", "cloud", "lock", "map-pin", "gift", "cart",
  "play-circle", "mic", "phone", "trophy", "lightbulb", "rocket", "shield-check", "wallet", "tag", "flame",
  "sun", "moon", "image", "video", "headphones", "compass", "gem", "crown", "leaf", "zap",
];

// Font glyphs, not SVGs: every icon here is a character in softstroke.woff2 / softstroke-solid.woff2.
// A wave flips them from the stroke font to the solid font and back.
export function GlyphWall() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const solid = el.querySelectorAll(".gw-solid");
    const stroke = el.querySelectorAll(".gw-stroke");
    const stagger = { grid: "auto" as const, from: "start" as const, amount: 0.9 };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1 });
    tl.to(stroke, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: "power2.in", stagger }, 0)
      .fromTo(solid, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger }, 0.15)
      .to(solid, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: "power2.in", stagger }, "+=1.6")
      .to(stroke, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger }, "<0.15");
    // pause while off screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
    io.observe(el);
    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="grid grid-cols-8 gap-2 text-[28px] text-ink [mask-image:radial-gradient(farthest-side,#000_75%,transparent)] sm:grid-cols-10 sm:text-[30px]">
      {NAMES.map((n, i) => (
        <span key={n} className={`relative grid aspect-square place-items-center rounded-2xl bg-[var(--glass)] ring-1 ring-[var(--glass-edge)] ${i >= 32 ? "max-sm:hidden" : ""}`}>
          <i className={`ss ss-${n} gw-stroke col-start-1 row-start-1`} />
          <i className={`ss-solid ss-${n} gw-solid invisible col-start-1 row-start-1 text-accent-text`} />
        </span>
      ))}
    </div>
  );
}
