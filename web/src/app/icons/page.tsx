import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { IconBrowser } from "@/components/icons/IconBrowser";
import { Nav } from "@/components/Nav";
import { ICON_COUNT } from "@/lib/count";

export const metadata: Metadata = {
  title: "Icons | Softstroke",
  description: `Search all ${ICON_COUNT} Softstroke icons in stroke and solid. Copy JSX, an import or raw SVG, or download.`,
};

export default function IconsPage() {
  return (
    <>
      <Nav />
      <main>
        <IconBrowser />
      </main>
      <Footer />
    </>
  );
}
