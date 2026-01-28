import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getAccessToken, isTokenExpired, getRefreshToken, clearTokens, setTokens, isAuthenticated } from "../auth";
import { jwtDecode } from "jwt-decode";
import { loginApi, logoutApi } from "../api";


type JwtPayload = {
  unique_name?: string;
  name?: string;
  email?: string;
};

interface AuthContextType {
  username: string | null;
  accesstoken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshToken());


  useEffect(() => {
    if (!accessToken) {
      setUsername(null);
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      setUsername(decoded.name || decoded.unique_name || null);
    } catch {
      setUsername(null);
    }
  }, [accessToken]);

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
  };

  const isAuth = () => {
    const token = getAccessToken();
    return token !== null && isAuthenticated();
  }

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

  return (
    <AuthContext.Provider value={{ username, accesstoken: accessToken, refreshToken, login, logout: logout, isAuth }}>
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
