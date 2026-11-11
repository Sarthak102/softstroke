import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Playground } from "@/components/Playground";
import { ScrollMorph } from "@/components/ScrollMorph";
import { Showcase } from "@/components/Showcase";
import { Supports } from "@/components/Supports";
import { UseCases } from "@/components/UseCases";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ScrollMorph />
        <Showcase />
        <UseCases />
        <Supports />
        <Playground />
      </main>
      <Footer />
    </>
  );
}
