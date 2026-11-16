import type { Metadata } from "next";
import { siAngular, siFlutter, siReact, siSvelte, siSvg, siVuedotjs } from "simple-icons";
import { Brand } from "@/components/Brand";
import { Construct } from "@/components/home/Specimen";
import { LogoMark } from "@/components/Logo";
import { Glyph } from "@/lib/glyph";
import { ICON_COUNT } from "@/lib/count";

// Social preview source: screenshot at 1200x630 into public/og.png. Not linked, not indexed.
// Fixed light colours: the preview must look the same whatever theme the capture browser uses.
export const metadata: Metadata = { title: "Softstroke preview", robots: { index: false, follow: false } };

const PAIRS = ["home", "heart", "bell", "bookmark", "star", "camera"];
const LOGOS = [siReact, siVuedotjs, siSvelte, siAngular, siFlutter, siSvg];

export default function OgImage() {
  return (
    <div
      className="fixed left-0 top-0 z-[100] flex h-[630px] w-[1200px] items-center gap-14 overflow-hidden px-[72px] text-[#141412]"
      style={{
        background: "#f4f3ef",
        backgroundImage: "linear-gradient(rgb(20 20 18 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(20 20 18 / 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="flex-1">
        <p className="flex items-center gap-3 font-display text-[30px] font-bold tracking-[-0.02em]">
          <LogoMark className="size-10 text-[#e8521c]" />
          Softstroke
        </p>
        <h1 className="mt-9 font-display text-[66px] font-semibold leading-[1.04] tracking-[-0.035em]">
          Soft at the corners, <span className="text-[#c2410c]">exact</span> on the grid
        </h1>
        <p className="mt-6 text-[24px] text-[#57564f]">{ICON_COUNT} icons in stroke and solid. MIT licensed.</p>
        <div className="mt-9 flex items-center gap-5 text-[#8a8982]">
          {LOGOS.map((l) => <Brand key={l.title} logo={l} size={26} />)}
        </div>
      </div>
      <div className="relative size-[460px] shrink-0 rounded-[28px] border border-[rgb(20_20_18/0.08)] bg-white shadow-[0_1px_2px_rgb(20_20_18/0.04),0_24px_60px_-28px_rgb(20_20_18/0.28)]">
        <span className="absolute left-6 top-6 font-mono text-[17px]">sparkles</span>
        <span className="absolute right-6 top-6 font-mono text-[15px] text-[#8a8982]">01 / 12</span>
        <div className="absolute inset-[18%] text-[#e8521c] [&_.construct_line]:stroke-[rgb(20_20_18/0.06)] [&_.construct_.major_line]:stroke-[rgb(20_20_18/0.12)]">
          <Construct style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <Glyph name="sparkles" solid size={0} className="absolute inset-0 size-full" />
        </div>
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
          {PAIRS.map((n) => (
            <span key={n} className="flex items-center gap-1 rounded-xl border border-[rgb(20_20_18/0.08)] bg-[#f4f3ef] p-1">
              <span className="grid size-6 place-items-center text-[#57564f]"><Glyph name={n} size={16} /></span>
              <span className="grid size-6 place-items-center rounded-md bg-[rgb(232_82_28/0.1)] text-[#e8521c]"><Glyph name={n} solid size={16} /></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
