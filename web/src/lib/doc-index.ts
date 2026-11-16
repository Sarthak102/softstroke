// The docs table of contents, safe for client code (docs.ts reads files on the server).
export const DOC_GROUPS: { title: string; pages: { slug: string; title: string }[] }[] = [
  { title: "Getting started", pages: [{ slug: "", title: "Introduction" }, { slug: "installation", title: "Installation" }] },
  {
    title: "Frameworks",
    pages: [
      { slug: "react", title: "React" },
      { slug: "shadcn", title: "shadcn" },
      { slug: "react-native", title: "React Native" },
      { slug: "flutter", title: "Flutter" },
      { slug: "vue", title: "Vue" },
      { slug: "svelte", title: "Svelte" },
      { slug: "angular", title: "Angular" },
      { slug: "svg", title: "SVG and sprite" },
      { slug: "cdn", title: "CDN" },
      { slug: "font", title: "Icon font" },
    ],
  },
  {
    title: "Guides",
    pages: [
      { slug: "styling", title: "Styling" },
      { slug: "solid", title: "Solid icons" },
      { slug: "accessibility", title: "Accessibility" },
      { slug: "bundle-size", title: "Bundle size" },
    ],
  },
  { title: "About", pages: [{ slug: "design", title: "Design rules" }, { slug: "contributing", title: "Contributing" }, { slug: "license", title: "License" }] },
];

export const DOC_PAGES = DOC_GROUPS.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.title })));
