"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRightIcon, CopyIcon, DownloadIcon, LinkIcon, SearchIcon, XIcon } from "@softstroke/react";
import keywords from "@softstroke/svg/keywords.json";
import { FRAMEWORKS, savedFramework, saveFramework, snippet, type Framework } from "@/lib/frameworks";
import { Glyph, NAMES, save, toSvg, useSolid } from "@/lib/shapes";
import { suggest } from "@/lib/suggest";
import { COLOR_HEX, ColorPicker } from "./ColorPicker";
import { useCopy } from "./CopyCommand";
import { Select } from "./Select";

const KEYWORDS = keywords as Record<string, string[]>;
const START = ["home", "heart", "bell", "camera", "chat", "settings", "star", "rocket", "music", "wallet", "lock", "sparkles"];
const COLORS = [
  { name: "Ink", value: "currentColor", css: "var(--text)" },
  { name: "Tangerine", value: "#ff6b3d", css: "#ff6b3d" },
  { name: "Moss", value: "#4f8a5b", css: "#4f8a5b" },
  { name: "Harbour", value: "#3b7bd9", css: "#3b7bd9" },
  { name: "Plum", value: "#8b5cc4", css: "#8b5cc4" },
];
const GROUNDS = ["Light", "Dark", "Tangerine"] as const;
type Ground = (typeof GROUNDS)[number];
// Ink is currentColor, so its swatch shows what it draws in on each ground.
const INK: Record<Ground, [string, string]> = { Light: ["Ink", "#141412"], Dark: ["White", "#f4f3ef"], Tangerine: ["White", "#ffffff"] };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pct = (v: number, min: number, max: number) => ({ "--p": `${((v - min) / (max - min)) * 100}%` }) as React.CSSProperties;
const title = (n: string) => n.charAt(0).toUpperCase() + n.slice(1).replace(/-/g, " ");

