import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Icon count for site copy, read from the built svg package so it follows every release.
const icons = JSON.parse(readFileSync(join(process.cwd(), "node_modules/@softstroke/svg/dist/icons.json"), "utf8"));

// Static export for GitHub Pages, served from /softstroke.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/softstroke" : "",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
  env: { NEXT_PUBLIC_ICON_COUNT: String(Object.keys(icons).length) },
};

export default nextConfig;
