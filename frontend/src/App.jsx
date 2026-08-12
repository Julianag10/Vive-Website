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
import VolunteerApplicationPage from "./pages/VolunteerApplicationPage";
import ContactPage from "./pages/ContactPage";


// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminRegistrationsPage from "./pages/admin/AdminRegistrationsPage";
import AdminAboutPage from "./pages/admin/AdminAboutPage";
import AdminVolunteersPage from "./pages/admin/AdminVolunteersPage";
import AdminContactPage from "./pages/admin/AdminContactPage";
import AdminProgramsPage from "./pages/admin/AdminProgramsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/volunteer/application/:token" element={<VolunteerApplicationPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
          <Route path="/admin/contact" element={<AdminContactPage />} />
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
