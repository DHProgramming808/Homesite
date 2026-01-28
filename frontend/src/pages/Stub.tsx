import { useEffect, useState } from "react";
import { getProtectedStub } from "../api";
import { decodeToken } from "../auth";
import { isTokenExpired } from "../auth"
import { logoutApi } from "../api";
import type { DecodedToken } from "../auth";

export default function Stub() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logoutApi();
        return;
      }
    })

    setUser(decodeToken());

    getProtectedStub()
      .then(data => setMessage(data.message))
      .catch(() => logoutApi()); // TODO set 3 second message for "Unauthorized" or "Timeout" then run logout function

    return () => clearInterval(interval)
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
