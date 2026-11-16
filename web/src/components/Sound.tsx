"use client";

import { useEffect, useState } from "react";
import { VolumeIcon, VolumeOffIcon } from "@softstroke/react";

// Soft UI sounds, off unless the visitor turns them on (saved in localStorage). Synthesised with Web Audio,
// so there is nothing to download: a short low tick for buttons and tabs, a two-note chime when something is copied.
const KEY = "ss-sound";
let ctx: AudioContext | null = null;
const on = () => { try { return localStorage.getItem(KEY) === "on"; } catch { return false; } };

function tone(freq: number, start: number, dur: number, gain: number) {
  ctx ??= new AudioContext();
  const t = ctx.currentTime + start, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.82, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}
export const playTick = () => on() && tone(620, 0, 0.05, 0.05);
export const playCopied = () => { if (!on()) return; tone(880, 0, 0.09, 0.05); tone(1320, 0.07, 0.12, 0.04); };

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(on()), []);

  // One delegated listener: every button, tab and switch ticks; copies chime (useCopy dispatches ss:copied).
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("button, [role=tab], [role=switch], .btn");
      if (el && !el.closest("[data-no-sound]")) playTick();
    };
    window.addEventListener("click", click, true);
    window.addEventListener("ss:copied", playCopied);
    return () => {
      window.removeEventListener("click", click, true);
      window.removeEventListener("ss:copied", playCopied);
    };
  }, []);

  return (
    <button
      type="button"
      data-no-sound
      className="icon-btn sound-toggle"
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sounds off" : "Turn sounds on"}
      title={enabled ? "Sounds on" : "Sounds off"}
      onClick={() => {
        const next = !enabled;
        try { localStorage.setItem(KEY, next ? "on" : "off"); } catch {}
        setEnabled(next);
        if (next) tone(880, 0, 0.09, 0.05);
      }}
    >
      {enabled ? <VolumeIcon size={18} /> : <VolumeOffIcon size={18} />}
    </button>
  );
}
