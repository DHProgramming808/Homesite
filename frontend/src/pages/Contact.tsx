import { useMemo, useState } from "react";
import '../styles/ContactMe.css';
import { Link } from "react-router-dom";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Mailto fallback (works even without a backend)
  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio contact from ${name || "someone"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );
    // TODO: replace with your real email
    return `mailto:daniel.youngmin.hong@gmail.com?subject=${subject}&body=${body}`;
  }, [name, email, message]);


  return (
    <main className="container legalPage">
      <header className="legalHeader">
        <h1 className="h1">Contact Me</h1>
        <p className="subhead" style={{ marginTop: "12px" }}>
          Want to chat about a role, a project, or collaboration? Send a message.
        </p>

        <div className="aboutHeaderCtas">
          <Link className="btn btnPrimary" to="/technicalme">
            My Skills
          </Link>
          <Link className="btn" to="/contact">
            Contact
          </Link>
        </div>
      </header>

      <div className="contactGrid">
        {/* Left: Contact info / quick links */}
        <aside className="contactCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Reach me</h2>

          <div className="contactList">
            <div className="contactRow">
              <span className="contactLabel">Email</span>
              <a className="contactValue" href="mailto:daniel.youngmin.hong@gmail.com">Daniel.Youngmin.Hong@gmail.com</a>
            </div>

            <div className="contactRow">
              <span className="contactLabel">Phone</span>
              {/* TODO: determin if I want to open up my personal cell to the website */}
              <a className="contactValue" href="tel:+15034739866">+1 (503) 473-9866</a>
            </div>

            <div className="contactRow">
              <span className="contactLabel">Location</span>
              <span className="contactValue">NY/NJ (Remote-friendly)</span>
            </div>

            <div className="contactRow">
              <span className="contactLabel">Availability</span>
              <span className="contactValue">Open to opportunities</span>
            </div>
          </div>

          <div className="contactDivider" />

          <div className="contactPills" aria-label="Social links" style={{ alignItems: "center" }}>
            {/* TODO: replace handles */}
            <a className="footerPill" href="https://www.linkedin.com/in/daniel-y-hong/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="footerPill" href="https://github.com/DHProgramming808/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="footerPill" href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </aside>

        {/* Right: Form */}
        <section className="contactCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Send a message</h2>

          <form
            className="contactForm"
            onSubmit={(e) => {
              e.preventDefault();
              // Until backend exists, use mailto fallback.
              window.location.href = mailtoHref;
            }}
          >
            <label className="field">
              <span className="fieldLabel">Name</span>
              <input
                className="fieldInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>

            <label className="field">
              <span className="fieldLabel">Email</span>
              <input
                className="fieldInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                inputMode="email"
              />
            </label>

            <label className="field">
              <span className="fieldLabel">Message</span>
              <textarea
                className="fieldTextarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What’s on your mind?"
                rows={6}
              />
            </label>

            <div className="contactActions">
              <button className="btn btnPrimary" type="submit">
                Send
              </button>

              <a className="btn" href={mailtoHref}>
                Open in email
              </a>
            </div>

            {/* This form currently opens your default email app. Later we can wire it to your backend API.Hint about mailto fallback */}
            <p className="contactHint">

            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
