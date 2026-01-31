import { Link } from "react-router-dom";
import "../styles/Footer.css";

type Social = {
  label: string;
  href: string;
  icon: string; // URL or path to the icon image
};


const SOCIALS: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/daniel-y-hong/", icon: "/icons/linkedin.svg" },
  { label: "GitHub", href: "https://github.com/DHProgramming808/", icon: "/icons/github.svg" },
  { label: "Instagram", href: "https://instagram.com/YOUR_HANDLE", icon: "/icons/instagram.svg" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
      <footer className="footer">
        <div className="footerInner container">
          <div className="footerBrand">
            <Link to="/" className="footerLogo" aria-label="Home">
              <img
                src="/Homesite_icon_temp.png"
                alt="YourName logo"
                className="footerLogoImage"
              />
            </Link>
            <p className="footerTagline">
              {/* is this too tongue in cheek? */}
              I know what I'm doing... mostly
            </p>
          </div>

          <div className="footerRow">
            {/* Social Buttons */}
            <div className="footerSocials" aria-label="Social Links">
              {SOCIALS.map((social) => (
                <a
                  className="footerSocialPill"
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="footerSocialLabel">{social.label}</span>
                </a>
              ))}
            </div>

            {/* Contact */}
            {/* Add PO box and diverted cell phone */}
            <div className="footerContact">
              <div className="footerContactRow">
                <div className="footerContactActions">
                  <Link className="footerLink" to="/contact">
                    Contact Me
                  </Link>
                  <span className="footerDot">•</span>
                  <a className="footerLink" href="mailto:Daniel.Youngmin.Hong@gmail.com">
                    Daniel.Youngmin.Hong@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* Bottom */}
          <div className="footerBottom">
            <span>© {year} DHProgramming808. All rights reserved.</span>
            <span className="footerBottomSpacer" />
            <Link className="footerLinkMuted" to="/privacy">
              Privacy
            </Link>
            <span className="footerDot">•</span>
            <Link className="footerLinkMuted" to="/terms">
              Terms
            </Link>
          </div>

        </div>
      </footer>
  );
}
