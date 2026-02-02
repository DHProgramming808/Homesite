import '../styles/TermsPrivacy.css'

export default function Terms() {
  return (
    <main
      className="container legalPage"
      style={{ paddingTop: "120px", paddingBottom: "96px" }}
    >
      <h1 className="legalHeader">Terms of Service</h1>

      <p className="subhead legalHeader" style={{ marginTop: "12px", margin: "0 auto", maxWidth: "70ch" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginTop: "32px" }}>
        <h2 className="h2 legalHeader">Acceptance of Terms</h2>
        <p className="subhead legalContent">
          By accessing or using this website, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not
          use the site.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Purpose of the Website</h2>
        <p className="subhead legalContent">
          This website is a personal portfolio and project showcase. It is
          provided for informational and demonstration purposes only.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">User Accounts</h2>
        <p className="subhead legalContent">
          If you create an account, you are responsible for maintaining the
          confidentiality of your account credentials and for all activity
          that occurs under your account.
        </p>
        <p className="subhead legalContent">
          Accounts may be suspended or removed at any time for misuse, abuse,
          or violation of these terms.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Acceptable Use</h2>
        <p className="subhead legalContent">
          You agree not to misuse the website or attempt to disrupt its
          operation. This includes, but is not limited to:
        </p>
        <ul className="subhead legalContent">
          <li>Attempting to gain unauthorized access to systems or data</li>
          <li>Interfering with site functionality or security</li>
          <li>Using the site for unlawful purposes</li>
        </ul>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Intellectual Property</h2>
        <p className="subhead legalContent">
          All content on this site, including text, code samples, designs, and
          graphics, is the property of the site owner unless otherwise stated.
          You may not copy, reproduce, or redistribute content without
          permission.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Third-Party Links</h2>
        <p className="subhead legalContent">
          This website may contain links to third-party websites. These links
          are provided for convenience only, and no responsibility is assumed
          for the content or practices of those sites.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Disclaimer</h2>
        <p className="subhead legalContent">
          This website is provided “as is” without warranties of any kind,
          express or implied. No guarantees are made regarding availability,
          accuracy, or reliability.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Limitation of Liability</h2>
        <p className="subhead legalContent">
          To the fullest extent permitted by law, the site owner shall not be
          liable for any damages arising from the use or inability to use this
          website.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Changes to These Terms</h2>
        <p className="subhead legalContent">
          These Terms of Service may be updated from time to time. Continued
          use of the website after changes are made constitutes acceptance of
          the revised terms.
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2 className="h2 legalHeader">Contact</h2>
        <p className="subhead legalContent">
          If you have any questions about these Terms of Service, please contact
          me through the contact page.
        </p>
      </section>
    </main>
  );
}
