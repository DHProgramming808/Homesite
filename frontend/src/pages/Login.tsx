import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

export default function Login() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from || "/stub";

  // 🔒 Disable submit entirely
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    return;
  };

  return (
    <main className="authPage">
      <div className="authCard">
        <h1 className="h2 authTitle">Login</h1>

        {/* 🔒 Disabled notice */}
        <p className="authSubhead" style={{ marginBottom: "1rem" }}>
          Authentication services are temporarily paused to reduce hosting costs.
          <br />
          If you'd like a live demo, please reach out and I’ll spin everything up.
        </p>

        <form className="authForm" onSubmit={handleSubmit}>
          <label className="authField">
            <span className="authLabel">Email</span>
            <input
              className="authInput"
              placeholder="you@email.com"
              value={email}
              disabled
              readOnly
            />
          </label>

          <label className="authField">
            <span className="authLabel">Password</span>
            <input
              className="authInput"
              type="password"
              placeholder="••••••••"
              value={password}
              disabled
              readOnly
            />
          </label>

          <div className="authActions">
            <button
              className="btn btnPrimary"
              type="submit"
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              Login (Temporarily Disabled)
            </button>
          </div>

          <p className="authFooterText">
            Interested in seeing it live?{" "}
            <Link className="authLink" to="/contact">
              Request a Demo
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
