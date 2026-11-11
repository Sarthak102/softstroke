"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siAngular, siFigma, siFlutter, siFramer, siJsdelivr, siReact, siSvelte, siSvg, siVuedotjs, siWordpress } from "simple-icons";
import { Brand, type Logo } from "./Brand";
import { CopyButton, CopyCommand } from "./CopyCommand";
import { CodeIcon, SmartphoneIcon } from "@softstroke/react";
import { iconSet } from "@/lib/icon-set";

const Stroke = { CodeIcon, SmartphoneIcon };
const { StrokeIcon } = iconSet(Stroke);

gsap.registerPlugin(ScrollTrigger);


// What ships with v1. The snippets are the documented API of each package.
const TARGETS: { name: string; logo: Logo; install: string; code: string; mobile?: boolean }[] = [
  {
    name: "React",
    logo: siReact,
    install: "npm i @softstroke/react",
    code: `import { HomeIcon } from "@softstroke/react";\n\n<HomeIcon size={24} strokeWidth={1.5} />`,
  },
  {
    name: "Vue",
    logo: siVuedotjs,
    install: "npm i @softstroke/vue",
    code: `<script setup>\nimport { HomeIcon } from "@softstroke/vue";\n</script>\n\n<template>\n  <HomeIcon :size="24" />\n</template>`,
  },
  {
    name: "Svelte",
    logo: siSvelte,
    install: "npm i @softstroke/svelte",
    code: `<script>\n  import { HomeIcon } from "@softstroke/svelte";\n</script>\n\n<HomeIcon size={24} />`,
  },
  {
    name: "Angular",
    logo: siAngular,
    install: "npm i @softstroke/angular",
    code: `import { HomeIcon } from "@softstroke/angular";\n\n@Component({ imports: [HomeIcon], template: \`<ss-home [size]="24" />\` })`,
  },
  {
    name: "SVG",
    logo: siSvg,
    install: "npm i @softstroke/svg",
    code: `<svg width="24" height="24">\n  <use href="sprite.svg#home" />\n</svg>`,
  },
  {
    name: "React Native",
    logo: siReact,
    mobile: true,
    install: "npm i @softstroke/react-native",
    code: `import { HomeIcon } from "@softstroke/react-native";\n\n<HomeIcon size={24} color="#0b2545" />`,
  },
  {
    name: "CDN",
    logo: siJsdelivr,
    install: "No install needed",
    code: `<img src="https://cdn.jsdelivr.net/npm/@softstroke/svg/dist/icons/home.svg"\n     width="24" height="24" alt="Home" />`,
  },
  {
    name: "Icon font",
    logo: null,
    install: "npm i @softstroke/font",
    code: `<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/npm/@softstroke/font/dist/softstroke.css" />\n\n<i class="ss ss-home"></i>        <!-- stroke -->\n<i class="ss-solid ss-home"></i>  <!-- solid -->`,
  },
];

const LATER = [
  { name: "Figma", logo: siFigma },
  { name: "Framer", logo: siFramer },
  { name: "Flutter", logo: siFlutter },
  { name: "WordPress", logo: siWordpress },
  { name: "VS Code", logo: null },
];


export function Supports() {
  const root = useRef<HTMLElement>(null);
  const code = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(0);
  const t = TARGETS[sel];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".sp-tile", {
        autoAlpha: 0,
        y: 28,
        scale: 0.94,
        duration: 0.8,
        ease: "power3.out",
        stagger: { each: 0.06, grid: "auto", from: "start" },
        scrollTrigger: { trigger: ".sp-grid", start: "top 80%", once: true },
      });
      gsap.from(".sp-later", { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.05, scrollTrigger: { trigger: ".sp-laterrow", start: "top 90%", once: true } });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(code.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
    },
    { dependencies: [sel] },
  );

  return (
    <section ref={root} id="install" className="scroll-mt-24 px-4 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Works where you build.</h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">
          Native packages for every major framework, plain SVG for everything else, and a CDN when you just need one icon.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
          <div role="tablist" aria-label="Framework" className="sp-grid grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {TARGETS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                role="tab"
                aria-selected={sel === i}
                onClick={() => setSel(i)}
                className={`sp-tile group flex min-h-[112px] flex-col items-start justify-between rounded-[20px] p-4 text-left transition-[background-color,color,box-shadow,translate] duration-300 hover:-translate-y-0.5 ${
                  sel === i ? "bg-accent text-accent-ink shadow-[var(--shadow)]" : "glass text-ink"
                }`}
              >
                <span className="relative">
                  <Brand logo={x.logo} />
                  {x.mobile && (
                    <span className={`absolute -bottom-1.5 -right-2 grid size-[18px] place-items-center rounded-md ${sel === i ? "bg-accent-ink text-accent-text" : "bg-accent text-accent-ink"}`}>
                      <StrokeIcon name="SmartphoneIcon" size={12} strokeWidth={2} />
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium">{x.name}</span>
              </button>
            ))}
          </div>
          <div className="glass flex min-h-[320px] flex-col rounded-[32px] p-5 sm:p-6">
            <div ref={code} className="flex flex-1 flex-col">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {t.install.startsWith("npm") ? (
                  <CopyCommand command={t.install} />
                ) : (
                  <span className="rounded-full px-1 text-sm text-muted">{t.install}</span>
                )}
              </div>
              <div className="relative flex-1">
                <pre className="h-full overflow-x-auto rounded-2xl bg-[#0b1526] p-5 pr-14 font-mono text-[13px] leading-relaxed text-[#cfe0ff]">
                  <code>{t.code}</code>
                </pre>
                <CopyButton text={t.code} className="absolute right-3 top-3 text-[#cfe0ff]" />
              </div>
            </div>
          </div>
        </div>
        <div className="sp-laterrow mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-muted">
          <span className="text-sm">Planned after v1</span>
          {LATER.map((l) => (
            <span key={l.name} className="sp-later flex items-center gap-2 text-sm">
              {l.logo ? <Brand logo={l.logo} size={18} /> : <StrokeIcon name="CodeIcon" size={18} />}
              {l.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
