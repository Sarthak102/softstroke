"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@softstroke/react";

type Groups = { title: string; pages: { slug: string; title: string }[] }[];

export function DocsSidebar({ groups, current }: { groups: Groups; current: string }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const term = q.trim().toLowerCase();
  const shown = groups
    .map((g) => ({ ...g, pages: g.pages.filter((p) => !term || p.title.toLowerCase().includes(term) || g.title.toLowerCase().includes(term)) }))
    .filter((g) => g.pages.length);

  const list = (
    <>
      <label className="mb-6 flex items-center gap-2 rounded-2xl bg-[var(--glass)] px-3 ring-1 ring-[var(--line)] focus-within:ring-2 focus-within:ring-accent">
        <SearchIcon size={16} className="shrink-0 text-muted" />
        <span className="sr-only">Search docs</span>
        <input
          ref={input}
          value={q}
          maxLength={40}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search docs"
          className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted focus-visible:outline-none"
        />
        <kbd className="hidden rounded-md px-1.5 font-mono text-[11px] text-muted ring-1 ring-[var(--line)] lg:block">⌘K</kbd>
      </label>
      {shown.length === 0 && <p className="text-sm text-muted">No page matches &ldquo;{q.trim()}&rdquo;.</p>}
      {shown.map((g) => (
        <div key={g.title} className="mb-6">
          <p className="mb-2 px-3 text-xs font-medium text-muted">{g.title}</p>
          <ul className="space-y-0.5">
            {g.pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.slug ? `/docs/${p.slug}/` : "/docs/"}
                  aria-current={p.slug === current ? "page" : undefined}
                  className={`block rounded-xl px-3 py-1.5 text-sm transition-colors ${
                    p.slug === current ? "bg-accent/10 font-medium text-accent-text" : "text-muted hover:bg-[var(--glass)] hover:text-ink"
                  }`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <>
      <details className="glass rounded-[20px] p-3 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-1 text-sm font-medium">
          Browse docs
          <ChevronDownIcon size={18} className="text-muted" />
        </summary>
        <div className="mt-4">{list}</div>
      </details>
      <aside data-lenis-prevent className="sticky top-28 hidden h-[calc(100dvh-8rem)] overflow-y-auto pr-2 lg:block">
        {list}
      </aside>
    </>
  );
}
