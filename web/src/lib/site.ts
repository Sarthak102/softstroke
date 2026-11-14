export const GITHUB_URL = "https://github.com/softstroke/softstroke";
export const REQUEST_URL = `${GITHUB_URL}/issues/new?template=icon-request.yml`;
// Public address of the site (sitemap, robots, metadata, shadcn commands). Change here if the site moves.
export const SITE_URL = "https://softstroke.github.io/softstroke";
// GitHub Pages serves the site from /softstroke. next/link adds it; plain URLs (rendered docs, font CSS) need it too.
export const BASE = process.env.NODE_ENV === "production" ? "/softstroke" : "";
export const FONT_CDN = "https://cdn.jsdelivr.net/npm/@softstroke/font@1/dist/softstroke.css";
