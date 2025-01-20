import { Routes, Route } from "react-router-dom";

import Superadmin from "./superadmin.routes";

import User from "./user.routes";
import Admin from "./admin.routes";
import Employee from "./Employee.routes";

const MainRoutes = () => {


  return (
    <Routes>
      <Route path="/superadmin/*" element={<Superadmin />} />
      <Route path="/user/*" element={<User />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/employee/*" element={<Employee />} />


    </Routes>
  );
};
export default MainRoutes;
