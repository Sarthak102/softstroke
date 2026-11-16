import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@softstroke/react";
import { CaseCard } from "@/components/CaseCard";
import { FitScenes } from "@/components/FitScenes";
import { Footer } from "@/components/Footer";
import { IconsLink } from "@/components/IconsLink";
import { Nav } from "@/components/Nav";
import { USE_CASES } from "@/components/UseCaseScenes";
import { Words } from "@/components/Words";
import { ICON_COUNT } from "@/lib/count";

export const metadata: Metadata = {
  title: "Use cases | Softstroke",
  description: "Menus, tab bars, dashboards and app screens built with Softstroke icons. Each scene lists the icons it uses.",
};

export default function UseCasesPage() {
  return (
    <>
      <Nav />
      <main className="wrap page">
        <p className="eyebrow">Use cases</p>
        <h1 className="display page-title" data-split><Words>Softstroke in real interfaces</Words></h1>
        <p className="lede">Menus, tab bars, dashboards and app screens built with the set. Every icon you see is in it; tap a chip under a scene to open that icon.</p>
        <div className="cases-grid">
          {USE_CASES.map((c, i) => (
            <div key={c.id} data-reveal>
              <CaseCard c={c} i={i} />
            </div>
          ))}
        </div>
        <FitScenes />
        <div className="hero-actions" style={{ marginTop: 64 }}>
          <IconsLink href="/icons/" className="btn btn-primary">Browse all {ICON_COUNT} icons <ArrowRightIcon size={18} className="arrow" /></IconsLink>
          <Link href="/docs/" className="btn btn-ghost">Read the docs</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
