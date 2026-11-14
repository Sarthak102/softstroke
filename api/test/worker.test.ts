import { afterEach, describe, expect, it, vi } from "vitest";
import { buildIssue, clean, safe, validate } from "../src/issue";
import worker, { type Env } from "../src/index";

const ORIGIN = "https://softstroke.github.io";
const request = { kind: "request", author: "Asha", fields: { name: "pill-bottle", use: "Medicine reminders" }, turnstile: "tok" };

function env(limit = true): Env {
  return {
    GITHUB_TOKEN: "test-token",
    TURNSTILE_SECRET: "test-secret",
    ALLOWED_ORIGINS: `${ORIGIN},http://localhost:3123`,
    GITHUB_REPO: "softstroke/softstroke",
    LIMITER: { limit: async () => ({ success: limit }) },
  };
}
function post(body: unknown, origin = ORIGIN) {
  return new Request("https://w.example/issue", { method: "POST", headers: { Origin: origin, "CF-Connecting-IP": "1.2.3.4" }, body: JSON.stringify(body) });
}
// Turnstile answers `captcha`; GitHub answers `github` and records what it was sent.
function mockFetch(captcha = true, github: { status: number; body: unknown } = { status: 201, body: { html_url: "https://github.com/softstroke/softstroke/issues/7", number: 7 } }) {
  const sent: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    sent.push({ url, init });
    if (url.includes("turnstile")) return new Response(JSON.stringify({ success: captcha }));
    return new Response(JSON.stringify(github.body), { status: github.status });
  });
  return sent;
}
afterEach(() => vi.unstubAllGlobals());

describe("validate", () => {
  it("accepts a request and trims", () => {
    const r = validate({ kind: "request", author: "  Asha  ", fields: { name: " pill-bottle ", use: "x" } });
    expect(r).toEqual({ ok: true, value: { kind: "request", author: "Asha", fields: { name: "pill-bottle", use: "x", looks: "" }, solid: false } });
  });
  it("rejects unknown kinds, missing and over-long fields, non-strings, too many links", () => {
    expect(validate({ kind: "x" }).ok).toBe(false);
    expect(validate({ kind: "issue", fields: { what: "x" } })).toEqual({ ok: false, error: 'Please fill in "Where?".' });
    expect(validate({ kind: "request", fields: { name: "a".repeat(61), use: "x" } }).ok).toBe(false);
    expect(validate({ kind: "request", fields: { name: 5, use: "x" } }).ok).toBe(false);
    expect(validate({ kind: "request", author: "a".repeat(61), fields: { name: "a", use: "x" } }).ok).toBe(false);
    expect(validate({ kind: "request", fields: { name: "a", use: "http://a http://b http://c http://d" } }).ok).toBe(false);
  });
  it("keeps one-line fields on one line", () => {
    const r = validate({ kind: "issue", fields: { what: "a\nb", where: "page\nhome" } });
    expect(r.ok && r.value.fields).toEqual({ what: "a\nb", where: "page home", steps: "" });
  });
});

describe("formatting", () => {
  it("cleans control characters and blank runs", () => expect(clean(" a\r\n\n\n\nb\u0007 ")).toBe("a\n\nb"));
  it("defuses HTML, images and mentions", () => expect(safe('<img src=x> ![t](u) @octocat')).toBe("&lt;img src=x&gt; !\\[t](u) @\u200Boctocat"));
  it("builds a labelled issue with the author", () => {
    const i = buildIssue({ kind: "request", author: "Asha", fields: { name: "pill-bottle", use: "Meds", looks: "" }, solid: true });
    expect(i.title).toBe("Icon request: pill-bottle");
    expect(i.labels).toEqual(["icon request"]);
    expect(i.body).toContain("### Where would you use it?\n\nMeds");
    expect(i.body).toContain("### Solid version");
    expect(i.body).toContain("Submitted by **Asha**");
    expect(i.body).not.toContain("What should it show?");
  });
  it("calls an empty author Anonymous and keeps titles plain", () => {
    const i = buildIssue({ kind: "issue", author: "", fields: { what: "x", where: "<b>@team</b>", steps: "" }, solid: false });
    expect(i.body).toContain("Submitted by **Anonymous**");
    expect(i.title).toBe("Bug: b@\u200Bteam/b");
  });
});

describe("worker", () => {
  it("creates the issue and returns its link", async () => {
    const sent = mockFetch();
    const res = await worker.fetch(post(request), env());
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, url: "https://github.com/softstroke/softstroke/issues/7", number: 7 });
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    const gh = sent.find((s) => s.url.includes("/issues"))!;
    expect(gh.url).toBe("https://api.github.com/repos/softstroke/softstroke/issues");
    expect((gh.init!.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
    expect(JSON.parse(gh.init!.body as string).labels).toEqual(["icon request"]);
  });
  it("answers the CORS preflight only for allowed origins", async () => {
    const ok = await worker.fetch(new Request("https://w.example/issue", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env());
    const no = await worker.fetch(new Request("https://w.example/issue", { method: "OPTIONS", headers: { Origin: "https://evil.example" } }), env());
    expect([ok.status, no.status]).toEqual([204, 403]);
    expect(no.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
  it("refuses other origins, wrong paths and methods", async () => {
    mockFetch();
    expect((await worker.fetch(post(request, "https://evil.example"), env())).status).toBe(403);
    expect((await worker.fetch(new Request("https://w.example/other", { method: "POST", headers: { Origin: ORIGIN } }), env())).status).toBe(404);
    expect((await worker.fetch(new Request("https://w.example/issue", { headers: { Origin: ORIGIN } }), env())).status).toBe(405);
  });
  it("rate limits, then rejects bad JSON, invalid fields and a failed spam check without calling GitHub", async () => {
    const sent = mockFetch(false);
    expect((await worker.fetch(post(request), env(false))).status).toBe(429);
    expect((await worker.fetch(new Request("https://w.example/issue", { method: "POST", headers: { Origin: ORIGIN }, body: "{" }), env())).status).toBe(400);
    expect((await worker.fetch(post({ ...request, fields: {} }), env())).status).toBe(400);
    expect((await worker.fetch(post(request), env())).status).toBe(403);
    expect((await worker.fetch(post({ ...request, turnstile: undefined }), env())).status).toBe(403);
    expect(sent.some((s) => s.url.includes("/issues"))).toBe(false);
  });
  it("rejects oversized bodies", async () => {
    mockFetch();
    const res = await worker.fetch(post({ ...request, pad: "x".repeat(20_000) }), env());
    expect(res.status).toBe(413);
  });
  it("hides GitHub errors from the visitor", async () => {
    mockFetch(true, { status: 401, body: { message: "Bad credentials" } });
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await worker.fetch(post(request), env());
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("credentials");
    expect(err).toHaveBeenCalled();
  });
});
