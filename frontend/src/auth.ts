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

export const isauthenticated = () => {
  return !!getToken();
}

//TODO we want to 1. move to cookies. 2. add refresh token. 3. decode JWT claims.
