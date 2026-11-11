"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CopyIcon, DownloadIcon, SearchIcon, XIcon } from "@softstroke/react";
import strokeNodes from "@softstroke/svg/icons.json";
import solidNodes from "@softstroke/svg/icons-solid.json";
import keywords from "@softstroke/svg/keywords.json";
import categories from "@softstroke/svg/categories.json";
import { useCopy } from "../CopyCommand";

type Nodes = [string, Record<string, string>][];
type Style = "stroke" | "solid";

const NAMES = Object.keys(strokeNodes).sort();
const KEYWORDS = keywords as Record<string, string[]>;
const CATEGORY = categories as Record<string, string>;
// Categories alphabetically, each with its icon count and a representative icon (sidebar).
const CAT_ICON: Record<string, string> = {
  Arrows: "arrow-up-right", Commerce: "cart", Communication: "chat", Devices: "smartphone", Editing: "type", Files: "folder",
  Interface: "layout", Media: "play-circle", Objects: "lightbulb", "People and security": "shield-check", Time: "clock",
  Travel: "map-pin", "Weather and nature": "cloud-sun",
};
const CATS = [...new Set(Object.values(CATEGORY))].sort().map((c) => [c, NAMES.filter((n) => CATEGORY[n] === c).length] as const);
const SIZES = [20, 24, 32];

// Same rule as scripts/build.mjs: qr-code -> QrCodeIcon.
const component = (n: string) => `${n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}Icon`;

function toSvg(name: string, style: Style) {
  const nodes = (style === "solid" ? solidNodes : strokeNodes)[name as keyof typeof strokeNodes] as Nodes;
  const head =
    style === "solid"
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
  const body = nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ")}/>`).join("");
  return `${head}${body}</svg>`;
}

// Draws an icon from its shape list: the page already needs the JSON for Copy SVG, so it doesn't also load 600 components.
function Glyph({ name, solid, size, className = "" }: { name: string; solid: boolean; size: number | string; className?: string }) {
  const nodes = (solid ? solidNodes : strokeNodes)[name as keyof typeof strokeNodes] as Nodes;
  const paint = solid ? { fill: "currentColor" } : { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} {...paint}>
      {nodes.map(([Tag, attrs], i) => {
        const T = Tag as "path";
        return <T key={i} {...attrs} />;
      })}
    </svg>
  );
}

function matches(name: string, q: string) {
  return name.includes(q) || (KEYWORDS[name] ?? []).some((k) => k.includes(q));
}

