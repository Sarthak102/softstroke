"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PhoneDemo } from "./demos/PhoneDemo";
import { WebDemo } from "./demos/WebDemo";
import { MenuDemo } from "./demos/MenuDemo";
import { PlayerDemo } from "./demos/PlayerDemo";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Tab bars that feel native", body: "Tap a tab: its icon turns solid while the rest stay stroke.", node: <PhoneDemo /> },
  { title: "Dashboards that stay calm", body: "Readable at 18px in a busy sidebar, with one weight throughout.", node: <WebDemo /> },
  { title: "Menus people scan", body: "Even 1.5px strokes keep a long list of actions quiet and aligned.", node: <MenuDemo /> },
  { title: "Controls with clear states", body: "Play, pause, like. Each state change is a swap from stroke to solid.", node: <PlayerDemo /> },
];

// Pinned while scrolling: one live demo at a time, each built only from Softstroke icons.
export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const stages = gsap.utils.toArray<HTMLElement>(".s-stage", root.current);
      const fills = gsap.utils.toArray<HTMLElement>(".s-fill", root.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(stages.slice(1), { autoAlpha: 0, y: 80, scale: 0.94 });
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${(STEPS.length - 1) * 100}%`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          snap: { snapTo: 1 / (STEPS.length - 1), inertia: false, directional: false, duration: { min: 0.3, max: 0.7 }, ease: "power2.inOut" },
          onUpdate: (st) => setActive(Math.round(st.progress * (STEPS.length - 1))),
        },
      });
      stages.forEach((stage, i) => {
        if (i === 0) return;
        tl.to(fills[i - 1], { scaleY: 1, duration: 1, ease: "none" }, i - 1)
          .to(stages[i - 1], { autoAlpha: 0, y: -60, scale: 0.92, duration: 0.5 }, i - 0.6)
          .to(stage, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, i - 0.45);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100dvh] items-center px-4 pb-6 pt-20 sm:pb-8 sm:pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <h2 className="font-display text-3xl max-sm:hidden sm:text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Built for real screens.</h2>
          <ol className="mt-8 space-y-1 max-lg:hidden">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative pl-6">
                <span aria-hidden className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px] overflow-hidden rounded-full bg-[var(--line)]">
                  <span className={`s-fill block h-full origin-top bg-accent [transform:scaleY(0)] ${i === STEPS.length - 1 ? "hidden" : ""}`} />
                </span>
                <div className={`py-2 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-40"}`}>
                  <p className="font-display text-xl font-semibold tracking-tight">{s.title}</p>
                  <p className={`grid text-muted transition-[grid-template-rows,opacity] duration-500 ${active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <span className="overflow-hidden pt-1">{s.body}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-muted sm:mt-4 sm:text-lg lg:hidden">
            <span className="font-medium text-ink">{STEPS[active].title}.</span> {STEPS[active].body}
          </p>
        </div>
        <div className="glass relative overflow-hidden rounded-[32px]">
          <div className="relative grid h-[calc(100dvh-11rem)] min-h-[480px] place-items-center sm:h-[min(620px,calc(100dvh-8rem))] sm:min-h-[580px]">
            {STEPS.map((s) => (
              <div key={s.title} className="s-stage col-start-1 row-start-1 w-full px-4 sm:px-8">
                <div className="origin-center max-sm:scale-[0.85]">{s.node}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
