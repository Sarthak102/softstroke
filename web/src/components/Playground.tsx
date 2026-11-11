"use client";

import { useState } from "react";
import { BellIcon, CameraIcon, ChatIcon, HeartIcon, HomeIcon, LockIcon, MusicIcon, RocketIcon, SettingsIcon, SparklesIcon, StarIcon, WalletIcon } from "@softstroke/react";
import { BellIcon as BellSolidIcon, CameraIcon as CameraSolidIcon, ChatIcon as ChatSolidIcon, HeartIcon as HeartSolidIcon, HomeIcon as HomeSolidIcon, LockIcon as LockSolidIcon, MusicIcon as MusicSolidIcon, RocketIcon as RocketSolidIcon, SettingsIcon as SettingsSolidIcon, SparklesIcon as SparklesSolidIcon, StarIcon as StarSolidIcon, WalletIcon as WalletSolidIcon } from "@softstroke/react/solid";

const Stroke = { BellIcon, CameraIcon, ChatIcon, HeartIcon, HomeIcon, LockIcon, MusicIcon, RocketIcon, SettingsIcon, SparklesIcon, StarIcon, WalletIcon };
const Solid = { BellIcon: BellSolidIcon, CameraIcon: CameraSolidIcon, ChatIcon: ChatSolidIcon, HeartIcon: HeartSolidIcon, HomeIcon: HomeSolidIcon, LockIcon: LockSolidIcon, MusicIcon: MusicSolidIcon, RocketIcon: RocketSolidIcon, SettingsIcon: SettingsSolidIcon, SparklesIcon: SparklesSolidIcon, StarIcon: StarSolidIcon, WalletIcon: WalletSolidIcon };
type IconName = keyof typeof Stroke;

const NAMES: IconName[] = ["HomeIcon", "HeartIcon", "BellIcon", "CameraIcon", "ChatIcon", "SettingsIcon", "StarIcon", "RocketIcon", "MusicIcon", "WalletIcon", "LockIcon", "SparklesIcon"];
const COLORS = [
  { name: "Ink", value: "var(--ink)" },
  { name: "Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#d97706" },
];

// Live controls: every value here is a real prop of the React package.
export function Playground() {
  const [size, setSize] = useState(32);
  const [stroke, setStroke] = useState(1.5);
  const [color, setColor] = useState(COLORS[0].value);
  const [solid, setSolid] = useState(false);

  return (
    <section id="playground" className="scroll-mt-24 px-4 pb-24 lg:pb-32">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass rounded-[32px] p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Make them yours.</h2>
          <p className="mt-3 text-muted">Size, stroke width and color are plain props. Try them.</p>
          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="mb-2 flex justify-between text-sm">
                Size <span className="font-mono text-muted">{size}px</span>
              </span>
              <input type="range" min={16} max={56} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-[var(--accent)]" />
            </label>
            <label className={`block transition-opacity ${solid ? "opacity-40" : ""}`}>
              <span className="mb-2 flex justify-between text-sm">
                Stroke width <span className="font-mono text-muted">{stroke.toFixed(2)}</span>
              </span>
              <input type="range" min={1} max={2.5} step={0.25} value={stroke} disabled={solid} onChange={(e) => setStroke(+e.target.value)} className="w-full accent-[var(--accent)]" />
            </label>
            <div>
              <span className="mb-2 block text-sm">Color</span>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={color === c.value}
                    onClick={() => setColor(c.value)}
                    className={`size-8 rounded-full ring-offset-2 ring-offset-[var(--bg-2)] transition-[box-shadow,scale] active:scale-90 ${color === c.value ? "ring-2 ring-[var(--ink)]" : ""}`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </div>
            <div className="flex rounded-full bg-[var(--glass)] p-1 ring-1 ring-[var(--line)]">
              {(["Stroke", "Solid"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={solid === (s === "Solid")}
                  onClick={() => setSolid(s === "Solid")}
                  className={`flex-1 rounded-full py-1.5 text-sm transition-colors duration-300 ${solid === (s === "Solid") ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="glass flex flex-col justify-between gap-6 rounded-[32px] p-6 sm:p-8">
          <div className="grid flex-1 grid-cols-4 place-items-center gap-y-6 sm:grid-cols-6">
            {NAMES.map((n, i) => {
              const S = Stroke[n];
              const F = Solid[n];
              const layer = "col-start-1 row-start-1 transition-[opacity,scale,width,height] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]";
              // Delays per property (opacity, scale, width, height): a wave on style change, no lag on size.
              const box = { width: size, height: size, transitionDelay: `${i * 30}ms, ${i * 30}ms, 0ms, 0ms` };
              return (
                <span key={n} className="inline-grid">
                  <S size={24} strokeWidth={stroke} color={color} style={box} className={`${layer} ${solid ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} />
                  <F size={24} color={color} style={box} className={`${layer} ${solid ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
                </span>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-2xl bg-[var(--glass)] p-4 text-sm ring-1 ring-[var(--line)]">
              <span className="font-medium">Tree-shakable.</span> <span className="text-muted">Your bundle gets only the icons you import.</span>
            </p>
            <p className="rounded-2xl bg-[var(--glass)] p-4 text-sm ring-1 ring-[var(--line)]">
              <span className="font-medium">About 0.4 KB each.</span> <span className="text-muted">Optimised paths, no runtime, no fonts to load.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
