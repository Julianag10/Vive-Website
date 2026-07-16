import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../styles/admin-layout.css";

// TODO MAKE ADMIN COMPONENTS DOLdeR??
// TODO why and amdmin lay out and admin home and aventually nav bar?
// TODO why layout? with grid?
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  const adminLinks = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/programs", label: "Programs" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/donations", label: "Donations" },
    { to: "/admin/about", label: "About" },
  ];

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
            <nav className="admin-nav" aria-label="Admin navigation">
              {adminLinks.map((link) => (
                <NavLink
                  className={({ isActive }) =>
                    `admin-nav-link${isActive ? " is-active" : ""}`
                  }
                  end={link.end}
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link className="admin-public-link" to="/">
                Public Site
              </Link>
              <button type="button" onClick={handleLogout}>Logout</button>
            </nav>
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
