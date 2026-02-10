import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { getProtectedStub, logoutApi } from "../api";
import { decodeToken, isTokenExpired, clearTokens } from "../auth";
import type { DecodedToken } from "../auth";
import { useAuth } from "../context/AuthContext";

import "../styles/Stub.css";

export default function Stub() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // even if API fails, clear local tokens
      console.warn("logoutApi failed, clearing tokens anyway", e);
    } finally {
      await logout();
      navigate("/");
    }
  };

  useEffect(() => {
    let loggingOut = false;

    const interval = window.setInterval(() => {
      if (loggingOut) return;
      if (isTokenExpired()) {
        loggingOut = true;
        handleLogout();
      }
    }, 1500);

    setUser(decodeToken());

    getProtectedStub()
      .then((data) => setMessage(data.message))
      .catch(() => handleLogout());

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="stubPage">
      <div className="stubCard">
        <div className="stubHeader">
          <div>
            <h1 className="h2 stubTitle">Profile</h1>
            <p className="subhead">Authenticated area (stub page for now).</p>
          </div>

          <button className="btn btnPrimary" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {user ? (
          <div className="stubSection">
            <h3 className="stubSectionTitle">User Info</h3>

            <div className="stubRow">
              <span className="stubLabel">Username</span>
              <span className="stubValue">{user.unique_name || user.name || "Unknown"}</span>
            </div>

            <div className="stubRow">
              <span className="stubLabel">Token expires</span>
              <span className="stubValue">
                {user.exp ? new Date(user.exp * 1000).toLocaleString() : "Unknown"}
              </span>
            </div>
          </div>
        ) : (
          <div className="stubSection">
            <p className="subhead">Loading user…</p>
          </div>
        )}

        <div className="stubSection">
          <h3 className="stubSectionTitle">API Message</h3>
          <p className="subhead">{message || "…"}</p>
        </div>

        <div className="stubFooter">
          <Link className="btn" to="/projects">
            Browse Projects
          </Link>
          <Link className="btn" to="/aboutme">
            About Me
          </Link>
        </div>
      </div>
    </main>
  );
}
