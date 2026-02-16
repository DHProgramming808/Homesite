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
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  isAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO make these claims decoder more robust and flexible to different claim types and naming conventions
const CLAIM_NAME =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const CLAIM_EMAIL =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const CLAIM_SUB =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const CLAIM_ROLE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

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
  const [email, setEmail] = useState<string | null>(null);


  useEffect(() => {
    if (!accessToken || !refreshToken || !isAuthenticated()) {
      setUsername(null);
      setRole(null);
      return;
    }
    try {
      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error("Failed to decode token");

      const username =
        decoded[CLAIM_NAME] ??
        decoded[CLAIM_EMAIL];

      setUsername(username ?? null);
      setRole(decoded[CLAIM_ROLE] ?? "user");
      setEmail(decoded[CLAIM_EMAIL] ?? null);

      // Debug log
      console.log("Decoded name:", username);
      console.log(accessToken);

      const exp = decoded.exp ? decoded.exp * 1000 : 0;
      const timeout = exp - Date.now() - 60000; // Refresh 1 minute before expiry

      if (timeout <=0) {
        logout();
        return;
      }

      const timer = setTimeout(async () => {
        if (!getRefreshToken()) return;
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

  //reconfigure to be used instead of the logout function in auth.tsx, to ensure context is properly cleared on logout
  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearTokens();
      setAccessToken(null);
      setRefreshToken(null);
      setUsername(null);
      setRole(null);
    }

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
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "accessToken" && e.key !== "refreshToken") return;

      setAccessToken(getAccessToken());
      setRefreshToken(getRefreshToken());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ username, role, accessToken: accessToken, refreshToken, login, logout: logout, isAuth }}>
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
