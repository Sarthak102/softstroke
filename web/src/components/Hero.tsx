import Link from "next/link";
import { ArrowRightIcon } from "@softstroke/react";
import { CopyCommand } from "./CopyCommand";
import { IconField } from "./IconField";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-10 px-4 pb-12 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-24">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-[4.25rem]">
            Soft icons for crisp interfaces.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
            310 icons in stroke and solid, drawn on a 24px grid. Free and MIT licensed for every major framework.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/icons/"
              prefetch={false}
              className="group flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink shadow-[var(--shadow)] transition-transform active:scale-[0.98]"
            >
              Browse icons
              <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <CopyCommand command="npm i @softstroke/react" />
          </div>
        </div>
        <IconField />
      </div>
    </section>
  );
}
