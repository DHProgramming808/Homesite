const TOKEN_KEY = "auth_token"; // TODO deprecate gracefully
const ACCESS_TOKEN_KEY = "access_token"; // TODO make sure key hygeine is observed
const REFRESH_TOKEN_KEY = "refresh_token";


export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token && token.length > 0 ? token : null;
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  return !isTokenExpired();
};

// TODO deprecate BLOCK gracefully
// START BLOCK old token functions
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
// BLOCK END

export interface DecodedToken {
  unique_name?: string;
  name?: string;
  exp?: number;
  iat?: number;
};

export const decodeToken = (): DecodedToken | null => {
  const token = getAccessToken();
  if (!token) return null;


  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

// TODO determine if this needs to be cleaned up further with the old token functions
export const logout = () => {
  clearTokens();
  window.location.href = "/login";
};

export const getTokenExpiration = (): number | null => {
  const decoded = decodeToken();
  return decoded?.exp ?? null;
};

export const isTokenExpired = (): boolean => {
  const exp = getTokenExpiration();
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return exp < now;
};

//TODO we want to 1. move to cookies. 2. add refresh token. 3. decode JWT claims.
