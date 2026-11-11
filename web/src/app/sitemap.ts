import type { MetadataRoute } from "next";
import { DOC_PAGES } from "@/lib/docs";

export const dynamic = "force-static";
const SITE = "https://sarthak102.github.io/softstroke";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/icons/", "/icon-font/", "/use-cases/", "/changelog/", ...DOC_PAGES.map((p) => (p.slug ? `/docs/${p.slug}/` : "/docs/"))];
  return pages.map((p) => ({ url: `${SITE}${p}` }));
}
