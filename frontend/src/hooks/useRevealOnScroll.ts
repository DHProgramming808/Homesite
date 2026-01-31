import { useEffect } from "react";

export function useRevealOnScroll(selector = ".reveal", threshold = 0.15) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if(entry.isIntersecting) {
            entry.target.classList.add("revealVisible");
          }
        }

      },{ threshold }
    );

    elements.forEach((element) => io.observe(element));
    return () => io.disconnect();
  }, [selector, threshold]);
}
