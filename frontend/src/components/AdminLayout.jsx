import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-layout.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/admin/auth/logout", {
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
          <h2 className="admin-title">ViVe Admin</h2>

          <nav className="admin-nav">
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/donations">Donations</Link>
            <Link to="/admin/programs">Programs</Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      {/* ADMIN PAGE CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
