import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NotFoundSearch } from "@/components/NotFoundSearch";

export const metadata: Metadata = { title: "Page not found | Softstroke" };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid min-h-[80dvh] max-w-3xl place-items-center px-4 pb-16 pt-32 text-center">
        <div>
          <p className="font-display text-8xl font-semibold tracking-tight text-accent-text md:text-9xl">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">This page isn&apos;t drawn yet.</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-lg text-muted">The link may be old, or the page moved. Looking for an icon? Search for it here.</p>
          <NotFoundSearch />
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/" className="rounded-full px-4 py-2 text-muted ring-1 ring-[var(--line)] hover:text-ink">Home</Link>
            <Link href="/docs/" className="rounded-full px-4 py-2 text-muted ring-1 ring-[var(--line)] hover:text-ink">Docs</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
