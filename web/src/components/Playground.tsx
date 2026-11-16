"use client";

import { useState } from "react";
import { BellIcon, CameraIcon, ChatIcon, HeartIcon, HomeIcon, LockIcon, MusicIcon, RocketIcon, SettingsIcon, SparklesIcon, StarIcon, WalletIcon } from "@softstroke/react";
import { BellIcon as BellSolidIcon, CameraIcon as CameraSolidIcon, ChatIcon as ChatSolidIcon, HeartIcon as HeartSolidIcon, HomeIcon as HomeSolidIcon, LockIcon as LockSolidIcon, MusicIcon as MusicSolidIcon, RocketIcon as RocketSolidIcon, SettingsIcon as SettingsSolidIcon, SparklesIcon as SparklesSolidIcon, StarIcon as StarSolidIcon, WalletIcon as WalletSolidIcon } from "@softstroke/react/solid";

const ICONS = [
  [HomeIcon, HomeSolidIcon], [HeartIcon, HeartSolidIcon], [BellIcon, BellSolidIcon], [CameraIcon, CameraSolidIcon], [ChatIcon, ChatSolidIcon], [SettingsIcon, SettingsSolidIcon],
  [StarIcon, StarSolidIcon], [RocketIcon, RocketSolidIcon], [MusicIcon, MusicSolidIcon], [WalletIcon, WalletSolidIcon], [LockIcon, LockSolidIcon], [SparklesIcon, SparklesSolidIcon],
] as const;
const COLORS = [
  { name: "Ink", value: "currentColor", css: "var(--text)" },
  { name: "Tangerine", value: "#ff6b3d", css: "#ff6b3d" },
  { name: "Moss", value: "#4f8a5b", css: "#4f8a5b" },
  { name: "Harbour", value: "#3b7bd9", css: "#3b7bd9" },
  { name: "Plum", value: "#8b5cc4", css: "#8b5cc4" },
];
const pct = (v: number, min: number, max: number) => ({ "--p": `${((v - min) / (max - min)) * 100}%` }) as React.CSSProperties;

// Live controls: every value here is a real prop of the React package.
export function Playground() {
  const [size, setSize] = useState(32);
  const [stroke, setStroke] = useState(1.5);
  const [color, setColor] = useState(COLORS[0].value);
  const [solid, setSolid] = useState(false);
  const [flip, setFlip] = useState(0);
  const imp = solid ? "@softstroke/react/solid" : "@softstroke/react";
  const props = `size={${size}}${solid ? "" : ` strokeWidth={${stroke}}`}${color === "currentColor" ? "" : ` color="${color}"`}`;

  return (
    <div className="play-grid" data-reveal>
      <div className="panel">
        <label className="field">
          <span className="field-head"><span>Size</span><span className="meta">{size}px</span></span>
          <input type="range" min={16} max={56} step={4} value={size} onChange={(e) => setSize(+e.target.value)} style={pct(size, 16, 56)} />
        </label>
        <label className="field">
          <span className="field-head"><span>Stroke width</span><span className="meta">{stroke.toFixed(2)}</span></span>
          <input type="range" min={1} max={2.5} step={0.25} value={stroke} disabled={solid} onChange={(e) => setStroke(+e.target.value)} style={pct(stroke, 1, 2.5)} />
        </label>
        <div className="field">
          <span className="field-head"><span>Color</span><span className="meta">{color}</span></span>
          <div className="swatches">
            {COLORS.map((c) => (
              <button key={c.name} type="button" className="sw" aria-label={c.name} aria-pressed={color === c.value} style={{ "--c": c.css } as React.CSSProperties} onClick={() => { setColor(c.value); setFlip((f) => f + 1); }} />
            ))}
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
      </div>
      <div className="panel preview">
        <div className="preview-grid" key={flip}>
          {ICONS.map(([S, F], i) => {
            const C = solid ? F : S;
            return <C key={i} size={size} strokeWidth={stroke} color={color} className={flip ? "flip" : undefined} style={{ "--d": `${i * 30}ms` } as React.CSSProperties} />;
          })}
        </div>
        <div className="codeline" style={{ margin: 0, display: "block" }}>
          <span className="str">&lt;HeartIcon</span> {props} <span className="str">/&gt;</span> <span style={{ color: "var(--text-3)" }}>{`// from "${imp}"`}</span>
        </div>
        <div className="facts">
          <div><b>About 0.4 KB each</b><span>Optimised paths, no runtime</span></div>
          <div><b>Tree-shakable</b><span>Ship only what you import</span></div>
          <div><b>MIT licensed</b><span>Personal and commercial work</span></div>
        </div>
      </div>
    </div>
  );
}
