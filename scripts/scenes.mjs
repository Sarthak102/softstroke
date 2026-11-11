// Captures the use-case scenes (web/src/components/scenes) to web/public/use-cases/<id>.webp at 1200x800 @2x, plus <id>-1200.webp at 1x.
// Needs the dev server: cd web && npm run dev -- -p 3123. Usage: node scripts/scenes.mjs [id ...]
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const IDS = process.argv.slice(2).length ? process.argv.slice(2) : ["soft-menu", "weather-pill", "theme-toggle", "add-calendar", "bento", "clouds-bar", "glass-bar", "control-center", "feed", "dock", "music", "calendar", "menus", "profile", "files", "dashboard", "finance", "settings"];
const BASE = process.env.SCENES_URL ?? "http://localhost:3123/scenes";
const OUT = new URL("../web/public/use-cases/", import.meta.url).pathname;
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;

const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "scenes-"))}`, "about:blank"], { stdio: "ignore" });
try {
  let pages;
  for (let i = 0; !pages; i++) {
    try { pages = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); }
    catch { if (i > 50) throw new Error("Chrome did not start"); await new Promise((r) => setTimeout(r, 200)); }
  }
  const ws = new WebSocket(pages.find((p) => p.type === "page").webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let seq = 0;
  const waiting = new Map();
  const events = [];
  ws.onmessage = ({ data }) => {
    const m = JSON.parse(data);
    if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); }
    else if (m.method) events.forEach((f) => f(m));
  };
  const send = (method, params = {}) => new Promise((r, j) => {
    const id = ++seq;
    waiting.set(id, (m) => (m.error ? j(new Error(`${method}: ${m.error.message}`)) : r(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  const loaded = () => new Promise((r) => { const f = (m) => m.method === "Page.loadEventFired" && (events.splice(events.indexOf(f), 1), r()); events.push(f); });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 800, deviceScaleFactor: 2, mobile: false });
  mkdirSync(OUT, { recursive: true });
  for (const id of IDS) {
    const done = loaded();
    await send("Page.navigate", { url: `${BASE}/${id}/` });
    await done;
    await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 400)))", awaitPromise: true });
    const { data } = await send("Page.captureScreenshot", { format: "webp", quality: 92 });
    writeFileSync(`${OUT}${id}.webp`, Buffer.from(data, "base64"));
    // half-size copy for phones (the page picks it through srcset)
    const { data: small } = await send("Page.captureScreenshot", { format: "webp", quality: 90, clip: { x: 0, y: 0, width: 1200, height: 800, scale: 0.5 } });
    writeFileSync(`${OUT}${id}-1200.webp`, Buffer.from(small, "base64"));
    console.log(`use-cases/${id}.webp (+ -1200)`);
  }
  ws.close();
} finally {
  chrome.kill();
}
