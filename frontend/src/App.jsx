/*
== layouts/main.hbs
layout + routing 

Header
↓
Which page should render?
↓
Footer

*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Complete from "./pages/Complete";
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/Donations";
import AdminPrograms from "./pages/admin/Programs";
import ProgramRegistrations from "./pages/admin/ProgramRegistrations";

import "./styles/App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/complete" element={<Complete />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route
          path="/admin/programs/:id/registrations"
          element={<ProgramRegistrations />}
        />
      </Routes>
    </BrowserRouter>
  );
}
