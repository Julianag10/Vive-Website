// OUTLET ->  used for rendering the matched child route inside a layout
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  ContactInfoList,
  SocialLinks,
} from "./PublicContactSections";
import "../styles/contact.css";

const VIVE_LOGO = "/uploads/logo/Vive-logo.png";

// TODO why layout? with grid?
export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/programs", label: "Programs" },
    { to: "/events", label: "Events" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="nav">
          <div className="nav-brand">
            <Link to="/" className="brand-logo-link" aria-label="ViVe Wellness home">
              <img className="brand-logo brand-logo-main" src={VIVE_LOGO} alt="ViVe Wellness" />
            </Link>
          </div>

          <nav
            className={`nav-links${isMenuOpen ? " is-open" : ""}`}
            aria-label="Primary"
            id="public-primary-menu"
          >
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link to="/donate" className="nav-donate-button">Donate</Link>
            <Link to="/volunteer" className="nav-volunteer-button">Volunteer</Link>
            <button
              type="button"
              className="nav-menu-toggle"
              aria-controls="public-primary-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
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
              <img className="brand-logo brand-logo-sub" src={VIVE_LOGO} alt="ViVe Wellness" />
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
