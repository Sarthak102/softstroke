// POST /issue: the site's feedback modal sends a form here; the Worker checks it and opens a GitHub issue
// with the project's token, so visitors need no GitHub account. Guarded by origin, rate limit and Turnstile.
import { buildIssue, validate } from "./issue";

export interface Env {
  GITHUB_TOKEN: string; // secret: fine-grained token, Issues read/write on GITHUB_REPO only
  TURNSTILE_SECRET: string; // secret: Cloudflare Turnstile widget secret
  ALLOWED_ORIGINS: string; // comma-separated
  GITHUB_REPO: string; // owner/name
  GITHUB_API?: string; // override for local tests
  LIMITER: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

const MAX_BODY = 16_000;

function json(status: number, data: unknown, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } });
}

async function turnstileOk(token: unknown, ip: string, env: Env): Promise<boolean> {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!res.ok) return false;
  const out = (await res.json()) as { success?: boolean };
  return out.success === true;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin") ?? "";
    const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).includes(origin);
    const cors: Record<string, string> = allowed ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {};

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: allowed ? 204 : 403,
        headers: { ...cors, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" },
      });
    }
    if (new URL(req.url).pathname !== "/issue") return json(404, { error: "Not found." }, cors);
    if (req.method !== "POST") return json(405, { error: "Method not allowed." }, cors);
    if (!allowed) return json(403, { error: "Not allowed." }, cors);

    const ip = req.headers.get("CF-Connecting-IP") ?? "";
    const { success } = await env.LIMITER.limit({ key: ip || "unknown" });
    if (!success) return json(429, { error: "Too many submissions. Please wait a minute and try again." }, cors);

    const text = await req.text();
    if (text.length > MAX_BODY) return json(413, { error: "That is too long to send." }, cors);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      return json(400, { error: "Invalid request." }, cors);
    }

    const v = validate(body);
    if (!v.ok) return json(400, { error: v.error }, cors);
    if (!(await turnstileOk(body?.turnstile, ip, env))) return json(403, { error: "The spam check failed. Please try again." }, cors);

    const issue = buildIssue(v.value);
    const res = await fetch(`${env.GITHUB_API ?? "https://api.github.com"}/repos/${env.GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "softstroke-feedback",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });
    if (!res.ok) {
      // Details stay in the Worker logs (`npx wrangler tail`); the visitor gets a plain message.
      console.error("github", res.status, (await res.text()).slice(0, 500));
      return json(502, { error: "We could not send it right now. Please try again later." }, cors);
    }
    const created = (await res.json()) as { html_url: string; number: number };
    return json(201, { ok: true, url: created.html_url, number: created.number }, cors);
  },
};
