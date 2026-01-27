const TOKEN_KEY = "auth_token"

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired();
};

export interface DecodedToken {
  unique_name?: string;
  name?: string;
  exp?: number;
  iat?: number;
};

export const decodeToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;


  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

export const logout = () => {
  clearToken();
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
