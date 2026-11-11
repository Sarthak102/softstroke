import type { Metadata } from "next";
import * as Stroke from "@softstroke/react";
import * as Solid from "@softstroke/react/solid";
import { LogoMark } from "@/components/Logo";
import type { IconName } from "@/lib/icons";

// Social preview source: screenshot at 1200x630 into public/og.png (see web/README or the plan). Not linked, not indexed.
export const metadata: Metadata = { title: "Softstroke preview", robots: { index: false, follow: false } };

const NAMES: IconName[] = ["HomeIcon", "SearchIcon", "HeartIcon", "BellIcon", "CameraIcon", "ChatIcon", "CalendarIcon", "WalletIcon", "MusicIcon", "SettingsIcon", "UserIcon", "SparklesIcon", "MailIcon", "FolderIcon", "StarIcon", "CloudIcon"];

export default function OgImage() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-[630px] w-[1200px] items-center gap-16 overflow-hidden bg-[linear-gradient(160deg,#f4f9ff,#dcebff_55%,#c7defd)] px-20 text-[#0b2545]">
      <div className="flex-1">
        <p className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight">
          <LogoMark className="size-11 text-[#2563eb]" />
          Softstroke
        </p>
        <h1 className="mt-10 font-display text-[68px] font-semibold leading-[1.02] tracking-tight">Soft icons for crisp interfaces.</h1>
        <p className="mt-6 text-2xl text-[#3f5878]">310 icons in stroke and solid. MIT licensed.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {NAMES.map((n, i) => {
          const C = (i % 3 === 1 ? Solid : Stroke)[n];
          return (
            <span key={n} className={`grid size-[92px] place-items-center rounded-[26px] ${i % 3 === 1 ? "bg-[#2563eb] text-white" : "bg-white/70 text-[#0b2545]"} shadow-[0_8px_30px_-12px_rgb(30_64_140/0.35)]`}>
              <C size={40} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
