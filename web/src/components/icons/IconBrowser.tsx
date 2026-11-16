"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon, SearchIcon, SparklesIcon, XIcon } from "@softstroke/react";
import keywords from "@softstroke/svg/keywords.json";
import categories from "@softstroke/svg/categories.json";
import { useCopy } from "../CopyCommand";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { FeedbackLink } from "../Feedback";
import { ICON_COUNT } from "@/lib/count";
import { FRAMEWORKS, savedFramework, saveFramework, snippet, type Framework } from "@/lib/frameworks";
import { IS_NEW, NEW_VERSION } from "@/lib/new-icons";
import { zip } from "@/lib/zip";
import { Glyph, loadSolid, NAMES, save, SOLID, toSvg, useSolid, type Style } from "@/lib/shapes";
import { Select } from "../Select";
import { suggest } from "@/lib/suggest";


const KEYWORDS = keywords as Record<string, string[]>;
const CATEGORY = categories as Record<string, string>;
// Categories alphabetically, each with its icon count and a representative icon (sidebar).
const CAT_ICON: Record<string, string> = {
  Arrows: "arrow-up-right", "Charts and data": "bar-chart", Commerce: "cart", Communication: "chat", Development: "code", Devices: "smartphone",
  Editing: "type", Files: "folder",
  Interface: "layout", Media: "play-circle", Objects: "lightbulb", "People and security": "shield-check", Time: "clock",
  Travel: "map-pin", "Weather and nature": "cloud-sun",
};
const CATS = [...new Set(Object.values(CATEGORY))].sort().map((c) => [c, NAMES.filter((n) => CATEGORY[n] === c).length] as const);
const SIZES = [20, 24, 32];

const NEW_CAT = "__new";

