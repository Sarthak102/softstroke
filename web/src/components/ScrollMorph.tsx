"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { drawIn } from "@/lib/draw";
import { BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, CartIcon, ChatIcon, CloudIcon, CompassIcon, CrownIcon, FlameIcon, FolderIcon, GemIcon, GiftIcon, HeadphonesIcon, HeartIcon, HomeIcon, ImageIcon, LeafIcon, LightbulbIcon, LockIcon, MailIcon, MapPinIcon, MicIcon, MoonIcon, MusicIcon, PhoneIcon, PlayCircleIcon, RocketIcon, SearchIcon, SettingsIcon, ShieldCheckIcon, SparklesIcon, StarIcon, SunIcon, TagIcon, TrophyIcon, UserIcon, VideoIcon, WalletIcon, ZapIcon } from "@softstroke/react";
import { BellIcon as BellSolidIcon, BookmarkIcon as BookmarkSolidIcon, CalendarIcon as CalendarSolidIcon, CameraIcon as CameraSolidIcon, CartIcon as CartSolidIcon, ChatIcon as ChatSolidIcon, CloudIcon as CloudSolidIcon, CompassIcon as CompassSolidIcon, CrownIcon as CrownSolidIcon, FlameIcon as FlameSolidIcon, FolderIcon as FolderSolidIcon, GemIcon as GemSolidIcon, GiftIcon as GiftSolidIcon, HeadphonesIcon as HeadphonesSolidIcon, HeartIcon as HeartSolidIcon, HomeIcon as HomeSolidIcon, ImageIcon as ImageSolidIcon, LeafIcon as LeafSolidIcon, LightbulbIcon as LightbulbSolidIcon, LockIcon as LockSolidIcon, MailIcon as MailSolidIcon, MapPinIcon as MapPinSolidIcon, MicIcon as MicSolidIcon, MoonIcon as MoonSolidIcon, MusicIcon as MusicSolidIcon, PhoneIcon as PhoneSolidIcon, PlayCircleIcon as PlayCircleSolidIcon, RocketIcon as RocketSolidIcon, SearchIcon as SearchSolidIcon, SettingsIcon as SettingsSolidIcon, ShieldCheckIcon as ShieldCheckSolidIcon, SparklesIcon as SparklesSolidIcon, StarIcon as StarSolidIcon, SunIcon as SunSolidIcon, TagIcon as TagSolidIcon, TrophyIcon as TrophySolidIcon, UserIcon as UserSolidIcon, VideoIcon as VideoSolidIcon, WalletIcon as WalletSolidIcon, ZapIcon as ZapSolidIcon } from "@softstroke/react/solid";

const Stroke = { BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, CartIcon, ChatIcon, CloudIcon, CompassIcon, CrownIcon, FlameIcon, FolderIcon, GemIcon, GiftIcon, HeadphonesIcon, HeartIcon, HomeIcon, ImageIcon, LeafIcon, LightbulbIcon, LockIcon, MailIcon, MapPinIcon, MicIcon, MoonIcon, MusicIcon, PhoneIcon, PlayCircleIcon, RocketIcon, SearchIcon, SettingsIcon, ShieldCheckIcon, SparklesIcon, StarIcon, SunIcon, TagIcon, TrophyIcon, UserIcon, VideoIcon, WalletIcon, ZapIcon };
const Solid = { BellIcon: BellSolidIcon, BookmarkIcon: BookmarkSolidIcon, CalendarIcon: CalendarSolidIcon, CameraIcon: CameraSolidIcon, CartIcon: CartSolidIcon, ChatIcon: ChatSolidIcon, CloudIcon: CloudSolidIcon, CompassIcon: CompassSolidIcon, CrownIcon: CrownSolidIcon, FlameIcon: FlameSolidIcon, FolderIcon: FolderSolidIcon, GemIcon: GemSolidIcon, GiftIcon: GiftSolidIcon, HeadphonesIcon: HeadphonesSolidIcon, HeartIcon: HeartSolidIcon, HomeIcon: HomeSolidIcon, ImageIcon: ImageSolidIcon, LeafIcon: LeafSolidIcon, LightbulbIcon: LightbulbSolidIcon, LockIcon: LockSolidIcon, MailIcon: MailSolidIcon, MapPinIcon: MapPinSolidIcon, MicIcon: MicSolidIcon, MoonIcon: MoonSolidIcon, MusicIcon: MusicSolidIcon, PhoneIcon: PhoneSolidIcon, PlayCircleIcon: PlayCircleSolidIcon, RocketIcon: RocketSolidIcon, SearchIcon: SearchSolidIcon, SettingsIcon: SettingsSolidIcon, ShieldCheckIcon: ShieldCheckSolidIcon, SparklesIcon: SparklesSolidIcon, StarIcon: StarSolidIcon, SunIcon: SunSolidIcon, TagIcon: TagSolidIcon, TrophyIcon: TrophySolidIcon, UserIcon: UserSolidIcon, VideoIcon: VideoSolidIcon, WalletIcon: WalletSolidIcon, ZapIcon: ZapSolidIcon };
type IconName = keyof typeof Stroke;

