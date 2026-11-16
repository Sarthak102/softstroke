import { ArrowRightIcon } from "@softstroke/react";
import { Glyph } from "@/lib/glyph";
import { NEW_ICONS, NEW_VERSION } from "@/lib/new-icons";
import { IconsLink } from "../IconsLink";

// The latest release's icons, one strip, linking to the filtered sheet.
export function NewStrip() {
  return (
    <section className="wrap new-strip" data-reveal>
      <div className="new-head">
        <span className="tag">New in {NEW_VERSION}</span>
        <p><b>{NEW_ICONS.length} icons</b> for communication, people, security, files and notes.</p>
        <IconsLink href="/icons/?new=1" className="new-all">See all <ArrowRightIcon size={16} /></IconsLink>
      </div>
      <div className="new-row">
        {NEW_ICONS.slice(0, 24).map((n) => (
          <IconsLink key={n} href={`/icons/?icon=${n}`} className="new-cell" title={n} aria-label={n}>
            <Glyph name={n} size={22} />
          </IconsLink>
        ))}
      </div>
    </section>
  );
}