// Same rule as scripts/build.mjs: qr-code -> QrCodeIcon.
const component = (n: string) => `${n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}Icon`;


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
  useSolid(solidSeen);
  useEffect(() => {
    const id = setTimeout(() => loadSolid().catch(() => {}), 2500);
    return () => clearTimeout(id);
  }, []);
  // Pick several icons, then download them as a ZIP or one sprite.
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const q = query.trim().toLowerCase();
  const inCat = (n: string) => !cat || (cat === NEW_CAT ? IS_NEW.has(n) : CATEGORY[n] === cat);
  const list = useMemo(() => NAMES.filter((n) => inCat(n) && (!q || matches(n, q))), [q, cat]); // eslint-disable-line react-hooks/exhaustive-deps
  const catName = cat === NEW_CAT ? `New in ${NEW_VERSION}` : cat;

  // The view lives in the URL (?q=, ?style=, ?icon=) so any search or icon can be shared.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery((p.get("q") ?? "").slice(0, 50));
    if (p.get("style") === "solid") setStyle("solid");
    const c = p.get("category");
    if (c && CATS.some(([name]) => name === c)) setCatState(c);
    if (p.get("new") === "1") setCatState(NEW_CAT);
    const icon = p.get("icon");
    if (icon && NAMES.includes(icon)) setOpen(icon);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (style === "solid") p.set("style", "solid");
    if (cat === NEW_CAT) p.set("new", "1");
    else if (cat) p.set("category", cat);
    if (open) p.set("icon", open);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [ready, query, style, cat, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // "/" jumps to search, but never while typing somewhere else (the feedback modal's fields, for one).
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));
      if (e.key === "/" && !typing && document.activeElement !== input.current) {
        e.preventDefault();
        input.current?.focus();
      }
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="wrap page">
      <p className="eyebrow">Icons</p>
      <h1 className="display page-title">Every icon, on one sheet</h1>
      <p className="lede">
        {NAMES.length} icons, each in stroke and solid. Search by name or meaning, then open one to copy or download it.
      </p>

      <div className="liquid sticky top-[76px] z-30 mt-10 flex flex-wrap items-center gap-2 rounded-[14px] p-1.5">
        <label className="flex min-w-0 flex-1 basis-60 items-center gap-2 rounded-[10px] px-3 ring-accent focus-within:ring-2">
          <SearchIcon size={20} className="shrink-0 text-muted" />
          <span className="sr-only">Search icons</span>
          <input
            ref={input}
            value={query}
            maxLength={50}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${ICON_COUNT} icons`}
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
        <button
          type="button"
          aria-pressed={selecting}
          onClick={() => { setSelecting(!selecting); if (selecting) setPicked([]); }}
          className={`h-10 rounded-[10px] px-3.5 text-[13px] ring-1 transition-colors ${selecting ? "bg-ink text-[var(--bg)] ring-ink" : "text-muted ring-[var(--line)] hover:text-ink"}`}
        >
          {selecting ? "Done" : "Select"}
        </button>
      </div>

      <div role="group" aria-label="Category" className="-mx-4 mt-4 flex snap-x lg:hidden gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {[[null, NAMES.length] as const, [NEW_CAT, IS_NEW.size] as const, ...CATS].map(([c, count]) => (
          <button
            key={c ?? "all"}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`flex shrink-0 snap-start items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] ring-1 transition-colors duration-300 ${
              cat === c ? "bg-ink text-[var(--bg)] ring-ink" : "text-muted ring-[var(--line)] hover:text-ink"
            }`}
          >
            {c === NEW_CAT ? `New in ${NEW_VERSION}` : c ?? "All"}
            <span className={`font-mono text-[11px] ${cat === c ? "opacity-70" : "text-faint"}`}>{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div role="group" aria-label="Category" className="sticky top-[150px] max-h-[calc(100dvh-170px)] space-y-0.5 overflow-y-auto pb-2">
            {[[null, NAMES.length] as const, [NEW_CAT, IS_NEW.size] as const, ...CATS].map(([c, count]) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  cat === c ? "bg-[var(--surface)] font-medium text-ink shadow-[0_0_0_1px_var(--line)] [&>svg]:text-accent" : "text-muted hover:bg-[var(--surface-2)] hover:text-ink"
                }`}
              >
                {c === NEW_CAT ? <SparklesIcon size={18} className="shrink-0" /> : <Glyph name={c ? CAT_ICON[c] : "grid"} solid={cat === c} size={18} className="shrink-0" />}
                <span className="flex-1 truncate">{c === NEW_CAT ? `New in ${NEW_VERSION}` : c ?? "All icons"}</span>
                <span className="font-mono text-[11px] tabular-nums text-faint">{count}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="min-w-0">
      <p ref={results} className="meta mb-4 mt-6 scroll-mt-40 lg:mt-0" aria-live="polite">
        {q
          ? `${list.length} ${list.length === 1 ? "result" : "results"} for "${query.trim()}"${cat ? ` in ${catName}` : ""}`
          : cat === NEW_CAT
            ? `${list.length} icons new in ${NEW_VERSION}`
            : cat
            ? `${list.length} icons in ${cat}`
            : `All ${NAMES.length} icons`}
      </p>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-[14px] border border-dashed border-[var(--line-2)] px-6 py-20 text-center">
          <SearchIcon size={40} className="text-muted" />
          <p className="mt-4 font-display text-xl font-semibold">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
          {(() => {
            const near = suggest(query, NAMES, KEYWORDS);
            return near.length ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-muted">Did you mean</span>
                {near.map((n) => (
                  <button key={n} type="button" onClick={() => { setQuery(n); setCat(null); }} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[13px] ring-1 ring-[var(--line-2)] hover:text-accent">
                    <Glyph name={n} solid={false} size={16} />{n}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1 max-w-[40ch] text-muted">Try a simpler word, like &ldquo;arrow&rdquo;, &ldquo;file&rdquo; or &ldquo;user&rdquo;.</p>
            );
          })()}
          <button type="button" onClick={() => { setQuery(""); setCat(null); }} className="btn btn-primary mt-6">
            {cat ? "Clear search and category" : "Clear search"}
          </button>
          <FeedbackLink kind="request" prefill={{ name: query.trim().slice(0, 60) }} className="mt-3 text-sm text-accent-text hover:underline">
            Request &ldquo;{query.trim()}&rdquo; as a new icon
          </FeedbackLink>
        </div>
      ) : (
        <ul className="icon-sheet">
          {list.map((n, i) => {
            const layer = "col-start-1 row-start-1 transition-[opacity,scale] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]";
            return (
              <li key={n} className="animate-[tile-in_.5s_cubic-bezier(.2,.7,.2,1)_both]" style={{ animationDelay: `${Math.min(i, 40) * 12}ms` }}>
                <button
                  type="button"
                  aria-pressed={selecting ? picked.includes(n) : undefined}
                  onClick={() => (selecting ? toggle(n) : setOpen(n))}
                  className={`group relative flex aspect-square w-full flex-col items-center justify-center gap-3 p-2 transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-accent ${
                    open === n || picked.includes(n) ? "bg-[var(--surface-2)] text-accent shadow-[inset_0_0_0_1.5px_var(--accent)]" : ""
                  }`}
                >
                  {IS_NEW.has(n) && <span className="absolute right-2 top-2 rounded bg-accent/10 px-1 font-mono text-[10px] leading-4 text-accent-text">new</span>}
                  {selecting && (
                    <span className={`absolute left-2 top-2 grid size-4 place-items-center rounded ring-1 ${picked.includes(n) ? "bg-accent text-accent-ink ring-accent" : "ring-[var(--line-2)]"}`}>
                      {picked.includes(n) && <CheckIcon size={12} strokeWidth={2} />}
                    </span>
                  )}
                  <span className="inline-grid" style={{ width: size, height: size }}>
                    <Glyph name={n} solid={false} size={size} className={`${layer} ${style === "solid" ? "scale-50 opacity-0" : "opacity-100"}`} />
                    {solidSeen && SOLID && <Glyph name={n} solid size={size} className={`${layer} ${style === "solid" ? "opacity-100" : "scale-50 opacity-0"}`} />}
                  </span>
                  <span className="w-full truncate px-1 text-center font-mono text-xs text-faint group-hover:text-muted">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
        </div>
      </div>

      {picked.length > 0 && <PickBar picked={picked} style={style} onClear={() => setPicked([])} />}
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
    <div role="group" aria-label={label} className="relative grid rounded-[10px] bg-[var(--surface-2)] p-1 ring-1 ring-[var(--line)]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      <span
        aria-hidden
        className="absolute bottom-1 left-1 top-1 rounded-[7px] bg-[var(--surface)] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--line)] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{ width: `calc((100% - 0.5rem) / ${options.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={`relative h-8 rounded-[7px] px-3.5 text-[13px] capitalize transition-colors duration-300 ${o === value ? "text-ink" : "text-muted hover:text-ink"}`}
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
  const [fw, setFw] = useState<Framework>("React");
  useEffect(() => setFw(savedFramework()), []);
  useSolid(!!name);
  const svg = useCopy();
  const share = useCopy();
  const shad = useCopy();

  useEffect(() => setView(style), [style, name]);
  // Keep the last icon rendered while the panel slides out.
  useEffect(() => {
    if (name) setShown(name);
  }, [name]);

  const n = shown;
  const C = n ? component(n) : null;

  function download() {
    if (!n) return;
    save(new Blob([toSvg(n, view)], { type: "image/svg+xml" }), `${n}${view === "solid" ? "-solid" : ""}.svg`);
  }


  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/30 transition-opacity duration-500 ${name ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={n ?? "Icon details"}
        className={`liquid fixed z-[60] overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] max-sm:inset-x-2 max-sm:bottom-2 max-sm:max-h-[85dvh] max-sm:rounded-[20px] sm:bottom-4 sm:right-4 sm:top-4 sm:w-[380px] sm:rounded-[20px] ${
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

            <div className="relative mt-5 grid aspect-square place-items-center overflow-hidden rounded-[14px] bg-[var(--surface-2)] ring-1 ring-[var(--line)]">
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
                <span key={k} className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs text-muted">
                  {k}
                </span>
              ))}
            </div>

            {/* minmax(0,1fr): without it the column grows to the longest code hint and pushes the rows past the card */}
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-2">
              <label className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Copy for</span>
                <Select value={fw} onChange={(e) => { const v = e.target.value as Framework; setFw(v); saveFramework(v); }}>
                  {FRAMEWORKS.map((f) => <option key={f}>{f}</option>)}
                </Select>
              </label>
              <Action label="Copy code" hint={snippet(n, fw, view === "solid").use} state={jsx.state} onClick={() => jsx.copy(snippet(n, fw, view === "solid").use)} />
              <Action label="Copy import" hint={snippet(n, fw, view === "solid").imp} state={imp.state} onClick={() => imp.copy(snippet(n, fw, view === "solid").imp)} />
              <Action label="Copy SVG" hint={`${view}, 24px`} state={svg.state} onClick={() => svg.copy(toSvg(n, view))} />
              {fw === "React" && <Action label="Copy shadcn" hint="npx shadcn add" state={shad.state} onClick={() => shad.copy(`npx shadcn@latest add ${SITE_URL}/r/${n}${view === "solid" ? "-solid" : ""}.json`)} />}
              <Action label="Copy link" hint="to this icon" state={share.state} onClick={() => share.copy(window.location.href)} />
              <button
                type="button"
                onClick={download}
                className="flex items-center justify-center gap-2 rounded-[10px] bg-[var(--btn)] px-4 py-3 text-sm font-medium text-[var(--btn-ink)] transition-transform active:scale-[0.98]"
              >
                <DownloadIcon size={18} />
                Download SVG
              </button>
              <Link href={`/icons/${n}/`} className="py-1 text-center text-sm text-accent-text hover:underline">
                Open the {n} page
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


// Shown while icons are picked: download them as single SVG files in a ZIP, or as one sprite of <symbol>s.
function PickBar({ picked, style, onClear }: { picked: string[]; style: Style; onClear: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const suffix = style === "solid" ? "-solid" : "";
  async function run(kind: "zip" | "sprite") {
    setBusy(true);
    setError(false);
    try {
      if (style === "solid") await loadSolid();
      if (kind === "zip") {
        save(zip(picked.map((n) => ({ name: `${n}${suffix}.svg`, text: toSvg(n, style) }))), `softstroke-${picked.length}-icons${suffix}.zip`);
      } else {
        const symbols = picked.map((n) => toSvg(n, style).replace(/^<svg[^>]*>/, `<symbol id="${n}" viewBox="0 0 24 24">`).replace(/<\/svg>$/, "</symbol>"));
        const paint = style === "solid" ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
        save(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" ${paint}>${symbols.join("")}</svg>`], { type: "image/svg+xml" }), `softstroke-sprite${suffix}.svg`);
      }
    } catch {
      setError(true);
    }
    setBusy(false);
  }
  return (
    <div className="pick-bar" role="region" aria-label="Selected icons">
      <span><b>{picked.length}</b> selected · {style}</span>
      {error && <span className="text-accent-text">Download failed, try again</span>}
      <button type="button" className="btn btn-primary" disabled={busy} onClick={() => run("zip")}><DownloadIcon size={16} />ZIP</button>
      <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => run("sprite")}>Sprite</button>
      <button type="button" className="icon-btn" aria-label="Clear selection" onClick={onClear}><XIcon size={18} /></button>
    </div>
  );
}

function Action({ label, hint, state, onClick }: { label: string; hint: string; state: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[10px] bg-[var(--surface)] px-4 py-3 text-left text-sm ring-1 ring-[var(--line)] transition-[background-color,scale] hover:bg-[var(--surface-2)] active:scale-[0.98]"
    >
      <span className="shrink-0 font-medium">{label}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{hint}</span>
      <span aria-live="polite" className="text-xs">
        {state === "copied" ? <span className="text-accent-text">Copied</span> : state === "failed" ? <span className="text-muted">Copy failed</span> : <CopyIcon size={16} className="text-muted" />}
      </span>
    </button>
  );
}
