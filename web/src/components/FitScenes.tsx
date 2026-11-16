"use client";

import { useEffect } from "react";

// Scenes are drawn at 720px wide; this scales each one to its card.
export function FitScenes() {
  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>(".case-img")];
    const fit = () => cards.forEach((el) => el.style.setProperty("--k", String(el.clientWidth / 720)));
    fit();
    const ro = new ResizeObserver(fit);
    cards.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  return null;
}
