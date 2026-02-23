import { Link } from "react-router-dom";
import "../styles/Stub.css";

export default function Stub() {
  return (
    <main className="stubPage">
      <div className="stubCard">
        <div className="stubHeader">
          <div>
            <h1 className="h2 stubTitle">Login</h1>
            <p className="subhead">
              Auth + backend services are currently paused to save on server costs.
              If you’d like a live demo, reach out and I’ll spin it up.
            </p>
          </div>
        </div>

        {/* Non-interactive “login” form */}
        <div className="stubSection">
          <h3 className="stubSectionTitle">Sign in</h3>

          {/* This wrapper makes EVERYTHING inside non-clickable/non-focusable */}
          <div
            aria-disabled="true"
            style={{
              pointerEvents: "none",
              opacity: 0.6,
              filter: "grayscale(0.2)",
            }}
          >
            <div className="stubRow" style={{ alignItems: "center" }}>
              <span className="stubLabel">Email</span>
              <input
                style={{ width: "100%" }}
                value=""
                placeholder="email@example.com"
                disabled
                readOnly
                tabIndex={-1}
              />
            </div>

            <div className="stubRow" style={{ alignItems: "center" }}>
              <span className="stubLabel">Password</span>
              <input
                style={{ width: "100%" }}
                value=""
                placeholder="••••••••"
                type="password"
                disabled
                readOnly
                tabIndex={-1}
              />
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btnPrimary" type="button" disabled tabIndex={-1}>
                Login (Temporarily Disabled)
              </button>
            </div>
          </div>

          {/* This button stays clickable */}
          <div style={{ marginTop: 14 }}>
            <Link className="btn" to="/contact">
              Request a live demo
            </Link>
          </div>
        </div>

        <div className="stubFooter">
          <Link className="btn" to="/projects">
            Browse Projects
          </Link>
          <Link className="btn" to="/aboutme">
            About Me
          </Link>
          <Link className="btn" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
