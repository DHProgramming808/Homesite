import { useEffect, useMemo, useRef, useState } from "react";
import { getProjectsData, type Project } from "../data/projects";

import "../styles/ProjectsPage.css";

function ProjectRailCard({ project }: { project: Project }) {
  return (
    <article
      className="projRailCard"
      style={{ ["--card-bg" as any]: `url("${project.image}")` }}
    >
      <div className="projRailOverlay" />

      <div className="projRailTop">
        <h3 className="projRailTitle">{project.title}</h3>
      </div>


      <div className="projRailBody">
        <p className="projRailDesc">{project.description}</p>


        {project.tags?.length ? (
          <div className="projRailTags">
            {project.role ? <span className="projMetaPill">{project.role}</span> : null}

            {project.tags.slice(0, 4).map((t) => (
              <span key={t} className="projTag">
                {t}
              </span>
            ))}

            {project.status ? <span className="projMetaPill">{project.status}</span> : null}
          </div>
        ) : null}

        <div className="projRailActions">
          {project.repoUrl ? (
            <a className="btn" href={project.repoUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}

          {project.liveUrl ? (
            <a className="btn btnPrimary" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}


export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    getProjectsData().then((projects) => {
      if (!alive) return;
      setProjects(projects);
    });

    return () => {
      alive = false;
    };
  }, []);

  const featured = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 4),
    [ projects ]
  );

  const scrollRail = (dir: "left" | "right") => {
    const element = railRef.current;

    if (!element) return;

    const scrollAmount = Math.min(520, element.clientWidth * 0.8);

    if (dir === "left") {
      element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      element.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }


  return (
    <main className="projPage">
      <header className="projHeader">
        <h1 className="h1">Projects</h1>
        <p className="subhead contentNarrow" style={{ marginTop: 12 }}>
          My handicraft — some polished, some in-progress — all built with intention.
        </p>
      </header>

      {/* Rail section */}
      <section className="projRailSection">
        <div className="projRailHeader">
          <div>
            <h2 className="h2" style={{ margin: 0, fontSize: 36 }}>Featured</h2>
          </div>

          <div className="projRailNav">
            <button className="projNavBtn" type="button" onClick={() => scrollRail("left")} aria-label="Scroll left">
              ←
            </button>
            <button className="projNavBtn" type="button" onClick={() => scrollRail("right")} aria-label="Scroll right">
              →
            </button>
          </div>
        </div>

        <div ref={railRef} className="projRail" aria-label="Featured projects">
          {featured.map((p) => (
            <ProjectRailCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className="container projListSection">
        <div className="container projListContainer">

          <h2 className="h2 projListTitle" style={{ fontSize: 36 }}>All projects</h2>

          <div className="projList">
            {projects.map((p) => (
              <details key={p.id} className="projItem">
                <summary className="projSummary">
                  <span className="projSummaryLine">
                    <span className="projSummaryTitle">{p.title}:</span>{" "}
                    <span className="projSummaryDesc">{p.description}</span>
                  </span>

                  {p.tags?.length ? (
                    <span className="projSummaryTags" aria-label="Project tags">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="projInlineTag">
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 3 ? (
                        <span className="projInlineMore">+{p.tags.length - 3}</span>
                      ) : null}
                    </span>
                  ) : null}

                  <span className="projChevron" aria-hidden="true">▾</span>
                </summary>

                <div className="projDetails">
                  <div className="projDetailGrid">
                    {p.status ? (
                      <div className="projDetailRow">
                        <span className="projDetailLabel">Status</span>
                        <span className="projDetailValue">{p.status}</span>
                      </div>
                    ) : null}

                    {p.role ? (
                      <div className="projDetailRow">
                        <span className="projDetailLabel">Role</span>
                        <span className="projDetailValue">{p.role}</span>
                      </div>
                    ) : null}

                    {p.year ? (
                      <div className="projDetailRow">
                        <span className="projDetailLabel">Year</span>
                        <span className="projDetailValue">{p.year}</span>
                      </div>
                    ) : null}
                  </div>

                  {p.tags?.length ? (
                    <div className="projDetailBlock">
                      <div className="projDetailLabel">Tags</div>
                      <div className="projTagCloud">
                        {p.tags.map((t) => (
                          <span key={t} className="projPill">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="projDetailLinks">
                    {p.repoUrl ? (
                      <a className="btn" href={p.repoUrl} target="_blank" rel="noreferrer">
                        GitHub repo
                      </a>
                    ) : null}
                    {p.liveUrl ? (
                      <a className="btn btnPrimary" href={p.liveUrl} target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
