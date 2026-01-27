import { useEffect, useState } from "react";
import { getProtectedStub } from "../api";
import { decodeToken } from "../auth";
import type { DecodedToken } from "../auth";

export default function Stub() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    setUser(decodeToken());

    getProtectedStub()
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Protected Stub Page</h2>

      {user && (
        <div style = {{ marginBottom: "1rem"}}>
          <h3>User Info</h3>
          <p>
            <strong>Username:</strong>{" "}
            {user.unique_name || user.name || "Unknown"}
          </p>
          <p>
            {user.exp
              ? new Date(user.exp * 1000).toLocaleString()
             : "Unknown"}
          </p>
          </div>
      )}

      <p>{message}</p>
    </div>
  );
}
