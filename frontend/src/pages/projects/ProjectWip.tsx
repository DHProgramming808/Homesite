import { use, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectsData, type Project } from "../../data/projects";

type ReadmeState =
  | { status: "idle" | "loading"; text?: string; rawUrl?: string }
  | { status: "loaded"; text: string; rawUrl: string }
  | { status: "error"; error: string };


function parseGithubRepo(repoRul?: string): { owner: string; repo: string } | null {
  if (!repoRul) return null;

  try {
    const url = new URL(repoRul);
    if (url.hostname !== "github.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1];
    return { owner, repo };
  } catch (e) {
    return null;
  }
};

async function fetchReadmeText(repoUrl?: string): Promise<{ text: string; rawUrl: string }> {
  const parsed = parseGithubRepo(repoUrl);
  if (!parsed) throw new Error("Invalid GitHub URL");

  const { owner, repo } = parsed;

  const candidates = [
    `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
  ];

  for (const rawUrl of candidates) {
    try {
      const response = await fetch(rawUrl, { cache: "no-cache" });
      if (response.ok) {
        const text = await response.text();
        return { text, rawUrl };
      }
    } catch (e) {
      // Ignore and try next candidate
    }
  }

    throw new Error("Could not find README.md in the repository");
}

export default function ProjectWip () {
  const { id } = useParams<{ id: string }>();

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [readme, setReadme] = useState<ReadmeState>({ status: "idle"});

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await getProjectsData();
      if (alive) setProjects(list);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const project = useMemo(() => {
    if(!projects || !id) return null;
    return projects.find(p => p.id === id) ?? null;
  }, [projects, id]);

  useEffect(() => {
    if (!project?.repoUrl) return;

    let alive = true;
    setReadme({ status: "loading" });

    (async () => {
      try {
        const { text, rawUrl } = await fetchReadmeText(project.repoUrl);
        if (!alive) return;
        setReadme({ status: "loaded", text, rawUrl });
      } catch (e: any) {
        if (!alive) return;
        setReadme({ status: "error", error: e.message ?? "Failed to load README" });
      }
    })();

    return () => {
      alive = false;
    };
  }, [project?.repoUrl]);

  const contactHref = useMemo(() => {
    const title = project?.title ?? id ?? "project";
    const subject = encodeURIComponent(`Inquiry and Live demo request about ${title}`);
    const body = encodeURIComponent(
      `Hi Daniel,\n\nI'd love to see a live demo of "${title}" and learn more about it. Please let me know when you're available.\n\nBest,\n[Your Name]`
    );
    return `/contact?subject=${subject}&message=${body}`;
  }, [project?.title, id]);

  if (!id) {
    return (
      <main>
        <h1>Project not found</h1>
        <p>No project ID provided.</p>
        <Link to="/projects">Back to Projects</Link>
      </main>
    );
  }

  if (!projects) {
    return (
      <main className="projPage">
        <header className="projHeader">
          <h1>Loading…</h1>
        </header>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="projPage">
        <header className="projHeader">
          <h1>Project not found</h1>
          <p>
            No project matches id: <code>{id}</code>
          </p>
          <div className="projDetailLinks" style={{ justifyContent: "center" }}>
            <Link to="/projects">Back to Projects</Link>
          </div>
        </header>
      </main>
    );
  }

  return (
    <main className="projPage">
      <header className="projHeader">
        <h1 className="h1">{project.title}</h1>
        <p className="subhead contentNarrow" style={{ marginTop: 12 }}>
          {project.description ? project.description : ""}
        </p>
      </header>

      <section className = "projRailSection">
        <div className="projRailHeader">
          <div>
            <h2 style = {{margin: 0}}>Preview</h2>
            <p style = {{marginTop: 6, opacity: 0.8}}>
              Repo Preview
            </p>
          </div>

          <div className="projDetailLinks">
            <Link to="/projects">Back to Projects</Link>
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            <Link to={contactHref}>Request a Live Demo</Link>
          </div>
        </div>

        <article
          className="projRailCard"
          style={{ ["--card-bg" as any]: `url(${project.image})` }}
        >
          <div className = "projRailTop">
            <h3 className = "projRailTitle">{project.title}</h3>
          </div>

          <div className="projRailBody">
            <div className = "projRailMeta">
              {project.year ? <span className="projMetaPill">{project.year}</span> : null}
              {project.status ? <span className="projMetaPill">{project.status}</span> : null}
              {project.role ? <span className="projMetaPill">{project.role}</span> : null}
            </div>

            {project.description ? <p className="projDescription">{project.description}</p> : null}

            {project.tags?.length ? (
              <div className = "projRailTags">
                {project.tags.filter(Boolean).slice(0,10).map((t) => (
                  <span key={t} className="projTag">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <div className = "projRailActions">
              <Link to = {contactHref}>Request a Live Demo</Link>
              <Link to = "/projects">View All Projects</Link>
            </div>
          </div>
        </article>

        <div className="projBelow">
          <div className="projBelowGrid">
            <div className="projBelowCard">
              <h3 style={{ marginTop: 0 }}>Live demo status</h3>
              <ul className="projBullets">
                <li>
                  This project’s live environment is <strong>offline</strong> by default to keep costs low.
                </li>
                <li>
                  Click <strong>Request a Live Demo</strong> and I’ll spin it up for you.
                </li>
                <li>
                  Future: auto spin-up for ~30 minutes then shutdown.
                </li>
              </ul>

              <div className="projDetailLinks">
                <Link to={contactHref}>Request a Live Demo</Link>
                {project.liveUrl ? (
                  <span className="projInlineMore">
                    (Live URL listed but may be down)
                  </span>
                ) : null}
              </div>
            </div>

            <div className="projBelowCard">
              <h3 style={{ marginTop: 0 }}>Repository preview</h3>

              {!project.repoUrl ? (
                <p style={{ marginTop: 8, opacity: 0.8 }}>No repo URL provided for this project.</p>
              ) : (
                <>
                  <div className="projDetailLinks">
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      Open repo
                    </a>

                    {readme.status === "loaded" ? (
                      <a href={readme.rawUrl} target="_blank" rel="noreferrer">
                        README raw
                      </a>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    {readme.status === "loading" || readme.status === "idle" ? (
                      <p style={{ marginTop: 8, opacity: 0.8 }}>Loading README…</p>
                    ) : readme.status === "error" ? (
                      <p style={{ marginTop: 8, opacity: 0.8 }}>
                        Couldn’t load README: <code>{readme.error}</code>
                      </p>
                    ) : (
                      <pre
                        style={{
                          margin: 0,
                          marginTop: 8,
                          padding: 14,
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,.10)",
                          background: "rgba(0,0,0,.25)",
                          maxHeight: 520,
                          overflow: "auto",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.45,
                          color: "rgba(255,255,255,.86)",
                        }}
                      >
                        {readme.text}
                      </pre>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );

}
