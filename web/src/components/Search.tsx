"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, SearchIcon } from "@softstroke/react";
import { DOC_PAGES } from "@/lib/doc-index";
import { savedFramework, snippet } from "@/lib/frameworks";
import { useCopy } from "./CopyCommand";

type Nodes = [string, Record<string, string>][];
type Data = { nodes: Record<string, Nodes>; keywords: Record<string, string[]> };
type Item = { kind: "icon"; name: string } | { kind: "doc"; slug: string; title: string; group: string };

export const openSearch = () => window.dispatchEvent(new Event("ss:search"));

// ⌘K anywhere: icons by name or meaning, and docs pages. Enter on an icon copies its import for the
// framework picked on /icons (React by default); Shift+Enter opens it. Icon data loads on first open.
export function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { state, copy } = useCopy();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ss:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ss:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    requestAnimationFrame(() => input.current?.focus());
    if (!data)
      Promise.all([import("@softstroke/svg/icons.json"), import("@softstroke/svg/keywords.json")])
        .then(([n, k]) => setData({ nodes: n.default as unknown as Record<string, Nodes>, keywords: k.default as Record<string, string[]> }))
        .catch(() => setFailed(true));
  }, [open, data]);

  const items: Item[] = useMemo(() => {
    const t = q.trim().toLowerCase();
    const docs = DOC_PAGES.filter((d) => !t || d.title.toLowerCase().includes(t) || d.group.toLowerCase().includes(t))
      .slice(0, t ? 5 : 3)
      .map((d) => ({ kind: "doc" as const, ...d }));
    if (!data) return docs;
    const names = Object.keys(data.nodes).sort();
    const exact = names.filter((n) => n.includes(t));
    const byWord = t ? names.filter((n) => !n.includes(t) && (data.keywords[n] ?? []).some((k) => k.includes(t))) : [];
    const icons = [...exact, ...byWord].slice(0, 30).map((name) => ({ kind: "icon" as const, name }));
    return [...icons, ...docs];
  }, [q, data]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  function choose(it: Item, openPage = false) {
    if (it.kind === "doc") {
      setOpen(false);
      return router.push(it.slug ? `/docs/${it.slug}/` : "/docs/");
    }
    if (openPage) {
      setOpen(false);
      return router.push(`/icons/?icon=${it.name}`);
    }
    copy(snippet(it.name, savedFramework(), false).imp);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    const cols = 6;
    const icons = items.filter((i) => i.kind === "icon").length;
    const move = (d: number) => { e.preventDefault(); setSel((s) => Math.max(0, Math.min(items.length - 1, s + d))); };
    if (e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowLeft") move(-1);
    else if (e.key === "ArrowDown") move(sel < icons ? Math.min(cols, Math.max(1, icons - sel)) : 1);
    else if (e.key === "ArrowUp") move(sel <= icons && sel >= cols ? -cols : -1);
    else if (e.key === "Enter" && items[sel]) {
      e.preventDefault();
      choose(items[sel], e.shiftKey);
    }
  }

  if (!open) return null;
  const icons = items.filter((i): i is Extract<Item, { kind: "icon" }> => i.kind === "icon");
  const docs = items.filter((i): i is Extract<Item, { kind: "doc" }> => i.kind === "doc");
  const active = items[sel];

  return (
    <div className="cmdk-backdrop" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search icons and docs" onKeyDown={onKey}>
        <label className="cmdk-input">
          <SearchIcon size={18} />
          <input
            ref={input}
            value={q}
            maxLength={50}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons and docs"
            aria-label="Search icons and docs"
            aria-activedescendant={active ? `cmdk-${sel}` : undefined}
          />
          <span className="kbd">esc</span>
        </label>
        <div className="cmdk-body" ref={list} role="listbox">
          {failed && <p className="cmdk-empty">Icons couldn&apos;t load. Check your connection and try again.</p>}
          {!data && !failed && <p className="cmdk-empty">Loading icons…</p>}
          {data && icons.length > 0 && (
            <>
              <p className="cmdk-label">Icons</p>
              <div className="cmdk-icons">
                {icons.map((it, i) => (
                  <button
                    key={it.name}
                    id={`cmdk-${i}`}
                    data-i={i}
                    type="button"
                    role="option"
                    aria-selected={sel === i}
                    title={it.name}
                    className={sel === i ? "on" : ""}
                    onPointerMove={() => setSel(i)}
                    onClick={(e) => choose(it, e.shiftKey)}
                  >
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {data.nodes[it.name].map(([T, a], k) => { const Tag = T as "path"; return <Tag key={k} {...a} />; })}
                    </svg>
                    <span>{it.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {docs.length > 0 && (
            <>
              <p className="cmdk-label">Docs</p>
              {docs.map((it, k) => {
                const i = icons.length + k;
                return (
                  <button key={it.slug || "intro"} id={`cmdk-${i}`} data-i={i} type="button" role="option" aria-selected={sel === i} className={`cmdk-doc ${sel === i ? "on" : ""}`} onPointerMove={() => setSel(i)} onClick={() => choose(it)}>
                    <BookOpenIcon size={18} />
                    {it.title}
                    <span className="meta">{it.group}</span>
                  </button>
                );
              })}
            </>
          )}
          {data && items.length === 0 && (
            <p className="cmdk-empty">Nothing for &ldquo;{q.trim()}&rdquo; yet. Try a simpler word, like &ldquo;arrow&rdquo; or &ldquo;file&rdquo;.</p>
          )}
        </div>
        <div className="cmdk-foot meta">
          {state === "copied" ? <span className="cmdk-ok">Copied the {savedFramework()} import</span> : state === "failed" ? <span>Copy failed</span> : <span>↵ copy import · ⇧↵ open · ↑↓←→ move</span>}
          <span>{savedFramework()}</span>
        </div>
      </div>
    </div>
  );
}
