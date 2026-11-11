import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { CopyPage, DocsArticle } from "@/components/docs/DocsArticle";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";
import { DOC_GROUPS, DOC_PAGES, loadDoc } from "@/lib/docs";
import { StrokeIcon } from "@/lib/icons";

type Props = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug ? [p.slug] : [] }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await loadDoc((await params).slug?.[0] ?? "");
  return { title: `${doc.title} | Softstroke docs`, description: doc.description };
}

export default async function DocPage({ params }: Props) {
  const slug = (await params).slug?.[0] ?? "";
  const doc = await loadDoc(slug);
  const i = DOC_PAGES.findIndex((p) => p.slug === slug);
  const prev = DOC_PAGES[i - 1];
  const next = DOC_PAGES[i + 1];
  const href = (s: string) => (s ? `/docs/${s}/` : "/docs/");

  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 pt-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:pt-28 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar groups={DOC_GROUPS} current={slug} />
        <article className="min-w-0">
          <p className="mb-2 text-sm font-medium text-accent-text">{doc.group}</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{doc.title}</h1>
            <CopyPage raw={doc.raw} />
          </div>
          <p className="mt-3 text-lg text-muted">{doc.description}</p>
          <DocsArticle html={doc.html} />
          <nav aria-label="Previous and next page" className="mt-16 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={href(prev.slug)} className="glass group rounded-[20px] p-4 transition-transform hover:-translate-y-0.5">
                <span className="flex items-center gap-1 text-sm text-muted"><StrokeIcon name="ArrowLeftIcon" size={16} /> Previous</span>
                <span className="mt-1 block font-medium">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={href(next.slug)} className="glass group rounded-[20px] p-4 text-right transition-transform hover:-translate-y-0.5">
                <span className="flex items-center justify-end gap-1 text-sm text-muted">Next <StrokeIcon name="ArrowRightIcon" size={16} /></span>
                <span className="mt-1 block font-medium">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>
        <DocsToc toc={doc.toc} />
      </main>
      <Footer />
    </>
  );
}
