"use client";

import { useEffect, useState } from "react";

const KEY = "ss-downloads";
const PKGS = ["react", "react-native", "vue", "svelte", "angular", "svg", "font"];

// Weekly npm downloads across all packages, cached for an hour. Renders nothing until it has a number,
// and nothing at all if npm can't be reached.
export function Downloads({ suffix = "/week" }: { suffix?: string }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (c && Date.now() - c.t < 3600e3) return setN(c.n);
    } catch {}
    const ctl = new AbortController();
    Promise.all(PKGS.map((p) => fetch(`https://api.npmjs.org/downloads/point/last-week/@softstroke/${p}`, { signal: ctl.signal }).then((r) => (r.ok ? r.json() : null))))
      .then((all) => {
        const total = all.reduce((s, d) => s + (typeof d?.downloads === "number" ? d.downloads : 0), 0);
        if (!total) return;
        setN(total);
        try { localStorage.setItem(KEY, JSON.stringify({ n: total, t: Date.now() })); } catch {}
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);
  if (n === null) return null;
  const v = n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
  return <span className="gh-n">{v}{suffix}<span className="sr-only"> npm downloads</span></span>;
}