gsap.registerPlugin(ScrollTrigger);

const NAMES: IconName[] = [
  "HomeIcon", "SearchIcon", "HeartIcon", "BellIcon", "CameraIcon", "ChatIcon", "CalendarIcon", "BookmarkIcon",
  "MusicIcon", "SettingsIcon", "UserIcon", "SparklesIcon", "MailIcon", "FolderIcon", "StarIcon", "CloudIcon",
  "LockIcon", "MapPinIcon", "GiftIcon", "CartIcon", "PlayCircleIcon", "MicIcon", "PhoneIcon", "TrophyIcon",
  "LightbulbIcon", "RocketIcon", "ShieldCheckIcon", "WalletIcon", "TagIcon", "FlameIcon", "SunIcon", "MoonIcon",
  "ImageIcon", "VideoIcon", "HeadphonesIcon", "CompassIcon", "GemIcon", "CrownIcon", "LeafIcon", "ZapIcon",
];

// Pinned while the visitor scrolls: the grid turns from stroke to solid in a diagonal wave,
// and the headline and import line switch to their solid versions at the halfway point.
export function ScrollMorph() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // the stroke icons draw themselves in as the section arrives
      const strokes = gsap.utils.toArray<SVGElement>(".m-stroke", root.current);
      const draw = drawIn(strokes, { duration: 1, each: 0.03 }).pause();
      ScrollTrigger.create({ trigger: root.current, start: "top 75%", once: true, onEnter: () => draw.play() });
      const stagger = { grid: "auto" as const, from: "start" as const, amount: 0.8 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
        },
      });
      tl.fromTo(".m-solid", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(71% at 50% 50%)", duration: 0.3, stagger }, 0)
        .to(".m-stroke", { autoAlpha: 0, duration: 0.12, stagger }, 0.2)
        .fromTo(".m-fill", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger }, 0)
        .fromTo(".m-tile", { y: 0 }, { y: -4, duration: 0.15, yoyo: true, repeat: 1, stagger }, 0)
        .fromTo(".m-sweep", { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 0.9, ease: "none" }, 0.05)
        .to(".m-code-stroke", { autoAlpha: 0, y: -10, duration: 0.08 }, 0.5)
        .fromTo(".m-code-solid", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.52);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 pb-10 pt-24 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[2.75rem]">
            Stroke when it rests.
            <br />
            <span className="m-sweep bg-[linear-gradient(90deg,var(--accent)_50%,color-mix(in_srgb,var(--ink)_22%,transparent)_50%)] bg-[length:200%_100%] bg-[100%_0] bg-clip-text motion-reduce:bg-[0%_0] pb-1 text-transparent">
              Solid when it&apos;s chosen.
            </span>
          </h2>
          <p className="mt-5 max-w-[42ch] text-lg max-sm:hidden leading-relaxed text-muted">
            Every icon ships in both styles under the same name, so an active state is a one-word import change.
          </p>
          <code className="glass mt-7 inline-flex max-w-full items-center overflow-x-auto whitespace-nowrap rounded-2xl px-4 py-3 font-mono text-[13px] sm:text-sm">
            <span className="text-muted">import</span>&nbsp;{"{ HomeIcon }"}&nbsp;<span className="text-muted">from</span>&nbsp;
            <span className="inline-grid">
              <span className="m-code-stroke col-start-1 row-start-1">&quot;@softstroke/react&quot;</span>
              <span className="m-code-solid invisible col-start-1 row-start-1">
                &quot;@softstroke/react<span className="text-accent-text">/solid</span>&quot;
              </span>
            </span>
          </code>
        </div>
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8 sm:gap-3">
          {NAMES.map((name, i) => {
            const S = Stroke[name];
            const F = Solid[name];
            return (
              <div
                key={name}
                className={`m-tile relative grid aspect-square place-items-center overflow-hidden rounded-[18px] bg-[var(--glass)] ring-1 ring-[var(--glass-edge)] ${
                  i >= 20 ? "max-sm:hidden" : ""
                }`}
              >
                <span aria-hidden className="m-fill invisible absolute inset-0 bg-accent/12" />
                <S className="m-stroke absolute size-6 sm:size-7" />
                <F className="m-solid absolute [clip-path:circle(0%_at_50%_50%)] size-6 sm:size-7" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
