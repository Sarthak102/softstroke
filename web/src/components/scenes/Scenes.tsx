import type { CSSProperties, ReactNode } from "react";
import type { Icon } from "@softstroke/react";
import {
  ArchiveIcon, ArrowDownLeftIcon, ArrowUpRightIcon, BagIcon, BanknoteIcon, BarChartIcon, BatteryIcon, BellIcon, BookmarkIcon,
  CalendarIcon, CheckIcon, CartIcon, ChatIcon, ChevronDownIcon, ChevronRightIcon, CloudIcon, CoffeeIcon, CopyIcon, CreditCardIcon, DollarIcon,
  DownloadIcon, EditIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, FileTextIcon, FilterIcon, FingerprintIcon, FolderIcon, FuelIcon,
  GlobeIcon, GridIcon, HeartIcon, HelpCircleIcon, HistoryIcon, HomeIcon, ImageIcon, InboxIcon, InfoIcon, LayersIcon, LeafIcon,
  LinkIcon, LockIcon, LogOutIcon, MailIcon, MoonIcon, MoreHorizontalIcon, MoveIcon, MusicIcon, PackageIcon, PinIcon, PlusCircleIcon,
  PlusIcon, RepeatIcon, SearchIcon, SendIcon, SettingsIcon, ShareIcon, ShieldCheckIcon, SidebarIcon, SlidersIcon, SparklesIcon,
  StarIcon, SunIcon, TrashIcon, TrendingUpIcon, UploadIcon, UserCircleIcon, UserIcon, UsersIcon, VideoIcon, WalletCardIcon,
  WifiIcon, ZapIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon, CastIcon, ListMusicIcon, CaptionsIcon, VolumeLowIcon, VolumeIcon,
  ChevronLeftIcon, ClockIcon, MapPinIcon, PlaneIcon, CalendarCheckIcon, PuzzleIcon, SnowflakeIcon, CloudRainIcon, MoonStarIcon,
  CloudSunIcon, WindIcon, StickyNoteIcon, EarthIcon, LampIcon, AppleIcon, ReplyIcon, SearchSparkleIcon, LockRotateIcon, VolumeOffIcon, ChevronsUpDownIcon, TimerIcon, RecordIcon,
} from "@softstroke/react";
import {
  BellIcon as BellSolid, FolderIcon as FolderSolid, HeartIcon as HeartSolid, HomeIcon as HomeSolid, PlayCircleIcon as PlayCircleSolid,
  SparklesIcon as SparklesSolid, ZapIcon as ZapSolid, PauseIcon as PauseSolid, CalendarIcon as CalendarSolid, BookmarkIcon as BookmarkSolid,
  GridIcon as GridSolid, PlayIcon as PlaySolid, LampIcon as LampSolid, MoonIcon as MoonSolid, FlashlightIcon as FlashlightSolid, CameraIcon as CameraSolid,
} from "@softstroke/react/solid";
import { LogoMark } from "@/components/Logo";

// Use-case scenes: real UI built from Softstroke icons, each a fixed 1200x800 frame.
// /scenes/<id> renders one for scripts/scenes.mjs to capture; sample data only.

