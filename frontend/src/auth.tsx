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
  return !!getToken();
}

export interface DecodedToken {
  unique_name?: string;
  name?: string;
  exp?: number;
  iat?: number;
}

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



//TODO we want to 1. move to cookies. 2. add refresh token. 3. decode JWT claims.
