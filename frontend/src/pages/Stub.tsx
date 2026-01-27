import { useEffect, useState } from "react";
import { getProtectedStub } from "../api";

export default function Stub() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProtectedStub()
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Protected Stub Page</h2>
      <p>{message}</p>
    </div>
  );
}
