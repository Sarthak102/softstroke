"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BarChartIcon, BatteryIcon, BellIcon, BellRingIcon, CalendarIcon, CalendarPlusIcon, ChatIcon, CheckCircleIcon, CheckSquareIcon, ChevronRightIcon, CreditCardIcon, FileTextIcon, FolderIcon, HelpCircleIcon, HistoryIcon, HomeIcon, ImageIcon, ImagePlusIcon, LinkIcon, LogOutIcon, MicIcon, MoonIcon, MusicIcon, PaletteIcon, PlaneIcon, PlusCircleIcon, ReceiptIcon, SearchIcon, ShieldCheckIcon, SparklesIcon, SproutIcon, SunriseIcon, UserIcon, UserPlusIcon, WifiIcon } from "@softstroke/react";
import { BarChartIcon as BarChartSolidIcon, BatteryIcon as BatterySolidIcon, BellIcon as BellSolidIcon, BellRingIcon as BellRingSolidIcon, CalendarIcon as CalendarSolidIcon, CalendarPlusIcon as CalendarPlusSolidIcon, ChatIcon as ChatSolidIcon, CheckCircleIcon as CheckCircleSolidIcon, CheckSquareIcon as CheckSquareSolidIcon, ChevronRightIcon as ChevronRightSolidIcon, CreditCardIcon as CreditCardSolidIcon, FileTextIcon as FileTextSolidIcon, FolderIcon as FolderSolidIcon, HelpCircleIcon as HelpCircleSolidIcon, HistoryIcon as HistorySolidIcon, HomeIcon as HomeSolidIcon, ImageIcon as ImageSolidIcon, ImagePlusIcon as ImagePlusSolidIcon, LinkIcon as LinkSolidIcon, LogOutIcon as LogOutSolidIcon, MicIcon as MicSolidIcon, MoonIcon as MoonSolidIcon, MusicIcon as MusicSolidIcon, PaletteIcon as PaletteSolidIcon, PlaneIcon as PlaneSolidIcon, PlusCircleIcon as PlusCircleSolidIcon, ReceiptIcon as ReceiptSolidIcon, SearchIcon as SearchSolidIcon, ShieldCheckIcon as ShieldCheckSolidIcon, SparklesIcon as SparklesSolidIcon, SproutIcon as SproutSolidIcon, SunriseIcon as SunriseSolidIcon, UserIcon as UserSolidIcon, UserPlusIcon as UserPlusSolidIcon, WifiIcon as WifiSolidIcon } from "@softstroke/react/solid";
import { iconSet } from "@/lib/icon-set";

const Stroke = { BarChartIcon, BatteryIcon, BellIcon, BellRingIcon, CalendarIcon, CalendarPlusIcon, ChatIcon, CheckCircleIcon, CheckSquareIcon, ChevronRightIcon, CreditCardIcon, FileTextIcon, FolderIcon, HelpCircleIcon, HistoryIcon, HomeIcon, ImageIcon, ImagePlusIcon, LinkIcon, LogOutIcon, MicIcon, MoonIcon, MusicIcon, PaletteIcon, PlaneIcon, PlusCircleIcon, ReceiptIcon, SearchIcon, ShieldCheckIcon, SparklesIcon, SproutIcon, SunriseIcon, UserIcon, UserPlusIcon, WifiIcon };
const Solid = { BarChartIcon: BarChartSolidIcon, BatteryIcon: BatterySolidIcon, BellIcon: BellSolidIcon, BellRingIcon: BellRingSolidIcon, CalendarIcon: CalendarSolidIcon, CalendarPlusIcon: CalendarPlusSolidIcon, ChatIcon: ChatSolidIcon, CheckCircleIcon: CheckCircleSolidIcon, CheckSquareIcon: CheckSquareSolidIcon, ChevronRightIcon: ChevronRightSolidIcon, CreditCardIcon: CreditCardSolidIcon, FileTextIcon: FileTextSolidIcon, FolderIcon: FolderSolidIcon, HelpCircleIcon: HelpCircleSolidIcon, HistoryIcon: HistorySolidIcon, HomeIcon: HomeSolidIcon, ImageIcon: ImageSolidIcon, ImagePlusIcon: ImagePlusSolidIcon, LinkIcon: LinkSolidIcon, LogOutIcon: LogOutSolidIcon, MicIcon: MicSolidIcon, MoonIcon: MoonSolidIcon, MusicIcon: MusicSolidIcon, PaletteIcon: PaletteSolidIcon, PlaneIcon: PlaneSolidIcon, PlusCircleIcon: PlusCircleSolidIcon, ReceiptIcon: ReceiptSolidIcon, SearchIcon: SearchSolidIcon, ShieldCheckIcon: ShieldCheckSolidIcon, SparklesIcon: SparklesSolidIcon, SproutIcon: SproutSolidIcon, SunriseIcon: SunriseSolidIcon, UserIcon: UserSolidIcon, UserPlusIcon: UserPlusSolidIcon, WifiIcon: WifiSolidIcon };
type IconName = keyof typeof Stroke;
const { StrokeIcon, DualIcon } = iconSet(Stroke, Solid);

