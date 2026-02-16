import { getProjects } from "../api/projects-api"


export type Project = {
  id: string;
  title: string;
  description?: string;
  descriptionLong?: string;

  image: string;         // background image url
  tags?: string[];

  repoUrl?: string;
  liveUrl?: string;
  year?: string;
  status?: "Live" | "WIP" | "Archived";
  role?: string;

  featured?: boolean;
};

const DOMAIN_URL = window.__CONFIG__?.DOMAIN_URL ??
  import.meta.env.VITE_DOMAIN_URL ??
  "localhost:5127"

/**
 * Mock data for now.
 * Later, replace getProjects() with a fetch to your backend.
 */
const MOCK_PROJECTS: Project[] = [
  {
    id: "homesite",
    title: "Homesite",
    description: "Personal website + portfolio with auth, projects, and a clean UI system.",
    descriptionLong: "This site! Built with React, TypeScript, and Tailwind CSS on the front end. Uses ASP.NET C#, Entity Framework, and MySQL on the backend. \nFeatures a custom CMS for easy content updates, JWT-based auth, and a modular component library for consistent design. Deployed on AWS with CI/CD pipelines for seamless updates. \nBuilt as a showcase of my full-stack skills and to have a personal space to share my projects and blog posts.",
    image: "/images/projects/proj1.jpg",
    tags: ["C#", ".NET", "React", "TypeScript", "AWS", "Docker", "CI/CD", "MySQL", "Entity Framework"],
    repoUrl: "https://github.com/DHProgramming808/Homesite",
    liveUrl: "https://www.DOMAIN_URL",
    year: "2026",
    status: "WIP",
    role: "Full-stack",
    featured: true,
  },
  {
    id: "recipes",
    title: "Recipes",
    description: "GraphQL-first recipes service behind a gateway/BFF architecture.",
    descriptionLong: "A backend service for managing recipes, built with Java and Spring Boot. It exposes a GraphQL API for flexible querying and is designed to be consumed by a frontend gateway and BFF layer. The service uses MongoDB for data storage, allowing for easy scalability and handling of complex data structures. \nThis is part of a much larger ongoing kitchen and pantry assistant project, this module particularly focusing in building APIs and working with modern technologies like GraphQL.\nEventually, I plan to expand this service with features like user-generated content, ratings, and integration with external recipe APIs, a playlist step-by-step cooking mode, ML suggestions, and more.",
    image: "/images/projects/proj2.jpg",
    tags: ["GraphQL", "Java", "Spring Boot", "MongoDB"],
    repoUrl: "https://github.com/DHProgramming808/Homesite/tree/main/backend/recipes-api",
    liveUrl: "https://www.DOMAIN_URL/recipes",
    year: "2026",
    status: "WIP",
    role: "Backend",
    featured: true,
  },
  {
    id: "twentyone",
    title: "Game of 21",
    description: "A simple but fun card game built with Ruby on Rails.",
    descriptionLong: "A web application for playing the card game 'Game of 21', built with ASP.NET Core and React. The backend implements JWT-based authentication with refresh tokens, allowing users to securely log in, maintain sessions, and play online with their friends.\nBuilt in Ruby on Rails, this project was just a simple exercise in maintaining my Ruby skills and building a fun little game. It features a clean UI, real-time multiplayer gameplay.",
    image: "/images/projects/proj3.jpg",
    tags: ["Ruby on Rails", "JWT", "Docker"],
    repoUrl: "https://github.com/DHProgramming808/TwentyOneRoRWebApp",
    liveUrl: "https://twentyone.DOMAIN_URL",
    year: "2026",
    status: "WIP",
    role: "Full-stack",
  },
  {
    id: "assistant",
    title: "AI Assistant",
    description: "Agentic AI assistant using LLMs to perform tasks",
    descriptionLong: "An AI assistant built with Python that uses large language models (LLMs) to perform a variety of tasks. The assistant is designed to be multi-modal and agentic, meaning it can autonomously decide how to accomplish tasks based on user input. It can integrate with various APIs and services to fetch information, automate workflows, and provide intelligent responses. \nThis project is an exploration into the capabilities of LLMs and how they can be used to create powerful AI assistants that can help with everything from scheduling and reminders to complex problem-solving and decision-making.",
    image: "/images/projects/proj4.jpg",
    tags: ["Python", "LangGraph", "LangChain", "LLMs", "AI"],
    repoUrl: "https://github.com/DHProgramming808/ai-assistant",
    liveUrl: "https://assistant.DOMAIN_URL",
    year: "2025",
    status: "Archived",
    role: "AI/ML",
  },
  {
    id: "parser",
    title: "Concept Parser",
    description: "Use AI to find relevant concepts in text/csv files and return concept codes",
    descriptionLong: "A backend service built with Python and ASP.NET that uses AI to parse text and CSV files to identify relevant concepts and return standardized concept codes. This project is designed to help with data normalization and categorization by leveraging natural language processing (NLP) techniques and machine learning models. The service can be integrated into larger data processing pipelines to automatically extract structured information from unstructured text, making it easier to analyze and utilize the data for various applications.",
    image: "/images/projects/proj5.jpg",
    tags: ["Python", "RAG", "LLM", "AI", "ASP.NET", "C#"],
    repoUrl: "https://github.com/DHProgramming808/PolicyParser",
    liveUrl: "https://parser.DOMAIN_URL",
    year: "2025",
    status: "Archived",
    role: "AI/ML",
    featured: true,
  },
  {
    id: "projectsix",
    title: "project six",
    description: "As of yet unannounced project six, stay tuned for updates!",
    descriptionLong: "This is a placeholder for an upcoming project that I'm currently working on. I can't share too many details just yet, but it's going to be an exciting new venture that combines some of my favorite technologies and skills. \nKeep an eye on this space for updates and announcements about project six, as I'll be sharing more information as it gets closer to completion!",
    image: "/images/projects/proj6.jpg",
    tags: [""],
    repoUrl: "https://github.com/DHProgramming808/",
    liveUrl: "https://projectsix.DOMAIN_URL",
    year: "2024",
    status: "WIP",
    role: "Engineer",
  }
];

export async function getProjectsData(): Promise<Project[]> { // TODO deprecate once api is fleshed out
  const projects = MOCK_PROJECTS;

  return projects.map((p) => {
    if (!p.liveUrl) return p;

    return {
      ...p,
      liveUrl: p.liveUrl.includes("DOMAIN_URL")
        ? p.liveUrl.replace("DOMAIN_URL", DOMAIN_URL)
        : p.liveUrl,
    };
  });
}

export async function getProjectsAPI(): Promise<Project[]> {
  const projects = await getProjects();

  return projects.map((p: Project) => {
    if (!p.liveUrl) return p;

    return {
      ...p,
      liveUrl: p.liveUrl.includes("DOMAIN_URL")
        ? p.liveUrl.replace("DOMAIN_URL", DOMAIN_URL)
        : p.liveUrl,
    };
  });
}
