/*
layouts + routing 

Header
↓
Which page should render?
        ==
defines routes (what component shows at each URL)
↓
Footer
*/

import { BrowserRouter, Routes, Route } from "react-router-dom"; // No page reloads

import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import Layout from "./components/Layout";

// Public pages
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Complete from "./pages/Complete";
import Programs from "./pages/Programs";
import ProgramRegister from "./pages/ProgramRegister";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminPrograms from "./pages/admin/AdminPrograms";
import ProgramRegistrations from "./pages/admin/AdminProgramRegistrations";

import "./styles/App.css";

export default function App() {
  return (
    // BROWSER TOUER = REACT ROUTER
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC PAGE ROUTES (NAVIGATION REQ) ---------- */}
        <Route
          element={
            // react renders layout componet first
            // inside layout, OUTLET mached component is injected
            <Layout />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id/register" element={<ProgramRegister />} />
        </Route>

        {/* ----------ADMIN LOGIN PAGE NOT PROTECTED ----------*/}
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* ---------- PROTECTED ADMIN PAGE ROUTES (NAVIGATION) ---------- */}
        <Route
          element={
            // a component tree react needs to render:
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route
            path="/admin/programs/:id/registrations"
            element={<ProgramRegistrations />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/* 
TODO UNDERSTAND HOW ROUTING WORKS:
TODO ROUTING VS API CALLS FLOW
1. main.jsx mounts <app/> in to DOM
2. <App /> renders <BrowserRouter>(react) and <Routes>
3. React Router checks the current URL
4. If the URL matches a public path, it renders PublicLayout first.
5. Inside PublicLayout, <Outlet /> is where the matched page component is injected.
6. If the URL matches an admin path, it renders AdminGuard → AdminLayout first, then injects the admin page into AdminLayout’s <Outlet />

*/
