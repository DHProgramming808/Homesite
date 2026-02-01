import "../styles/ContactMe.css";

import { Link } from "react-router-dom";

export default function TechnicalMe() {
  return (
    <main className="container legalPage">
      {/* Header */}
      <header className="legalHeader">
        <h1 className="h1">What I Do</h1>
        <p className="subhead" style={{ marginTop: "12px" }}>
          I build modern web apps end-to-end — clean UI, solid APIs, and thoughtful UX.
        </p>

        <div className="aboutHeaderCtas">
          <Link className="btn btnPrimary" to="/technicalme">
            My Skills
          </Link>
          <Link className="btn" to="/contact">
            Contact
          </Link>
        </div>
      </header>

      <div className="aboutGrid">
        {/* Left column */}
        <section className="aboutCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Quick snapshot</h2>

          <p className="subhead">
            I’m a software engineer focused on building polished, reliable products. I like
            systems that are simple on the surface and well-architected underneath.
          </p>

          <div className="aboutHighlights">
            <div className="aboutHighlight">
              <span className="aboutLabel">Focus</span>
              <span className="aboutValue">Full-stack • UX-first • Pragmatic</span>
            </div>
            <div className="aboutHighlight">
              <span className="aboutLabel">Currently</span>
              <span className="aboutValue">Building personal projects + portfolio</span>
            </div>
            <div className="aboutHighlight">
              <span className="aboutLabel">Open to</span>
              <span className="aboutValue">Software roles • Contract work</span>
            </div>
          </div>

          <div className="aboutDivider" />

          <h3 className="h2" style={{ fontSize: "20px" }}>Tech I use</h3>
          <div className="aboutPills" aria-label="Tech stack">
            {[
              "TypeScript",
              "React",
              "Node.js",
              ".NET",
              "SQL",
              "MongoDB",
              "AWS",
              "Docker",
            ].map((t) => (
              <span key={t} className="aboutPill">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Right column */}
        <section className="aboutCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Story</h2>

          <div className="aboutProse">
            <p className="subhead">
              I enjoy turning messy requirements into clean product experiences. I’m comfortable
              across the stack — from UI interaction details and design systems to APIs, data,
              and deployment.
            </p>
            <p className="subhead">
              My favorite projects are the ones where performance, clarity, and ergonomics all
              matter. I like creating pages that feel “alive” (subtle motion, strong typography,
              and smooth navigation) without being heavy or distracting.
            </p>
          </div>

          <div className="aboutDivider" />

          <h2 className="h2">Timeline</h2>
          <div className="aboutTimeline">
            <div className="aboutStep">
              <div className="aboutDot" />
              <div className="aboutStepBody">
                <div className="aboutStepTitle">Now</div>
                <div className="aboutStepText subhead">
                  Building a portfolio site and shipping projects with a focus on polish and clarity.
                </div>
              </div>
            </div>

            <div className="aboutStep">
              <div className="aboutDot" />
              <div className="aboutStepBody">
                <div className="aboutStepTitle">Recently</div>
                <div className="aboutStepText subhead">
                  Full-stack work across APIs, auth, and UI; experience with cloud and deployment workflows.
                </div>
              </div>
            </div>

            <div className="aboutStep">
              <div className="aboutDot" />
              <div className="aboutStepBody">
                <div className="aboutStepTitle">Background</div>
                <div className="aboutStepText subhead">
                  Software engineering with an emphasis on reliability, collaboration, and shipping.
                </div>
              </div>
            </div>
          </div>

          <div className="aboutDivider" />

          <h2 className="h2">What I’m looking for</h2>
          <ul className="subhead aboutBullets">
            <li>Teams that care about product quality and users</li>
            <li>Projects with real-world impact</li>
            <li>Opportunities to own features end-to-end</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
