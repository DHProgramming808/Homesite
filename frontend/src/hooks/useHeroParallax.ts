import { useEffect } from "react";

export function useHeroParallax(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    console.log("Hero parallax enabled"); // TODO remove after debug

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        console.log("Scroll Y:", y);
        // Small movement: 0px to ~24px over first ~600px of scroll
        const offset = Math.min(160, y * 0.30);

        document.documentElement.style.setProperty("--hero-parallax", `${offset}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--hero-parallax");
    };
  }, [enabled]);
}
