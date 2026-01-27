import { useState } from "react";
import { login } from "../api";
import { setTokens }  from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const result = await login(username, password);
      setTokens(result.accessToken, result.refreshToken);
      navigate("/stub");

    } catch {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit = {handleSubmit}>
        <input
          placeholder = "Username"
          value = {username}
          onChange = {e => setUsername(e.target.value)}
        />
        <input
          type = "password"
          placeholder = "Password"
          value = {password}
          onChange = {e => setPassword(e.target.value)}
        />
        <button type = "submit">Login</button>
      </form>
    </div>
  );
}
