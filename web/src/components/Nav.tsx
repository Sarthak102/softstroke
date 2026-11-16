"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siGithub } from "simple-icons";
import { BookOpenIcon, GridIcon, LayoutIcon, MenuIcon, XIcon } from "@softstroke/react";
import { GITHUB_URL } from "@/lib/site";
import { IconsLink } from "./IconsLink";
import { LogoMark } from "./Logo";
import { Brand } from "./Brand";
import { Stars } from "./Stars";
import { NavSearch } from "./NavSearch";
import { ThemeToggle } from "./Theme";

// Each tab is its own page.
const TABS = [
  { label: "Icons", href: "/icons/", Icon: GridIcon },
  { label: "Use cases", href: "/use-cases/", Icon: LayoutIcon },
  { label: "Docs", href: "/docs/", Icon: BookOpenIcon },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const links = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const current = TABS.findIndex((t) => pathname.startsWith(t.href.replace(/\/$/, "")));

  // A soft pill glides to the hovered tab and rests on the current page's tab.
  function place(i: number) {
    const el = links.current?.querySelectorAll<HTMLElement>("[data-tab]")[i];
    const p = pill.current;
    if (!p) return;
    if (!el) return void (p.style.opacity = "0");
    p.style.setProperty("--x", `${el.offsetLeft}px`);
    p.style.width = `${el.offsetWidth}px`;
    p.style.opacity = "1";
  }
  useEffect(() => place(current), [current]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile menu closes on navigation, Escape and clicks outside.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const click = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", click);
    };
  }, [open]);

  return (
    <header ref={root} className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="Softstroke home">
          <LogoMark />
          Softstroke
        </Link>
        <nav ref={links} className="nav-links" aria-label="Main" onPointerLeave={() => place(current)}>
          <span ref={pill} className="nav-pill" aria-hidden />
          {TABS.map((t, i) => {
            const props = { "data-tab": "", className: i === current ? "cur" : "", "aria-current": i === current ? ("page" as const) : undefined, onPointerEnter: () => place(i) };
            return t.href === "/icons/" ? (
              <IconsLink key={t.href} href={t.href} {...props}>{t.label}</IconsLink>
            ) : (
              <Link key={t.href} href={t.href} {...props}>{t.label}</Link>
            );
          })}
        </nav>
        <div className="nav-end">
          <NavSearch />
          <a className="gh" href={GITHUB_URL} aria-label="Softstroke on GitHub">
            <Brand logo={siGithub} size={16} />
            <Stars />
          </a>
          <ThemeToggle />
          <IconsLink href="/icons/" className="btn btn-primary">Browse icons</IconsLink>
          <button type="button" aria-expanded={open} aria-controls="nav-mobile" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="icon-btn nav-menu">
            {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      <div id="nav-mobile" className={`nav-sheet ${open ? "open" : ""}`}>
        <div className="wrap">
          {TABS.map(({ label, href, Icon }, i) => (
            <Link key={href} href={href} className={`nav-sheet-row ${i === current ? "cur" : ""}`}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
          <a href={GITHUB_URL} className="nav-sheet-row">
            <Brand logo={siGithub} size={20} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
