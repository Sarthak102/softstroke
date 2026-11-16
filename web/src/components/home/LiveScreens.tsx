"use client";

import { useEffect, useState } from "react";
import {
  ArchiveIcon, BarChartIcon, BellIcon, CalendarIcon, ChatIcon, ChevronRightIcon, CodeIcon, FileTextIcon, FolderIcon, GlobeIcon,
  HeartIcon, HomeIcon, ImageIcon, InboxIcon, LockIcon, MoonIcon, MusicIcon, PlusIcon, RepeatIcon, SearchIcon, SettingsIcon,
  ShuffleIcon, SlidersIcon, StarIcon, UsersIcon, VideoIcon, type Icon,
} from "@softstroke/react";
import {
  BarChartIcon as BarChartF, CalendarIcon as CalendarF, ChatIcon as ChatF, FolderIcon as FolderF, HeadphonesIcon as HeadphonesF,
  HeartIcon as HeartF, HomeIcon as HomeF, InboxIcon as InboxF, PauseIcon as PauseF, PlayIcon as PlayF, SettingsIcon as SettingsF,
  SkipBackIcon as SkipBackF, SkipForwardIcon as SkipForwardF, StarIcon as StarF, UsersIcon as UsersF,
} from "@softstroke/react/solid";
import { Words } from "../Words";

const ROWS: [Icon, Icon, string, string?][] = [
  [HomeIcon, HomeF, "Home"], [InboxIcon, InboxF, "Inbox", "12"], [CalendarIcon, CalendarF, "Calendar"], [FolderIcon, FolderF, "Files"], [ChatIcon, ChatF, "Messages", "3"],
];
const WORK: [Icon, Icon, string][] = [[UsersIcon, UsersF, "Team"], [BarChartIcon, BarChartF, "Reports"], [SettingsIcon, SettingsF, "Settings"]];
const FILES: [Icon, string, string, boolean][] = [
  [FileTextIcon, "Q4 planning notes", "2.4 MB", true], [ImageIcon, "Launch hero, final", "8.1 MB", false], [VideoIcon, "Onboarding walkthrough", "64 MB", false],
  [MusicIcon, "Podcast intro mix", "5.7 MB", true], [ArchiveIcon, "Brand assets 2026", "212 MB", false], [CodeIcon, "checkout-flow.tsx", "18 KB", false],
];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// 04: a sidebar, a player and a settings list, all live. The dark mode switch is the real theme switch.
export function LiveScreens() {
  const [row, setRow] = useState("Home");
  const [stars, setStars] = useState(FILES.map((f) => f[3]));
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(84);
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setPos((p) => (p + 1) % 221), 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const read = () => setDark(document.documentElement.dataset.theme === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  // Clicking the matching option of the nav switch keeps its circle reveal and session storage in one place.
  const toggleTheme = () => document.querySelector<HTMLButtonElement>(`[data-theme-option="${dark ? "light" : "dark"}"]`)?.click();

  const navRow = ([S, F, label, c]: [Icon, Icon, string, string?]) => (
    <button key={label} type="button" className={`row ${row === label ? "on" : ""}`} onClick={() => setRow(label)}>
      <span className="ri"><S size={18} className="s" /><F size={18} className="f" /></span>
      {label}
      {c && <span className="c">{c}</span>}
    </button>
  );

  return (
    <section className="section wrap" id="screens" style={{ paddingTop: 96 }}>
      <div data-reveal>
        <p className="eyebrow"><b>04</b> Try it</p>
        <h2 className="display h2" data-split><Words>Quiet in a busy screen</Words></h2>
        <p className="lede">One stroke weight keeps a sidebar, a player and a settings list calm next to each other. Everything here is live, click around.</p>
      </div>
      <div className="screens">
        <article className="screen wide" data-reveal>
          <div className="app">
            <div className="side">
              <div className="ws"><i>N</i> Northwind</div>
              {ROWS.map(navRow)}
              <div className="label">Workspace</div>
              {WORK.map(navRow)}
            </div>
            <div className="main">
              <div className="main-head">
                <h4>Recent files</h4>
                <div style={{ display: "flex", gap: 4 }}>
                  <span className="icon-btn"><SearchIcon size={18} /></span><span className="icon-btn"><SlidersIcon size={18} /></span><span className="icon-btn"><PlusIcon size={18} /></span>
                </div>
              </div>
              {FILES.map(([I, name, size], k) => (
                <div key={name} className="file">
                  <span className="ft"><I size={18} /></span>
                  <span>{name}</span>
                  <small>{size}</small>
                  <button type="button" aria-pressed={stars[k]} aria-label={stars[k] ? `Unstar ${name}` : `Star ${name}`} className={`star ${stars[k] ? "on pop" : ""}`} onClick={() => setStars((s) => s.map((v, j) => (j === k ? !v : v)))}>
                    {stars[k] ? <StarF size={18} /> : <StarIcon size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="screen-cap"><strong>Dashboard sidebar</strong><span className="meta">18px · click a row, star a file</span></div>
        </article>

        <article className="screen" data-reveal>
          <div className="player">
            <div className="track">
              <span className={`cover ${playing ? "spin" : ""}`}><HeadphonesF size={26} /></span>
              <div><b>Low Tide</b><span>Harbour Lights</span></div>
              <button type="button" className={`icon-btn like ${liked ? "pop" : ""}`} aria-pressed={liked} aria-label="Like" onClick={() => setLiked(!liked)} style={liked ? { color: "var(--accent)" } : undefined}>
                {liked ? <HeartF size={18} /> : <HeartIcon size={18} />}
              </button>
            </div>
            <div className="bar"><i style={{ "--t": pos / 221 } as React.CSSProperties} /></div>
            <div className="times meta"><span>{fmt(pos)}</span><span>3:41</span></div>
            <div className="controls">
              <button type="button" className="icon-btn" aria-label="Shuffle"><ShuffleIcon size={20} /></button>
              <button type="button" className="icon-btn" aria-label="Previous"><SkipBackF size={22} /></button>
              <button type="button" className="play" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)}>
                {playing ? <PauseF size={22} /> : <PlayF size={22} />}
              </button>
              <button type="button" className="icon-btn" aria-label="Next"><SkipForwardF size={22} /></button>
              <button type="button" className="icon-btn" aria-label="Repeat"><RepeatIcon size={20} /></button>
            </div>
          </div>
          <div className="screen-cap"><strong>Player</strong><span className="meta">play, pause, like</span></div>
        </article>

        <article className="screen" data-reveal>
          <div className="settings">
            <div className={`set ${notify ? "active" : ""}`}><span className="tile"><BellIcon size={18} /></span>Notifications<button type="button" className="switch" role="switch" aria-checked={notify} aria-label="Notifications" onClick={() => setNotify(!notify)} /></div>
            <div className={`set ${dark ? "active" : ""}`}><span className="tile"><MoonIcon size={18} /></span>Dark mode<button type="button" className="switch" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={toggleTheme} /></div>
            <div className="set"><span className="tile"><LockIcon size={18} /></span>Privacy<span className="chev"><ChevronRightIcon size={18} /></span></div>
            <div className="set"><span className="tile"><GlobeIcon size={18} /></span>Language<span className="meta" style={{ marginLeft: "auto" }}>English</span><span className="chev" style={{ marginLeft: 4 }}><ChevronRightIcon size={18} /></span></div>
          </div>
          <div className="screen-cap"><strong>Settings list</strong><span className="meta">the dark mode switch is real</span></div>
        </article>
      </div>
    </section>
  );
}
