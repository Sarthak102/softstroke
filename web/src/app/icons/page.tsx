import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { IconBrowser } from "@/components/icons/IconBrowser";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Icons | Softstroke",
  description: "Search all 310 Softstroke icons in stroke and solid. Copy JSX, an import or raw SVG, or download.",
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
