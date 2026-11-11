export const GITHUB_URL = "https://github.com/Sarthak102/softstroke";
// GitHub Pages serves the site from /softstroke. next/link adds it; plain URLs (rendered docs, font CSS) need it too.
export const BASE = process.env.NODE_ENV === "production" ? "/softstroke" : "";
export const FONT_CDN = "https://cdn.jsdelivr.net/npm/@softstroke/font@1/dist/softstroke.css";
