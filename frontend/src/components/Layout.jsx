// OUTLET ->  used for rendering the matched child route inside a layout
import { Outlet, Link } from "react-router-dom";
import "../styles/layout.css";

// TODO why layout? with grid?
export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="nav">
          <div className="nav-brand">
            <Link to="/" className="brand-title">
              ViVe Wellness
            </Link>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/about">About Us</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/donate">Donate</Link>
          </nav>
        </div>
      </header>

      <main className="public-content">
        <Outlet />
      </main>

      <footer className="public-footer">
        <p>© ViVe Wellness</p>
      </footer>
    </div>
  );
}
