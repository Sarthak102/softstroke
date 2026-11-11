"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { drawIn } from "@/lib/draw";
import { BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, CartIcon, ChatIcon, CloudIcon, CoffeeIcon, CompassIcon, CrownIcon, FlagIcon, FlameIcon, FolderIcon, GemIcon, GiftIcon, GlobeIcon, HeadphonesIcon, HeartIcon, HomeIcon, ImageIcon, KeyIcon, LeafIcon, LightbulbIcon, LockIcon, MailIcon, MapPinIcon, MicIcon, MoonIcon, MusicIcon, PaletteIcon, PhoneIcon, PlayCircleIcon, PuzzleIcon, RocketIcon, SearchIcon, SettingsIcon, ShieldCheckIcon, SparklesIcon, StarIcon, SunIcon, TagIcon, TerminalIcon, TrophyIcon, UmbrellaIcon, UserIcon, VideoIcon, WalletIcon, ZapIcon } from "@softstroke/react";
import { BellIcon as BellSolidIcon, BookmarkIcon as BookmarkSolidIcon, CalendarIcon as CalendarSolidIcon, CameraIcon as CameraSolidIcon, CartIcon as CartSolidIcon, ChatIcon as ChatSolidIcon, CloudIcon as CloudSolidIcon, CoffeeIcon as CoffeeSolidIcon, CompassIcon as CompassSolidIcon, CrownIcon as CrownSolidIcon, FlagIcon as FlagSolidIcon, FlameIcon as FlameSolidIcon, FolderIcon as FolderSolidIcon, GemIcon as GemSolidIcon, GiftIcon as GiftSolidIcon, GlobeIcon as GlobeSolidIcon, HeadphonesIcon as HeadphonesSolidIcon, HeartIcon as HeartSolidIcon, HomeIcon as HomeSolidIcon, ImageIcon as ImageSolidIcon, KeyIcon as KeySolidIcon, LeafIcon as LeafSolidIcon, LightbulbIcon as LightbulbSolidIcon, LockIcon as LockSolidIcon, MailIcon as MailSolidIcon, MapPinIcon as MapPinSolidIcon, MicIcon as MicSolidIcon, MoonIcon as MoonSolidIcon, MusicIcon as MusicSolidIcon, PaletteIcon as PaletteSolidIcon, PhoneIcon as PhoneSolidIcon, PlayCircleIcon as PlayCircleSolidIcon, PuzzleIcon as PuzzleSolidIcon, RocketIcon as RocketSolidIcon, SearchIcon as SearchSolidIcon, SettingsIcon as SettingsSolidIcon, ShieldCheckIcon as ShieldCheckSolidIcon, SparklesIcon as SparklesSolidIcon, StarIcon as StarSolidIcon, SunIcon as SunSolidIcon, TagIcon as TagSolidIcon, TerminalIcon as TerminalSolidIcon, TrophyIcon as TrophySolidIcon, UmbrellaIcon as UmbrellaSolidIcon, UserIcon as UserSolidIcon, VideoIcon as VideoSolidIcon, WalletIcon as WalletSolidIcon, ZapIcon as ZapSolidIcon } from "@softstroke/react/solid";

