"use client";

import { useState } from "react";
import { AudioLinesIcon, HeartIcon, PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from "@softstroke/react";
import { AudioLinesIcon as AudioLinesSolidIcon, HeartIcon as HeartSolidIcon, PauseIcon as PauseSolidIcon, PlayIcon as PlaySolidIcon, RepeatIcon as RepeatSolidIcon, ShuffleIcon as ShuffleSolidIcon, SkipBackIcon as SkipBackSolidIcon, SkipForwardIcon as SkipForwardSolidIcon } from "@softstroke/react/solid";
import { iconSet } from "@/lib/icon-set";

const Stroke = { AudioLinesIcon, HeartIcon, PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon };
const Solid = { AudioLinesIcon: AudioLinesSolidIcon, HeartIcon: HeartSolidIcon, PauseIcon: PauseSolidIcon, PlayIcon: PlaySolidIcon, RepeatIcon: RepeatSolidIcon, ShuffleIcon: ShuffleSolidIcon, SkipBackIcon: SkipBackSolidIcon, SkipForwardIcon: SkipForwardSolidIcon };
const { StrokeIcon, DualIcon } = iconSet(Stroke, Solid);

export function PlayerDemo() {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[28px] bg-white p-4 text-[#0b2545] shadow-[0_30px_80px_-24px_rgb(20_50_110/0.45)] ring-1 ring-[#0b2545]/8">
      <div className="relative mb-4 grid aspect-[16/10] place-items-center overflow-hidden rounded-[20px] bg-[radial-gradient(120%_90%_at_20%_10%,#93c5fd,#2563eb_55%,#0b2545)]">
        <StrokeIcon name="AudioLinesIcon" size={72} className={`text-white/90 transition-transform duration-700 ${playing ? "scale-110" : "scale-100"}`} />
      </div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold leading-tight">Low Tide</p>
          <p className="text-[13px] text-[#0b2545]/65">Harbour Lights</p>
        </div>
        <button type="button" aria-pressed={liked} aria-label="Like" onClick={() => setLiked(!liked)} className={`transition-transform active:scale-90 ${liked ? "text-[#2563eb]" : "text-[#0b2545]/65"}`}>
          <DualIcon name="HeartIcon" active={liked} size={24} />
        </button>
      </div>
      <div className="mb-1 h-1 overflow-hidden rounded-full bg-[#0b2545]/10">
        <div className={`h-full rounded-full bg-[#2563eb] transition-[width] ease-linear ${playing ? "w-full duration-[30s]" : "w-[34%] duration-300"}`} />
      </div>
      <div className="mb-4 flex justify-between text-[11px] text-[#0b2545]/65">
        <span>1:12</span>
        <span>3:28</span>
      </div>
      <div className="flex items-center justify-between">
        <button type="button" aria-pressed={shuffle} aria-label="Shuffle" onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-[#2563eb]" : "text-[#0b2545]/65"}>
          <StrokeIcon name="ShuffleIcon" size={20} />
        </button>
        <button type="button" aria-label="Previous" className="text-[#0b2545]/80 active:scale-90">
          <DualIcon name="SkipBackIcon" active size={24} />
        </button>
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)} className="grid size-14 place-items-center rounded-full bg-[#2563eb] text-white transition-transform active:scale-95">
          <span className="inline-grid">
            <DualIcon name="PlayIcon" active={!playing} size={24} className={`col-start-1 row-start-1 transition-opacity duration-200 ${playing ? "opacity-0" : "opacity-100"}`} />
            <DualIcon name="PauseIcon" active={playing} size={24} className={`col-start-1 row-start-1 transition-opacity duration-200 ${playing ? "opacity-100" : "opacity-0"}`} />
          </span>
        </button>
        <button type="button" aria-label="Next" className="text-[#0b2545]/80 active:scale-90">
          <DualIcon name="SkipForwardIcon" active size={24} />
        </button>
        <button type="button" aria-pressed={repeat} aria-label="Repeat" onClick={() => setRepeat(!repeat)} className={repeat ? "text-[#2563eb]" : "text-[#0b2545]/65"}>
          <StrokeIcon name="RepeatIcon" size={20} />
        </button>
      </div>
    </div>
  );
}