const noise = (rgb: string, a: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 ${rgb} 0 0 0 0 ${rgb} 0 0 0 0 ${rgb} 0 0 0 ${a} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Frame({ dark, soft, children }: { dark?: boolean; soft?: boolean; children: ReactNode }) {
  const bg = dark
    ? `${noise("1", 0.05)}, radial-gradient(110% 90% at 50% 0%, #12284d, #071225 70%)`
    : soft
      ? `${noise("0.05", 0.05)}, radial-gradient(120% 100% at 20% 0%, #f8fbff, #e6f0ff 60%, #d3e4fd)`
      : `${noise("0.05", 0.06)}, radial-gradient(120% 100% at 30% 0%, #f7fbff, #dcebff 58%, #c7defd)`;
  return (
    <div className={`relative h-[800px] w-[1200px] overflow-hidden ${dark ? "text-[#e7f0ff]" : "text-[#0b2545]"}`} style={{ background: bg }}>
      {children}
    </div>
  );
}

const CARD = "bg-white shadow-[0_1px_2px_rgb(30_64_140/0.06),0_30px_70px_-24px_rgb(30_64_140/0.32)] ring-1 ring-[#0b2545]/[0.06]";

function Phone({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`absolute h-[880px] w-[430px] rounded-[66px] bg-[linear-gradient(145deg,#eef2f8,#b9c4d4_35%,#dfe5ee_70%,#ffffff)] p-[3px] shadow-[0_50px_100px_-30px_rgb(20_50_110/0.45)] ${className}`}
      style={style}
    >
      <div className="h-full rounded-[63px] bg-[#f6f8fb] p-[11px] ring-1 ring-inset ring-[#0b2545]/10">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[53px] bg-white ring-1 ring-[#0b2545]/[0.08]">{children}</div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative flex h-14 shrink-0 items-center justify-between px-9 pt-2 text-[15px] font-semibold">
      <span>9:41</span>
      <span className="absolute left-1/2 top-3 h-[30px] w-[100px] -translate-x-1/2 rounded-full bg-[#0b0f18]" />
      <span className="flex items-center gap-1.5">
        <WifiIcon size={17} />
        <BatteryIcon size={20} />
      </span>
    </div>
  );
}

function Avatar({ initials, size = 40, tone = "from-[#60a5fa] to-[#2563eb]" }: { initials: string; size?: number; tone?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${tone} font-semibold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

function Cursor({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={30} height={30} className="absolute drop-shadow-[0_3px_4px_rgb(0_0_0/0.25)]" style={style} aria-hidden>
      <path d="M5 3.2v15.4c0 .5.6.8 1 .4l3.6-3.4 2.4 5.5c.2.4.6.6 1 .4l1.8-.8c.4-.2.6-.6.4-1l-2.4-5.4h5c.5 0 .8-.6.4-1L6 2.8c-.4-.4-1-.1-1 .4Z" fill="#0b0f18" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function Toggle({ on, dark }: { on?: boolean; dark?: boolean }) {
  return (
    <span className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition ${on ? "bg-[#2563eb]" : dark ? "bg-white/15" : "bg-[#0b2545]/15"}`}>
      <span className={`absolute top-[3px] size-5 rounded-full bg-white shadow-sm ${on ? "left-[21px]" : "left-[3px]"}`} />
    </span>
  );
}

type MenuRow =
  | { icon: Icon; label: string; hint?: string; sub?: boolean; active?: boolean; danger?: boolean }
  | "sep"
  | { note: string };

function Menu({ rows, className = "", style, children }: { rows: MenuRow[]; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`absolute w-[340px] rounded-[24px] p-2 text-[18px] ${CARD} ${className}`} style={style}>
      {children}
      {rows.map((r, i) => {
        if (r === "sep") return <div key={i} className="mx-3 my-1.5 h-px bg-[#0b2545]/[0.08]" />;
        if ("note" in r) return <p key={i} className="px-4 pb-2 pt-1 text-[14px] leading-snug text-[#0b2545]/50">{r.note}</p>;
        const I = r.icon;
        return (
          <div
            key={i}
            className={`flex h-[50px] items-center gap-3.5 rounded-[14px] px-4 ${r.active ? "bg-[#2563eb]/[0.08]" : ""} ${r.danger ? "text-[#e5484d]" : ""}`}
          >
            <I size={22} className={r.danger ? "" : "text-[#0b2545]/80"} />
            <span className="flex-1 font-medium tracking-[-0.01em]">{r.label}</span>
            {r.hint && <span className="text-[15px] text-[#0b2545]/40">{r.hint}</span>}
            {r.sub && <ChevronRightIcon size={18} className="text-[#0b2545]/40" />}
          </div>
        );
      })}
    </div>
  );
}

/* 1. Social feed: tilted phone, post with an icon-pattern artwork and the action row. */
function Feed() {
  const art = [SunIcon, CloudIcon, LeafIcon, MusicIcon, StarIcon, HeartIcon, SparklesIcon, MailIcon, CalendarIcon, ImageIcon, PinIcon, BookmarkIcon];
  return (
    <Frame>
      <Phone className="left-[385px] top-[-150px]" style={{ transform: "perspective(2200px) rotateX(24deg) rotateZ(-7deg)" }}>
        <StatusBar />
        <div className="flex items-center gap-3 px-7 pt-3">
          <Avatar initials="MS" size={46} tone="from-[#fbbf24] to-[#f97316]" />
          <div className="flex-1 leading-tight">
            <p className="text-[17px] font-semibold">Mira Sato</p>
            <p className="text-[14px] text-[#0b2545]/50">2h · Lisbon</p>
          </div>
          <MoreHorizontalIcon size={24} className="text-[#0b2545]/60" />
        </div>
        <p className="px-7 pt-4 text-[17px] leading-snug">Weekend moodboard for the new app. Everything soft, nothing sharp.</p>
        <div className="relative mx-5 mt-4 h-[330px] overflow-hidden rounded-[30px] bg-[linear-gradient(150deg,#1d4ed8,#3b82f6_45%,#93c5fd)]">
          <div className="absolute -inset-6 grid rotate-[-10deg] grid-cols-4 gap-x-6 gap-y-7 p-8 text-white/35">
            {[...art, ...art].map((I, i) => (
              <I key={i} size={46} strokeWidth={1.5} />
            ))}
          </div>
          <SparklesSolid size={92} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_10px_30px_rgb(0_0_0/0.25)]" />
        </div>
        <div className="flex items-center gap-7 px-8 pt-6 text-[17px] text-[#0b2545]/60">
          <span className="flex items-center gap-2 text-[#e5484d]"><HeartSolid size={25} />12.4k</span>
          <span className="flex items-center gap-2"><ChatIcon size={25} />48</span>
          <span className="flex items-center gap-2"><RepeatIcon size={25} />96</span>
          <span className="flex items-center gap-2"><SendIcon size={25} />21</span>
          <BookmarkIcon size={25} className="ml-auto" />
        </div>
        <div className="mx-7 mt-6 flex items-center gap-3 border-t border-[#0b2545]/[0.07] pt-5">
          <Avatar initials="LK" size={46} tone="from-[#34d399] to-[#0d9488]" />
          <div className="flex-1 leading-tight">
            <p className="text-[17px] font-semibold">Leo Kim</p>
            <p className="text-[14px] text-[#0b2545]/50">5h · Seoul</p>
          </div>
          <MoreHorizontalIcon size={24} className="text-[#0b2545]/60" />
        </div>
        <p className="px-7 pt-3 text-[17px] leading-snug">Shipped dark mode today. The solid icons make active tabs so much clearer.</p>
        <div className="mt-auto border-t border-[#0b2545]/[0.07] bg-[#f6f8fb] px-9 pb-3 pt-4">
          <div className="flex items-center justify-between text-[#0b2545]/55">
            <HomeIcon size={28} />
            <SearchIcon size={28} />
            <span className="relative text-[#2563eb]">
              <PlayCircleSolid size={30} />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#e5484d] ring-2 ring-[#f6f8fb]" />
            </span>
            <BellIcon size={28} />
            <UserIcon size={28} />
          </div>
          <div className="mx-auto mt-5 h-[5px] w-[140px] rounded-full bg-[#0b0f18]" />
        </div>
      </Phone>
    </Frame>
  );
}

/* 2. Floating dock: the bottom of a reading app with a glass tab pill and a search button. */
function Dock() {
  const tabs: { icon: Icon; label: string }[] = [
    { icon: ChatIcon, label: "Chat" },
    { icon: BellIcon, label: "Activity" },
    { icon: UserIcon, label: "Profile" },
  ];
  return (
    <Frame>
      <Phone className="left-[385px] top-[-170px]" style={{ transform: "perspective(2200px) rotateX(22deg) rotateZ(6deg)" }}>
        <div className="space-y-6 px-9 pt-[200px] text-[22px] leading-[1.45] text-[#0b2545]/45">
          <p className="font-display text-[32px] font-semibold leading-tight tracking-tight text-[#0b2545]">Why soft icons?</p>
          <p>Softstroke draws every icon on a 24px grid with a 1.5px stroke, round caps and soft corners.</p>
          <p className="text-[#0b2545]/85">Install one package and import only the icons you use. Each one ships in stroke and solid, so active states come for free.</p>
          <p>Works in React, React Native, Vue, Svelte, Angular, plain SVG and as an icon font.</p>
        </div>
        <div className="absolute inset-x-4 bottom-10 flex items-center gap-3">
          <div className="flex flex-1 items-center justify-between rounded-full bg-white/80 p-2 shadow-[0_20px_50px_-16px_rgb(20_50_110/0.45),inset_0_0_0_1px_rgb(255_255_255/0.9)] ring-1 ring-[#0b2545]/[0.07] backdrop-blur">
            <span className="flex h-[66px] w-[76px] flex-col items-center justify-center gap-1 rounded-full bg-[#2563eb]/10 text-[#2563eb]">
              <HomeSolid size={25} />
              <span className="text-[13px] font-semibold">Home</span>
            </span>
            {tabs.map(({ icon: I, label }) => (
              <span key={label} className="flex w-[58px] flex-col items-center gap-1 text-[#0b2545]/75">
                <I size={25} />
                <span className="text-[13px] font-medium">{label}</span>
              </span>
            ))}
          </div>
          <span className="grid size-[66px] shrink-0 place-items-center rounded-full bg-white/80 text-[#0b2545]/80 shadow-[0_20px_50px_-16px_rgb(20_50_110/0.45)] ring-1 ring-[#0b2545]/[0.07]">
            <SearchIcon size={28} />
          </span>
        </div>
      </Phone>
    </Frame>
  );
}

/* 3. Three context menus fanned across a tilted plane. */
function Menus() {
  return (
    <Frame>
      <div className="absolute inset-0" style={{ transform: "perspective(2400px) rotateX(26deg) rotateZ(-7deg) scale(1.02)", transformOrigin: "50% 60%" }}>
        <Menu
          className="left-[40px] top-[300px]"
          rows={[
            { icon: EditIcon, label: "Rename" },
            { icon: ExternalLinkIcon, label: "Open in new tab", active: true },
            "sep",
            { icon: PlusCircleIcon, label: "Create new", sub: true },
            { icon: SettingsIcon, label: "Space settings", sub: true },
            { icon: LayersIcon, label: "Templates", sub: true },
            "sep",
            { icon: StarIcon, label: "Add to favorites" },
            { icon: EyeOffIcon, label: "Hide space" },
            { note: "You keep access, it just leaves your sidebar." },
          ]}
        />
        <Menu
          className="left-[430px] top-[150px]"
          rows={[
            { icon: EditIcon, label: "Rename" },
            { icon: InfoIcon, label: "Get info" },
            { icon: ShareIcon, label: "Share" },
            { icon: CopyIcon, label: "Copy link", active: true },
            { icon: TrashIcon, label: "Move to trash", danger: true },
            "sep",
            { icon: ZapIcon, label: "Quick actions", sub: true },
          ]}
        />
        <Menu
          className="left-[430px] top-[560px]"
          rows={[
            { icon: UserCircleIcon, label: "Account settings" },
            { icon: GridIcon, label: "Integrations" },
          ]}
        >
          <div className="mb-1 flex items-center gap-3 rounded-[16px] bg-[#f4f7fc] p-3">
            <Avatar initials="AR" size={44} />
            <div className="flex-1 leading-tight">
              <p className="text-[17px] font-semibold">Aanya Rao</p>
              <p className="text-[14px] text-[#0b2545]/50">aanya@studio.dev</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#2563eb] px-2.5 py-1 text-[12px] font-semibold text-white"><ZapSolid size={13} />PRO</span>
          </div>
        </Menu>
        <Menu
          className="left-[820px] top-[220px] w-[360px]"
          rows={[
            { icon: StarIcon, label: "Add to favorites" },
            "sep",
            { icon: CopyIcon, label: "Duplicate", hint: "⌘⇧D" },
            { icon: EditIcon, label: "Rename", hint: "⌘⇧R" },
            { icon: MoveIcon, label: "Move to", sub: true, active: true },
            { icon: UploadIcon, label: "Export settings", sub: true },
            "sep",
            { icon: SlidersIcon, label: "Session settings" },
            { icon: ArchiveIcon, label: "Move to archive" },
            { note: "Last edited Nov 11, 2026, 9:40 AM" },
          ]}
        />
      </div>
    </Frame>
  );
}

/* 4. Account dropdown with solid icons, a plan badge, storage meter and a dark mode switch. */
function Profile() {
  const rows: { icon: Icon; label: string; active?: boolean }[] = [
    { icon: HomeIcon, label: "Home" },
    { icon: FolderIcon, label: "Projects" },
    { icon: VideoIcon, label: "Live session", active: true },
    { icon: UsersIcon, label: "Team" },
  ];
  return (
    <Frame>
      <div className="absolute left-1/2 top-[70px] w-[400px] -translate-x-1/2">
        <div className={`flex items-center gap-3.5 rounded-[24px] p-4 ${CARD}`}>
          <span className="relative">
            <Avatar initials="AR" size={54} />
            <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-[#22c55e] ring-[3px] ring-white" />
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-[19px] font-semibold">Aanya Rao</p>
            <p className="text-[15px] text-[#0b2545]/50">aanya@studio.dev</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#0b2545] px-3 py-1.5 text-[13px] font-semibold text-white"><ZapSolid size={14} />PRO</span>
        </div>
        <div className={`mt-2 rounded-[24px] p-2 text-[17px] ${CARD}`}>
          {rows.map(({ icon: I, label, active }) => (
            <div key={label} className={`flex h-[48px] items-center gap-3.5 rounded-[14px] px-4 ${active ? "bg-[#2563eb]/[0.08] text-[#2563eb]" : ""}`}>
              <I size={22} className={active ? "" : "text-[#0b2545]/70"} />
              <span className="flex-1 font-medium">{label}</span>
              {active && <span className="rounded-full bg-[#e5484d] px-2 py-0.5 text-[12px] font-semibold text-white">LIVE</span>}
            </div>
          ))}
          <div className="mx-3 my-1.5 h-px bg-[#0b2545]/[0.08]" />
          <div className="flex h-[48px] items-center gap-3.5 px-4">
            <SettingsIcon size={22} className="text-[#0b2545]/70" />
            <span className="flex-1 font-medium">Workspace settings</span>
          </div>
          <div className="flex h-[48px] items-center gap-3.5 px-4">
            <MoonIcon size={22} className="text-[#0b2545]/70" />
            <span className="flex-1 font-medium">Dark mode</span>
            <Toggle />
          </div>
          <div className="flex h-[48px] items-center gap-3.5 px-4">
            <HelpCircleIcon size={22} className="text-[#0b2545]/70" />
            <span className="flex-1 font-medium">Help center</span>
          </div>
          <div className="mx-2 mt-1 rounded-[16px] bg-[#f4f7fc] p-4">
            <div className="flex items-center gap-2 text-[15px]">
              <CloudIcon size={20} className="text-[#2563eb]" />
              <span className="flex-1 font-medium">Storage</span>
              <span className="text-[#0b2545]/50">6.8 of 10 GB</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#0b2545]/10">
              <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]" />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[15px]">
            <span className="text-[#0b2545]/50">Feedback</span>
            <span className="flex items-center gap-2 rounded-[12px] px-3 py-2 font-medium ring-1 ring-[#0b2545]/10"><LogOutIcon size={18} />Log out</span>
          </div>
        </div>
      </div>
      <Cursor style={{ left: 655, top: 288 }} />
    </Frame>
  );
}

/* 5. File browser window with a right-click menu open on a folder. */
function Files() {
  const folders = ["Brand", "Icons", "Launch", "Exports", "Research", "Archive"];
  return (
    <Frame>
      <div className={`absolute left-[90px] top-[90px] h-[760px] w-[1060px] overflow-hidden rounded-[26px] ${CARD}`}>
        <div className="flex h-14 items-center gap-2 border-b border-[#0b2545]/[0.07] px-5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="size-3 rounded-full" style={{ background: c }} />)}
          <span className="ml-6 flex items-center gap-2 text-[15px] font-semibold"><FolderIcon size={18} className="text-[#2563eb]" />Design</span>
          <span className="ml-auto flex h-9 w-[240px] items-center gap-2 rounded-[10px] bg-[#f4f7fc] px-3 text-[14px] text-[#0b2545]/45"><SearchIcon size={17} />Search files</span>
        </div>
        <div className="flex h-full">
          <div className="w-[220px] space-y-1 border-r border-[#0b2545]/[0.07] bg-[#f8fafd] p-3 text-[15px]">
            {[
              { i: HomeIcon, l: "Home" },
              { i: HistoryIcon, l: "Recent" },
              { i: StarIcon, l: "Starred" },
              { i: UsersIcon, l: "Shared" },
              { i: TrashIcon, l: "Trash" },
            ].map(({ i: I, l }, n) => (
              <div key={l} className={`flex h-10 items-center gap-3 rounded-[10px] px-3 ${n === 0 ? "bg-white font-semibold shadow-sm ring-1 ring-[#0b2545]/[0.06]" : "text-[#0b2545]/70"}`}>
                <I size={19} />{l}
              </div>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-4 content-start gap-6 p-8">
            {folders.map((f, n) => (
              <div key={f} className={`flex flex-col items-center gap-2 rounded-[18px] p-4 ${n === 1 ? "bg-[#2563eb]/[0.08] ring-1 ring-[#2563eb]/30" : ""}`}>
                <FolderSolid size={74} className="text-[#60a5fa]" />
                <span className="text-[15px] font-medium">{f}</span>
              </div>
            ))}
            {[FileTextIcon, ImageIcon].map((I, n) => (
              <div key={n} className="flex flex-col items-center gap-2 p-4">
                <span className="grid h-[74px] w-[60px] place-items-center rounded-[12px] bg-[#f4f7fc] text-[#0b2545]/60 ring-1 ring-[#0b2545]/[0.08]"><I size={28} /></span>
                <span className="text-[15px] font-medium">{n ? "cover.png" : "brief.md"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Menu
        className="left-[560px] top-[250px] w-[330px]"
        rows={[
          { icon: HistoryIcon, label: "Version history" },
          { icon: LinkIcon, label: "Copy link", hint: "⌘L" },
          { icon: UploadIcon, label: "Export…" },
          "sep",
          { icon: SidebarIcon, label: "Add to sidebar", sub: true },
          "sep",
          { icon: CopyIcon, label: "Duplicate", hint: "⌘D" },
          { icon: EditIcon, label: "Rename", active: true },
          { icon: MoveIcon, label: "Move to…" },
          { icon: TrashIcon, label: "Move to trash", danger: true },
        ]}
      />
      <Cursor style={{ left: 770, top: 560 }} />
    </Frame>
  );
}

/* 6. Analytics dashboard bleeding off the frame. */
function Dashboard() {
  const nav: { icon: Icon; label: string; badge?: string }[] = [
    { icon: HomeIcon, label: "Overview" },
    { icon: BarChartIcon, label: "Analytics" },
    { icon: InboxIcon, label: "Inbox", badge: "12" },
    { icon: UsersIcon, label: "Customers" },
    { icon: PackageIcon, label: "Products" },
    { icon: CreditCardIcon, label: "Billing" },
    { icon: SettingsIcon, label: "Settings" },
  ];
  const stats: { icon: Icon; label: string; value: string; delta: string }[] = [
    { icon: DollarIcon, label: "Revenue", value: "$48,920", delta: "+12.4%" },
    { icon: CartIcon, label: "Orders", value: "1,284", delta: "+8.1%" },
    { icon: EyeIcon, label: "Visitors", value: "32.6k", delta: "+21.7%" },
  ];
  const pts = [40, 62, 55, 80, 72, 98, 90, 120, 112, 140, 150, 170];
  // smooth curve through the points (Catmull-Rom as cubic Beziers), not straight segments
  const P = pts.map((y, i) => [i * 60, 200 - y]);
  const line = P.map(([x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [a, b, c] = [P[i - 2] ?? P[i - 1], P[i - 1], P[i + 1] ?? [x, y]];
    return `C${b[0] + (x - a[0]) / 6} ${b[1] + (y - a[1]) / 6} ${x - (c[0] - b[0]) / 6} ${y - (c[1] - b[1]) / 6} ${x} ${y}`;
  }).join("");
  return (
    <Frame>
      <div className={`absolute left-[120px] top-[110px] flex h-[760px] w-[1180px] overflow-hidden rounded-[28px] ${CARD}`}>
        <div className="w-[250px] border-r border-[#0b2545]/[0.07] bg-[#f8fafd] p-5">
          <div className="flex items-center gap-2.5 px-2 pb-6 font-display text-[20px] font-semibold"><LogoMark className="size-7 text-[#2563eb]" />Northwind</div>
          {nav.map(({ icon: I, label, badge }, n) => (
            <div key={label} className={`mb-1 flex h-11 items-center gap-3 rounded-[12px] px-3 text-[16px] ${n === 1 ? "bg-white font-semibold text-[#2563eb] shadow-sm ring-1 ring-[#0b2545]/[0.06]" : "text-[#0b2545]/70"}`}>
              <I size={21} />
              <span className="flex-1">{label}</span>
              {badge && <span className="rounded-full bg-[#2563eb] px-2 text-[12px] font-semibold text-white">{badge}</span>}
            </div>
          ))}
        </div>
        <div className="flex-1 p-8">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[28px] font-semibold tracking-tight">Analytics</h3>
            <span className="ml-auto flex h-11 items-center gap-2 rounded-[12px] px-4 text-[15px] ring-1 ring-[#0b2545]/10"><CalendarIcon size={18} />Last 30 days<ChevronDownIcon size={16} /></span>
            <span className="grid size-11 place-items-center rounded-[12px] ring-1 ring-[#0b2545]/10"><FilterIcon size={19} /></span>
            <span className="relative grid size-11 place-items-center rounded-[12px] ring-1 ring-[#0b2545]/10"><BellIcon size={19} /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#e5484d]" /></span>
            <Avatar initials="AR" size={44} />
          </div>
          <div className="mt-7 grid grid-cols-3 gap-5">
            {stats.map(({ icon: I, label, value, delta }) => (
              <div key={label} className="rounded-[20px] bg-[#f8fafd] p-5 ring-1 ring-[#0b2545]/[0.06]">
                <div className="flex items-center gap-2.5 text-[15px] text-[#0b2545]/60">
                  <span className="grid size-9 place-items-center rounded-[10px] bg-white text-[#2563eb] shadow-sm"><I size={19} /></span>
                  {label}
                </div>
                <p className="mt-4 font-display text-[30px] font-semibold tracking-tight">{value}</p>
                <p className="mt-1 flex items-center gap-1 text-[14px] font-medium text-[#16a34a]"><TrendingUpIcon size={16} />{delta}<span className="font-normal text-[#0b2545]/45">vs last month</span></p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[20px] p-6 ring-1 ring-[#0b2545]/[0.07]">
            <div className="flex items-center text-[16px] font-semibold">Revenue<span className="ml-auto flex items-center gap-1.5 text-[14px] font-medium text-[#0b2545]/50"><DownloadIcon size={17} />Export</span></div>
            <svg viewBox="0 0 660 200" className="mt-4 h-[200px] w-full" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2563eb" stopOpacity=".22" />
                  <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[50, 100, 150].map((y) => <line key={y} x1="0" x2="660" y1={y} y2={y} stroke="#0b2545" strokeOpacity=".06" />)}
              <path d={`${line} L660 200 L0 200 Z`} fill="url(#dash-fill)" />
              <path d={line} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* 7. Banking app: phone with balance, quick actions and transactions, plus a floating notification. */
function Finance() {
  const actions: { icon: Icon; label: string }[] = [
    { icon: SendIcon, label: "Send" },
    { icon: ArrowDownLeftIcon, label: "Request" },
    { icon: CreditCardIcon, label: "Cards" },
    { icon: MoreHorizontalIcon, label: "More" },
  ];
  const tx: { icon: Icon; name: string; meta: string; amt: string; tone: string }[] = [
    { icon: CoffeeIcon, name: "Blue Bottle", meta: "Today, 8:12", amt: "-$6.40", tone: "bg-[#fef3c7] text-[#b45309]" },
    { icon: BanknoteIcon, name: "Salary", meta: "Yesterday", amt: "+$4,200", tone: "bg-[#dcfce7] text-[#15803d]" },
    { icon: FuelIcon, name: "Shell", meta: "Nov 9", amt: "-$52.10", tone: "bg-[#fee2e2] text-[#b91c1c]" },
    { icon: BagIcon, name: "Uniqlo", meta: "Nov 8", amt: "-$89.90", tone: "bg-[#ede9fe] text-[#6d28d9]" },
  ];
  return (
    <Frame>
      <Phone className="left-[180px] top-[60px]">
        <StatusBar />
        <div className="flex items-center px-7 pt-2">
          <Avatar initials="AR" size={42} />
          <div className="ml-3 flex-1 leading-tight">
            <p className="text-[14px] text-[#0b2545]/50">Good morning</p>
            <p className="text-[17px] font-semibold">Aanya</p>
          </div>
          <span className="grid size-11 place-items-center rounded-full bg-[#f4f7fc]"><BellIcon size={22} /></span>
        </div>
        <div className="relative mx-5 mt-5 overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#1e40af,#2563eb_55%,#60a5fa)] p-6 text-white">
          <WalletCardIcon size={150} className="absolute -right-6 -top-6 text-white/10" />
          <p className="flex items-center gap-2 text-[15px] text-white/75">Total balance<EyeIcon size={17} /></p>
          <p className="mt-2 font-display text-[40px] font-semibold tracking-tight">$12,480.52</p>
          <p className="mt-1 flex items-center gap-1 text-[14px] text-white/80"><TrendingUpIcon size={16} />+$1,920 this month</p>
        </div>
        <div className="grid grid-cols-4 px-6 pt-6">
          {actions.map(({ icon: I, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-[14px] font-medium">
              <span className="grid size-[58px] place-items-center rounded-[20px] bg-[#f4f7fc] text-[#2563eb]"><I size={24} /></span>
              {label}
            </div>
          ))}
        </div>
        <div className="flex items-center px-7 pt-7 text-[17px] font-semibold">Recent<span className="ml-auto text-[14px] font-medium text-[#2563eb]">See all</span></div>
        <div className="px-5 pt-2">
          {tx.map(({ icon: I, name, meta, amt, tone }) => (
            <div key={name} className="flex items-center gap-3.5 rounded-[18px] px-2 py-3">
              <span className={`grid size-12 place-items-center rounded-[16px] ${tone}`}><I size={22} /></span>
              <div className="flex-1 leading-tight">
                <p className="text-[16px] font-semibold">{name}</p>
                <p className="text-[13px] text-[#0b2545]/50">{meta}</p>
              </div>
              <span className={`text-[16px] font-semibold ${amt.startsWith("+") ? "text-[#16a34a]" : ""}`}>{amt}</span>
            </div>
          ))}
        </div>
      </Phone>
      <div className={`absolute left-[650px] top-[170px] flex w-[400px] items-center gap-4 rounded-[24px] p-5 ${CARD}`}>
        <span className="grid size-14 place-items-center rounded-[18px] bg-[#dcfce7] text-[#15803d]"><ArrowDownLeftIcon size={26} /></span>
        <div className="flex-1 leading-tight">
          <p className="text-[17px] font-semibold">Payment received</p>
          <p className="mt-1 text-[15px] text-[#0b2545]/55">Leo sent you $240.00</p>
        </div>
        <span className="text-[13px] text-[#0b2545]/40">now</span>
      </div>
      <div className={`absolute left-[700px] top-[330px] w-[360px] rounded-[24px] p-5 ${CARD}`}>
        <div className="flex items-center gap-2 text-[16px] font-semibold"><BarChartIcon size={20} className="text-[#2563eb]" />Spending<span className="ml-auto text-[14px] font-medium text-[#16a34a]">-12% vs Oct</span></div>
        <div className="mt-5 flex h-[120px] items-end gap-3">
          {[46, 70, 38, 92, 60, 104, 74].map((h, i) => (
            <span key={i} className={`flex-1 rounded-[8px] ${i === 5 ? "bg-[#2563eb]" : "bg-[#2563eb]/15"}`} style={{ height: h }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-[#0b2545]/40">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}</div>
      </div>
      <div className={`absolute left-[760px] top-[560px] flex items-center gap-3 rounded-full py-3 pl-3 pr-5 text-[15px] font-medium ${CARD}`}>
        <span className="grid size-9 place-items-center rounded-full bg-[#2563eb] text-white"><ShieldCheckIcon size={19} /></span>
        Card protected with Face ID
      </div>
    </Frame>
  );
}

/* 8. Dark settings panel: toggles, values and a confirmation toast. */
function DarkSettings() {
  const rows: { icon: Icon; label: string; sub: string; on?: boolean; value?: string }[] = [
    { icon: BellIcon, label: "Notifications", sub: "Mentions and replies", on: true },
    { icon: ShieldCheckIcon, label: "Two-factor login", sub: "Authenticator app", on: true },
    { icon: FingerprintIcon, label: "Unlock with Touch ID", sub: "On this device" },
    { icon: MoonIcon, label: "Appearance", sub: "Follows system", value: "Dark" },
    { icon: GlobeIcon, label: "Language", sub: "Interface and emails", value: "English" },
    { icon: LockIcon, label: "Privacy", sub: "Data and permissions", value: "" },
  ];
  return (
    <Frame dark>
      <div className="absolute left-[110px] top-[80px] w-[600px] rounded-[30px] bg-[#0c1a33] p-3 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-3 px-5 pb-4 pt-3">
          <SettingsIcon size={24} className="text-[#7aa7ff]" />
          <h3 className="font-display text-[24px] font-semibold tracking-tight">Settings</h3>
          <span className="ml-auto flex h-10 w-[200px] items-center gap-2 rounded-[12px] bg-white/[0.06] px-3 text-[14px] text-white/40"><SearchIcon size={17} />Search</span>
        </div>
        <div className="rounded-[22px] bg-white/[0.04] p-2 ring-1 ring-white/[0.06]">
          {rows.map(({ icon: I, label, sub, on, value }, n) => (
            <div key={label} className={`flex h-[78px] items-center gap-4 px-4 ${n ? "border-t border-white/[0.06]" : ""}`}>
              <span className="grid size-11 place-items-center rounded-[14px] bg-white/[0.07] text-[#cfe0ff]"><I size={22} /></span>
              <div className="flex-1 leading-tight">
                <p className="text-[17px] font-semibold">{label}</p>
                <p className="mt-0.5 text-[14px] text-white/45">{sub}</p>
              </div>
              {value === undefined ? <Toggle on={on} dark /> : (
                <span className="flex items-center gap-1.5 text-[15px] text-white/55">{value}<ChevronRightIcon size={18} /></span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[750px] top-[450px] w-[370px] rounded-[24px] bg-[#13264a] p-5 shadow-[0_30px_80px_-24px_rgb(0_0_0/0.75)] ring-1 ring-white/10">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-[16px] bg-[#2563eb] text-white"><ShieldCheckIcon size={24} /></span>
          <div className="flex-1 leading-tight">
            <p className="text-[17px] font-semibold">Two-factor is on</p>
            <p className="mt-1 text-[14px] text-white/50">Your account is safer now.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-[14px] font-medium">
          <span className="flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-white/[0.07] py-2.5"><DownloadIcon size={17} />Backup codes</span>
          <span className="flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#2563eb] py-2.5 text-white"><CheckIcon size={17} />Done</span>
        </div>
      </div>
      <div className="absolute left-[800px] top-[150px] flex items-center gap-3 rounded-full bg-[#13264a] py-3 pl-3 pr-5 text-[15px] font-medium shadow-[0_20px_60px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
        <span className="grid size-9 place-items-center rounded-full bg-white/10 text-[#7aa7ff]"><BellSolid size={18} /></span>
        3 new mentions
        <ArrowUpRightIcon size={17} className="text-white/40" />
      </div>
      <div className="absolute left-[860px] top-[250px] flex items-center gap-3 rounded-full bg-[#13264a] py-3 pl-3 pr-5 text-[15px] font-medium shadow-[0_20px_60px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
        <span className="grid size-9 place-items-center rounded-full bg-white/10 text-[#7aa7ff]"><PlusIcon size={18} /></span>
        Add a passkey
      </div>
    </Frame>
  );
}

/* 9. Music player: tilted phone, now playing with transport controls. */
function Music() {
  return (
    <Frame>
      <Phone className="left-[390px] top-[-120px]" style={{ transform: "perspective(2200px) rotateX(24deg) rotateZ(7deg)" }}>
        <StatusBar />
        <div className="flex items-center justify-between px-8 pt-2 text-[#0b2545]/60">
          <ChevronDownIcon size={26} />
          <span className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#0b2545]/45">Now playing</span>
          <MoreHorizontalIcon size={26} />
        </div>
        <div className="relative mx-8 mt-6 aspect-square overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#dbeafe,#93c5fd_55%,#3b82f6)] shadow-[0_24px_50px_-20px_rgb(30_64_140/0.45)]">
          {[300, 230, 160, 90].map((s) => (
            <span key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" style={{ width: s, height: s }} />
          ))}
          <MusicIcon size={54} strokeWidth={1.5} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
        </div>
        <div className="flex items-center px-8 pt-7">
          <div className="flex-1 leading-tight">
            <p className="text-[24px] font-semibold tracking-tight">Soft Hours</p>
            <p className="mt-1 text-[17px] text-[#0b2545]/50">Northbound</p>
          </div>
          <HeartSolid size={28} className="text-[#e5484d]" />
        </div>
        <div className="mx-8 mt-6 h-1.5 rounded-full bg-[#0b2545]/10">
          <div className="relative h-full w-[38%] rounded-full bg-[#0b2545]">
            <span className="absolute -right-2 -top-[5px] size-4 rounded-full bg-[#0b2545] ring-4 ring-white" />
          </div>
        </div>
        <div className="flex justify-between px-8 pt-2.5 text-[13px] font-medium text-[#0b2545]/45"><span>1:24</span><span>3:51</span></div>
        <div className="flex items-center justify-between px-9 pt-4 text-[#0b2545]/70">
          <ShuffleIcon size={24} />
          <SkipBackIcon size={32} className="text-[#0b2545]" />
          <span className="grid size-[76px] place-items-center rounded-full bg-[#0b2545] text-white shadow-[0_14px_30px_-10px_rgb(11_37_69/0.6)]"><PauseSolid size={32} /></span>
          <SkipForwardIcon size={32} className="text-[#0b2545]" />
          <RepeatIcon size={24} className="text-[#2563eb]" />
        </div>
        <div className="flex items-center gap-3 px-8 pt-7 text-[#0b2545]/45">
          <VolumeLowIcon size={20} />
          <div className="h-1.5 flex-1 rounded-full bg-[#0b2545]/10"><div className="h-full w-[64%] rounded-full bg-[#0b2545]/60" /></div>
          <VolumeIcon size={20} />
        </div>
        <div className="mt-auto flex items-center justify-around border-t border-[#0b2545]/[0.07] bg-[#f6f8fb] px-8 pb-8 pt-5 text-[#0b2545]/60">
          <CaptionsIcon size={26} />
          <CastIcon size={26} />
          <ListMusicIcon size={26} />
        </div>
      </Phone>
    </Frame>
  );
}

/* 10. Calendar: tilted phone, day view with a week strip, timed events and the now line. */
function CalendarDay() {
  const week = [["M", 9], ["T", 10], ["W", 11], ["T", 12], ["F", 13], ["S", 14], ["S", 15]] as const;
  const HOUR = 92;
  const events: { icon: Icon; title: string; meta: string; top: number; h: number; tone: string; people?: string[] }[] = [
    { icon: VideoIcon, title: "Design review", meta: "9:30 – 10:30 · Meet", top: 0.5, h: 1, tone: "bg-[#2563eb]/[0.09] text-[#1d4ed8] border-[#2563eb]", people: ["MS", "LK"] },
    { icon: CoffeeIcon, title: "Coffee with Leo", meta: "11:00 · Blue Bottle", top: 2, h: 0.75, tone: "bg-[#fef3c7] text-[#92400e] border-[#f59e0b]" },
    { icon: PlaneIcon, title: "Flight to Lisbon", meta: "12:45 – 14:30 · TP 1351", top: 3.75, h: 1.25, tone: "bg-[#ede9fe] text-[#5b21b6] border-[#8b5cf6]" },
  ];
  return (
    <Frame>
      <Phone className="left-[380px] top-[-130px]" style={{ transform: "perspective(2200px) rotateX(24deg) rotateZ(-6deg)" }}>
        <StatusBar />
        <div className="flex items-center gap-3 px-8 pt-2">
          <div className="flex-1 leading-tight">
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#0b2545]/45">Wednesday</p>
            <p className="text-[28px] font-semibold tracking-tight">November 11</p>
          </div>
          <span className="grid size-11 place-items-center rounded-full bg-[#f4f7fc] text-[#0b2545]/70"><SearchIcon size={22} /></span>
          <span className="grid size-11 place-items-center rounded-full bg-[#f4f7fc] text-[#0b2545]/70"><CalendarIcon size={22} /></span>
        </div>
        <div className="flex items-center gap-1 px-4 pt-5">
          <ChevronLeftIcon size={20} className="shrink-0 text-[#0b2545]/35" />
          {week.map(([d, n]) => (
            <span key={n} className={`flex flex-1 flex-col items-center gap-1 rounded-[18px] py-2.5 ${n === 11 ? "bg-[#0b2545] text-white shadow-[0_12px_24px_-10px_rgb(11_37_69/0.6)]" : ""}`}>
              <span className={`text-[13px] font-medium ${n === 11 ? "text-white/60" : "text-[#0b2545]/45"}`}>{d}</span>
              <span className="text-[18px] font-semibold">{n}</span>
              <span className={`size-1 rounded-full ${[9, 11, 13].includes(n) ? (n === 11 ? "bg-white" : "bg-[#2563eb]") : "bg-transparent"}`} />
            </span>
          ))}
          <ChevronRightIcon size={20} className="shrink-0 text-[#0b2545]/35" />
        </div>
        <div className="relative mx-6 mt-5 border-t border-[#0b2545]/[0.07]" style={{ height: HOUR * 5.4 }}>
          {[9, 10, 11, 12, 13, 14].map((h, i) => (
            <div key={h} className="absolute inset-x-0 flex items-start gap-3" style={{ top: i * HOUR }}>
              <span className="-mt-2 w-11 text-right text-[13px] font-medium text-[#0b2545]/40">{h}:00</span>
              <span className="mt-0 h-px flex-1 bg-[#0b2545]/[0.06]" />
            </div>
          ))}
          {events.map(({ icon: I, title, meta, top, h, tone, people }) => (
            <div key={title} className={`absolute left-[60px] right-1 flex gap-3 rounded-[16px] border-l-[4px] px-4 py-3 ${tone}`} style={{ top: top * HOUR + 3, height: h * HOUR - 6 }}>
              <I size={22} className="mt-0.5 shrink-0" />
              <div className="flex-1 leading-tight">
                <p className="text-[16px] font-semibold">{title}</p>
                <p className="mt-1 text-[13px] opacity-70">{meta}</p>
              </div>
              {people && (
                <span className="flex shrink-0 self-end">
                  {people.map((p, i) => <span key={p} className="relative flex rounded-full ring-2 ring-white" style={{ zIndex: people.length - i, marginLeft: i ? -4 : 0 }}><Avatar initials={p} size={30} tone={i ? "from-[#34d399] to-[#0d9488]" : "from-[#fbbf24] to-[#f97316]"} /></span>)}
                </span>
              )}
            </div>
          ))}
          <div className="absolute left-[46px] right-0 flex items-center" style={{ top: 2.85 * HOUR }}>
            <span className="size-2.5 rounded-full bg-[#e5484d]" />
            <span className="h-[2px] flex-1 bg-[#e5484d]" />
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[#0b2545]/[0.07] bg-[#f6f8fb] px-10 pb-8 pt-5 text-[#0b2545]/55">
          <CalendarCheckIcon size={27} className="text-[#2563eb]" />
          <ClockIcon size={27} />
          <span className="-mt-12 grid size-[66px] place-items-center rounded-full bg-[#2563eb] text-white shadow-[0_16px_30px_-10px_rgb(37_99_235/0.7)] ring-[6px] ring-[#f6f8fb]"><PlusIcon size={28} /></span>
          <MapPinIcon size={27} />
          <UserIcon size={27} />
        </div>
      </Phone>
    </Frame>
  );
}

/* Soft light UI (Sarthak's inspo 04/05/11/12): pale grey ground, frosted white surfaces with a bright top edge. */
const SOFT = "bg-[linear-gradient(180deg,#fdfeff,#f1f6fd)] shadow-[inset_0_1.5px_0_rgb(255_255_255/0.95),0_0_0_1.5px_rgb(255_255_255/0.75),0_40px_80px_-36px_rgb(30_64_140/0.22)]";

function HandCursor({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={44} height={44} className="absolute drop-shadow-[0_3px_4px_rgb(30_64_140/0.22)]" style={style} aria-hidden>
      <path
        d="M8.6 4.1a1.55 1.55 0 0 1 3.1 0v6.2h.3V8.9a1.5 1.5 0 0 1 3 0v1.6h.3V9.7a1.45 1.45 0 0 1 2.9 0v1.2h.3a1.4 1.4 0 0 1 2.8 0v4.2c0 3.6-2.5 6.1-6 6.1h-1.4c-2 0-3.4-.75-4.6-2.25l-3.5-4.4a1.6 1.6 0 0 1 2.45-2.05l1.95 2.1Z"
        fill="#fff" stroke="#0b0f18" strokeWidth="1.25" strokeLinejoin="round"
      />
      <path d="M11.7 14.2v3.2M14.7 14.2v3.2M17.5 14.2v3.2" stroke="#0b0f18" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* 11. Soft account menu (inspo 12): avatar on a frosted panel, menu with a raised hover row. */
function SoftMenu() {
  const rows: { icon: Icon; label: string; danger?: boolean }[] = [
    { icon: UserIcon, label: "Profile" },
    { icon: PuzzleIcon, label: "Integrations" },
    { icon: SlidersIcon, label: "Settings" },
    { icon: HelpCircleIcon, label: "Help Center" },
  ];
  return (
    <Frame soft>
      <div className={`absolute -left-10 top-[70px] h-[900px] w-[1110px] rounded-[72px] ${SOFT}`} />
      <span className="absolute left-[908px] top-[118px] grid size-[104px] place-items-center rounded-full bg-[#e1eaf7] shadow-[inset_0_2px_4px_rgb(30_64_140/0.08),0_0_0_2px_rgb(255_255_255/0.9)]">
        <Avatar initials="AR" size={84} />
      </span>
      <div className={`absolute left-[520px] top-[262px] w-[490px] rounded-[46px] p-5 text-[#111] ${SOFT}`}>
        {rows.map(({ icon: I, label }, n) => (
          <div
            key={label}
            className={`flex h-[90px] items-center rounded-[26px] px-7 ${n === 0 ? "bg-[#f6f9fe] shadow-[inset_0_1.5px_0_#fff,0_0_0_1px_rgb(30_64_140/0.03),0_12px_24px_-12px_rgb(30_64_140/0.22)]" : ""}`}
          >
            <span className="flex-1 text-[29px] font-medium tracking-[-0.01em]">{label}</span>
            <I size={38} />
          </div>
        ))}
        <div className="mx-7 my-3 h-[1.5px] bg-[#0b0f18]/[0.07]" />
        <div className="flex h-[90px] items-center px-7 text-[#ef4444]">
          <span className="flex-1 text-[29px] font-medium tracking-[-0.01em]">Logout</span>
          <LogOutIcon size={38} />
        </div>
      </div>
      <HandCursor style={{ left: 842, top: 318 }} />
    </Frame>
  );
}

/* 12. Weather segmented pill (inspo 11): the active option sits in a raised round key. */
function WeatherPill() {
  const opts: Icon[] = [SunIcon, SnowflakeIcon, CloudRainIcon, MoonStarIcon, CloudSunIcon, WindIcon];
  return (
    <Frame soft>
      <div className={`absolute left-[90px] top-[290px] flex h-[220px] w-[1300px] items-center gap-[64px] rounded-full pl-[78px] ${SOFT}`}>
        {opts.map((I, n) =>
          n === 1 ? (
            <span key={n} className="grid size-[176px] shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#f3f7fd,#d9e4f3)] shadow-[0_0_0_7px_#eef4fc,0_0_0_8.5px_rgb(30_64_140/0.06),0_14px_24px_-10px_rgb(30_64_140/0.3),inset_0_2px_0_#fff]">
              <I size={72} className="text-[#2563eb]" />
            </span>
          ) : (
            <I key={n} size={72} className="shrink-0 text-[#111]" />
          ),
        )}
      </div>
    </Frame>
  );
}

/* 13. Theme switch (inspo 04): a frosted glass knob with a warm sun glow on a long pill. */
function ThemeToggle() {
  return (
    <Frame soft>
      <div className={`absolute left-[150px] top-[230px] h-[340px] w-[1200px] rounded-full ${SOFT}`} />
      <MoonIcon size={86} className="absolute left-[1010px] top-[357px] text-[#0b2545]/20" />
      <div className="absolute left-[200px] top-[275px] size-[250px] overflow-hidden rounded-full bg-white/50 shadow-[inset_0_0_0_2.5px_rgb(255_255_255/0.95),0_24px_40px_-18px_rgb(30_64_140/0.25)] backdrop-blur">
        <span className="absolute -left-6 top-24 size-[180px] rounded-full bg-[#60a5fa]/60 blur-[38px]" />
        <span className="absolute -right-4 -top-2 size-[140px] rounded-full bg-[#93c5fd]/70 blur-[34px]" />
        <span className="absolute left-[55px] top-[55px] size-[140px] rounded-full bg-[#fcd34d]/80 blur-[30px]" />
        <SunIcon size={104} strokeWidth={1.75} className="absolute left-[73px] top-[73px] text-[#fef3c7] drop-shadow-[0_0_12px_rgb(251_191_36/0.9)]" />
      </div>
    </Frame>
  );
}

/* 14. "Add to My Calendar" pill (inspo 05): a big double-rimmed button with a gradient calendar. */
function AddCalendar() {
  return (
    <Frame soft>
      <div className="absolute left-[80px] top-[150px] h-[500px] w-[1300px] rounded-full bg-[#f6f9fe] p-[16px] shadow-[0_0_0_1.5px_rgb(30_64_140/0.04),0_40px_80px_-40px_rgb(30_64_140/0.3)]">
        <div className="flex h-full items-center gap-[60px] rounded-full bg-[linear-gradient(180deg,#fcfdff,#e9f0fa)] pl-[150px] shadow-[inset_0_2px_0_#fff,inset_0_-2px_6px_rgb(30_64_140/0.04),0_0_0_1.5px_rgb(30_64_140/0.05)]">
          <CalendarSolid size={180} color="url(#add-cal)" className="shrink-0 drop-shadow-[0_10px_20px_rgb(37_99_235/0.22)]">
            <defs>
              <linearGradient id="add-cal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fbbf24" />
                <stop offset=".45" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#bfdbfe" />
              </linearGradient>
            </defs>
          </CalendarSolid>
          <div className="leading-none text-[#7f8da6] [text-shadow:0_1.5px_0_#fff]">
            <p className="text-[64px] font-medium tracking-[-0.01em]">Add to</p>
            <p className="mt-4 whitespace-nowrap text-[120px] font-semibold tracking-[-0.02em]">My Calendar</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* 15. Bento of soft app cards (inspo 08), three columns bleeding off the frame. */
function Bento() {
  const card = `absolute overflow-hidden rounded-[34px] ${SOFT}`;
  const tab = (I: Icon, label: string, on?: boolean) => (
    <span key={label} className={`flex flex-col items-center gap-1.5 text-[15px] ${on ? "font-semibold text-[#111]" : "text-[#0b0f18]/35"}`}>
      <I size={34} />
      {label}
    </span>
  );
  const plusKey = (s: number) => (
    <span className="grid shrink-0 place-items-center rounded-full bg-[#f6f9fe] text-[#111] shadow-[inset_0_1.5px_0_#fff,0_14px_24px_-12px_rgb(30_64_140/0.25)]" style={{ width: s, height: s }}>
      <PlusIcon size={s * 0.4} />
    </span>
  );
  const steps = [62, 70, 66, 74, 72, 64, 66, 58, 60, 54, 57, 48, 44, 36, 38, 26, 20];
  const stepLine = steps.map((y, i) => `${i ? "L" : "M"}${i * 22} ${y}`).join(" ");
  return (
    <Frame soft>
      {/* left column */}
      <div className={`${card} -left-10 -top-12 h-[240px] w-[340px]`}>
        <div className="absolute bottom-7 left-14 flex items-end gap-4">
          {plusKey(76)}
          {tab(BookmarkSolid, "Bookmark")}
          {tab(GridSolid, "Dashboard")}
        </div>
      </div>
      <div className={`${card} -left-10 top-[222px] h-[310px] w-[340px]`}>
        <span className="absolute right-6 top-6"><Avatar initials="AR" size={52} /></span>
        <div className="absolute left-14 top-[88px] leading-tight">
          <p className="text-[18px] font-medium text-[#111]">8,911 Steps</p>
          <p className="text-[14px] text-[#0b0f18]/45">Wed Nov 11</p>
        </div>
        <svg viewBox="0 0 352 90" className="absolute left-0 top-[140px] h-[90px] w-[352px]" aria-hidden>
          <path d={stepLine} fill="none" stroke="#111" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-6 left-14 right-8 flex justify-between text-[15px] text-[#0b0f18]/35"><b className="font-semibold text-[#111]">1m</b><span>6m</span><span>1y</span><span>All</span></div>
      </div>
      <div className={`${card} -left-10 top-[552px] h-[300px] w-[340px]`}>
        <div className="absolute left-14 right-7 top-5 rounded-[24px] bg-[#f6f9fe] p-4 shadow-[inset_0_1.5px_0_#fff,0_10px_20px_-12px_rgb(30_64_140/0.2)]">
          <div className="flex items-center text-[15px] font-medium text-[#111]">Active Minutes<HistoryIcon size={22} className="ml-auto" /></div>
          <div className="mt-3 flex items-end gap-1.5"><span className="text-[30px] font-semibold leading-none text-[#111]">28</span><span className="text-[14px] text-[#0b0f18]/50">min</span><span className="ml-auto rounded-full bg-[#2563eb] px-2.5 py-1 text-[12px] font-semibold text-white">+12%</span></div>
        </div>
        <div className="absolute left-14 top-[132px] flex items-end gap-8">
          <span className="grid size-[82px] place-items-center rounded-full bg-[#0b0f18] text-white shadow-[0_14px_24px_-10px_rgb(0_0_0/0.5)]"><PlaySolid size={34} /></span>
          {tab(AppleIcon, "Nutrition")}
          {tab(MoonIcon, "Sleep")}
        </div>
      </div>

      {/* middle column */}
      <div className={`${card} left-[330px] -top-10 h-[230px] w-[520px]`}>
        <p className="absolute left-10 top-[52px] flex items-center gap-2 text-[16px] text-[#111]"><ReplyIcon size={18} />Got it, thanks! I&apos;ll check the files today.</p>
        <div className="absolute bottom-6 left-10 right-10 flex items-end justify-between">
          {tab(InboxIcon, "Inbox", true)}
          {tab(CalendarIcon, "Calendar")}
          <span className="mb-3 grid size-[88px] place-items-center rounded-full bg-[linear-gradient(160deg,#60a5fa,#2563eb)] text-white shadow-[0_18px_30px_-12px_rgb(37_99_235/0.7)]"><PlusIcon size={36} /></span>
          {tab(BookmarkIcon, "Saved")}
          {tab(StickyNoteIcon, "Notes")}
        </div>
      </div>
      <div className={`${card} left-[330px] top-[212px] h-[520px] w-[520px] p-4`}>
        <div className="relative h-[262px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#2f80ed,#7fb6ff_55%,#eef4ff)]">
          <span className="absolute left-6 top-6 size-[56px] rounded-full bg-[radial-gradient(circle_at_40%_40%,#fde68a,#fbbf24)] shadow-[0_0_60px_20px_rgb(253_224_71/0.45)]" />
          <svg viewBox="0 0 400 200" className="absolute inset-x-0 top-[60px] h-[200px] w-full" aria-hidden><path d="M110 200 C150 40 250 40 290 200" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" strokeDasharray="5 7" /></svg>
          <p className="absolute left-1/2 top-[30px] flex -translate-x-1/2 items-center gap-1.5 text-[15px] text-white/90"><MapPinIcon size={17} />Lisbon, Portugal</p>
          <span className="absolute right-5 top-5"><Avatar initials="AR" size={46} /></span>
          <p className="absolute left-7 top-[118px] text-[64px] font-light leading-none text-white">24°</p>
          <p className="absolute bottom-[58px] left-7 text-[15px] text-white">Pretty Sunny</p>
          <p className="absolute bottom-[58px] left-1/2 -translate-x-1/2 text-[14px] text-white/80">11:21 AM</p>
          <p className="absolute bottom-[58px] right-6 text-[14px] text-white">Nov 11, 2026</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { l: "Air Quality", v: "42", s: "Good", I: SunIcon, bar: "bg-[linear-gradient(90deg,#86efac,#60a5fa,#2563eb)]", knob: "left-[28%]" },
            { l: "Cloud Cover", v: "5%", s: "Clear", I: CloudIcon, bar: "bg-[#0b0f18]/[0.06]", knob: "left-0" },
          ].map(({ l, v, s, I, bar, knob }) => (
            <div key={l} className="rounded-[22px] bg-[#f6f9fe] p-4 shadow-[inset_0_1.5px_0_#fff,0_10px_20px_-14px_rgb(30_64_140/0.25)]">
              <div className="flex items-center text-[15px] font-medium text-[#111]">{l}<I size={22} className="ml-auto" /></div>
              <p className="mt-2 text-[28px] font-medium leading-none text-[#111]">{v}</p>
              <div className="mt-1 flex items-center gap-3 text-[13px] text-[#0b0f18]/50">{s}<span className={`relative h-2.5 flex-1 rounded-full ${bar}`}><span className={`absolute -top-[3px] h-4 w-5 rounded-full bg-[#2563eb] ring-2 ring-white ${knob}`} /></span></div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-[78px] flex-1 items-center justify-around rounded-full bg-[#f6f9fe] text-[#111] shadow-[inset_0_1.5px_0_#fff,0_12px_22px_-14px_rgb(30_64_140/0.3)]">
            <HomeSolid size={30} /><CloudSunIcon size={30} /><EarthIcon size={30} /><HeartIcon size={30} />
          </div>
          {plusKey(78)}
        </div>
      </div>
      <div className={`${card} left-[330px] top-[752px] h-[160px] w-[520px]`}>
        <div className="relative flex h-full items-start gap-3 bg-[linear-gradient(180deg,#fde7dc,#f3e7e1)] p-6">
          <span className="grid size-[54px] place-items-center rounded-full bg-white/70 text-[#111]"><ChevronLeftIcon size={24} /></span>
          <span className="ml-auto grid size-[54px] place-items-center rounded-full bg-white/70 text-[#111]"><UploadIcon size={24} /></span>
          <span className="grid size-[54px] place-items-center rounded-full bg-white/70 text-[#111]"><EditIcon size={24} /></span>
        </div>
      </div>

      {/* right column */}
      <div className={`${card} left-[880px] -top-10 h-[530px] w-[360px]`}>
        <div className="absolute left-6 top-[58px] flex items-center gap-3">
          <Avatar initials="AR" size={52} />
          <div className="leading-tight"><p className="text-[14px] text-[#0b0f18]/45">November 11, 2026</p><p className="text-[19px] font-medium text-[#111]">Welcome back, Aanya</p></div>
        </div>
        <div className="absolute left-6 right-0 top-[132px] h-[120px] overflow-hidden rounded-l-[26px] bg-[linear-gradient(135deg,#dbeafe,#93c5fd_60%,#60a5fa)]">
          <LampSolid size={150} className="absolute right-6 -top-6 text-white/45" />
          <span className="absolute left-5 top-5 grid size-[54px] place-items-center rounded-full bg-white/80 text-[#2563eb] shadow-[0_8px_18px_-8px_rgb(37_99_235/0.6)]"><LockIcon size={24} /></span>
        </div>
        <div className="absolute left-6 top-[266px] flex gap-3">
          <div className="w-[230px] rounded-[24px] bg-[linear-gradient(160deg,#bfdbfe,#93c5fd)] p-4 text-[#0b2545] shadow-[inset_0_1.5px_0_rgb(255_255_255/0.7)]">
            <div className="flex items-center"><span className="grid size-[48px] place-items-center rounded-full bg-white"><LampIcon size={24} /></span><span className="ml-auto text-[17px] font-medium">On</span></div>
            <p className="mt-4 text-[18px] font-medium">Smart Spotlights</p>
          </div>
          <div className="w-[160px] rounded-[24px] bg-[#f6f9fe] p-4 text-[#111] shadow-[inset_0_1.5px_0_#fff]">
            <span className="grid size-[48px] place-items-center rounded-full bg-white"><WindIcon size={24} /></span>
            <p className="mt-4 whitespace-nowrap text-[18px] font-medium">Air Purifier</p>
          </div>
        </div>
        <div className="absolute bottom-7 left-10 flex items-end gap-9">
          {tab(HomeIcon, "Home", true)}
          {tab(ZapIcon, "Smart")}
          {plusKey(82)}
        </div>
      </div>
      <div className={`${card} left-[880px] top-[510px] h-[360px] w-[360px]`}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#2f80ed,#7fb6ff_60%,#dbeafe)]" />
        <span className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-[16px] text-white ring-1 ring-white/40 backdrop-blur"><ChevronLeftIcon size={18} />Back</span>
        <div className="absolute left-6 top-[90px] grid size-[150px] place-items-center rounded-[22px] bg-[linear-gradient(150deg,#dbeafe,#93c5fd_55%,#3b82f6)] shadow-[0_18px_30px_-14px_rgb(11_37_69/0.5)]">
          <MusicIcon size={54} className="text-white" />
        </div>
        <div className="absolute left-[196px] top-[96px] text-white">
          <p className="text-[24px] font-semibold leading-tight">Soft Hours</p>
          <p className="mt-2 text-[16px] text-white/85">Northbound</p>
          <p className="mt-3 text-[13px] text-white/70">Album · 2026</p>
        </div>
        <div className="absolute inset-x-6 top-[270px] flex items-center gap-4 text-[15px] text-white/90"><span>1</span><span className="font-medium">Morning Light</span><span className="ml-auto text-white/70">3:51</span></div>
      </div>
    </Frame>
  );
}

/* Glass over a photo (inspo 06/07/10): Sarthak's generated backgrounds in public/use-cases/bg. */
const GLASS = "bg-white/15 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1.5px_0_rgb(255_255_255/0.7),inset_0_0_0_1.5px_rgb(255_255_255/0.35),0_30px_60px_-24px_rgb(11_37_69/0.45)]";

/* 16. Glass tab bar over clouds (inspo 06): the photo sits in a white-rimmed screen corner. */
function CloudsBar() {
  return (
    <Frame soft>
      <div className="absolute -top-16 left-[150px] h-[720px] w-[1120px] overflow-hidden rounded-bl-[64px] bg-cover bg-center shadow-[0_0_0_7px_#fff,0_40px_80px_-40px_rgb(0_0_0/0.35)]" style={{ backgroundImage: "url(/use-cases/bg/clouds.jpg)" }}>
        <div className={`absolute bottom-[56px] left-[56px] flex h-[150px] w-[520px] items-center justify-around rounded-full text-white ${GLASS}`}>
          <HomeIcon size={60} />
          <SearchSparkleIcon size={60} />
          <BookmarkIcon size={60} />
        </div>
      </div>
    </Frame>
  );
}

/* 17. Glass tab bar over liquid glass (inspo 07): active home in our blue, separate search key. */
function GlassBar() {
  return (
    <Frame>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/use-cases/bg/glass.jpg)" }} />
      <div className="absolute left-[80px] top-[310px] flex items-center gap-5">
        <div className={`flex h-[180px] w-[820px] items-center justify-between rounded-full px-5 text-[#0b2545] ${GLASS} bg-white/35`}>
          <span className="grid h-[140px] w-[200px] place-items-center rounded-full bg-white/70 shadow-[inset_0_1.5px_0_#fff,0_12px_24px_-12px_rgb(37_99_235/0.5)]">
            <HomeSolid size={64} color="url(#glass-home)">
              <defs>
                <linearGradient id="glass-home" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </HomeSolid>
          </span>
          <MapPinIcon size={64} className="mx-auto" />
          <BagIcon size={64} className="mx-auto" />
          <SettingsIcon size={64} className="mx-auto" />
        </div>
        <span className={`grid size-[180px] shrink-0 place-items-center rounded-full text-[#0b2545] ${GLASS} bg-white/35`}>
          <SearchIcon size={64} />
        </span>
      </div>
    </Frame>
  );
}

/* 18. Control centre over hydrangea petals (inspo 10): glass keys, "on" keys lighter with solid icons. */
function ControlCenter() {
  const key = (on?: boolean) => `grid place-items-center rounded-full text-white ${GLASS} ${on ? "bg-white/35" : ""}`;
  return (
    <Frame>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/use-cases/bg/petals.jpg)" }} />
      <div className="absolute left-[150px] top-[80px] grid grid-cols-[repeat(4,170px)] grid-rows-[repeat(3,170px)] gap-[34px]">
        <span className={key()}><LockRotateIcon size={70} /></span>
        <span className={key(true)}><BellSolid size={66} /></span>
        <span className={`row-span-2 ${key()} rounded-[85px] items-end pb-[60px]`}><SunIcon size={66} /></span>
        <span className={`row-span-2 ${key()} rounded-[85px] items-end pb-[60px]`}><VolumeOffIcon size={66} /></span>
        <span className={`col-span-2 flex items-center gap-7 rounded-full pl-6 pr-9 text-white ${GLASS}`}>
          <span className="grid size-[124px] place-items-center rounded-full bg-white/35 shadow-[inset_0_1.5px_0_rgb(255_255_255/0.7)]"><MoonSolid size={56} /></span>
          <span className="text-[34px] font-medium">Focus</span>
          <ChevronsUpDownIcon size={32} className="ml-auto opacity-80" />
        </span>
        <span className={key(true)}><FlashlightSolid size={66} /></span>
        <span className={key()}><TimerIcon size={70} /></span>
        <span className={key(true)}><CameraSolid size={66} /></span>
        <span className={key()}><RecordIcon size={70} /></span>
      </div>
    </Frame>
  );
}

export const SCENES = {
  "soft-menu": { title: "Soft account menu", Scene: SoftMenu },
  "weather-pill": { title: "Weather picker", Scene: WeatherPill },
  "theme-toggle": { title: "Theme switch", Scene: ThemeToggle },
  "add-calendar": { title: "Add to calendar button", Scene: AddCalendar },
  bento: { title: "Soft app cards", Scene: Bento },
  "clouds-bar": { title: "Glass tab bar over clouds", Scene: CloudsBar },
  "glass-bar": { title: "Glass tab bar", Scene: GlassBar },
  "control-center": { title: "Glass control centre", Scene: ControlCenter },
  music: { title: "Music player", Scene: Music },
  calendar: { title: "Calendar day view", Scene: CalendarDay },
  feed: { title: "Social feed", Scene: Feed },
  dock: { title: "Floating tab bar", Scene: Dock },
  menus: { title: "Context menus", Scene: Menus },
  profile: { title: "Account menu", Scene: Profile },
  files: { title: "File browser", Scene: Files },
  dashboard: { title: "Analytics dashboard", Scene: Dashboard },
  finance: { title: "Banking app", Scene: Finance },
  settings: { title: "Dark settings", Scene: DarkSettings },
} as const;

export type SceneId = keyof typeof SCENES;
