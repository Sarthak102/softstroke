import Link from "next/link";
import { siFlutter, siGithub, siNpm } from "simple-icons";
import { GITHUB_URL } from "@/lib/site";
import { Brand } from "../Brand";
import { Stars } from "../Stars";
import { Words } from "../Words";
import { Timeline } from "./Timeline";

export const RELEASES = [
  { v: "1.4", date: null, body: "Commerce, charts, devices, development, AI and time. About 75 new icons." },
  { v: "1.3", date: "15 Nov 2026", body: "62 new icons across communication, people, security, files and notes. 429 in total." },
  { v: "Flutter", date: "15 Nov 2026", body: "The full set on pub.dev as a Flutter package, published from GitHub Actions on every release." },
  { v: "1.2", date: "14 Nov 2026", body: "57 new icons for interface, arrows and editing. 367 in total." },
  { v: "1.1", date: "14 Nov 2026", body: "A proportions pass over the whole set and 16 fixes to solid shapes." },
  { v: "1.0", date: "11 Nov 2026", body: "310 icons in stroke and solid, seven npm packages, MIT licensed." },
];

// The maker and the release history. `eyebrow` numbers it on the home page; the changelog page reuses it.
export function Maker({ eyebrow, link = true }: { eyebrow?: string; link?: boolean }) {
  return (
    <div className="maker">
      <div data-reveal>
        <p className="eyebrow">{eyebrow && <b>{eyebrow}</b>} Made in public</p>
        <h2 className="display h2" data-split><Words>One designer, shipping in public</Words></h2>
        <p className="lede">
          Softstroke started on 10 November 2026 and shipped its first 310 icons the next day. Every release since is drawn on the grid,
          linted for joins and gaps, and reviewed stroke next to solid before it goes out.
        </p>
        <div className="person">
          <span className="avatar">
            SK
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github.com/Sarthak102.png?size=112" alt="" width={56} height={56} loading="lazy" />
          </span>
          <div><b>Sarthak Kamble</b><span>Designs and maintains Softstroke</span></div>
        </div>
        <div className="person-links">
          <a href={GITHUB_URL}><Brand logo={siGithub} size={16} />Star on GitHub<Stars /></a>
          <a href="https://www.npmjs.com/org/softstroke"><Brand logo={siNpm} size={16} />npm</a>
          <a href="https://pub.dev/packages/softstroke"><Brand logo={siFlutter} size={16} />pub.dev</a>
          {link && <Link href="/changelog/">Full changelog</Link>}
        </div>
      </div>
      <Timeline items={RELEASES} />
    </div>
  );
}
