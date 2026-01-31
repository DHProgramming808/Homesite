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

  const { text, visible } = useHeroTextCycle(HERO_TEXTS, {
    fadeDuration: 1000,
    holdDuration: 1100,
  });

  return (
    <main id ="top">
      <section className = "hero">
        {/*grain*/}
        <div className="container reveal" >
          <h1 className = {`h1 heroTitle ${visible ? "isVisible" : "isHidden"}`}>
            {text}
          </h1>
        </div>
      </section>

      <section className="container">
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
