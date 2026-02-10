import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getAccessToken, isTokenExpired, getRefreshToken, clearTokens, setTokens, isAuthenticated } from "../auth";
import { jwtDecode } from "jwt-decode";
import { loginApi, logoutApi, refreshAccessToken } from "../api";


type JwtPayload = {
  unique_name?: string;
  name?: string;
  email?: string;
  exp?: number;
  role?: string;
};

interface AuthContextType {
  username: string | null;
  accesstoken: string | null;
  refreshToken: string | null;
  role: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): any {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshToken());
  const [role, setRole] = useState<string | null>(null);


  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setUsername(null);
      setRole(null);
      return;
    }
    try {
      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error("Failed to decode token");

      const username =
        decoded.name ??
        decoded.unique_name;

      setUsername(username ?? null);
      setRole(decoded.role ?? "user");

      console.log("Decoded name:", decoded); // Debug log
      console.log(accessToken);

      const exp = decoded.exp ? decoded.exp * 1000 : 0;
      const timeout = exp - Date.now() - 60000; // Refresh 1 minute before expiry

      if (timeout <=0) {
        logout();
        return;
      }

      const timer = setTimeout(async () => {
        const data = await refreshAccessToken();
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setTokens(data.accessToken, data.refreshToken);
      }, timeout);

      return () => clearTimeout(timer);
    } catch (error) {
      setUsername(null);
      setRole(null);
      logout();
      console.error(error);
    }
  }, [accessToken, refreshToken]);

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setTokens(newAccessToken, newRefreshToken);
  };

  const logout = () => {
    logoutApi();
    clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setRole(null);
  };

  const isAuth = () => {
    const token = getAccessToken();
    return token !== null && isAuthenticated();
  }

  // TODO remove duplicate
  /*
  useEffect(() => {
      const handleStorageChange = () => {
        const token = getAccessToken();
        if (!token) {
          setUsername(null);
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          setUsername(decoded.name || decoded.unique_name || null);
        } catch {
          setUsername(null);
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);
    */

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== "accessToken" && event.key !== "refreshToken") {
        setUsername(null);
        return;
      }

      const newAccessToken = getAccessToken();
      const newRefreshToken = getRefreshToken();

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ username, role, accesstoken: accessToken, refreshToken, login, logout: logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
