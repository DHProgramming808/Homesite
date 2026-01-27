import { getToken } from "./auth";


const API_BASE = "http://localhost:5086/api/v1" // TODO configure this for local and remote hosts


export const getInfo = async () => {
  try {
    const response = await fetch("http://localhost:5086/api/v1/info"); //TODO configure this for local and remote hosting

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching /info:", err);
    return null;
  }
};


export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};


export const getProtectedStub = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/user/stub-protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
};
