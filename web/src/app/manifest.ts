import type { MetadataRoute } from "next";
import { BASE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Softstroke",
    short_name: "Softstroke",
    description: "Soft, rounded open-source icons in stroke and solid.",
    start_url: `${BASE}/`,
    display: "standalone",
    background_color: "#f4f9ff",
    theme_color: "#2563eb",
    icons: [{ src: `${BASE}/icon-512.png`, sizes: "512x512", type: "image/png" }],
  };
}