const TABS: { name: IconName; label: string }[] = [
  { name: "HomeIcon", label: "Today" },
  { name: "SearchIcon", label: "Search" },
  { name: "PlusCircleIcon", label: "Create" },
  { name: "BellIcon", label: "Inbox" },
  { name: "UserIcon", label: "Profile" },
];

// A small planner app. Every tab is a real screen built from Softstroke icons (sample data).
export function PhoneDemo() {
  const [tab, setTab] = useState(0);
  const prev = useRef(0);
  const screen = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const dir = Math.sign(tab - prev.current);
      prev.current = tab;
      if (!dir || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        screen.current!.children,
        { x: dir * 36, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out", stagger: 0.04 },
      );
    },
    { dependencies: [tab] },
  );

  return (
    // Titanium frame: a gradient rim, a dark bezel and side buttons, sized to the 19.5:9 ratio.
    <div className="relative mx-auto h-[540px] w-[262px] rounded-[50px] bg-[linear-gradient(145deg,#8a9bb4,#2a3447_30%,#1a2232_70%,#7d8ca3)] p-[3px] shadow-[0_40px_90px_-24px_rgb(20_50_110/0.55)]">
      <span aria-hidden className="absolute -left-[3px] top-[96px] h-6 w-[3px] rounded-l bg-[#3a4559]" />
      <span aria-hidden className="absolute -left-[3px] top-[136px] h-11 w-[3px] rounded-l bg-[#3a4559]" />
      <span aria-hidden className="absolute -left-[3px] top-[188px] h-11 w-[3px] rounded-l bg-[#3a4559]" />
      <span aria-hidden className="absolute -right-[3px] top-[150px] h-16 w-[3px] rounded-r bg-[#3a4559]" />
      <div className="h-full rounded-[47px] bg-[#05080f] p-[7px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[40px] bg-[#f4f7fc] text-[#0b2545]">
          <div className="flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-[12px] font-semibold">
            <span>9:41</span>
            <span aria-hidden className="absolute left-1/2 top-2.5 h-[24px] w-[72px] -translate-x-1/2 rounded-full bg-[#05080f]" />
            <span className="flex items-center gap-1">
              <span aria-hidden className="flex h-[10px] items-end gap-[2px]">
                {[4, 6, 8, 10].map((h) => (
                  <span key={h} className="w-[3px] rounded-[1px] bg-current" style={{ height: h }} />
                ))}
              </span>
              <StrokeIcon name="WifiIcon" size={14} strokeWidth={2} />
              <StrokeIcon name="BatteryIcon" size={17} strokeWidth={1.8} />
            </span>
          </div>
          <div ref={screen} className="flex-1 overflow-hidden px-4 pt-2">
            <Screen tab={tab} />
          </div>
          {/* Floating dock: frosted glass over the content, icons only, a glass lens slides to the active tab.
              Inset from the screen edges so its blur never reaches the rounded corners. */}
          <nav
            aria-label="Demo app tabs"
            className="absolute inset-x-3 bottom-5 grid grid-cols-5 rounded-full border border-white/70 bg-white/45 p-1.5 shadow-[0_10px_30px_-8px_rgb(20_50_110/0.35),inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-xl backdrop-saturate-200"
          >
            <span
              aria-hidden
              className="absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%-0.75rem)/5)] rounded-full border border-white/80 bg-white/70 shadow-[0_2px_8px_rgb(20_50_110/0.18),inset_0_1px_0_#fff] transition-transform duration-500 ease-[cubic-bezier(.34,1.4,.64,1)]"
              style={{ transform: `translateX(${tab * 100}%)` }}
            />
            {TABS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setTab(i)}
                aria-label={t.label}
                aria-current={tab === i ? "page" : undefined}
                className={`relative grid h-10 place-items-center rounded-full transition-colors duration-300 ${tab === i ? "text-[#2563eb]" : "text-[#0b2545]/65"}`}
              >
                <span key={tab === i ? "on" : "off"} className={tab === i ? "animate-[tab-pop_.5s_cubic-bezier(.34,1.56,.64,1)]" : ""}>
                  <DualIcon name={t.name} active={tab === i} size={22} />
                </span>
              </button>
            ))}
          </nav>
          <span aria-hidden className="absolute bottom-1.5 left-1/2 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-[#0b2545]" />
        </div>
      </div>
    </div>
  );
}

