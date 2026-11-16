"use client";

import { useEffect, useRef, useState } from "react";
import type { Nodes } from "@/lib/glyph";

type Item = { name: string; stroke: Nodes; solid: Nodes };

const DRAW = 1400, HOLD = 2200, SOLID = 1600;

// A path with several pieces (compass ticks: "M12 2v2M22 12h-2...") restarts its dash on every piece, so the
// pieces would appear at once. Split at each absolute M so every piece draws in turn.
const pieces = (nodes: Nodes): Nodes =>
  nodes.flatMap(([t, a]) => (t === "path" && /.M/.test(a.d) ? a.d.split(/(?=M)/).map((d) => [t, { ...a, d }] as Nodes[number]) : [[t, a]]));

// One icon at a time on its 24px construction grid: drawn stroke by stroke with a pen dot, then turned solid.
export function Specimen({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const [solid, setSolid] = useState(false);
  const paused = useRef(false);
  const card = useRef<HTMLElement>(null);
  const strokeSvg = useRef<SVGSVGElement>(null);
  const pen = useRef<SVGCircleElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const item = items[i];

  // Draw the current icon. Closed shapes would show a notch where the dash meets its start,
  // so the dash is removed once the drawing ends.
  useEffect(() => {
    const parts = [...(strokeSvg.current?.children ?? [])] as SVGGeometryElement[];
    const finish = () => parts.forEach((p) => { p.style.strokeDasharray = "none"; p.style.strokeDashoffset = "0"; p.style.opacity = "1"; });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    // Hidden until their turn: a zero-length dash still paints its round cap as a stub.
    parts.forEach((p) => { p.style.strokeDasharray = "1"; p.style.strokeDashoffset = "1"; p.style.opacity = "0"; });
    const per = DRAW / parts.length, t0 = performance.now(), dot = pen.current;
    let raf = 0;
    if (dot) dot.style.opacity = "1";
    const tick = (now: number) => {
      const t = now - t0;
      let done = true;
      parts.forEach((p, j) => {
        const k = Math.min(1, Math.max(0, (t - j * per * 0.8) / (per * 1.2)));
        const e = 1 - Math.pow(1 - k, 3);
        p.style.strokeDashoffset = String(1 - e);
        p.style.opacity = k > 0 ? "1" : "0";
        if (k < 1) done = false;
        if (k > 0 && k < 1 && dot) {
          try {
            const pt = p.getPointAtLength(p.getTotalLength() * e);
            dot.setAttribute("cx", String(pt.x));
            dot.setAttribute("cy", String(pt.y));
          } catch {}
        }
      });
      if (!done) raf = requestAnimationFrame(tick);
      else { if (dot) dot.style.opacity = "0"; finish(); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i]);

  // Cycle: draw, hold, solid, next. Hovering the card pauses it.
  useEffect(() => {
    setSolid(false);
    timer.current = setTimeout(() => {
      if (paused.current) return;
      setSolid(true);
      timer.current = setTimeout(() => !paused.current && setI((x) => (x + 1) % items.length), SOLID);
    }, HOLD);
    return () => clearTimeout(timer.current);
  }, [i, items.length]);

  function tilt(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
    e.currentTarget.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`);
  }

  return (
    <div className="specimen-wrap fade-in" style={{ animationDelay: "200ms" }}>
      <figure
        ref={card}
        className={`specimen ${solid ? "is-solid" : ""}`}
        aria-label={`Icon specimen: ${item.name}`}
        onPointerEnter={() => (paused.current = true)}
        onPointerMove={tilt}
        onPointerLeave={(e) => {
          paused.current = false;
          e.currentTarget.style.setProperty("--rx", "0deg");
          e.currentTarget.style.setProperty("--ry", "0deg");
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setI((x) => (x + 1) % items.length), 900);
        }}
      >
        <div className="specimen-corner sc-tl"><span key={item.name} className="spec-name swap">{item.name}</span></div>
        <div className="spec-dots" aria-hidden>{items.map((it, j) => <i key={it.name} className={j === i ? "on" : ""} />)}</div>
        <div className="specimen-corner sc-tr"><span className="meta">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div>
        <div className="specimen-corner sc-bl"><span className="meta">24 × 24 · 1.5 stroke</span></div>
        <div className="specimen-corner sc-br">
          <div className="seg" role="group" aria-label="Style">
            <button type="button" aria-pressed={!solid} onClick={() => { paused.current = true; clearTimeout(timer.current); setSolid(false); }}>Stroke</button>
            <button type="button" aria-pressed={solid} className={solid ? "solid-on" : ""} onClick={() => { paused.current = true; clearTimeout(timer.current); setSolid(true); }}>Solid</button>
          </div>
        </div>
        <div className="spec-stage">
          <Construct />
          <svg viewBox="0 0 24 24" className="spec-solid" aria-hidden fill="currentColor">
            {item.solid.map(([T, a], j) => { const Tag = T as "path"; return <Tag key={`${item.name}${j}`} {...a} />; })}
          </svg>
          <svg ref={strokeSvg} key={item.name} viewBox="0 0 24 24" className="spec-stroke" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {pieces(item.stroke).map(([T, a], j) => { const Tag = T as "path"; return <Tag key={j} {...a} pathLength={1} />; })}
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden><circle ref={pen} className="pen" r={0.45} /></svg>
        </div>
      </figure>
    </div>
  );
}

// The 24-unit grid with majors every 4, and the keyline square and circle.
export function Construct({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className="construct" aria-hidden style={style}>
      {Array.from({ length: 25 }, (_, k) => (
        <g key={k} className={k % 4 === 0 ? "major" : undefined}>
          <line x1={k} y1={0} x2={k} y2={24} />
          <line x1={0} y1={k} x2={24} y2={k} />
        </g>
      ))}
      <rect className="key" x={2} y={2} width={20} height={20} rx={3} />
      <circle className="key" cx={12} cy={12} r={10} />
    </svg>
  );
}
