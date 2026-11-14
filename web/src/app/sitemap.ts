import type { MetadataRoute } from "next";
import { DOC_PAGES } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";
import icons from "@softstroke/svg/icons.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/icons/", "/icon-font/", "/use-cases/", "/changelog/", ...DOC_PAGES.map((p) => (p.slug ? `/docs/${p.slug}/` : "/docs/")), ...Object.keys(icons).map((n) => `/icons/${n}/`)];
  return pages.map((p) => ({ url: `${SITE_URL}${p}` }));
}