const Stroke = { BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, CartIcon, ChatIcon, CloudIcon, CoffeeIcon, CompassIcon, CrownIcon, FlagIcon, FlameIcon, FolderIcon, GemIcon, GiftIcon, GlobeIcon, HeadphonesIcon, HeartIcon, HomeIcon, ImageIcon, KeyIcon, LeafIcon, LightbulbIcon, LockIcon, MailIcon, MapPinIcon, MicIcon, MoonIcon, MusicIcon, PaletteIcon, PhoneIcon, PlayCircleIcon, PuzzleIcon, RocketIcon, SearchIcon, SettingsIcon, ShieldCheckIcon, SparklesIcon, StarIcon, SunIcon, TagIcon, TerminalIcon, TrophyIcon, UmbrellaIcon, UserIcon, VideoIcon, WalletIcon, ZapIcon };
const Solid = { BellIcon: BellSolidIcon, BookmarkIcon: BookmarkSolidIcon, CalendarIcon: CalendarSolidIcon, CameraIcon: CameraSolidIcon, CartIcon: CartSolidIcon, ChatIcon: ChatSolidIcon, CloudIcon: CloudSolidIcon, CoffeeIcon: CoffeeSolidIcon, CompassIcon: CompassSolidIcon, CrownIcon: CrownSolidIcon, FlagIcon: FlagSolidIcon, FlameIcon: FlameSolidIcon, FolderIcon: FolderSolidIcon, GemIcon: GemSolidIcon, GiftIcon: GiftSolidIcon, GlobeIcon: GlobeSolidIcon, HeadphonesIcon: HeadphonesSolidIcon, HeartIcon: HeartSolidIcon, HomeIcon: HomeSolidIcon, ImageIcon: ImageSolidIcon, KeyIcon: KeySolidIcon, LeafIcon: LeafSolidIcon, LightbulbIcon: LightbulbSolidIcon, LockIcon: LockSolidIcon, MailIcon: MailSolidIcon, MapPinIcon: MapPinSolidIcon, MicIcon: MicSolidIcon, MoonIcon: MoonSolidIcon, MusicIcon: MusicSolidIcon, PaletteIcon: PaletteSolidIcon, PhoneIcon: PhoneSolidIcon, PlayCircleIcon: PlayCircleSolidIcon, PuzzleIcon: PuzzleSolidIcon, RocketIcon: RocketSolidIcon, SearchIcon: SearchSolidIcon, SettingsIcon: SettingsSolidIcon, ShieldCheckIcon: ShieldCheckSolidIcon, SparklesIcon: SparklesSolidIcon, StarIcon: StarSolidIcon, SunIcon: SunSolidIcon, TagIcon: TagSolidIcon, TerminalIcon: TerminalSolidIcon, TrophyIcon: TrophySolidIcon, UmbrellaIcon: UmbrellaSolidIcon, UserIcon: UserSolidIcon, VideoIcon: VideoSolidIcon, WalletIcon: WalletSolidIcon, ZapIcon: ZapSolidIcon };
type IconName = keyof typeof Stroke;

const NAMES: IconName[] = [
  "HomeIcon", "SearchIcon", "HeartIcon", "BellIcon", "CameraIcon", "ChatIcon", "CalendarIcon", "BookmarkIcon",
  "MusicIcon", "SettingsIcon", "UserIcon", "SparklesIcon", "MailIcon", "FolderIcon", "StarIcon", "CloudIcon",
  "LockIcon", "MapPinIcon", "GiftIcon", "CartIcon", "PlayCircleIcon", "MicIcon", "PhoneIcon", "TrophyIcon",
  "LightbulbIcon", "RocketIcon", "ShieldCheckIcon", "WalletIcon", "TagIcon", "FlameIcon", "SunIcon", "MoonIcon",
  "ImageIcon", "VideoIcon", "HeadphonesIcon", "CompassIcon", "GemIcon", "CrownIcon", "LeafIcon", "ZapIcon",
  "CoffeeIcon", "GlobeIcon", "PuzzleIcon", "TerminalIcon", "PaletteIcon", "KeyIcon", "UmbrellaIcon", "FlagIcon",
];

const RADIUS = 190; // px: how far the spotlight reaches

