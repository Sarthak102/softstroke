import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Cases } from "@/components/home/Cases";
import { Hero } from "@/components/home/Hero";
import { IconRows } from "@/components/home/IconRows";
import { Install } from "@/components/home/Install";
import { LiveScreens } from "@/components/home/LiveScreens";
import { Maker } from "@/components/home/Maker";
import { Sheet } from "@/components/home/Sheet";
import { States } from "@/components/home/States";
import { Stats } from "@/components/home/Stats";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <IconRows />
        <States />
        <Sheet />
        <Cases />
        <LiveScreens />
        <Install />
        <section className="section wrap" style={{ paddingTop: 48 }}>
          <Maker eyebrow="06" />
        </section>
      </main>
      <Footer />
    </>
  );
}
