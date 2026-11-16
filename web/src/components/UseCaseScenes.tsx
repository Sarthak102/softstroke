import type { CSSProperties, ReactNode } from "react";
import {
  BarChartIcon, BellIcon, BookmarkIcon, CalendarIcon, ClockIcon, CloudSunIcon, CopyIcon, CreditCardIcon, DropletIcon, EarthIcon,
  EditIcon, FileTextIcon, FolderIcon, HeartIcon, HelpCircleIcon, HistoryIcon, HomeIcon, ImageIcon, InboxIcon, LampIcon, LinkIcon,
  LogOutIcon, MapPinIcon, MoonIcon, MusicIcon, PlusIcon, PuzzleIcon, SearchIcon, SettingsIcon, ShareIcon, SlidersIcon, StarIcon,
  TrashIcon, TrendingUpIcon, UploadIcon, UserIcon, UserPlusIcon, UsersIcon, WalletIcon, WindIcon, BagIcon, CartIcon,
} from "@softstroke/react";
import {
  BarChartIcon as BarChartF, CalendarIcon as CalendarF, FolderIcon as FolderF, HomeIcon as HomeF, PlayIcon as PlayF,
  SkipBackIcon as SkipBackF, SkipForwardIcon as SkipForwardF, SunIcon as SunF,
} from "@softstroke/react/solid";
import { BASE } from "@/lib/site";

// The use-case scenes, drawn at 720 x 480 in the site's light palette on the grounds of the original captures
// (soft blue radials with grain, or a photo). The card scales them to fit (--k, set by ScaleScenes).
export type UseCase = { id: string; title: string; body: string; icons: string[]; Scene: () => ReactNode };

const st = (s: CSSProperties) => s;
const Sm = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <div className="sm" style={style}>{children}</div>;
const Row = ({ children, on, danger }: { children: ReactNode; on?: boolean; danger?: boolean }) => (
  <div className={`ri2${on ? " on" : ""}${danger ? " danger" : ""}`}>{children}</div>
);
const Kbd = ({ children }: { children: ReactNode }) => <span className="kbd">{children}</span>;
const Line = ({ w, strong }: { w: string; strong?: boolean }) => (
  <div style={{ height: strong ? 12 : 10, width: w, borderRadius: 4, background: strong ? "var(--line-2)" : "var(--line)" }} />
);
const photo = (file: string) => ({ "--photo": `url(${BASE}/use-cases/bg/${file})` }) as CSSProperties;

