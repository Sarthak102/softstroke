import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Playground } from "@/components/Playground";
import { Words } from "@/components/Words";

export const metadata: Metadata = {
  title: "Playground | Softstroke",
  description: "Try any Softstroke icon with live size, stroke, colour and style, see it in real UI, and copy the code for React, Vue, Svelte, Angular or Flutter.",
};

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main className="wrap page">
        <p className="eyebrow">Playground</p>
        <h1 className="display page-title" data-split><Words>Make them yours</Words></h1>
        <p className="lede">Pick any icon, set its size, stroke and colour, see it in real UI, then copy the code for your framework.</p>
        <Playground />
      </main>
      <Footer />
    </>
  );
}
