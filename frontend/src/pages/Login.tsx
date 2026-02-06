import { useState } from "react";
import { loginApi } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

export default function Login() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginApi(email, password);
      login(result.accessToken, result.refreshToken);
      navigate("/stub");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <main className="authPage">
      <div className="authCard">
        <h1 className="h2 authTitle">Login</h1>
        <p className="authSubhead">
          Welcome back. Sign in to access your profile features.
        </p>

        <form className="authForm" onSubmit={handleSubmit}>
          <label className="authField">
            <span className="authLabel">Email</span>
            <input
              className="authInput"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <label className="authField">
            <span className="authLabel">Password</span>
            <input
              className="authInput"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <div className="authActions">
            <button className="btn btnPrimary" type="submit">
              Login
            </button>
          </div>

          <p className="authFooterText">
            Need an account?{" "}
            <Link className="authLink" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
