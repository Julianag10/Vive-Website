import { BrowserRouter, Routes, Route } from "react-router-dom"; // No page reloads

import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";

// Public pages
import Home from "./pages/HomePage";
import Donate from "./pages/Donate";
import Complete from "./pages/Complete";
import Programs from "./pages/ProgramsPage";
import LearnMorePage from "./pages/LearnMorePage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import VolunteerPage from "./pages/VolunteerPage";


// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminPrograms from "./pages/admin/AdminProgramsPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminRegistrationsPage from "./pages/admin/AdminRegistrationsPage";
import AdminAboutPage from "./pages/admin/AdminAboutPage";

import "./styles/App.css";
import AdminProgramsPage from "./pages/admin/AdminProgramsPage";

export default function App() {
  return (
    // BROWSER ROUTER = REACT ROUTER
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
          <Route path="/programs/:id" element={<LearnMorePage/>} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
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
          <Route path="/admin/programs" element={<AdminProgramsPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/about" element={<AdminAboutPage />} />
          <Route
            path="/admin/registrations/:type/:id"
            element={<AdminRegistrationsPage />}
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
4. If the URL matches a public path, it renders PublicLayout component first.
5. Inside PublicLayout, <Outlet /> is where the matched page component is injected.
6. If the URL matches an admin path, it renders AdminGuard → AdminLayout first, then injects the admin page into AdminLayout’s <Outlet />

*/
