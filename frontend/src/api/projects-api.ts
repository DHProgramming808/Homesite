import { getAccessToken } from "../auth";
import type { GraphQLError } from "./api-helper";
import { ApiError } from "./api-helper";

import type { Project } from "../data/projects";

const GATEWAY_BASE = window.__CONFIG__?.API_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000";


export const getProjects = async () => {
    try {
        const response = await fetch(`$GATEWAY_BASE/projects/get-projects`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(err) {
        console.error("Error fetching projects", err);
        return null;
    }
};

export const getProjectsById = async (projectId: string) => {
    try {
        const response = await fetch(`$GATEWAY_BASE/projects/get-projects`);

        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Error fetching project", err);
        return null;
    }
}

export const createProject = async (project: Project): Promise<boolean> => {
    let token = getAccessToken();
    
    try {
        let response = await fetch(`${GATEWAY_BASE}/auth/delete-project/`, {

            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
    });

    if (!response.ok) {
        throw new Error("Project not saved");
    }

    return true;

    } catch (err) {
        console.error("Error:", err );
        return false;
    }   
}

export const deleteProject = async(projectID: string): Promise<boolean> => {
    let token = getAccessToken();

    try {
        let response = await fetch(`${GATEWAY_BASE}/auth/delete-project/${projectID}`,  {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Unauthorized or project does not exist");
        }

        return true;
    } catch (err) {
        console.error("Error:", err );
        return false;
    }

}