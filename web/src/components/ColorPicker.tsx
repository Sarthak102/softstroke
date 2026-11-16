"use client";

import { useEffect, useRef, useState } from "react";
import { PipetteIcon } from "@softstroke/react";
import { Select } from "./Select";

// Colour maths. The picker keeps HSV + alpha; it reads and writes #rrggbb, or #rrggbbaa below full opacity.
type Hsva = { h: number; s: number; v: number; a: number };
export const COLOR_HEX = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

function rgbToHsv(r: number, g: number, b: number) {
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  const h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}
function hsvToRgb({ h, s, v }: Hsva) {
  const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return [f(5), f(3), f(1)].map((x) => Math.round(x * 255));
}
function fromHex(hex: string): Hsva {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return { ...rgbToHsv(r, g, b), a: hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1 };
}
const two = (n: number) => Math.round(n).toString(16).padStart(2, "0");
function toHex(c: Hsva) {
  return `#${hsvToRgb(c).map(two).join("")}${c.a < 1 ? two(c.a * 255) : ""}`;
}
function hsvToHsl({ h, s, v }: Hsva) {
  const l = v * (1 - s / 2);
  return [h, l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l];
}
function hslToHsv(h: number, s: number, l: number) {
  const v = l + s * Math.min(l, 1 - l);
  return { h, s: v ? 2 * (1 - l / v) : 0, v };
}

const MODES = ["HEX", "RGB", "HSL"] as const;
type Mode = (typeof MODES)[number];

// A thick bar with a ring thumb (hue and opacity), driven by pointer or arrow keys.
function Bar({ label, value, max, text, track, thumb, onChange }: { label: string; value: number; max: number; text: string; track: string; thumb: string; onChange: (v: number) => void }) {
  const el = useRef<HTMLDivElement>(null);
  function drag(e: React.PointerEvent) {
    if (e.type === "pointerdown") el.current!.setPointerCapture(e.pointerId);
    else if (!el.current!.hasPointerCapture(e.pointerId)) return;
    const r = el.current!.getBoundingClientRect();
    onChange(clamp((e.clientX - r.left) / r.width) * max);
  }
  function key(e: React.KeyboardEvent) {
    const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
    if (!d) return;
    e.preventDefault();
    onChange(clamp(value + d * (e.shiftKey ? 10 : 1) * (max / 100), 0, max));
  }
  return (
    <div ref={el} className="cp-bar" style={{ background: track }} role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} aria-valuetext={text} onPointerDown={drag} onPointerMove={drag} onKeyDown={key}>
      <span className="cp-ring" style={{ left: `${(value / max) * 100}%`, background: thumb }} />
    </div>
  );
}