function Bento() {
  return (
    <div className="sc soft" style={st({ display: "grid", gridTemplateColumns: "200px 1fr 200px", gap: 16, padding: 24 })}>
      <div style={{ display: "grid", gap: 16, gridTemplateRows: "1fr auto" }}>
        <div className="cd" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="ti"><TrendingUpIcon size={18} /></span>
          <span className="num" style={{ fontSize: 32, marginTop: 10 }}>8,911</span>
          <Sm>Steps today</Sm>
          <svg viewBox="0 0 160 48" style={{ marginTop: "auto", width: "100%", color: "var(--accent)" }} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M2 40 C 20 38, 26 30, 40 32 S 62 18, 78 24 S 104 10, 120 16 S 146 6, 158 4" />
          </svg>
        </div>
        <div className="cd" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span className="ti"><LampIcon size={18} /></span>
          <div><b style={{ fontWeight: 500 }}>Spotlights</b><Sm>Living room</Sm></div>
          <span className="tgl" />
        </div>
      </div>
      <div className="cd" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
        <div className="sm" style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}><MapPinIcon size={14} />Lisbon</span><span>Thu 19 Nov</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
          <SunF size={64} style={{ color: "var(--accent)" }} />
          <div><div className="num" style={{ fontSize: 56, lineHeight: 1 }}>24°</div><div className="mut">Clear sky</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }}>
          {([[WindIcon, "Wind", "12 km/h"], [DropletIcon, "Humidity", "41%"]] as const).map(([I, l, v]) => (
            <div key={l} style={{ padding: 12, borderRadius: 12, background: "var(--surface-2)" }}>
              <Sm style={{ display: "flex", gap: 6, alignItems: "center" }}><I size={14} />{l}</Sm>
              <b style={{ fontWeight: 500 }}>{v}</b>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px 0", color: "var(--text-3)" }}>
          <HomeF size={22} style={{ color: "var(--accent)" }} />
          <CloudSunIcon size={22} /><EarthIcon size={22} /><HeartIcon size={22} />
          <span className="inv" style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center" }}><PlusIcon size={20} /></span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateRows: "1fr auto" }}>
        <div className="cd" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ aspectRatio: "1", borderRadius: 12, background: "var(--surface-2)", display: "grid", placeItems: "center", color: "var(--text-3)" }}><MusicIcon size={44} /></div>
          <div><b style={{ fontWeight: 500 }}>Soft Hours</b><Sm>Northbound</Sm></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", color: "var(--text-2)" }}>
            <SkipBackF size={18} />
            <span className="inv" style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center" }}><PlayF size={16} /></span>
            <SkipForwardF size={18} />
          </div>
        </div>
        <div className="cd" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span className="ti"><InboxIcon size={18} /></span>
          <div><b style={{ fontWeight: 500 }}>3 new</b><Sm>Inbox</Sm></div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <div className="sc soft">
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <b style={{ fontWeight: 600 }}>Northwind</b><span className="sm" style={{ marginLeft: 16 }}>Projects</span><span className="sm">Team</span>
        <span style={{ marginLeft: "auto", color: "var(--text-2)" }}><BellIcon size={18} /></span>
        <span className="ti acc" style={{ width: 32, height: 32, borderRadius: "50%", fontWeight: 600, fontSize: 12 }}>AR</span>
      </div>
      <div style={{ padding: "32px 24px", display: "grid", gap: 12, width: 360 }}>
        <Line w="60%" strong /><Line w="90%" /><Line w="80%" />
        <div style={{ height: 120, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)", marginTop: 12 }} />
      </div>
      <div className="cd" style={{ position: "absolute", right: 24, top: 68, width: 290, padding: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10 }}>
          <span className="ti acc" style={{ width: 40, height: 40, borderRadius: "50%", fontWeight: 600 }}>AR</span>
          <div><b style={{ fontWeight: 500 }}>Aanya Rao</b><Sm>aanya@northwind.co</Sm></div>
        </div>
        <div className="hr" />
        <Row><UserIcon size={18} />Profile</Row>
        <Row><PuzzleIcon size={18} />Integrations</Row>
        <Row on><SlidersIcon size={18} />Settings<Kbd>⌘,</Kbd></Row>
        <Row><HelpCircleIcon size={18} />Help center</Row>
        <div className="hr" />
        <Row danger><LogOutIcon size={18} />Log out</Row>
      </div>
    </div>
  );
}

function CallToAction() {
  return (
    <div className="sc photo" style={{ ...photo("petals.jpg"), display: "grid", placeItems: "center" }}>
      <div className="cd" style={{ width: 400, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="ti acc" style={{ width: 48, height: 48, borderRadius: 14 }}><CalendarF size={24} /></span>
          <div><Sm>Event</Sm><b style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Design review</b></div>
        </div>
        <div className="mut" style={{ display: "grid", gap: 10, margin: "20px 0 22px" }}>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}><ClockIcon size={16} />Thu 19 Nov, 10:30 to 11:15</span>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}><MapPinIcon size={16} />Studio 2, third floor</span>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}><UsersIcon size={16} />Aanya, Leo and 4 others</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ flex: 1, height: 46, borderRadius: 12, background: "var(--accent)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500, fontSize: 14 }}>
            <CalendarF size={18} />Add to calendar
          </span>
          <span style={{ height: 46, padding: "0 16px", borderRadius: 12, border: "1px solid var(--line-2)", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <BellIcon size={18} />Remind me
          </span>
        </div>
      </div>
    </div>
  );
}

function SideNav({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderRight: "1px solid var(--line)", padding: "16px 10px", display: "grid", alignContent: "start", gap: 2 }}>
      <b style={{ fontWeight: 600, padding: "2px 10px 14px" }}>{title}</b>
      {children}
    </div>
  );
}

