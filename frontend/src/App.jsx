/*
== layouts/main.hbs
layout + routing 

Header
↓
Which page should render?
↓
Footer

*/
import { BrowserRouter, Routes, Route } from "react-router-dom"; // No page reloads

import AdminGuard from "./components/AdminGuard";

// Public pages
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Complete from "./pages/Complete";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/Donations";
import AdminPrograms from "./pages/admin/Programs";
import ProgramRegistrations from "./pages/admin/ProgramRegistrations";

import "./styles/App.css";

import AdminLayout from "./components/AdminLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ---------- PROTECTED ADMIN ROUTES ---------- */}
        <Route
          path="/admin"
          element={
            // a component tree react needs to render:
            <AdminGuard>
              <AdminLayout>
                <AdminHome />
              </AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/donations"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminDonations />
              </AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/programs"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminPrograms />
              </AdminLayout>
            </AdminGuard>
          }
        />

        <Route
          path="/admin/programs/:id/registrations"
          element={
            <AdminGuard>
              <AdminLayout>
                <ProgramRegistrations />
              </AdminLayout>
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
