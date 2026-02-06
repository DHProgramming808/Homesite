import '../styles/TermsPrivacy.css'

export default function Privacy() {
  return (
    <main className="container legalPage" style={{ paddingTop: "120px", paddingBottom: "96px" }}>
      <h1 className="h1">Privacy Policy</h1>

      <p className="subhead legalHeader" style={{ marginTop: "12px", margin: "0 auto", maxWidth: "70ch" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginTop: "32px" }}>
        <h2 className="h2 legalHeader">Overview</h2>
        <p className="subhead legalContent">
          This website is a personal portfolio and project showcase. Your privacy is
          important, and this page explains what information is collected and how it is used.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Information Collected</h2>
        <p className="subhead legalContent">
          Depending on how you interact with the site, the following information may be collected:
        </p>
        <ul className="subhead legalContent">
          <li>Basic contact information you voluntarily provide (such as name or email)</li>
          <li>Authentication information if you create an account</li>
          <li>Usage data such as pages visited or interactions, collected via analytics tools</li>
        </ul>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">How Information Is Used</h2>
        <p className="subhead legalContent">
          Collected information is used solely to:
        </p>
        <ul className="subhead legalContent">
          <li>Operate and improve the website</li>
          <li>Respond to inquiries or messages</li>
          <li>Support authentication and security features</li>
          <li>Understand how the site is used and improve user experience</li>
        </ul>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Cookies & Analytics</h2>
        <p className="subhead legalContent">
          This site may use cookies or similar technologies for authentication and analytics
          purposes. These are used to understand site usage and improve functionality.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Third-Party Services</h2>
        <p className="subhead legalContent">
          Third-party services (such as analytics providers or authentication services) may
          process limited data as required to provide their functionality. No personal data
          is sold or shared for marketing purposes.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Data Security</h2>
        <p className="subhead legalContent">
          Reasonable technical and organizational measures are taken to protect information.
          However, no method of transmission or storage is completely secure.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Contact</h2>
        <p className="subhead legalContent">
          If you have any questions about this Privacy Policy, you may contact me via the
          contact page or by email.
        </p>
      </section>
    </main>
  );
}
