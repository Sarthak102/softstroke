import { gsap } from "gsap";

// Draw-in: each stroke icon draws its own lines like a pen, icon after icon. pathLength="1" makes every
// shape's dash maths length-independent; dash styles are cleared afterwards so nothing lingers.
// Callers skip this under prefers-reduced-motion.
export function drawIn(svgs: Element[], { duration = 1.1, each = 0.035, delay = 0 } = {}) {
  const tl = gsap.timeline({ delay });
  svgs.forEach((svg, i) => {
    const shapes = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, circle, line, rect, ellipse, polyline"));
    shapes.forEach((s) => s.setAttribute("pathLength", "1"));
    tl.fromTo(
      shapes,
      { strokeDasharray: "1 2", strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" },
      i * each,
    );
  });
  return tl;
}
