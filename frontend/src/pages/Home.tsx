import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useHeroParallax } from "../hooks/useHeroParallax";
import { useHeroTextCycle } from "../hooks/useHeroTextCycle";

export default function Home() {
  useRevealOnScroll();
  useHeroParallax(true);

  const HERO_TEXTS = [
    "Hello, World!",
    "E komo mai i kaʻu pūnaewele",
    "어서 들어오세요",
    "Welcome to my site!"
  ];
  const { text, visible, done } = useHeroTextCycle(HERO_TEXTS, {
    fadeDuration: 1000,
    holdDuration: 1100,
  });

  const scrollToNext = () => {
    const element = document.getElementById("content_section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main id ="top">
      <section className = "hero">
        {/*grain*/}
        <div className="container reveal" >
          <h1 className = {`h1 heroTitle ${visible ? "isVisible" : "isHidden"}`}>
            {text}
          </h1>
        <button
          type = "button"
          className = {`scrollCue ${done ? "scrollCueOn" : "scrollCueOff"}`}
          onClick={scrollToNext}
          aria-label = "Scroll to next section"
          >
          <span className = "scrollCueIcon">↓</span>
        </button>
        </div>
      </section>

      <section id="content_section" className="container">
        {/* Content Sections */}
        <div className = "me">
          <h1 className = "h2">Who I am</h1>
          <p className = "subhead">Ipsum Lorem</p>
        </div>
        <div className="projects_overview">
         <h2 className="h2">Projects</h2>
        </div>
      </section>
    </main>
  );
}
