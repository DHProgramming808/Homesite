export type Project = {
  id: string;
  title: string;
  description?: string;
  href: string;          // where the card links
  image: string;         // background image url
  tags?: string[];
  featured?: boolean;
};

/**
 * Mock data for now.
 * Later, replace getProjects() with a fetch to your backend.
 */
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Proj1",
    href: "/projects",
    image: "/images/projects/proj1.jpg",
    tags: ["API", ".NET", "Healthcare"],
    featured: true,
  },
  {
    id: "proj-2",
    title: "Proj2",
    href: "/projects",
    image: "/images/projects/proj2.jpg",
    tags: ["Java", "Rules", "GovTech"],
    featured: true,
  },
  {
    id: "proj-3",
    title: "Proj3",
    href: "/projects",
    image: "/images/projects/proj3.jpg",
    tags: ["Full-stack", "Auth", "Cloud"],
    featured: true,
  },
  {
    id: "proj-4",
    title: "Proj4",
    href: "/projects",
    image: "/images/projects/proj4.jpg",
    tags: ["React", "UX", "Motion"],
  },
  {
    id: "proj-5",
    title: "Proj5",
    href: "/projects",
    image: "/images/projects/proj5.jpg",
    tags: ["Python", "Data", "Workflow"],
  },
  {
    id: "proj-6",
    title: "Proj6",
    href: "/projects",
    image: "/images/projects/proj6.jpg",
    tags: ["API", "ETL", "Integration"],
  },
];

export async function getProjects(): Promise<Project[]> {
  // Later:
  // const res = await fetch("/api/projects");
  // return await res.json();

  return Promise.resolve(MOCK_PROJECTS);
}