// Live controls: every value here is a real prop of the packages, and the code below follows the chosen framework.
// The whole setup lives in the URL so it can be shared.
export function Playground() {
  const [icons, setIcons] = useState(START);
  const [focus, setFocus] = useState("heart");
  const [size, setSize] = useState(32);
  const [stroke, setStroke] = useState(1.5);
  const [color, setColor] = useState(COLORS[0].value);
  const [solid, setSolid] = useState(false);
  const [ground, setGround] = useState<Ground>("Light");
  const [fw, setFw] = useState<Framework>("React");
  const [query, setQuery] = useState("");
  const [flip, setFlip] = useState(0);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState(0);
  useSolid(true); // the in-use tab bar shows its active tab solid
  // Tangerine on the tangerine ground draws nothing: that swatch is hidden there and falls back to ink.
  const swatches = COLORS.filter((c) => !(ground === "Tangerine" && c.name === "Tangerine"));
  useEffect(() => {
    if (ground === "Tangerine" && color === "#ff6b3d") setColor("currentColor");
  }, [ground, color]);

  // Read the shared setup once; anything malformed falls back to the default.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const list = (p.get("icons") ?? "").split(",").filter((n) => NAMES.includes(n)).slice(0, 12);
    if (list.length) setIcons(list);
    const f = p.get("focus");
    setFocus(f && NAMES.includes(f) ? f : (list[0] ?? "heart"));
    const s = Number(p.get("size"));
    if (s) setSize(clamp(Math.round(s / 4) * 4, 16, 56));
    const w = Number(p.get("stroke"));
    if (w) setStroke(clamp(Math.round(w * 4) / 4, 1, 2.5));
    const c = p.get("color");
    if (c && COLOR_HEX.test(`#${c}`)) setColor(`#${c.toLowerCase()}`);
    setSolid(p.get("style") === "solid");
    const g = p.get("ground");
    if (GROUNDS.includes(g as Ground)) setGround(g as Ground);
    const fwp = p.get("fw");
    setFw(FRAMEWORKS.includes(fwp as Framework) ? (fwp as Framework) : savedFramework());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams({ icons: icons.join(","), focus, size: String(size), stroke: String(stroke), style: solid ? "solid" : "stroke", ground, fw });
    if (color !== "currentColor") p.set("color", color.slice(1));
    window.history.replaceState(null, "", `?${p}`);
  }, [ready, icons, focus, size, stroke, color, solid, ground, fw]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => (q ? NAMES.filter((n) => n.includes(q) || (KEYWORDS[n] ?? []).some((k) => k.includes(q))).slice(0, 24) : []), [q]);
  const hint = q && !results.length ? suggest(q, NAMES, KEYWORDS) : [];

  function pick(n: string) {
    setIcons((list) => [n, ...list.filter((x) => x !== n)].slice(0, 12));
    setFocus(n);
    setFlip((f) => f + 1);
  }

  const code = snippet(focus, fw, solid, { size, strokeWidth: stroke, color });
  const copyCode = useCopy();
  const copySvg = useCopy();
  const copyLink = useCopy();
  const paint = { solid, strokeWidth: stroke, color };

  return (
    <>
    <div className="play-grid" data-reveal>
      <div className="panel">
        <div className="field">
          <label className="field-head" htmlFor="play-search"><span>Icons</span><span className="meta">{NAMES.length} to pick from</span></label>
          <div className="play-search">
            <SearchIcon size={16} />
            <input id="play-search" type="search" placeholder="Search, then click to add" value={query} maxLength={50} onChange={(e) => setQuery(e.target.value)} />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><XIcon size={14} /></button>}
          </div>
          {results.length > 0 && (
            <div className="play-results">
              {results.map((n) => (
                <button key={n} type="button" title={n} aria-label={`Add ${n}`} onClick={() => pick(n)}>
                  <Glyph name={n} solid={false} size={20} />
                </button>
              ))}
            </div>
          )}
          {q && !results.length && (
            <p className="meta">
              No icon matches “{query}”.
              {hint.length > 0 && <> Try {hint.map((h, i) => <button key={h} type="button" className="play-hint" onClick={() => setQuery(h)}>{h}{i < hint.length - 1 ? "," : ""}</button>)}</>}
            </p>
          )}
        </div>
        <label className="field">
          <span className="field-head"><span>Size</span><span className="meta">{size}px</span></span>
          <input type="range" min={16} max={56} step={4} value={size} onChange={(e) => setSize(+e.target.value)} style={pct(size, 16, 56)} />
        </label>
        <label className="field">
          <span className="field-head"><span>Stroke width</span><span className="meta">{solid ? "solid has no stroke" : stroke.toFixed(2)}</span></span>
          <input type="range" min={1} max={2.5} step={0.25} value={stroke} disabled={solid} onChange={(e) => setStroke(+e.target.value)} style={pct(stroke, 1, 2.5)} />
        </label>
        <div className="field">
          <span className="field-head"><span>Color</span><span className="meta">{color}</span></span>
          <div className="swatches">
            {swatches.map((c) => {
              const [name, css] = c.value === "currentColor" ? INK[ground] : [c.name, c.css];
              return <button key={c.name} type="button" className="sw" title={name} aria-label={name} aria-pressed={color === c.value} style={{ "--c": css } as React.CSSProperties} onClick={() => { setColor(c.value); setFlip((f) => f + 1); }} />;
            })}
            <ColorPicker value={color} active={!COLORS.some((c) => c.value === color)} onChange={setColor} />
          </div>
        </div>
        <div className="field">
          <span className="field-head"><span>Style</span></span>
          <div className="seg" role="group" aria-label="Style" style={{ width: "max-content" }}>
            {(["Stroke", "Solid"] as const).map((s) => (
              <button key={s} type="button" aria-pressed={solid === (s === "Solid")} onClick={() => { setSolid(s === "Solid"); setFlip((f) => f + 1); }}>{s}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-head"><span>Background</span></span>
          <div className="seg" role="group" aria-label="Background" style={{ width: "max-content" }}>
            {GROUNDS.map((g) => (
              <button key={g} type="button" aria-pressed={ground === g} onClick={() => setGround(g)}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="preview">
        <div className={`panel play-stage ground-${ground.toLowerCase()}`}>
          <div className="preview-grid" key={flip}>
            {icons.map((n, i) => (
              <button key={n} type="button" title={n} aria-label={`Show code for ${n}`} aria-pressed={n === focus} onClick={() => setFocus(n)}>
                <Glyph name={n} size={size} {...paint} className={flip ? "flip" : undefined} style={{ "--d": `${i * 30}ms` } as React.CSSProperties} />
              </button>
            ))}
          </div>

          {/* The same settings in real UI: a button, a tab bar and a list row. */}
          <div className="play-context" role="group" aria-label="In use">
            <figure>
              <button type="button" className="ctx-btn">
                <Glyph name={focus} size={18} {...paint} />{title(focus)}
              </button>
              <figcaption>Button</figcaption>
            </figure>
            <figure>
              <span className="ctx-tabs" role="tablist" aria-label="Tab bar">
                {icons.slice(0, 4).map((n, i) => (
                  <button key={n} type="button" role="tab" aria-selected={i === tab} aria-label={n} className={i === tab ? "on" : undefined} onClick={() => setTab(i)}>
                    <Glyph name={n} size={22} {...paint} solid={solid || i === tab} />
                  </button>
                ))}
              </span>
              <figcaption>Tab bar, active tab solid</figcaption>
            </figure>
            <figure>
              <button type="button" className="ctx-row" onClick={() => setFocus(icons[(icons.indexOf(focus) + 1) % icons.length])}>
                <span className="ctx-tile"><Glyph name={focus} size={20} {...paint} /></span>
                {title(focus)}
                <ChevronRightIcon size={16} className="ctx-chev" />
              </button>
              <figcaption>List row, click for the next icon</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>

    {/* Code below the grid: the preview above stays pinned while the controls scroll. */}
    <div className="play-below">
        <div className="panel play-code">
          <div className="play-code-head">
            <Select aria-label="Framework" value={fw} onChange={(e) => { const v = e.target.value as Framework; setFw(v); saveFramework(v); }}>
              {FRAMEWORKS.map((f) => <option key={f}>{f}</option>)}
            </Select>
            <span className="meta">{focus}{fw === "Flutter" && !solid && stroke !== 1.5 ? " · Flutter's icon font keeps the 1.5 stroke" : ""}</span>
          </div>
          <pre><code>{code.imp}{"\n\n"}{code.use}</code></pre>
          <div className="play-actions">
            <button type="button" className="btn btn-primary" onClick={() => copyCode.copy(`${code.imp}\n\n${code.use}`)}>
              <CopyIcon size={16} />{copyCode.state === "copied" ? "Copied" : copyCode.state === "failed" ? "Copy failed" : "Copy code"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => copySvg.copy(toSvg(focus, solid ? "solid" : "stroke", size, stroke, color))}>
              {copySvg.state === "copied" ? "Copied" : copySvg.state === "failed" ? "Copy failed" : "Copy SVG"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => save(new Blob([toSvg(focus, solid ? "solid" : "stroke", size, stroke, color)], { type: "image/svg+xml" }), `${focus}${solid ? "-solid" : ""}.svg`)}>
              <DownloadIcon size={16} />Download SVG
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => copyLink.copy(window.location.href)}>
              <LinkIcon size={16} />{copyLink.state === "copied" ? "Link copied" : copyLink.state === "failed" ? "Copy failed" : "Share setup"}
            </button>
          </div>
        </div>

        <div className="facts">
          <div><b>About 0.4 KB each</b><span>Optimised paths, no runtime</span></div>
          <div><b>Tree-shakable</b><span>Ship only what you import</span></div>
          <div><b>MIT licensed</b><span>Personal and commercial work</span></div>
        </div>
    </div>
    </>
  );
}
