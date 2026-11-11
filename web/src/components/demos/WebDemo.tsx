"use client";

import { useState } from "react";
import { BarChartIcon, BellIcon, CalendarIcon, ClockIcon, FolderIcon, HomeIcon, InboxIcon, LayersIcon, MoreHorizontalIcon, SearchIcon, SettingsIcon, TrendingUpIcon, WalletIcon } from "@softstroke/react";
import { BarChartIcon as BarChartSolidIcon, BellIcon as BellSolidIcon, CalendarIcon as CalendarSolidIcon, ClockIcon as ClockSolidIcon, FolderIcon as FolderSolidIcon, HomeIcon as HomeSolidIcon, InboxIcon as InboxSolidIcon, LayersIcon as LayersSolidIcon, MoreHorizontalIcon as MoreHorizontalSolidIcon, SearchIcon as SearchSolidIcon, SettingsIcon as SettingsSolidIcon, TrendingUpIcon as TrendingUpSolidIcon, WalletIcon as WalletSolidIcon } from "@softstroke/react/solid";
import { iconSet } from "@/lib/icon-set";

const Stroke = { BarChartIcon, BellIcon, CalendarIcon, ClockIcon, FolderIcon, HomeIcon, InboxIcon, LayersIcon, MoreHorizontalIcon, SearchIcon, SettingsIcon, TrendingUpIcon, WalletIcon };
const Solid = { BarChartIcon: BarChartSolidIcon, BellIcon: BellSolidIcon, CalendarIcon: CalendarSolidIcon, ClockIcon: ClockSolidIcon, FolderIcon: FolderSolidIcon, HomeIcon: HomeSolidIcon, InboxIcon: InboxSolidIcon, LayersIcon: LayersSolidIcon, MoreHorizontalIcon: MoreHorizontalSolidIcon, SearchIcon: SearchSolidIcon, SettingsIcon: SettingsSolidIcon, TrendingUpIcon: TrendingUpSolidIcon, WalletIcon: WalletSolidIcon };
type IconName = keyof typeof Stroke;
const { StrokeIcon, DualIcon } = iconSet(Stroke, Solid);

const NAV: { name: IconName; label: string }[] = [
  { name: "HomeIcon", label: "Overview" },
  { name: "FolderIcon", label: "Projects" },
  { name: "InboxIcon", label: "Inbox" },
  { name: "CalendarIcon", label: "Calendar" },
  { name: "BarChartIcon", label: "Reports" },
  { name: "SettingsIcon", label: "Settings" },
];

// Sample numbers for the demo dashboard, not real data.
const STATS: { name: IconName; label: string; value: string; delta: string }[] = [
  { name: "WalletIcon", label: "Revenue", value: "$18,240", delta: "+12.4%" },
  { name: "LayersIcon", label: "Projects", value: "14", delta: "+2" },
  { name: "ClockIcon", label: "Hours", value: "326", delta: "+8.1%" },
];

export function WebDemo() {
  const [active, setActive] = useState(0);
  return (
    <div className="@container mx-auto flex h-[460px] w-full max-w-[560px] overflow-hidden rounded-[24px] bg-[#f7faff] text-[#0b2545] shadow-[0_30px_80px_-24px_rgb(20_50_110/0.4)] ring-1 ring-[#0b2545]/8">
      <aside className="flex w-14 shrink-0 flex-col gap-1 border-r border-[#0b2545]/8 bg-white/70 p-2 @md:w-40">
        <p className="mb-3 hidden px-2 pt-2 font-display text-sm font-semibold @md:block">Lumen Studio</p>
        <div className="relative flex flex-col gap-1">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-9 rounded-xl bg-[#2563eb]/10 transition-transform duration-500 ease-[cubic-bezier(.34,1.3,.64,1)]"
            style={{ transform: `translateY(${active * 40}px)` }}
          />
          {NAV.map((n, i) => (
            <button
              key={n.label}
              type="button"
              onClick={() => setActive(i)}
              aria-current={active === i ? "page" : undefined}
              aria-label={n.label}
              className={`relative flex h-9 items-center justify-center gap-2.5 rounded-xl px-2 text-[13px] transition-colors @md:justify-start ${
                active === i ? "font-medium text-[#2563eb]" : "text-[#0b2545]/60 hover:text-[#0b2545]"
              }`}
            >
              <DualIcon name={n.name} active={active === i} size={18} />
              <span className="hidden @md:inline">{n.label}</span>
            </button>
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col p-4 @md:p-5">
        <header className="mb-4 flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold tracking-tight">{NAV[active].label}</h3>
          <div className="flex items-center gap-1.5 text-[#0b2545]/60">
            <span className="grid size-8 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
              <StrokeIcon name="SearchIcon" size={16} />
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
              <StrokeIcon name="BellIcon" size={16} />
            </span>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-2 @sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={s.label} className={`rounded-2xl p-2.5 ${i === 0 ? "bg-[#2563eb] text-white" : "bg-white shadow-[0_1px_2px_rgb(30_64_140/0.06)]"}`}>
              <div className={`flex items-center gap-1.5 text-[11px] ${i === 0 ? "text-white/75" : "text-[#0b2545]/65"}`}>
                <StrokeIcon name={s.name} size={14} />
                {s.label}
              </div>
              <p className="mt-1 font-display text-base font-semibold tabular-nums">{s.value}</p>
              <p className={`flex items-center gap-1 text-[11px] ${i === 0 ? "text-white/80" : "text-[#2563eb]"}`}>
                <StrokeIcon name="TrendingUpIcon" size={12} />
                {s.delta}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2 hidden flex-1 rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgb(30_64_140/0.06)] @sm:block">
          <div className="flex items-center justify-between text-[11px] text-[#0b2545]/65">
            Last 30 days
            <StrokeIcon name="MoreHorizontalIcon" size={16} />
          </div>
          <svg viewBox="0 0 300 90" className="mt-2 h-[calc(100%-1.5rem)] w-full" preserveAspectRatio="none" aria-hidden>
            <path d="M0 70 C30 64 40 40 70 46 S120 70 150 50 S200 18 230 30 S280 20 300 8" fill="none" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0 70 C30 64 40 40 70 46 S120 70 150 50 S200 18 230 30 S280 20 300 8 V90 H0Z" fill="#2563eb" opacity=".08" />
          </svg>
        </div>
      </div>
    </div>
  );
}
