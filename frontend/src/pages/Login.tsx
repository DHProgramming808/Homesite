import { useState } from "react";
import { loginApi } from "../api";
import { setToken, setTokens }  from "../auth";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const result = await loginApi(email, password);
      //setToken(result.accessToken);
      var accessToken = result.accessToken;
      var refreshToken = result.refreshToken;

      console.log(accessToken);
      console.log(refreshToken);
      console.log(result);

      setTokens(accessToken, refreshToken);
      navigate("/stub");

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit = {handleSubmit}>
        <input
          placeholder = "Email"
          value = {email}
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