function Screen({ tab }: { tab: number }) {
  if (tab === 1) return <SearchScreen />;
  if (tab === 2) return <CreateScreen />;
  if (tab === 3) return <InboxScreen />;
  if (tab === 4) return <ProfileScreen />;
  return <TodayScreen />;
}

function Title({ children, sub }: { children: React.ReactNode; sub: string }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] text-[#0b2545]/65">{sub}</p>
      <h3 className="font-display text-[19px] font-semibold tracking-tight">{children}</h3>
    </div>
  );
}

function TodayScreen() {
  const [tasks, setTasks] = useState<{ done: boolean; title: string; time: string; icon: IconName; tint: string }[]>([
    { done: true, title: "Design review", time: "10:00", icon: "PaletteIcon", tint: "bg-[#e0ecff] text-[#2563eb]" },
    { done: false, title: "Send invoice to Lumen", time: "12:30", icon: "ReceiptIcon", tint: "bg-[#dcfce7] text-[#15803d]" },
    { done: false, title: "Book flight to Pune", time: "15:00", icon: "PlaneIcon", tint: "bg-[#fef3c7] text-[#b45309]" },
    { done: false, title: "Water the plants", time: "18:00", icon: "SproutIcon", tint: "bg-[#fce7f3] text-[#be185d]" },
  ]);
  const done = tasks.filter((t) => t.done).length;
  const C = 2 * Math.PI * 17;
  return (
    <>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#93c5fd,#2563eb)] text-[12px] font-semibold text-white">MK</span>
        <div className="flex-1">
          <p className="text-[10.5px] text-[#0b2545]/65">Tuesday, 10 Nov</p>
          <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight">Morning, Mira</h3>
        </div>
        <span className="relative grid size-9 place-items-center rounded-full bg-white shadow-[0_1px_3px_rgb(30_64_140/0.1)]">
          <StrokeIcon name="BellIcon" size={18} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ef4444] ring-2 ring-white" />
        </span>
      </div>
      <div className="relative mb-4 flex items-center gap-3 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#3b82f6,#1d4ed8)] p-3.5 text-white">
        <svg viewBox="0 0 40 40" className="size-12 shrink-0 -rotate-90" aria-hidden>
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgb(255 255 255/.25)" strokeWidth="4" />
          <circle cx="20" cy="20" r="17" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - done / tasks.length)} className="transition-[stroke-dashoffset] duration-700 ease-out" />
        </svg>
        <div>
          <p className="font-display text-[17px] font-semibold leading-tight">{done === tasks.length ? "All done" : `${tasks.length - done} tasks left`}</p>
          <p className="text-[11px] text-white/75">{done} of {tasks.length} done today</p>
        </div>
        <StrokeIcon name="SparklesIcon" size={64} className="absolute -right-3 -top-3 text-white/15" />
      </div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[13px] font-semibold">Tasks</p>
        <p className="text-[11px] text-[#2563eb]">See all</p>
      </div>
      <ul className="space-y-1.5">
        {tasks.map((t, i) => (
          <li key={t.title}>
            <button
              type="button"
              aria-pressed={t.done}
              onClick={() => setTasks((ts) => ts.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
              className="flex w-full items-center gap-2.5 rounded-2xl bg-white p-2 pr-3 text-left shadow-[0_1px_3px_rgb(30_64_140/0.08)] transition-transform active:scale-[0.98]"
            >
              <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${t.tint}`}>
                <StrokeIcon name={t.icon} size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[12px] font-medium transition-colors ${t.done ? "text-[#0b2545]/65 line-through" : ""}`}>{t.title}</span>
                <span className="block text-[10px] text-[#0b2545]/65">{t.time}</span>
              </span>
              <DualIcon name="CheckCircleIcon" active={t.done} size={20} className={`transition-colors ${t.done ? "text-[#2563eb]" : "text-[#0b2545]/45"}`} />
            </button>
          </li>
        ))}
      </ul>
      {/* Not a control: it sits under the glass dock to show the frost, so nothing tappable is hidden there. */}
      <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-[#e8eefb] p-3 text-[12px] text-[#0b2545]/75">
        <StrokeIcon name="SunriseIcon" size={18} />
        Tomorrow: 3 tasks, first at 09:00
      </div>
    </>
  );
}

