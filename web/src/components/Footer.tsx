"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRightIcon } from "@softstroke/react";
import { CopyCommand } from "./CopyCommand";
import { LogoMark } from "./Logo";
import { GITHUB_URL } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "Product", links: [["Icons", "/icons/"], ["Icon font", "/icon-font/"], ["Docs", "/docs/"], ["Playground", "/#playground"]] },
  { title: "Packages", links: [["React", "/docs/react/"], ["React Native", "/docs/react-native/"], ["Vue", "/docs/vue/"], ["Svelte", "/docs/svelte/"], ["Angular", "/docs/angular/"], ["SVG and CDN", "/docs/svg/"]] },
  { title: "Resources", links: [["GitHub", GITHUB_URL], ["npm", "https://www.npmjs.com/org/softstroke"], ["Changelog", "/changelog/"], ["Report an issue", `${GITHUB_URL}/issues`], ["MIT License", `${GITHUB_URL}/blob/main/LICENSE`]] },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".ft-in", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top bottom", once: true },
      });
      // The big mark turns into place as the footer scrolls in (tied to scroll, so it never fights it).
      gsap.fromTo(".ft-mark", { rotate: -24, scale: 0.85 }, { rotate: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.8 } });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="mt-8">
      <div className="glass relative overflow-hidden rounded-t-[48px] border-b-0 px-6 pb-8 pt-16 sm:px-12 sm:pt-24">
        <LogoMark className="ft-mark pointer-events-none absolute -bottom-[18%] -right-[8%] size-[min(34rem,80vw)] text-accent-text opacity-[0.07]" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <h2 className="ft-in max-w-[14ch] font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl">Start with one icon.</h2>
              <p className="ft-in mt-5 max-w-[40ch] text-lg text-muted">All 310, in both styles, free for personal and commercial work.</p>
              <div className="ft-in mt-8 flex flex-wrap gap-3">
                <Link href="/icons/" prefetch={false} className="group flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink shadow-[var(--shadow)] transition-transform active:scale-[0.98]">
                  Browse icons
                  <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <CopyCommand command="npm i @softstroke/react" />
              </div>
            </div>
            <nav aria-label="Footer" className="ft-in grid grid-cols-2 gap-x-8 gap-y-10 text-sm sm:grid-cols-3">
              {COLUMNS.map((c) => (
                <div key={c.title}>
                  <p className="mb-4 font-medium text-ink">{c.title}</p>
                  <ul className="space-y-3 text-muted">
                    {c.links.map(([label, href]) => (
                      <li key={label}>
                        {href.startsWith("http") ? (
                          <a href={href} className="transition-colors hover:text-ink">{label}</a>
                        ) : (
                          <Link href={href} className="transition-colors hover:text-ink">{label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="mt-16 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 font-display font-semibold text-ink">
              <LogoMark className="size-5 text-accent-text" />
              Softstroke
            </span>
            <span>MIT licensed. Made by Sarthak Kamble.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
