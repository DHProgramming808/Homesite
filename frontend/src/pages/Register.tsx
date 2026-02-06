import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import "../styles/Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(email, username, password);
      navigate("/login");
      console.log("Registration successful");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <main className="authPage">
      <div className="authCard">
        <h1 className="h2 authTitle">Register</h1>
        <p className="authSubhead">
          Create an account to access profile features. (You can always delete it later.)
        </p>

        <form className="authForm" onSubmit={submit}>
          <label className="authField">
            <span className="authLabel">Email</span>
            <input
              className="authInput"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <label className="authField">
            <span className="authLabel">Username</span>
            <input
              className="authInput"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              autoComplete="new-password"
            />
          </label>

          <div className="authActions">
            <button className="btn btnPrimary" type="submit">
              Register
            </button>
          </div>

          <p className="authFooterText">
            Already have an account?{" "}
            <Link className="authLink" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
