import type { NextConfig } from "next";

// Static export for GitHub Pages, served from /softstroke.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/softstroke" : "",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
