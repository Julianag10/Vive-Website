// OUTLET ->  used for rendering the matched child route inside a layout
import { Outlet, Link } from "react-router-dom";
import {
  ContactInfoList,
  SocialLinks,
} from "./PublicContactSections";
import "../styles/App.css";
import "../styles/contact.css";

const MAIN_LOGO = "/uploads/logo/main_logo.png";
const SUB_LOGO = "/uploads/logo/sub_logo.png";

// TODO why layout? with grid?
export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="nav">
          <div className="nav-brand">
            <Link to="/" className="brand-logo-link" aria-label="ViVe Wellness home">
              <img className="brand-logo brand-logo-main" src={MAIN_LOGO} alt="ViVe Wellness" />
            </Link>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/about">About Us</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/events"> Events</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/donate" className="nav-donate-button">Donate</Link>
          </nav>
        </div>
      </header>

      <main className="public-content">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-inner">
          <div className="public-footer-contact">
            <ContactInfoList />
          </div>

          <div className="public-footer-center">
            <Link to="/" className="brand-logo-link" aria-label="ViVe Wellness home">
              <img className="brand-logo brand-logo-sub" src={SUB_LOGO} alt="ViVe Wellness" />
            </Link>
            <Link to="/donate" className="footer-donate-button">
              Donate
            </Link>
          </div>

          <div className="public-footer-social">
            <SocialLinks />
          </div>

          <p className="public-footer-copy">
            © 2022 by Vive Wellness. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
