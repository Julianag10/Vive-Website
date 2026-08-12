import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../styles/admin-layout.css";

// TODO MAKE ADMIN COMPONENTS DOLdeR??
// TODO why and amdmin lay out and admin home and aventually nav bar?
// TODO why layout? with grid?
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({
    contact: 0,
    volunteers: 0,
  });

  const adminLinks = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/programs", label: "Programs" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/donations", label: "Donations" },
    { to: "/admin/volunteers", label: "Volunteers" },
    { to: "/admin/contact", label: "Contact" },
    { to: "/admin/about", label: "Staff" },
  ];

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    async function loadNotificationCounts() {
      const [volunteersResponse, contactResponse] = await Promise.all([
        fetch("/admin/api/volunteers", { credentials: "include" }),
        fetch("/admin/api/contact", { credentials: "include" }),
      ]);

      const [volunteers, contact] = await Promise.all([
        volunteersResponse.ok ? volunteersResponse.json() : [],
        contactResponse.ok ? contactResponse.json() : [],
      ]);

      setNotificationCounts({
        contact: Array.isArray(contact) ? contact.length : 0,
        volunteers: Array.isArray(volunteers) ? volunteers.length : 0,
      });
    }

    loadNotificationCounts().catch(() => {
      setNotificationCounts({ contact: 0, volunteers: 0 });
    });
  }, [isLoginPage]);

  function getNotificationCount(link) {
    if (link.to === "/admin/volunteers") {
      return notificationCounts.volunteers;
    }

    if (link.to === "/admin/contact") {
      return notificationCounts.contact;
    }

    return 0;
  }

  async function handleLogout() {
    await fetch("/admin/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/admin/login");
  }

  return (
    <div className="admin-layout">
      {/* ADMIN HEADER */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link className="admin-title" to="/admin">
            ViVe Admin
          </Link>

          {/* ADMIN NAV */}
          {!isLoginPage && (
            <>
              <nav
                className={`admin-nav admin-nav-links${isMenuOpen ? " is-open" : ""}`}
                aria-label="Admin navigation"
                id="admin-primary-menu"
              >
                {adminLinks.map((link) => (
                  <NavLink
                    className="admin-nav-link"
                    end={link.end}
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    {getNotificationCount(link) > 0 && (
                      <span
                        aria-label={`${getNotificationCount(link)} submissions`}
                        className="admin-nav-notification"
                      >
                        {getNotificationCount(link)}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="admin-nav admin-nav-actions">
                <Link className="admin-public-link" to="/">
                  Public Site
                </Link>
                <button type="button" onClick={handleLogout}>Logout</button>
                <button
                  type="button"
                  className="admin-menu-toggle"
                  aria-controls="admin-primary-menu"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle admin navigation menu"
                  onClick={() => setIsMenuOpen((open) => !open)}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ADMIN PAGE CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
