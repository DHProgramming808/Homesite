import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useHeroParallax } from "../hooks/useHeroParallax";
import { useHeroTextCycle } from "../hooks/useHeroTextCycle";
import { ProjectsPreview } from "../components/ProjectsPreview";

import { Link } from "react-router-dom";

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
        <div id="projects">
          <ProjectsPreview />
        </div>



        <div className="homeWelcome">
          <div className="homeWelcomeCard">
            <div className="homeWelcomeKicker">It's so nice to meet you!</div>

            <h2 className="homeWelcomeTitle">
              I’m Daniel
            </h2>

            <p className="homeWelcomeBody">
              This site is a quick tour of what I’ve built and what I’m building next.
              If you’re here for the highlights: start with Projects. If you want the human
              version: About has the story.
            </p>

            <div className="homeWelcomeActions">

              <Link className="btn" to="/aboutme">
                Get to know me better
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
