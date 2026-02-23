<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { getProtectedStub, logoutApi } from "../api";
import { decodeToken, isTokenExpired, clearTokens } from "../auth";
import type { DecodedToken } from "../auth";
=======
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
>>>>>>> Stashed changes
=======
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
>>>>>>> Stashed changes

import "../styles/Stub.css";

export default function Stub() {
  // purely cosmetic: lets the inputs look like a login form
  const [email] = useState("");
  const [password] = useState("");

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // even if API fails, clear local tokens
      console.warn("logoutApi failed, clearing tokens anyway", e);
    } finally {
      clearTokens();
      navigate("/");
    }
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (isTokenExpired()) {
        handleLogout();
      }
    }, 1500);

    setUser(decodeToken());

    getProtectedStub()
      .then((data) => setMessage(data.message))
      .catch(() => handleLogout());

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
  const statusText = useMemo(() => {
    return "Auth + backend services are currently paused to save on server costs.";
>>>>>>> Stashed changes
=======
  const statusText = useMemo(() => {
    return "Auth + backend services are currently paused to save on server costs.";
>>>>>>> Stashed changes
  }, []);

  return (
    <main className="stubPage">
      <div className="stubCard">
        <div className="stubHeader">
          <div>
            <h1 className="h2 stubTitle">Login</h1>
            <p className="subhead">
              {statusText} If you’d like a live demo, reach out and I’ll spin it up.
            </p>
          </div>
        </div>

        {/* Disabled “login” form */}
        <div className="stubSection">
          <h3 className="stubSectionTitle">Sign in</h3>

          <div className="stubRow" style={{ alignItems: "center" }}>
            <span className="stubLabel">Email</span>
            <input
              className="stubValue"
              style={{ width: "100%" }}
              value={email}
              placeholder="email@example.com"
              disabled
              readOnly
            />
          </div>

          <div className="stubRow" style={{ alignItems: "center" }}>
            <span className="stubLabel">Password</span>
            <input
              className="stubValue"
              style={{ width: "100%" }}
              value={password}
              placeholder="••••••••"
              type="password"
              disabled
              readOnly
            />
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" type="button" disabled>
              Login (Temporarily Disabled)
            </button>

            <Link className="btn" to="/contact">
              Request a live demo
            </Link>
          </div>

          <p className="subhead" style={{ marginTop: 10 }}>
            Note: this site is still fully viewable — projects and pages are available without login.
          </p>
        </div>

        <div className="stubFooter">
          <Link className="btn" to="/projects">
            Browse Projects
          </Link>
          <Link className="btn" to="/aboutme">
            About Me
          </Link>
          <Link className="btn" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
