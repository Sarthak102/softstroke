"use client";

import { useEffect, useState } from "react";
import { ArchiveIcon, BellOffIcon, CheckIcon, CopyIcon, EditIcon, EyeIcon, PinIcon, TrashIcon } from "@softstroke/react";
import { iconSet } from "@/lib/icon-set";

const Stroke = { ArchiveIcon, BellOffIcon, CheckIcon, CopyIcon, EditIcon, EyeIcon, PinIcon, TrashIcon };
type IconName = keyof typeof Stroke;
const { StrokeIcon } = iconSet(Stroke);

const ITEMS: { name: IconName; label: string; done: string }[] = [
  { name: "EditIcon", label: "Edit post", done: "Editing" },
  { name: "EyeIcon", label: "Public view", done: "Opened public view" },
  { name: "CopyIcon", label: "Copy link", done: "Link copied" },
  { name: "PinIcon", label: "Pin post", done: "Pinned" },
  { name: "ArchiveIcon", label: "Archive", done: "Archived" },
  { name: "BellOffIcon", label: "Mute replies", done: "Replies muted" },
];

export function MenuDemo() {
  const [hover, setHover] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="relative mx-auto w-full max-w-[280px] text-[#0b2545]">
      <div role="menu" aria-label="Post actions" className="relative rounded-[20px] bg-white p-1.5 shadow-[0_30px_80px_-24px_rgb(20_50_110/0.45)] ring-1 ring-[#0b2545]/8">
        <span
          aria-hidden
          className="absolute inset-x-1.5 top-1.5 h-10 rounded-xl bg-[#2563eb]/10 transition-transform duration-300 ease-[cubic-bezier(.34,1.3,.64,1)]"
          style={{ transform: `translateY(${hover * 40}px)` }}
        />
        {ITEMS.map((it, i) => (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => setToast(it.done)}
            className={`relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13.5px] outline-none transition-colors ${
              hover === i ? "text-[#2563eb]" : "text-[#0b2545]/75"
            }`}
          >
            <StrokeIcon name={it.name} size={18} />
            {it.label}
          </button>
        ))}
        <div className="my-1.5 h-px bg-[#0b2545]/8" />
        <button type="button" role="menuitem" onClick={() => setToast("Moved to trash")} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13.5px] text-[#c2410c] transition-colors hover:bg-[#c2410c]/8">
          <StrokeIcon name="TrashIcon" size={18} />
          Delete post
        </button>
      </div>
      <p
        aria-live="polite"
        className={`absolute inset-x-0 -bottom-12 mx-auto flex w-fit items-center gap-2 rounded-full bg-[#0b2545] px-4 py-2 text-[13px] text-white transition-[opacity,translate] duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <StrokeIcon name="CheckIcon" size={16} />
        {toast ?? "Done"}
      </p>
    </div>
  );
}
