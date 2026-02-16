// pages/projects/ProjectPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProjectsData, type Project } from "../../data/projects";
import { checkExternalLink } from "../../api/projects-api";

import "../../styles/ProjectsPage.css";

// glob screenshots
const PROJECT_SHOTS = import.meta.glob(
  "/src/assets/projects/*/*.{png,jpg,jpeg,webp}",
  { eager: true, as: "url" }
) as Record<string, string>;

function getShotsForProject(projectId: string): string[] {
  const prefix = `/src/assets/projects/${projectId}/`;

  return Object.entries(PROJECT_SHOTS)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    // using your mocked data for now
    (async () => {
      const list = await getProjectsData();
      setProjects(list);
    })();
  }, []);

  const project = useMemo(() => {
    if (!projects || !id) return null;
    return projects.find((p) => p.id === id) ?? null;
  }, [projects, id]);

  const shots = useMemo(() => {
    if (!project?.id) return [];
    return getShotsForProject(project.id);
  }, [project?.id]);

  const contactHref = useMemo(() => {
    const title = project?.title ?? id ?? "project";
    const subject = encodeURIComponent(`Project question: ${title}`);
    const body = encodeURIComponent(
      `Hi Daniel,\n\nI was looking at your project "${title}" and wanted to chat about:\n\n- \n\nBest,\n`
    );
    return `/contact?subject=${subject}&message=${body}`;
  }, [project?.title, id]);

  async function onOpenLive() {
    if (!project?.id || !project?.liveUrl) {
      navigate(`/projectwip/${project?.id ?? id ?? ""}`);
      return;
    }

    // Attempt server-side check (will fail until backend exists → fallback)
    const result = await checkExternalLink(project.liveUrl);

    if (result.ok) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/projectwip/${project.id}`);
    }
  }

  if (!id) {
    return (
      <main className="projPage">
        <div className="projPageInner">
          <header className="projHeader projSurface">
            <h1 className="h1">Project</h1>
            <p className="subhead contentNarrow" style={{ marginTop: 12 }}>
              Missing project id in route.
            </p>
          </header>
        </div>
      </main>
    );
  }

  if (!projects) {
    return (
      <main className="projPage">
        <div className="projPageInner">
          <header className="projHeader projSurface">
            <h1 className="h1">Loading…</h1>
          </header>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="projPage">
        <div className="projPageInner">
          <header className="projHeader projSurface">
            <h1 className="h1">Project not found</h1>
            <p className="subhead contentNarrow" style={{ marginTop: 12 }}>
              No project matches id: <code>{id}</code>
            </p>
            <div className="projDetailLinks" style={{ justifyContent: "center" }}>
              <Link to="/projects">Back to Projects</Link>
            </div>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className="projPage">
      <div className="projPageInner">
        <header className="projHeader projSurface">
          <h1 className="h1">{project.title}</h1>
          <p className="subhead contentNarrow" style={{ marginTop: 12, paddingBottom: 6 }}>
            {project.description ?? ""}
          </p>
        </header>

        <section className="projRailSection">
          <div className="projRailHeader">

            <div className="projDetailLinks">
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : null}
              <Link to="/projects">Back to Projects</Link>
            </div>
          </div>

          <article className="projRailCard" style={{ ["--card-bg" as any]: `url(${project.image})` }}>
            <div className="projRailTop">
              <h3 className="projRailTitle">{project.title}</h3>
            </div>

            <div className="projRailBody">
              <div className="projRailMeta">
                {project.year ? <span className="projMetaPill">{project.year}</span> : null}
                {project.status ? <span className="projMetaPill">{project.status}</span> : null}
                {project.role ? <span className="projMetaPill">{project.role}</span> : null}
              </div>

              {project.description ? <p className="projRailDesc">{project.description}</p> : null}

              {project.tags?.length ? (
                <div className="projRailTags">
                  {project.tags.filter(Boolean).slice(0, 10).map((t) => (
                    <span key={t} className="projTag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="projRailActions">
                {project.liveUrl ? (
                  <button type="button" className="projLinkButton" onClick={onOpenLive}>
                    View Live
                  </button>
                ) : (
                  <Link className="projLinkButton" to={`/projectwip/${project.id}`}>
                    View WIP page
                  </Link>
                )}
              </div>
            </div>
          </article>

          <div className="projBelow">
            <div className="projBelowStack">
              {/* Long description */}
              <div className="projBelowCard">
                <h3 style={{ marginTop: 0, textAlign: "left" }}>About this project</h3>
                <p style={{ marginTop: 10, textAlign: "left", opacity: 0.85, lineHeight: 1.6 }}>
                  {project.descriptionLong ?? project.description ?? ""}
                </p>
              </div>

              {/* Screenshots */}
              <div className="projBelowCard">
                <h3 style={{ marginTop: 0, textAlign: "left" }}>Previews</h3>

                {shots.length === 0 ? (
                  <p style={{ marginTop: 8, opacity: 0.8, textAlign: "left" }}>
                    No screenshots found for <code>{project.id}</code>.
                    <br />
                    Add images under <code>src/assets/projects/{project.id}/</code>.
                  </p>
                ) : (
                  <div className="projShotsGrid">
                    {shots.map((src, idx) => (
                      <a key={src} className="projShot" href={src} target="_blank" rel="noreferrer">
                        <img src={src} alt={`${project.title} screenshot ${idx + 1}`} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="projBelowCard">
                <h3 style={{ marginTop: 0 }}>Want to chat about this project?</h3>
                <p style={{ marginTop: 8, opacity: 0.85, lineHeight: 1.6 }}>
                  Send me a ping — happy to walk through tradeoffs, architecture, and what I’d improve next.
                </p>

                <div className="projDetailLinks">
                  <Link to={contactHref}>Contact me</Link>
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      View code
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
