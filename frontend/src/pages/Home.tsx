import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useHeroParallax } from "../hooks/useHeroParallax";

export default function Home() {
  useRevealOnScroll();
  useHeroParallax(true);

  return (
    <main id ="top">
      <section className = "hero">
        {/*grain*/}
        <div className="container reveal" >
          <h1 className = "h1">Welcome to My Website</h1>
          <p className = "subhead">Ipsum Lorem</p>
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
