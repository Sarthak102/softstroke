import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Playground } from "@/components/Playground";
import { Words } from "@/components/Words";

export const metadata: Metadata = {
  title: "Playground | Softstroke",
  description: "Try Softstroke's size, stroke width, color and style props live, and copy the JSX.",
};

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main className="wrap page">
        <p className="eyebrow">Playground</p>
        <h1 className="display page-title" data-split><Words>Make them yours</Words></h1>
        <p className="lede">Size, stroke width and color are plain props. Try them here, then copy the JSX.</p>
        <Playground />
      </main>
      <Footer />
    </>
  );
}