// Hero visual: icons near the spotlight turn solid, grow and take the accent. The spotlight
// follows the pointer, and drifts on its own when there is none (touch, or before first move).
export function IconField() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const box = root.current!;
      const cells = gsap.utils.toArray<HTMLElement>(".f-cell", box);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cells.forEach((c, i) => c.style.setProperty("--p", [10, 19, 20, 27, 28].includes(i) ? "1" : "0"));
        return;
      }

      // Each cell eases toward its target, so the light trails smoothly instead of snapping.
      const setters = cells.map((c) => gsap.quickTo(c, "--p", { duration: 0.5, ease: "power2.out" }));
      let centers: { x: number; y: number }[] = [];
      let size = { w: 0, h: 0 };
      const measure = () => {
        const b = box.getBoundingClientRect();
        size = { w: b.width, h: b.height };
        centers = cells.map((c) => {
          const r = c.getBoundingClientRect();
          return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(box);

      const spot = { x: 0, y: 0 };
      let pointer: { x: number; y: number } | null = null;
      const follow = { x: gsap.quickTo(spot, "x", { duration: 0.35 }), y: gsap.quickTo(spot, "y", { duration: 0.35 }) };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const b = box.getBoundingClientRect();
        pointer = { x: e.clientX - b.left, y: e.clientY - b.top };
      };
      const leave = () => (pointer = null);
      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);

      // Easter egg: the Konami code sends a ripple out from the middle; icons go solid as it passes.
      const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
      let typed = 0;
      let wave: number | null = null; // ticker time the ripple started
      const key = (e: KeyboardEvent) => {
        typed = e.key === KONAMI[typed] || e.key.toLowerCase() === KONAMI[typed] ? typed + 1 : e.key === KONAMI[0] ? 1 : 0;
        if (typed === KONAMI.length) { typed = 0; wave = gsap.ticker.time; }
      };
      window.addEventListener("keydown", key);
      console.log("%cSoftstroke%c  Psst, you read consoles. Try ↑ ↑ ↓ ↓ ← → ← → B A on this page.", "font-weight:700;color:#2563eb", "color:inherit");

      // Layout is read only in measure(); the per-frame loop does math only.
      const tick = (time: number) => {
        const { w, h } = size;
        if (wave !== null) {
          const r = (time - wave) * 420; // px/s
          if (r > Math.hypot(w, h) / 2 + 120) wave = null;
          else {
            centers.forEach((c, i) => setters[i](Math.max(0, 1 - Math.abs(Math.hypot(c.x - w / 2, c.y - h / 2) - r) / 90)));
            return;
          }
        }
        // Idle path: a slow Lissajous loop through the field.
        const target = pointer ?? { x: w / 2 + Math.sin(time * 0.55) * w * 0.34, y: h / 2 + Math.sin(time * 0.8 + 1) * h * 0.3 };
        follow.x(target.x);
        follow.y(target.y);
        centers.forEach((c, i) => {
          const d = Math.hypot(c.x - spot.x, c.y - spot.y);
          setters[i](Math.max(0, 1 - d / RADIUS) ** 1.6);
        });
      };
      // Run only while the field is on screen.
      let running = false;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) gsap.ticker.add(tick);
        if (!e.isIntersecting && running) gsap.ticker.remove(tick);
        running = e.isIntersecting;
      });
      io.observe(box);

      // a quick rise, then each icon draws its own lines in (the fade is short so the drawing shows)
      gsap.from(cells, { autoAlpha: 0, y: 14, duration: 0.45, ease: "power3.out", stagger: { grid: "auto", from: "center", amount: 0.4 } });
      drawIn(gsap.utils.toArray<SVGElement>(".f-stroke", box), { duration: 1.3, each: 0.025, delay: 0.1 });

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", leave);
        window.removeEventListener("keydown", key);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="grid grid-cols-6 gap-1 [mask-image:radial-gradient(closest-side,#000_72%,transparent)] sm:grid-cols-8"
    >
      {NAMES.map((name, i) => {
        const S = Stroke[name];
        const F = Solid[name];
        return (
          <div
            key={name}
            className={`f-cell relative grid aspect-square place-items-center [--p:0] [color:color-mix(in_srgb,var(--accent)_calc(var(--p)*100%),var(--muted))] [scale:calc(1_+_var(--p)*0.6)] ${i >= 36 ? "max-sm:hidden" : ""}`}
          >
            <span className="absolute inset-[18%] rounded-full bg-accent opacity-[calc(var(--p)*0.14)]" />
            <S className="f-stroke absolute size-6 opacity-[calc(0.75_-_var(--p)*0.75)] sm:size-7" />
            <F className="absolute size-6 opacity-[var(--p)] sm:size-7" />
          </div>
        );
      })}
    </div>
  );
}
