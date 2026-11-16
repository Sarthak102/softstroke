"use client";

import { useEffect, useRef, useState } from "react";
import { BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, FolderIcon, HeartIcon, HomeIcon, LockIcon, PlayCircleIcon, SearchIcon, StarIcon, UserIcon, type Icon } from "@softstroke/react";
import {
  BellIcon as BellF, BookmarkIcon as BookmarkF, CalendarIcon as CalendarF, CameraIcon as CameraF, FolderIcon as FolderF, HeartIcon as HeartF,
  HomeIcon as HomeF, LockIcon as LockF, PlayCircleIcon as PlayCircleF, SearchIcon as SearchF, StarIcon as StarF, UserIcon as UserF,
} from "@softstroke/react/solid";
import { Words } from "../Words";

const pair = (S: Icon, F: Icon, size = 24) => (<><S size={size} className="s" /><F size={size} className="f" /></>);
const TABS: [Icon, Icon, string][] = [[HomeIcon, HomeF, "Home"], [SearchIcon, SearchF, "Search"], [HeartIcon, HeartF, "Saved"], [BellIcon, BellF, "Alerts"], [UserIcon, UserF, "Profile"]];
const FILL: [Icon, Icon, string][] = [[HomeIcon, HomeF, "home"], [HeartIcon, HeartF, "heart"], [BookmarkIcon, BookmarkF, "bookmark"], [BellIcon, BellF, "bell"], [StarIcon, StarF, "star"], [FolderIcon, FolderF, "folder"], [CalendarIcon, CalendarF, "calendar"], [CameraIcon, CameraF, "camera"], [LockIcon, LockF, "lock"], [PlayCircleIcon, PlayCircleF, "play"]];

// 01: a tab bar whose active icon turns solid, and a strip that turns solid as you scroll past it.
export function States() {
  const [tab, setTab] = useState(0);
  const [touched, setTouched] = useState(false);
  const [filled, setFilled] = useState(0);
  const bar = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    const b = bar.current?.querySelectorAll<HTMLElement>(".tab")[tab];
    if (b) setX(b.offsetLeft - 8);
  }, [tab]);

  // Auto-advance while visible, until someone taps a tab.
  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id);
      if (e.isIntersecting) id = setInterval(() => setTab((t) => (t + 1) % TABS.length), 2000);
    }, { threshold: 0.4 });
    if (bar.current) io.observe(bar.current);
    return () => { io.disconnect(); clearInterval(id); };
  }, [touched]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = strip.current?.getBoundingClientRect();
        if (!r) return;
        const p = Math.max(0, Math.min(1, (innerHeight * 0.92 - r.top) / (innerHeight * 0.6)));
        setFilled(FILL.filter((_, i) => p > (i + 1) / (FILL.length + 1)).length);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section wrap" id="states" style={{ paddingTop: 96 }}>
      <div className="split">
        <div data-reveal>
          <p className="eyebrow"><b>01</b> Two styles, one name</p>
          <h2 className="display h2" data-split><Words>Stroke at rest. Solid when chosen.</Words></h2>
          <p className="lede">Both styles share every name, so an active tab, a liked post or a pressed toggle is one import path away.</p>
          <div className="codeline" aria-label="Import example">
            <span>import {"{ HomeIcon }"} from&nbsp;</span>
            <span className="str">&quot;@softstroke/react<span className={`add ${tab || touched ? "" : "off"}`}>/solid</span>&quot;</span>
          </div>
        </div>
        <div className="stage-card" data-reveal>
          <div className="tabbar" role="tablist" aria-label="Demo tab bar" ref={bar}>
            <span className="tab-ind" style={{ transform: `translateX(${x}px)` }} />
            {TABS.map(([S, F, label], i) => (
              <button key={label} type="button" role="tab" aria-selected={i === tab} className="tab" onClick={() => { setTouched(true); setTab(i); }}>
                <span className="ic">{pair(S, F)}</span>
                {label}
              </button>
            ))}
          </div>
          <p className="meta" style={{ margin: 0 }}>Tap a tab</p>
        </div>
      </div>
      <div className="fill-strip" ref={strip} aria-hidden>
        {FILL.map(([S, F, n], i) => <span key={n} className={i < filled ? "on" : ""}>{pair(S, F)}</span>)}
      </div>
      <div className="fill-cap meta"><span>Scroll to choose</span><span>{filled} of {FILL.length} solid</span></div>
    </section>
  );
}
