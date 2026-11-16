// The use-case scenes: components/scenes/Scenes.tsx drawn on Sarthak's grounds (public/use-cases/bg2),
// captured by scripts/scenes.mjs to public/use-cases/<id>.webp (2400px) and <id>-1200.webp.
export type UseCase = { id: string; title: string; body: string; icons: string[] };

export const USE_CASES: UseCase[] = [
  { id: "bento", title: "App cards", body: "Weather, health, smart home and music cards. Tabs rest in stroke, the active one turns solid.", icons: ["inbox", "calendar", "sticky-note", "bookmark", "cloud-sun", "moon"] },
  { id: "soft-menu", title: "Account menu", body: "A soft dropdown with icons at 38px, next to large text.", icons: ["user", "puzzle", "sliders", "help-circle", "log-out"] },
  { id: "dashboard", title: "Analytics dashboard", body: "Sidebar navigation, stat cards and toolbar buttons at 20 to 22px.", icons: ["home", "bar-chart", "inbox", "users", "credit-card", "bell"] },
  { id: "clouds-bar", title: "Glass tab bar", body: "White stroke icons on frosted glass over a photo.", icons: ["home", "search-sparkle", "bookmark"] },
  { id: "glass-bar", title: "Floating tab bar", body: "The active tab in solid, the rest in stroke.", icons: ["home", "map-pin", "bag", "settings", "search"] },
  { id: "files", title: "File browser", body: "Solid folders, a context menu and a sidebar, all from one set.", icons: ["folder", "history", "star", "trash", "upload", "copy"] },
];
