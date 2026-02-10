import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth";


declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
      RECIPE_BASE_URL?: string;
    };
  }
}

const GATEWAY_BASE = window.__CONFIG__?.API_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000";


// TODO move get Auth.Api /info and Auth.Api /health to separate api file?
export const getInfo = async () => {
  try {
    const response = await fetch(`${GATEWAY_BASE}/auth/get-info`); //TODO configure this for local and remote hosting

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching /info:", err);
    return null;
  }
};


export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${GATEWAY_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};


export const logoutApi = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  var response = await fetch(`${GATEWAY_BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`
     },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error("Logout failed");
  }

  clearTokens();
};


let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

export const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await fetch(`${GATEWAY_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    setTokens(data.accessToken, data.refreshToken);
    return data as { accessToken: string; refreshToken: string };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};


export const register = async (email: string, username: string, password: string) => {
  const response = await fetch(`${GATEWAY_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  } else {
    console.log("Registration successful");
  }
};

export const getProtectedStub = async () => {
  let token = getAccessToken();

  let response = await fetch(`${GATEWAY_BASE}/auth/stub-protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await refreshAccessToken();
    token = getAccessToken();

    response = await fetch(`${GATEWAY_BASE}/auth/stub-protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

