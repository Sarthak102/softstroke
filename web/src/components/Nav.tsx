"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siAngular, siReact, siSvelte, siSvg, siVuedotjs } from "simple-icons";
import { GITHUB_URL } from "@/lib/site";
import { Brand, type Logo } from "./Brand";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./Theme";
import { ArrowRightIcon, BookOpenIcon, ChevronDownIcon, CodeIcon, GridIcon, LayoutIcon, MenuIcon, SmartphoneIcon, XIcon } from "@softstroke/react";

const PACKAGES: { name: string; body: string; href: string; logo: Logo; mobile?: boolean }[] = [
  { name: "React", body: "Components for React and Next.js", href: "/docs/react/", logo: siReact },
  { name: "React Native", body: "Expo and bare React Native", href: "/docs/react-native/", logo: siReact, mobile: true },
  { name: "Vue", body: "Vue 3 and Nuxt", href: "/docs/vue/", logo: siVuedotjs },
  { name: "Svelte", body: "Svelte 5 and SvelteKit", href: "/docs/svelte/", logo: siSvelte },
  { name: "Angular", body: "Standalone components", href: "/docs/angular/", logo: siAngular },
  { name: "SVG and CDN", body: "Files, sprites, jsDelivr", href: "/docs/svg/", logo: siSvg },
  { name: "Icon font", body: "One CSS link, no build", href: "/icon-font/", logo: null },
];

const link = "rounded-full px-3.5 py-2 text-[15px] text-ink/80 transition-colors hover:text-ink";

function PackageLogo({ p }: { p: (typeof PACKAGES)[number] }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--glass)] text-ink ring-1 ring-[var(--line)]">
      <Brand logo={p.logo} size={18} />
      {p.mobile && (
        <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-md bg-accent text-accent-ink">
          <SmartphoneIcon size={10} strokeWidth={2} />
        </span>
      )}
    </span>
  );
}

export function Nav() {
  const [menu, setMenu] = useState<"packages" | "mobile" | null>(null);
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);

  // Close on navigation, Escape and clicks outside.
  useEffect(() => setMenu(null), [pathname]);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    const click = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setMenu(null);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", click);
    };
  }, [menu]);

  const pkgOpen = menu === "packages";
  const mobOpen = menu === "mobile";

  return (
    <header ref={root} className="fixed inset-x-0 top-4 z-40 px-4">
      {/* Layout from Sarthak's reference: brand | divider | links on the left; theme switch + white CTA on the right */}
      <nav aria-label="Main" className="liquid mx-auto flex h-16 max-w-6xl items-center gap-2 rounded-full pl-6 pr-2.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <LogoMark className="size-6 text-accent-text" />
          Softstroke
        </Link>
        <span aria-hidden className="mx-4 hidden h-7 w-px bg-[var(--line)] lg:block" />
        <div className="flex flex-1 items-center gap-1">
          <Link href="/icons/" prefetch={false} className={`${link} hidden lg:block`}>Icons</Link>
          <div className="relative hidden lg:block" onPointerEnter={(e) => e.pointerType === "mouse" && setMenu("packages")} onPointerLeave={(e) => e.pointerType === "mouse" && pkgOpen && setMenu(null)}>
            <button type="button" aria-expanded={pkgOpen} aria-controls="nav-packages" onClick={() => setMenu(pkgOpen ? null : "packages")} className={`${link} flex items-center gap-1 ${pkgOpen ? "text-ink" : ""}`}>
              Packages
              <ChevronDownIcon size={16} className={`transition-transform duration-300 ${pkgOpen ? "rotate-180" : ""}`} />
            </button>
            {/* pt-3 bridges the gap so the pointer can travel from the button into the panel */}
            <div id="nav-packages" className={`absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-[opacity,translate] duration-300 ${pkgOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
              <ul className="liquid grid grid-cols-2 gap-1 rounded-[24px] p-2" style={{ background: "var(--bg-1)" }}>
                {PACKAGES.map((p) => (
                  <li key={p.name}>
                    <Link href={p.href} className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-[var(--glass)]">
                      <PackageLogo p={p} />
                      <span>
                        <span className="block text-sm font-medium">{p.name}</span>
                        <span className="block text-xs text-muted">{p.body}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/docs/installation/" className="flex h-full items-center justify-between gap-2 rounded-2xl bg-accent/10 p-2.5 pl-4 text-sm font-medium text-accent-text transition-colors hover:bg-accent/15">
                    All packages
                    <ArrowRightIcon size={16} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link href="/use-cases/" className={`${link} hidden lg:block`}>Use cases</Link>
          <Link href="/docs/" className={`${link} hidden lg:block`}>Docs</Link>
          <a href={GITHUB_URL} className={`${link} hidden lg:block`}>GitHub</a>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button type="button" aria-expanded={mobOpen} aria-controls="nav-mobile" aria-label={mobOpen ? "Close menu" : "Open menu"} onClick={() => setMenu(mobOpen ? null : "mobile")} className="grid size-10 place-items-center rounded-full text-muted hover:text-ink lg:hidden">
            {mobOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <Link href="/icons/" prefetch={false} className="group hidden h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--cta)] px-5 text-[15px] font-semibold text-[var(--cta-ink)] shadow-[0_1px_2px_rgb(11_37_69/0.08),0_8px_20px_-8px_rgb(11_37_69/0.35)] ring-1 ring-[#0b2545]/[0.06] transition-transform active:scale-[0.98] sm:flex">
            Browse icons
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      <div id="nav-mobile" data-lenis-prevent className={`liquid mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-y-auto rounded-[28px] p-3 transition-[opacity,translate] duration-300 lg:hidden ${mobOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`} style={{ background: "var(--bg-1)" }}>
        <div className="grid grid-cols-4 gap-2 border-b border-[var(--line)] pb-3">
          {([["Icons", "/icons/", GridIcon], ["Use cases", "/use-cases/", LayoutIcon], ["Docs", "/docs/", BookOpenIcon], ["GitHub", GITHUB_URL, CodeIcon]] as const).map(([label, href, Icon]) => {
            const inner = (<><Icon size={20} />{label}</>);
            const cls = "flex flex-col items-center gap-1.5 rounded-2xl bg-[var(--glass)] py-3 text-sm ring-1 ring-[var(--line)]";
            return href.startsWith("http") ? <a key={label} href={href} className={cls}>{inner}</a> : <Link key={label} href={href} className={cls}>{inner}</Link>;
          })}
        </div>
        <p className="px-2 pb-1 pt-3 text-xs font-medium text-muted">Packages</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {PACKAGES.map((p) => (
            <li key={p.name}>
              <Link href={p.href} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-[var(--glass)]">
                <PackageLogo p={p} />
                <span className="text-sm font-medium">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
