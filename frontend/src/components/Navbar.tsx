import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { username } = useAuth();

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

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbarScrolled" : ""}`}>
      <div className="navInner">
        {/* LEFT */}
        <Link to="/" className="navHome">
          D Y H
        </Link>

        <div className="navSpacer" />

        {/* Desktop nav */}
        <nav className="navLinks">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <div className="navMenuWrapper">
          <button
            className="navMenuButton"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="menuIcon">☰</span>
          </button>

          {menuOpen && (
            <div className="navMobilePanel" role="menu">
              {NAV_LINKS.map((link) => (
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

        {/* RIGHT auth area */}
        {username ? (
          <button
            type="button"
            className="navUser"
            onClick={() => navigate("/stub")}
            aria-label="Open profile"
          >
            {username}
          </button>
        ) : (
          <Link className="btn btnPrimary navLogin" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
