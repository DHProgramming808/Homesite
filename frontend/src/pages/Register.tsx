import { register } from "../api";
import { useNavigate} from "react-router-dom";
import { useState } from "react";


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
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  );
}



