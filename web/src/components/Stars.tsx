"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@softstroke/react/solid";

const KEY = "ss-stars";
const API = "https://api.github.com/repos/softstroke/softstroke";

// Live GitHub star count, cached for an hour (the API allows 60 calls an hour per visitor).
// Renders nothing until a number arrives, and nothing at all if GitHub can't be reached.
export function Stars() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (c && Date.now() - c.t < 3600e3) return setN(c.n);
    } catch {}
    const ctl = new AbortController();
    fetch(API, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.stargazers_count !== "number") return;
        setN(d.stargazers_count);
        try { localStorage.setItem(KEY, JSON.stringify({ n: d.stargazers_count, t: Date.now() })); } catch {}
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);
  if (n === null) return null;
  return (
    <span className="gh-n">
      <StarIcon size={12} />
      {n.toLocaleString("en")}
      <span className="sr-only"> stars</span>
    </span>
  );
}
