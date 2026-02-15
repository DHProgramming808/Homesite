import { getProjects } from "../api/projects-api"

export type Project = {
  id: string;
  title: string;
  description?: string;

  image: string;         // background image url
  tags?: string[];

  repoUrl?: string;
  liveUrl?: string;
  year?: string;
  status?: "Live" | "WIP" | "Archived";
  role?: string;

  featured?: boolean;
};

/**
 * Mock data for now.
 * Later, replace getProjects() with a fetch to your backend.
 */
const MOCK_PROJECTS: Project[] = [
  {
    id: "homesite",
    title: "Homesite",
    description: "Personal website + portfolio with auth, projects, and a clean UI system.",
    image: "/images/projects/proj1.jpg",
    tags: ["C#", ".NET", "React", "TypeScript", "AWS", "Docker", "CI/CD", "MySQL"],
    repoUrl: "https://github.com/DHProgramming808/Homesite",
    liveUrl: "https://www.danielyhong.com",
    year: "2026",
    status: "WIP",
    role: "Full-stack",
    featured: true,
  },
  {
    id: "recipes",
    title: "Recipes",
    description: "GraphQL-first recipes service behind a gateway/BFF architecture.",
    image: "/images/projects/proj2.jpg",
    tags: ["GraphQL", "Java", "Spring Boot", "MongoDB"],
    repoUrl: "https://github.com/DHProgramming808/Homesite/tree/main/backend/recipes-api",
    liveUrl: "https://www.danielyhong.com/recipes",
    year: "2026",
    status: "WIP",
    role: "Backend",
    featured: true,
  },
  {
    id: "twentyone",
    title: "Game of 21",
    description: "JWT auth service with refresh tokens and role-aware access control.",
    image: "/images/projects/proj3.jpg",
    tags: [".NET", "JWT", "Docker"],
    repoUrl: "https://github.com/DHProgramming808/TwentyOneRoRWebApp",
    liveUrl: "https://YOUR_DOMAIN.com/login",
    year: "2026",
    status: "WIP",
    role: "Full-stack",
    featured: true,
  },
  {
    id: "AI assistant",
    title: "AI Assistant",
    description: "Agentic AI assistant using LLMs to perform tasks",
    image: "/images/projects/proj4.jpg",
    tags: ["Python", "LLMs", "AI"],
    repoUrl: "https://github.com/DHProgramming808/ai-assistant",
    liveUrl: "https://example.com",
    year: "2025",
    status: "Archived",
    role: "Backend",
  },
  {
    id: "Text Parser",
    title: "project five",
    description: "Use AI to find relevant concepts in text/csv files and return concept codes",
    image: "/images/projects/proj5.jpg",
    tags: [""],
    repoUrl: "https://github.com/DHProgramming808/",
    liveUrl: "https://example.com",
    year: "2025",
    status: "Archived",
    role: "Backend",
  },
  {
    id: "project six",
    title: "project six",
    description: "Small utilities for workflows: scripts, integrations, and time savers.",
    image: "/images/projects/proj6.jpg",
    tags: [""],
    repoUrl: "https://github.com/DHProgramming808/",
    liveUrl: "https://example.com",
    year: "2024",
    status: "WIP",
    role: "Engineer",
  }
];

export async function getProjects(): Promise<Project[]> {
  // Later:
  // const res = await fetch("/api/projects");
  // return await res.json();

  let url = 
  Project[] projects = [];

  //getProjects();

  foreach (project in MOCK_PROJECTS) {
    //replace live url DOMAIN_URL with environment domain url

    Projects.append(project);
  }


  return Promise.resolve(Projects);
}
