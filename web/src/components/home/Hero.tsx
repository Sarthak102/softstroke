import Link from "next/link";
import { ArrowRightIcon } from "@softstroke/react";
import { siAngular, siFlutter, siGithub, siNextdotjs, siNpm, siReact, siSvelte, siSvg, siVuedotjs } from "simple-icons";
import { GITHUB_URL } from "@/lib/site";
import { Downloads } from "../Downloads";
import { Stars } from "../Stars";
import { nodes } from "@/lib/glyph";
import { CopyCommand } from "../CopyCommand";
import { IconsLink } from "../IconsLink";
import { Words } from "../Words";
import { Brand } from "../Brand";
import { HeroLens } from "./HeroLens";
import { Specimen } from "./Specimen";
import { brandColor } from "./brand-color";

const SPEC = ["sparkles", "heart", "home", "bell", "leaf", "rocket", "headphones", "compass", "crown", "camera", "chat", "settings"];
const LOGOS = [
  [siReact, "React"], [siNextdotjs, "Next.js"], [siVuedotjs, "Vue"], [siSvelte, "Svelte"], [siAngular, "Angular"],
  [siReact, "React Native"], [siFlutter, "Flutter"], [siSvg, "SVG"], [null, "Icon font"],
] as const;

export function Hero() {
  const items = SPEC.map((name) => ({ name, stroke: nodes(name), solid: nodes(name, true) }));
  return (
    <HeroLens>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <Link className="status fade-in" href="/changelog/"><i />1.3 is out · 1.4 in progress</Link>
            <h1 className="display" data-split>
              <Words>Soft icons for <em>crisp</em> interfaces</Words>
            </h1>
            <p className="lede fade-in" style={{ animationDelay: "450ms" }}>
              Every icon is drawn on a 24px grid with a 1.5px stroke, then ships twice under one name: stroke for rest, solid for the chosen state.
            </p>
            <div className="hero-actions fade-in" style={{ animationDelay: "550ms" }}>
              <IconsLink href="/icons/" className="btn btn-primary">
                Browse icons <ArrowRightIcon size={18} className="arrow" />
              </IconsLink>
              <CopyCommand command="npm i @softstroke/react" />
            </div>
            <div className="proof fade-in" style={{ animationDelay: "650ms" }}>
              <a href={GITHUB_URL}><Brand logo={siGithub} size={15} />GitHub<Stars /></a>
              <a href="https://www.npmjs.com/org/softstroke"><Brand logo={siNpm} size={15} />npm<Downloads /></a>
              <span>MIT licensed</span>
            </div>
          </div>
          <Specimen items={items} />
        </div>
        <div className="logos fade-in" style={{ animationDelay: "700ms" }}>
          <span className="meta">Works with</span>
          <div className="logo-row">
            {LOGOS.map(([logo, name]) => (
              <span key={name} className="logo-item" style={{ "--brand": logo ? brandColor(logo) : "var(--accent)" } as React.CSSProperties}>
                <Brand logo={logo} size={20} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </HeroLens>
  );
}
