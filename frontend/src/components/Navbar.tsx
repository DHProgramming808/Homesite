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
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  const NAV_LINKS = [
    { name: "Projects", path: "/projects" },
    { name: "About Me", path: "/aboutme" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearTokens();
      navigate("/");
    }
  };

  return (
    <header
      className={`navbar ${scrolled ? "navbarScrolled" : ""}`}
    >
      <div className = "navInner">
        {/* LEFT - Logo and Home link */}
        <Link to="/" className="navHome">
          D Y H
        </Link>

        {/*FLEX SPACER*/}
        <div className = "navSpacer" />

        {/* RIGHT BIAS NAV */}
        <nav className="navLinks">
        {NAV_LINKS.map(link => (
          <Link key={link.path} to={link.path}>
            {link.name}
          </Link>
        ))}
        </nav>

        <div className="navMenuWrapper">
          <button
              className = "navMenuButton"
              onClick = {() => setMenuOpen(prev => !prev)}
              type = "button"
              aria-label = "Open menu"
              aria-expanded = {menuOpen}
          >
            <span className="menuIcon">☰</span>
          </button>
          {menuOpen && (
            <div className="navMobilePanel" role="menu">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>


        {/* RIGHT - Auth Links */}
        {username ? (
        <>
          <span style={{ marginRight: "1rem" }}>
            Logged in as{" "}
            <button
              onClick={() => navigate("/stub")}
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