export function IconBrowser() {
  const [query, setQuery] = useState("");
  const [style, setStyle] = useState<Style>("stroke");
  const [size, setSize] = useState(24);
  const [open, setOpen] = useState<string | null>(null);
  const [cat, setCatState] = useState<string | null>(null);
  const results = useRef<HTMLParagraphElement>(null);
  // Picking a category while scrolled down brings the (shorter) results back into view.
  function setCat(c: string | null) {
    setCatState(c);
    const top = results.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 180, behavior: "smooth" });
  }
  // Solid layers join the page the first time solid is shown (halves the page's HTML); after that the switch crossfades.
  const [solidSeen, setSolidSeen] = useState(false);
  useEffect(() => {
    if (style === "solid") setSolidSeen(true);
  }, [style]);
  const input = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const list = useMemo(() => NAMES.filter((n) => (!cat || CATEGORY[n] === cat) && (!q || matches(n, q))), [q, cat]);

  // The view lives in the URL (?q=, ?style=, ?icon=) so any search or icon can be shared.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery((p.get("q") ?? "").slice(0, 50));
    if (p.get("style") === "solid") setStyle("solid");
    const c = p.get("category");
    if (c && CATS.some(([name]) => name === c)) setCatState(c);
    const icon = p.get("icon");
    if (icon && icon in strokeNodes) setOpen(icon);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (style === "solid") p.set("style", "solid");
    if (cat) p.set("category", cat);
    if (open) p.set("icon", open);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [ready, query, style, cat, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== input.current) {
        e.preventDefault();
        input.current?.focus();
      }
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Icons</h1>
      <p className="mt-3 text-lg text-muted">
        {NAMES.length} icons, each in stroke and solid. Click one to copy it.
      </p>

      <div className="liquid sticky top-[5.5rem] z-30 mt-8 flex flex-wrap items-center gap-2 rounded-[24px] p-2">
        <label className="flex min-w-0 flex-1 basis-60 items-center gap-2 rounded-2xl px-3 ring-accent focus-within:ring-2">
          <SearchIcon size={20} className="shrink-0 text-muted" />
          <span className="sr-only">Search icons</span>
          <input
            ref={input}
            value={query}
            maxLength={50}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 310 icons"
            className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted focus-visible:outline-none"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="grid size-8 place-items-center rounded-full text-muted hover:text-ink">
              <XIcon size={18} />
            </button>
          ) : (
            <kbd className="hidden rounded-md px-2 py-0.5 font-mono text-xs text-muted ring-1 ring-[var(--line)] sm:block">/</kbd>
          )}
        </label>
        <Segmented label="Style" value={style} options={["stroke", "solid"]} onChange={setStyle} />
        <Segmented label="Size" value={size} options={SIZES} onChange={setSize} format={(s) => `${s}`} />
      </div>

      <div role="group" aria-label="Category" className="-mx-4 mt-4 flex snap-x lg:hidden gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {[[null, NAMES.length] as const, ...CATS].map(([c, count]) => (
          <button
            key={c ?? "all"}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ring-1 transition-colors duration-300 ${
              cat === c ? "bg-accent text-accent-ink ring-accent" : "text-muted ring-[var(--line)] hover:text-ink"
            }`}
          >
            {c ?? "All"}
            <span className={`text-xs ${cat === c ? "text-accent-ink" : "text-muted"}`}>{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div role="group" aria-label="Category" data-lenis-prevent className="sticky top-44 max-h-[calc(100dvh-12rem)] space-y-0.5 overflow-y-auto pb-2">
            {[[null, NAMES.length] as const, ...CATS].map(([c, count]) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  cat === c ? "bg-accent/10 font-medium text-accent-text" : "text-muted hover:bg-[var(--glass)] hover:text-ink"
                }`}
              >
                <Glyph name={c ? CAT_ICON[c] : "grid"} solid={cat === c} size={18} className="shrink-0" />
                <span className="flex-1 truncate">{c ?? "All icons"}</span>
                <span className="text-xs tabular-nums">{count}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="min-w-0">
      <p ref={results} className="mb-4 mt-6 scroll-mt-44 text-sm text-muted lg:mt-0" aria-live="polite">
        {q
          ? `${list.length} ${list.length === 1 ? "result" : "results"} for "${query.trim()}"${cat ? ` in ${cat}` : ""}`
          : cat
            ? `${list.length} icons in ${cat}`
            : `All ${NAMES.length} icons`}
      </p>

      {list.length === 0 ? (
        <div className="glass grid place-items-center rounded-[32px] px-6 py-20 text-center">
          <SearchIcon size={40} className="text-muted" />
          <p className="mt-4 font-display text-xl font-semibold">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
          <p className="mt-1 max-w-[40ch] text-muted">Try a simpler word, like &ldquo;arrow&rdquo;, &ldquo;file&rdquo; or &ldquo;user&rdquo;.</p>
          <button type="button" onClick={() => { setQuery(""); setCat(null); }} className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink active:scale-[0.98]">
            {cat ? "Clear search and category" : "Clear search"}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
          {list.map((n, i) => {
            const layer = "col-start-1 row-start-1 transition-[opacity,scale] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]";
            return (
              <li key={n} className="animate-[tile-in_.5s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: `${Math.min(i, 40) * 12}ms` }}>
                <button
                  type="button"
                  onClick={() => setOpen(n)}
                  className={`group flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[20px] p-2 transition-[background-color,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[var(--glass)] hover:shadow-[var(--shadow)] ${
                    open === n ? "bg-[var(--glass)] ring-2 ring-accent" : ""
                  }`}
                >
                  <span className="inline-grid" style={{ width: size, height: size }}>
                    <Glyph name={n} solid={false} size={size} className={`${layer} ${style === "solid" ? "scale-50 opacity-0" : "opacity-100"}`} />
                    {solidSeen && <Glyph name={n} solid size={size} className={`${layer} ${style === "solid" ? "opacity-100" : "scale-50 opacity-0"}`} />}
                  </span>
                  <span className="w-full truncate px-1 text-center text-[11px] text-muted group-hover:text-ink">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
        </div>
      </div>

      <Detail name={open} style={style} onClose={() => setOpen(null)} />
    </div>
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  const i = options.indexOf(value);
  return (
    <div role="group" aria-label={label} className="relative grid rounded-2xl bg-[var(--glass)] p-1 ring-1 ring-[var(--line)]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      <span
        aria-hidden
        className="absolute bottom-1 left-1 top-1 rounded-xl bg-accent transition-transform duration-500 ease-[cubic-bezier(.34,1.3,.64,1)]"
        style={{ width: `calc((100% - 0.5rem) / ${options.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={`relative h-9 rounded-xl px-3.5 text-sm capitalize transition-colors duration-300 ${o === value ? "text-accent-ink" : "text-muted hover:text-ink"}`}
        >
          {format(o)}
        </button>
      ))}
    </div>
  );
}

function Detail({ name, style, onClose }: { name: string | null; style: Style; onClose: () => void }) {
  const [view, setView] = useState<Style>(style);
  const [shown, setShown] = useState(name);
  const jsx = useCopy();
  const imp = useCopy();
  const svg = useCopy();
  const share = useCopy();

  useEffect(() => setView(style), [style, name]);
  // Keep the last icon rendered while the panel slides out.
  useEffect(() => {
    if (name) setShown(name);
  }, [name]);

  const n = shown;
  const C = n ? component(n) : null;
  const from = view === "solid" ? "@softstroke/react/solid" : "@softstroke/react";

  function download() {
    if (!n) return;
    const url = URL.createObjectURL(new Blob([toSvg(n, view)], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${n}${view === "solid" ? "-solid" : ""}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }


  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[#06101f]/30 transition-opacity duration-500 ${name ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={n ?? "Icon details"}
        data-lenis-prevent
        className={`liquid fixed z-50 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] max-sm:inset-x-2 max-sm:bottom-2 max-sm:max-h-[85dvh] max-sm:rounded-[28px] sm:bottom-4 sm:right-4 sm:top-4 sm:w-[380px] sm:rounded-[32px] ${
          name ? "translate-x-0 translate-y-0" : "max-sm:translate-y-[110%] sm:translate-x-[110%]"
        }`}
        style={{ background: "var(--bg-1)" }}
      >
        {n && C && (
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">{n}</h2>
                <p className="font-mono text-sm text-muted">{C}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full text-muted hover:bg-[var(--glass)] hover:text-ink">
                <XIcon size={20} />
              </button>
            </div>

            <div className="relative mt-5 grid aspect-square place-items-center overflow-hidden rounded-[24px] bg-[var(--glass)] ring-1 ring-[var(--line)]">
              <svg viewBox="0 0 24 24" className="absolute inset-[8%] text-accent-text opacity-25" aria-hidden>
                {Array.from({ length: 25 }, (_, i) => (
                  <path key={i} d={`M${i} 0v24M0 ${i}h24`} stroke="currentColor" strokeWidth={0.03} />
                ))}
                <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={0.06} />
              </svg>
              <Glyph key={view} name={n} solid={view === "solid"} size="84%" className="relative animate-[tile-in_.4s_cubic-bezier(.16,1,.3,1)_both]" />
            </div>

            <div className="mt-4">
              <Segmented label="Style" value={view} options={["stroke", "solid"]} onChange={setView} />
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {(KEYWORDS[n] ?? []).map((k) => (
                <span key={k} className="rounded-full bg-[var(--glass)] px-2.5 py-1 text-xs text-muted ring-1 ring-[var(--line)]">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-2">
              <Action label="Copy JSX" hint={`<${C} />`} state={jsx.state} onClick={() => jsx.copy(`<${C} />`)} />
              <Action label="Copy import" hint={`from "${from}"`} state={imp.state} onClick={() => imp.copy(`import { ${C} } from "${from}";`)} />
              <Action label="Copy SVG" hint={`${view}, 24px`} state={svg.state} onClick={() => svg.copy(toSvg(n, view))} />
              <Action label="Copy link" hint="to this icon" state={share.state} onClick={() => share.copy(window.location.href)} />
              <button
                type="button"
                onClick={download}
                className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-accent-ink transition-transform active:scale-[0.98]"
              >
                <DownloadIcon size={18} />
                Download SVG
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Action({ label, hint, state, onClick }: { label: string; hint: string; state: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-[var(--glass)] px-4 py-3 text-left text-sm ring-1 ring-[var(--line)] transition-[background-color,scale] hover:ring-accent active:scale-[0.98]"
    >
      <span className="font-medium">{label}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{hint}</span>
      <span aria-live="polite" className="text-xs">
        {state === "copied" ? <span className="text-accent-text">Copied</span> : state === "failed" ? <span className="text-muted">Copy failed</span> : <CopyIcon size={16} className="text-muted" />}
      </span>
    </button>
  );
}
