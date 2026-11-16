"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, BookmarkIcon, CameraIcon, CloudIcon, CompassIcon, CrownIcon, FlameIcon, GemIcon, GiftIcon, LeafIcon, LightbulbIcon, MapPinIcon, MicIcon, MusicIcon, RocketIcon, StarIcon, TagIcon, TrophyIcon, ZapIcon } from "@softstroke/react";
import {
  StarIcon as StarF, BookmarkIcon as BookmarkF, GiftIcon as GiftF, CompassIcon as CompassF, TrophyIcon as TrophyF, FlameIcon as FlameF, GemIcon as GemF, TagIcon as TagF, ZapIcon as ZapF, CloudIcon as CloudF, MicIcon as MicF, LightbulbIcon as LightbulbF, RocketIcon as RocketF, CameraIcon as CameraF, CrownIcon as CrownF, LeafIcon as LeafF, MusicIcon as MusicF, MapPinIcon as MapPinF,
} from "@softstroke/react/solid";
import { GITHUB_URL, SPONSOR_URL } from "@/lib/site";
import { ICON_COUNT } from "@/lib/count";
import { CopyCommand } from "./CopyCommand";
import { Downloads } from "./Downloads";
import { FeedbackLink } from "./Feedback";
import { IconsLink } from "./IconsLink";
import { LogoMark } from "./Logo";
import { Words } from "./Words";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "Product", links: [["Icons", "/icons/"], ["Use cases", "/use-cases/"], ["Playground", "/playground/"], ["Icon font", "/icon-font/"], ["Docs", "/docs/"]] },
  { title: "Packages", links: [["React", "/docs/react/"], ["React Native", "/docs/react-native/"], ["Flutter", "/docs/flutter/"], ["Vue", "/docs/vue/"], ["Svelte", "/docs/svelte/"], ["Angular", "/docs/angular/"], ["SVG and CDN", "/docs/svg/"]] },
  { title: "Resources", links: [["GitHub", GITHUB_URL], ["npm", "https://www.npmjs.com/org/softstroke"], ["Releases", "/changelog/"], ["Sponsor", SPONSOR_URL], ["Request an icon", "#request"], ["Report an issue", "#issue"], ["MIT License", `${GITHUB_URL}/blob/main/LICENSE`]] },
];

const TRAIL = [
  [StarIcon, StarF], [BookmarkIcon, BookmarkF], [GiftIcon, GiftF], [CompassIcon, CompassF], [TrophyIcon, TrophyF], [FlameIcon, FlameF], [GemIcon, GemF], [TagIcon, TagF], [ZapIcon, ZapF], [CloudIcon, CloudF], [MicIcon, MicF], [LightbulbIcon, LightbulbF], [RocketIcon, RocketF], [CameraIcon, CameraF], [CrownIcon, CrownF], [LeafIcon, LeafF], [MusicIcon, MusicF], [MapPinIcon, MapPinF],
] as const;

export function Footer() {
  const trail = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  // The wordmark is armed (letters hidden) only once JS runs, then rises when it scrolls into view.
  useEffect(() => {
    const el = mark.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("armed");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A diagonal wave of icons turning solid, once a quarter second.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let wave = 0;
    const id = setInterval(() => {
      trail.current?.querySelectorAll("span").forEach((c, i) => c.classList.toggle("hot", Math.floor(i / 6) + (i % 6) === wave % 10));
      wave++;
    }, 260);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="cta">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <h2 className="display" data-split><Words>Start with one icon</Words></h2>
          <div className="cta-row" data-reveal>
            <IconsLink href="/icons/" className="btn btn-primary">
              Browse all {ICON_COUNT} <ArrowRightIcon size={18} className="arrow" />
            </IconsLink>
            <CopyCommand command="npm i @softstroke/react" />
          </div>
        </div>
        <div className="cta-trail" ref={trail} aria-hidden>
          {TRAIL.map(([S, F], i) => (
            <span key={i}>
              <S className="s" />
              <F className="f" />
            </span>
          ))}
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <Link href="/" className="brand"><LogoMark />Softstroke</Link>
              <p className="meta" style={{ marginTop: 12 }}>Soft icons on a 24px grid</p>
            </div>
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="foot-h">{c.title}</h2>
                <ul>
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("#") ? (
                        <FeedbackLink kind={href === "#request" ? "request" : "issue"}>{label}</FeedbackLink>
                      ) : href.startsWith("http") ? (
                        <a href={href}>{label}</a>
                      ) : (
                        <Link href={href}>{label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="foot-base meta">
            <span>MIT licensed. Made by Sarthak Kamble.</span>
            <span>{ICON_COUNT} icons in stroke and solid · npm <Downloads /></span>
          </div>
        </div>
        <div className="wordmark" aria-hidden ref={mark}>
          {"Softstroke".split("").map((ch, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties} className={i === 4 ? "acc" : undefined}>{ch}</span>
          ))}
        </div>
      </footer>
    </>
  );
}