function Dashboard() {
  const curve = "M0 120 C 40 110, 70 112, 100 96 S 160 100, 200 80 S 270 74, 310 60 S 390 52, 430 34 S 480 26, 500 20";
  return (
    <div className="sc" style={{ display: "grid", gridTemplateColumns: "168px 1fr" }}>
      <SideNav title="Northwind">
        <Row><HomeIcon size={18} />Overview</Row>
        <Row on><BarChartF size={18} />Analytics</Row>
        <Row><InboxIcon size={18} />Inbox<span className="sm" style={{ marginLeft: "auto" }}>12</span></Row>
        <Row><UsersIcon size={18} />Customers</Row>
        <Row><CreditCardIcon size={18} />Billing</Row>
        <Row><SettingsIcon size={18} />Settings</Row>
      </SideNav>
      <div style={{ padding: 20, display: "grid", gap: 14, alignContent: "start" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>Analytics</b>
          <span className="pill"><CalendarIcon size={14} />Last 30 days</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {([[WalletIcon, "Revenue", "$48,920", "+12.4%"], [CartIcon, "Orders", "1,284", "+8.1%"], [UsersIcon, "Visitors", "32.6k", "+21.7%"]] as const).map(([I, l, v, d]) => (
            <div key={l} className="cd" style={{ padding: 14, boxShadow: "none" }}>
              <Sm style={{ display: "flex", gap: 6, alignItems: "center" }}><I size={14} />{l}</Sm>
              <div className="num" style={{ fontSize: 24, marginTop: 6 }}>{v}</div>
              <div className="up">{d} vs last month</div>
            </div>
          ))}
        </div>
        <div className="cd" style={{ padding: 16, boxShadow: "none" }}>
          <Sm>Revenue</Sm>
          <svg viewBox="0 0 500 150" style={{ width: "100%", marginTop: 8 }} fill="none">
            <path d="M0 30h500M0 75h500M0 120h500" stroke="var(--line)" />
            <path d={`${curve} V150 H0Z`} fill="var(--accent-soft)" />
            <path d={curve} stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CommandMenu() {
  return (
    <div className="sc photo" style={{ ...photo("clouds.jpg"), display: "grid", placeItems: "center" }}>
      <div className="cd" style={{ width: 460, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 54, padding: "0 16px", borderBottom: "1px solid var(--line)", color: "var(--text-3)" }}>
          <SearchIcon size={18} /><span style={{ fontSize: 15 }}>Search or jump to</span><span style={{ marginLeft: "auto" }}><Kbd>⌘K</Kbd></span>
        </div>
        <div style={{ padding: 8 }}>
          <Sm style={{ padding: "8px 10px 4px" }}>Suggestions</Sm>
          <Row><FileTextIcon size={18} />New document<Kbd>N</Kbd></Row>
          <Row><FolderIcon size={18} />Open project<Kbd>O</Kbd></Row>
          <Row><UserPlusIcon size={18} />Invite people</Row>
          <Sm style={{ padding: "12px 10px 4px" }}>Settings</Sm>
          <Row on><MoonIcon size={18} />Switch theme<Kbd>T</Kbd></Row>
          <Row><BellIcon size={18} />Notifications</Row>
        </div>
        <div className="sm" style={{ display: "flex", gap: 16, padding: "10px 16px", borderTop: "1px solid var(--line)" }}>
          <span>↑↓ to move</span><span>↵ to open</span><span style={{ marginLeft: "auto" }}>esc to close</span>
        </div>
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="sc photo" style={photo("glass.jpg")}>
      <div style={{ padding: "28px 120px", display: "grid", gap: 16 }}>
        {[0, 1].map((k) => (
          <div key={k} className="cd" style={{ padding: 14, boxShadow: "none", display: "grid", gridTemplateColumns: "96px 1fr", gap: 14, alignItems: "center" }}>
            <div style={{ height: 96, borderRadius: 12, background: "var(--surface-2)", display: "grid", placeItems: "center", color: "var(--text-3)" }}><ImageIcon size={28} /></div>
            <div style={{ display: "grid", gap: 8 }}>
              <Line w="70%" strong /><Line w="92%" /><Line w="60%" />
              <Sm style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}><HeartIcon size={14} />128</span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}><BookmarkIcon size={14} />Save</span>
              </Sm>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)", display: "flex", gap: 10, alignItems: "center" }}>
        <div className="inv" style={{ display: "flex", gap: 4, padding: 6, borderRadius: 22, boxShadow: "var(--shadow)" }}>
          <span style={{ width: 64, height: 48, borderRadius: 16, display: "grid", placeItems: "center", background: "rgb(255 255 255 / 0.12)", color: "var(--accent)" }}><HomeF size={22} /></span>
          {[MapPinIcon, BagIcon, HeartIcon, UserIcon].map((I, k) => (
            <span key={k} style={{ width: 56, height: 48, display: "grid", placeItems: "center", opacity: 0.75 }}><I size={22} /></span>
          ))}
        </div>
        <span className="inv" style={{ width: 60, height: 60, borderRadius: "50%", display: "grid", placeItems: "center", boxShadow: "var(--shadow)" }}><SearchIcon size={22} /></span>
      </div>
    </div>
  );
}

function Files() {
  const folders: [string, number, boolean?][] = [["Brand 2026", 24, true], ["Website", 58], ["Mobile app", 112], ["Research", 9], ["Pitch deck", 14], ["Archive", 301]];
  return (
    <div className="sc" style={{ display: "grid", gridTemplateColumns: "168px 1fr" }}>
      <SideNav title="Files">
        <Row on><FolderF size={18} />All files</Row>
        <Row><HistoryIcon size={18} />Recent</Row>
        <Row><StarIcon size={18} />Starred</Row>
        <Row><UsersIcon size={18} />Shared</Row>
        <Row><TrashIcon size={18} />Trash</Row>
        <div style={{ marginTop: 20, padding: "0 10px" }}>
          <div style={{ height: 4, borderRadius: 4, background: "var(--line-2)" }}><div style={{ height: "100%", width: "62%", borderRadius: 4, background: "var(--text)" }} /></div>
          <Sm style={{ marginTop: 6 }}>12.4 of 20 GB</Sm>
        </div>
      </SideNav>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <b style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>Projects</b>
          <span className="pill"><UploadIcon size={14} />Upload</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {folders.map(([n, c, a]) => (
            <div key={n} className="cd" style={{ padding: 14, boxShadow: "none" }}>
              <FolderF size={30} style={{ color: a ? "var(--accent)" : "var(--text-3)" }} />
              <div style={{ marginTop: 10, fontWeight: 500 }}>{n}</div>
              <Sm>{c} files</Sm>
            </div>
          ))}
        </div>
      </div>
      <div className="cd" style={{ position: "absolute", left: 452, top: 150, width: 200, padding: 6 }}>
        <Row><CopyIcon size={18} />Duplicate</Row>
        <Row><EditIcon size={18} />Rename</Row>
        <Row on><LinkIcon size={18} />Copy link</Row>
        <Row><ShareIcon size={18} />Share</Row>
        <div className="hr" />
        <Row danger><TrashIcon size={18} />Delete</Row>
      </div>
    </div>
  );
}

export const USE_CASES: UseCase[] = [
  { id: "app-cards", title: "App cards", body: "Weather, health, smart home and music cards. The active tab is solid, the rest stay stroke.", icons: ["trending-up", "lamp", "sun", "map-pin", "home", "music"], Scene: Bento },
  { id: "account-menu", title: "Account menu", body: "A dropdown where every row leads with an icon, and the hovered one turns tangerine.", icons: ["user", "puzzle", "sliders", "help-circle", "log-out"], Scene: AccountMenu },
  { id: "call-to-action", title: "Call to action", body: "A primary button that carries the solid calendar, next to stroke details.", icons: ["calendar", "clock", "map-pin", "users", "bell"], Scene: CallToAction },
  { id: "dashboard", title: "Analytics dashboard", body: "Sidebar navigation, stat cards and a toolbar at 14 to 18px.", icons: ["home", "bar-chart", "inbox", "wallet", "cart", "users"], Scene: Dashboard },
  { id: "command-menu", title: "Command menu", body: "Search, actions and shortcuts, each row anchored by an icon.", icons: ["search", "file-text", "folder", "user-plus", "moon", "bell"], Scene: CommandMenu },
  { id: "tab-bar", title: "Floating tab bar", body: "The active tab in solid, the rest in stroke, on an inverted bar.", icons: ["home", "map-pin", "bag", "heart", "user", "search"], Scene: TabBar },
  { id: "files", title: "File browser", body: "Solid folders, a context menu and a sidebar, all from one set.", icons: ["folder", "history", "star", "copy", "link", "trash"], Scene: Files },
];
