import "../styles/ContactMe.css";

import { Link } from "react-router-dom";

export default function AboutMe() {

  return (
    <main className="container">
      {/* Header */}
      <header className="aboutHeader">
        <h1 className="h1">About Me</h1>
        <p className="subhead" style={{ marginTop: "12px" }}>
          It's good to meet you! I'm Daniel
        </p>
        </header>
    </main>
  );
}
