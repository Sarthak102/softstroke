// Validation and formatting for website submissions. Pure functions: everything here is unit-tested.

export type Kind = "request" | "issue";
type Field = { id: string; label: string; max: number; required?: boolean };

// Field ids and limits match the site's modal (web/src/components/Feedback.tsx) and .github/ISSUE_TEMPLATE.
export const FORMS: Record<Kind, { label: string; fields: Field[]; title: (f: Record<string, string>) => string }> = {
  request: {
    label: "icon request",
    title: (f) => `Icon request: ${f.name}`,
    fields: [
      { id: "name", label: "Icon name", max: 60, required: true },
      { id: "use", label: "Where would you use it?", max: 1000, required: true },
      { id: "looks", label: "What should it show?", max: 1000 },
    ],
  },
  issue: {
    label: "bug",
    title: (f) => `Bug: ${f.where}`,
    fields: [
      { id: "what", label: "What happened?", max: 2000, required: true },
      { id: "where", label: "Where?", max: 200, required: true },
      { id: "steps", label: "Steps to reproduce", max: 2000 },
    ],
  },
};
export const AUTHOR_MAX = 60;
const MAX_LINKS = 3;

export type Submission = { kind: Kind; author: string; fields: Record<string, string>; solid: boolean };
export type Result = { ok: true; value: Submission } | { ok: false; error: string };

// Control characters out (keep newlines and tabs), CRLF to LF, no runs of blank lines, trimmed.
export function clean(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validate(input: unknown): Result {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request." };
  const o = input as Record<string, unknown>;
  if (o.kind !== "request" && o.kind !== "issue") return { ok: false, error: "Invalid request." };
  const form = FORMS[o.kind];
  const raw = (o.fields && typeof o.fields === "object" ? o.fields : {}) as Record<string, unknown>;

  const fields: Record<string, string> = {};
  for (const f of form.fields) {
    const v = raw[f.id];
    if (v !== undefined && typeof v !== "string") return { ok: false, error: "Invalid request." };
    const c = clean(v ?? "");
    if (c.length > f.max) return { ok: false, error: `"${f.label}" is too long (at most ${f.max} characters).` };
    if (f.required && !c) return { ok: false, error: `Please fill in "${f.label}".` };
    fields[f.id] = c;
  }
  // One-line fields stay one line (they become the issue title).
  for (const id of ["name", "where"]) if (fields[id]) fields[id] = fields[id].replace(/\s+/g, " ");

  if (o.author !== undefined && typeof o.author !== "string") return { ok: false, error: "Invalid request." };
  const author = clean((o.author as string | undefined) ?? "").replace(/\s+/g, " ");
  if (author.length > AUTHOR_MAX) return { ok: false, error: `Your name is too long (at most ${AUTHOR_MAX} characters).` };

  const links = Object.values(fields).join(" ").match(/https?:\/\//gi)?.length ?? 0;
  if (links > MAX_LINKS) return { ok: false, error: `Please include at most ${MAX_LINKS} links.` };

  return { ok: true, value: { kind: o.kind, author, fields, solid: o.solid === true } };
}

// Visitor text goes into a public GitHub issue: no HTML, no remote images (tracking), no @mentions that ping people.
export function safe(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/!\[/g, "!\\[")
    .replace(/@(?=[A-Za-z0-9_-])/g, "@\u200B");
}

export function buildIssue(s: Submission): { title: string; body: string; labels: string[] } {
  const form = FORMS[s.kind];
  const sections = form.fields
    .filter((f) => s.fields[f.id])
    .map((f) => `### ${f.label}\n\n${safe(s.fields[f.id])}`);
  if (s.kind === "request" && s.solid) sections.push("### Solid version\n\nNeeded too.");
  const by = s.author ? safe(s.author) : "Anonymous";
  const body = `${sections.join("\n\n")}\n\n---\n\nSubmitted by **${by}** through the website form.`;
  // Titles are plain text on GitHub (escaping would show "&lt;"): drop angle brackets, defuse @mentions.
  const title = form.title(s.fields).replace(/[<>]/g, "").replace(/@(?=[A-Za-z0-9_-])/g, "@\u200B").slice(0, 120);
  return { title, body, labels: [form.label] };
}
