import { Link, useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";

import '../styles/Navbar.css';

import { useAuth } from "../context/AuthContext";

type JwtPayload = {
  unique_name?: string;
  name?: string;
  email?: string;
};

export default function Navbar() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      const goingDown = y > lastY.current;
      setHidden(goingDown && y > 180);

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, {passive: true});

    return () => window.removeEventListener("scroll", onScroll);
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
    <header
      className={`navbar ${scrolled ? "navbarScrolled" : ""} ${hidden ? "navbarHidden" : ""}`}
    >
      <div className = "navInner">
        {/* LEFT - Logo and Home link */}
        <a href="#top" className="logo">
          Home
        </a>

        {/*FLEX SPACER*/}
        <div className = "navSpacer" />

        {/* RIGHT BIAS NAV */}
        <nav className="navLinks">
          <a href = "#projects">Projects</a>
          <a href = "#about">About Me</a>
          <a href = "#contact">Contact</a>
        </nav>

        {/* RIGHT - Auth Links */}
        {username ? (
        <>
          <span style={{ marginRight: "1rem" }}>
            Logged in as{" "}
            <button
              onClick={() => navigate("/stub")}
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                background: "gray",
                border: "none",
                padding: 0,
                textDecoration: "underline",
                color: "blue",
              }}
            >
              {username}
            </button>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      </div>
    </header>
  );
}
