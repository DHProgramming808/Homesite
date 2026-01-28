import { Link, useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

type JwtPayload = {
  unique_name?: string;
  name?: string;
  email?: string;
};

export default function Navbar() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  useEffect(() => {
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

  }, []);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearTokens();
      navigate("/login");
    }
  };

  return (
    <nav style={{padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem"}}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>

      {username ? (
        <>
          <span style={{ marginRight: "1rem" }}>
            Logged in as <strong>{username}</strong>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
