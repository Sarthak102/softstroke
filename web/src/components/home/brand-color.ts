// A framework's brand colour for hover and selected states. Near-black brands (Next.js, Expo, GitHub)
// would vanish on the ink theme, so they use the text colour; Angular's mark is its red.
export function brandColor(logo: { hex: string; title: string }) {
  if (logo.title === "Angular") return "#dd0031";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(logo.hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.25 ? "var(--text)" : `#${logo.hex}`;
}
