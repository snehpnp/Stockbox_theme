import { Routes, Route } from "react-router-dom";

import Superadmin from "./superadmin.routes";

import User from "./user.routes";
import Admin from "./admin.routes";
import Employee from "./Employee.routes";
import PrivateRoute from "./PrivateRoute.routes";

const MainRoutes = () => {


  return (
    <Routes>

      <Route element={<PrivateRoute allowedRoles={["SUPERADMIN"]} />}>
        <Route path="/superadmin/*" element={<Superadmin />} />
      </Route>

      <Route path="/user/*" element={<User />} />

      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/*" element={<Admin />} />
      </Route>


      <Route element={<PrivateRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route path="/employee/*" element={<Employee />} />
      </Route>

    </Routes>
  );
};
export default MainRoutes;
