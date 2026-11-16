"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siGithub } from "simple-icons";
import { XIcon } from "@softstroke/react";
import { GITHUB_URL } from "@/lib/site";
import { Brand } from "./Brand";
import { Stars } from "./Stars";

const KEY = "ss-star-nudge";
const DELAY = 30_000;

// A small "star us on GitHub" card, bottom right, after half a minute on the site. Once closed or clicked
// it never comes back for this browser. Not shown on the capture pages (og image, scenes).
export function StarNudge() {
  const path = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(KEY)) return; } catch { return; }
    const id = setTimeout(() => setShow(true), DELAY);
    return () => clearTimeout(id);
  }, []);

  function done() {
    setShow(false);
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  if (path.startsWith("/og") || path.startsWith("/scenes")) return null;
  return (
    <aside className={`nudge ${show ? "show" : ""}`} aria-hidden={!show} aria-label="Star Softstroke on GitHub">
      <button type="button" className="nudge-x" aria-label="Close" tabIndex={show ? 0 : -1} onClick={done}><XIcon size={16} /></button>
      <p className="nudge-t">Enjoying Softstroke?</p>
      <p className="nudge-d">A star on GitHub helps more people find it.</p>
      <a href={GITHUB_URL} className="nudge-btn" tabIndex={show ? 0 : -1} onClick={done}>
        <Brand logo={siGithub} size={16} />
        Star us
        <Stars />
      </a>
    </aside>
  );
}