function SearchScreen() {
  const browse: { name: IconName; label: string }[] = [
    { name: "CalendarIcon", label: "Calendar" },
    { name: "FolderIcon", label: "Files" },
    { name: "ImageIcon", label: "Photos" },
    { name: "MusicIcon", label: "Music" },
  ];
  return (
    <>
      <Title sub="Find anything">Search</Title>
      <label className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[13px] shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
        <StrokeIcon name="SearchIcon" size={18} className="text-[#0b2545]/65" />
        <input aria-label="Search the demo app" placeholder="Tasks, notes, files" className="w-full bg-transparent outline-none placeholder:text-[#0b2545]/65" />
      </label>
      <p className="mb-2 text-[11px] text-[#0b2545]/65">Recent</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {["invoice", "flight", "standup"].map((r) => (
          <span key={r} className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
            <StrokeIcon name="HistoryIcon" size={14} className="text-[#0b2545]/65" />
            {r}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {browse.map((b) => (
          <div key={b.label} className="rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
            <span className="mb-6 grid size-9 place-items-center rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
              <StrokeIcon name={b.name} size={20} />
            </span>
            <p className="text-[13px] font-medium">{b.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function CreateScreen() {
  const actions: { name: IconName; label: string }[] = [
    { name: "CheckSquareIcon", label: "Task" },
    { name: "CalendarPlusIcon", label: "Event" },
    { name: "FileTextIcon", label: "Note" },
    { name: "MicIcon", label: "Voice memo" },
    { name: "ImagePlusIcon", label: "Photo" },
    { name: "LinkIcon", label: "Link" },
  ];
  return (
    <>
      <Title sub="Quick add">Create</Title>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button
            key={a.label}
            type="button"
            className={`flex flex-col items-start gap-5 rounded-2xl p-3 text-left text-[13px] font-medium transition-transform active:scale-[0.97] ${
              i === 0 ? "bg-[#2563eb] text-white" : "bg-white shadow-[0_1px_2px_rgb(30_64_140/0.06)]"
            }`}
          >
            <StrokeIcon name={a.name} size={22} />
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}

function InboxScreen() {
  const items: { name: IconName; who: string; what: string; when: string; unread?: boolean }[] = [
    { name: "ChatIcon", who: "Arjun", what: "commented on Design review", when: "2m", unread: true },
    { name: "CreditCardIcon", who: "Lumen", what: "paid invoice #0412", when: "1h", unread: true },
    { name: "PlaneIcon", who: "Check-in", what: "opens for your Pune flight", when: "3h" },
    { name: "BarChartIcon", who: "Weekly report", what: "is ready to read", when: "Mon" },
    { name: "UserPlusIcon", who: "Neha", what: "joined the Studio team", when: "Sun" },
  ];
  return (
    <>
      <Title sub="2 unread">Inbox</Title>
      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.who} className="flex items-start gap-3 rounded-2xl p-2.5">
            <span className={`grid size-9 shrink-0 place-items-center rounded-full ${n.unread ? "bg-[#2563eb] text-white" : "bg-white text-[#0b2545]/70 shadow-[0_1px_2px_rgb(30_64_140/0.06)]"}`}>
              <StrokeIcon name={n.name} size={18} />
            </span>
            <p className="flex-1 text-[12.5px] leading-snug">
              <span className="font-semibold">{n.who}</span> {n.what}
            </p>
            <span className="text-[11px] text-[#0b2545]/65">{n.when}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function ProfileScreen() {
  const [on, setOn] = useState({ notify: true, focus: false });
  const rows: { name: IconName; label: string; key?: keyof typeof on }[] = [
    { name: "BellRingIcon", label: "Notifications", key: "notify" },
    { name: "MoonIcon", label: "Focus mode", key: "focus" },
    { name: "ShieldCheckIcon", label: "Privacy" },
    { name: "HelpCircleIcon", label: "Help" },
    { name: "LogOutIcon", label: "Log out" },
  ];
  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-[#2563eb] font-display text-lg font-semibold text-white">MK</span>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">Mira Kapoor</p>
          <p className="text-[11px] text-[#0b2545]/65">Studio plan</p>
        </div>
      </div>
      <ul className="divide-y divide-[#0b2545]/6 rounded-2xl bg-white px-3 shadow-[0_1px_2px_rgb(30_64_140/0.06)]">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3 py-3 text-[13px]">
            <StrokeIcon name={r.name} size={18} className="text-[#0b2545]/60" />
            <span className="flex-1">{r.label}</span>
            {r.key ? (
              <button
                type="button"
                role="switch"
                aria-checked={on[r.key]}
                aria-label={r.label}
                onClick={() => setOn((o) => ({ ...o, [r.key!]: !o[r.key!] }))}
                className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${on[r.key] ? "bg-[#2563eb]" : "bg-[#0b2545]/15"}`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] ${on[r.key] ? "translate-x-4" : ""}`}
                />
              </button>
            ) : (
              <StrokeIcon name="ChevronRightIcon" size={16} className="text-[#0b2545]/45" />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
