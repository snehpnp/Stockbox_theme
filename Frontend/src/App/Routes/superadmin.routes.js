import { Routes, Route } from "react-router-dom";

import Dashboard from "../Layout/Superadmin/Dashboard/Dashboard";

import Theme from "../Layout/Superadmin/Themes/Theme";
import AddTheme from "../Layout/Superadmin/Themes/AddTheme";
import Edittheme from "../Layout/Superadmin/Themes/EditTheme";
import Company from "../Layout/Superadmin/Company/Company";
import Update from "../Layout/Superadmin/Company/Update";
import Addcompany from "../Layout/Superadmin/Company/Addcompany";
import Companydetail from "../Layout/Superadmin/Company/Companydetail";

const SuperadminRouting = () => {

  return (
    <Routes>
      <Route path="/themes" element={<Theme />} />
      <Route path="/add-theme" element={<AddTheme />} />
      <Route path="/edit-theme/:id" element={<Edittheme />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/company" element={<Company />} />
      <Route path="/companyupdate" element={<Update />} />
      <Route path="/addcompany" element={<Addcompany />} />
      <Route path="/companydetail/:id" element={<Companydetail />} />

    </Routes>
  );
}
export default SuperadminRouting;
