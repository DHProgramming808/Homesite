import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export function ProjectCard({project}: {project: Project }) {
  return (
    <Link
      to={project.href}
      className="projectCard"
      style = {{ ["--card-bg" as any]: `url(${project.image})` }}
      aria-label = {project.title }
    >

      <div className="projectCardOverlay" />
      <div className="projectCardBody">

        <h3 className="projectCardTitle">{project.title}</h3>

        {project.tags?.length ? (
          <div className = "projectCardTags" aria-label = "Project tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="projectTag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

    </Link>
  )
}
