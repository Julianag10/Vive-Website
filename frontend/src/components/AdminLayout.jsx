// place fo radmi nUI

import { Link, useNavigate } from "react-router-dom";

// <AdminLayout>  { children }   </AdminLayout>
export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/admin/auth/logout", {
      method: "POST",

      // required so the backend knows which session to destroy
      credentials: "include",
    });

    navigate("/admin/login");
  }

  return (
    <div>
      {/* ADMIN HEADER */}
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h2>ViVe Admin</h2>

        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/donations">Donations</Link>
          <Link to="/admin/programs">Programs</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* ADMIN PAGE CONTENT */}
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
}
