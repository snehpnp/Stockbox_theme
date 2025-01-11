import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/DashbaordMain";

import Theme from "../Layout/Superadmin/Themes/Theme";
import AddTheme from "../Layout/Superadmin/Themes/AddTheme";
import Edittheme from "../Layout/Superadmin/Themes/EditTheme";
import Company from "../Layout/Superadmin/Company/Company";

export default function App() {
  return (
    <Routes>
      <Route path="/themes" element={<Theme />} />
      <Route path="/add-theme" element={<AddTheme />} />
      <Route path="/edit-theme/:id" element={<Edittheme />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/company" element={<Company />} />
    </Routes>
  );
}
