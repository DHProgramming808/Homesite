import { getToken } from "./auth";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";


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


export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const response = await fetch(`${API_BASE}/user/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error("Refresh failed");
  }

  const data = await response.json();
  localStorage.SetItem("access", data.accessToken); // TODO move this function to auth.tsx?
}


export const getProtectedStub = async () => {
  let token = getAccessToken();

  let response = await fetch(`${API_BASE}/user/stub-protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await refreshAccessToken();
    token = getAccessToken();

    response = await fetch(`${API_BASE}/user/stub-protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
};