// "Any colour" swatch: a panel after the usual design-tool picker. Shade area, eyedropper, hue and opacity bars,
// then the value as HEX, RGB or HSL fields plus opacity.
export function ColorPicker({ value, active, onChange }: { value: string; active: boolean; onChange: (hex: string) => void }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<Hsva>(() => fromHex(COLOR_HEX.test(value) ? value : "#ff6b3d"));
  const [mode, setMode] = useState<Mode>("HEX");
  const [hexText, setHexText] = useState("");
  const [dropper, setDropper] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const hex = toHex(c);
  const solidHex = hex.slice(0, 7);

  useEffect(() => setDropper("EyeDropper" in window), []);
  useEffect(() => setHexText(solidHex.slice(1)), [solidHex]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const click = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", click);
    };
  }, [open]);

  // Opening starts from the current colour when it is a custom one.
  function toggle() {
    if (!open && COLOR_HEX.test(value)) setC(fromHex(value));
    setOpen(!open);
  }
  function set(next: Hsva) {
    setC(next);
    onChange(toHex(next));
  }
  function drag(e: React.PointerEvent) {
    if (e.type === "pointerdown") area.current!.setPointerCapture(e.pointerId);
    else if (!area.current!.hasPointerCapture(e.pointerId)) return;
    const r = area.current!.getBoundingClientRect();
    set({ ...c, s: clamp((e.clientX - r.left) / r.width), v: 1 - clamp((e.clientY - r.top) / r.height) });
  }
  function areaKey(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
    if (!d) return;
    e.preventDefault();
    set({ ...c, s: clamp(c.s + d[0]), v: clamp(c.v + d[1]) });
  }
  async function pickFromScreen() {
    try {
      const { sRGBHex } = await new (window as unknown as { EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> } }).EyeDropper().open();
      if (COLOR_HEX.test(sRGBHex)) set({ ...fromHex(sRGBHex), a: c.a });
    } catch {
      // Cancelled with Escape: keep the colour.
    }
  }

  const [r, g, b] = hsvToRgb(c);
  const [hh, hs, hl] = hsvToHsl(c);
  // Number fields: each edits one channel, clamped to its range; empty or non-numbers are ignored.
  const num = (label: string, v: number, max: number, apply: (n: number) => Hsva) => (
    <input key={label} aria-label={label} inputMode="numeric" value={Math.round(v)} onChange={(e) => { const n = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(n)) set(apply(clamp(n, 0, max))); }} />
  );
  const fields =
    mode === "RGB"
      ? [num("Red", r, 255, (n) => ({ ...rgbToHsv(n / 255, g / 255, b / 255), a: c.a })), num("Green", g, 255, (n) => ({ ...rgbToHsv(r / 255, n / 255, b / 255), a: c.a })), num("Blue", b, 255, (n) => ({ ...rgbToHsv(r / 255, g / 255, n / 255), a: c.a }))]
      : mode === "HSL"
        ? [num("Hue", hh, 360, (n) => ({ ...hslToHsv(n % 360, hs, hl), a: c.a })), num("Saturation", hs * 100, 100, (n) => ({ ...hslToHsv(hh, n / 100, hl), a: c.a })), num("Lightness", hl * 100, 100, (n) => ({ ...hslToHsv(hh, hs, n / 100), a: c.a }))]
        : [
            <input key="hex" className="cp-hex" aria-label="Hex colour" value={hexText} maxLength={7} spellCheck={false} onChange={(e) => {
              const t = e.target.value.replace(/^#/, "");
              setHexText(t);
              if (/^[0-9a-f]{6}$/i.test(t)) set({ ...fromHex(`#${t.toLowerCase()}`), a: c.a });
            }} />,
          ];

  return (
    <div className="cp" ref={root}>
      <button type="button" className={`sw sw-any ${active ? "on" : ""}`} aria-label="Any colour" aria-expanded={open} onClick={toggle} />
      {open && (
        <div className="cp-panel" role="dialog" aria-label="Custom colour">
          <p className="cp-title">Custom colour</p>
          <div ref={area} className="cp-area" style={{ "--hue": `hsl(${c.h} 100% 50%)` } as React.CSSProperties} role="slider" tabIndex={0} aria-label="Shade" aria-valuetext={solidHex} onPointerDown={drag} onPointerMove={drag} onKeyDown={areaKey}>
            <span className="cp-ring" style={{ left: `${c.s * 100}%`, top: `${(1 - c.v) * 100}%`, background: solidHex }} />
          </div>
          <div className="cp-body">
            <div className="cp-tools">
              {dropper ? (
                <button type="button" className="cp-drop" aria-label="Pick a colour from the screen" onClick={pickFromScreen}><PipetteIcon size={20} /></button>
              ) : <span className="cp-chip" style={{ "--c": hex } as React.CSSProperties} aria-hidden />}
              <div className="cp-bars">
                <Bar label="Hue" value={c.h} max={359} text={`${Math.round(c.h)} degrees`} track="linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" thumb={`hsl(${c.h} 100% 50%)`} onChange={(h) => set({ ...c, h })} />
                <Bar label="Opacity" value={c.a * 100} max={100} text={`${Math.round(c.a * 100)}%`} track={`linear-gradient(to right, transparent, ${solidHex}), repeating-conic-gradient(#d9d8d3 0 25%, #fff 0 50%) 0 0 / 10px 10px`} thumb={hex} onChange={(a) => set({ ...c, a: a / 100 })} />
              </div>
            </div>
            <div className="cp-values">
              <Select aria-label="Colour format" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                {MODES.map((m) => <option key={m}>{m}</option>)}
              </Select>
              <div className="cp-fields">
                {fields}
                <span className="cp-alpha">
                  <input aria-label="Opacity percent" inputMode="numeric" value={Math.round(c.a * 100)} onChange={(e) => { const n = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(n)) set({ ...c, a: clamp(n, 0, 100) / 100 }); }} />%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
