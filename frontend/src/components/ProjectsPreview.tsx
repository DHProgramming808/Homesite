import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjectsData, type Project } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let alive = true;

    getProjectsData().then((projects) => {
      if (!alive) return;
      setProjects(projects.slice(0, 4));
    });

    return () => { alive = false; };
  }, []);

  return (
    <section className = "homeProjects">
      <div className="homeProjectsHeader">
        <div>
          <h2 className="h2 homeProjectsTitle">Projects</h2>
          <p className="subhead">
            A few things I've built recently
          </p>
        </div>
      </div>

      <div className="projectsGrid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className = "homeProjectsFooter">
        <Link className = "btn btnPrimary" to = "/projects">
          See all projects →
        </Link>
      </div>

    </section>

  )
}
