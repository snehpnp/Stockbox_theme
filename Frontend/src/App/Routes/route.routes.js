import { Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
import Settings from "../pages/Settings";
import Home from "../pages/Home";
import Dashboard from "../components/Dashboard/DashbaordMain";

import Classicform from "../components/Forms/ClassicForm";
import Glassform from "../components/Forms/Glassmorphism";

import Darktheme from "../components/Forms/Darktheme";
import Floating from "../components/Forms/Floating";
import Modern from "../components/Forms/Modern";

import BasicTable from "../components/Tabels/BasicTable";
import CardTable from "../components/Tabels/BasicTable";
import StripedTable from "../components/Tabels/StripedTable";
import BorderTable from "../components/Tabels/BorderedTable";
import HoverTable from "../components/Tabels/HoverableTable";
import Reacttabel from "../components/Tabels/Reacttable";
import Product from "../pages/Product";
import Chart from "../pages/Chart";
import Theme from "../Layout/Superadmin/Themes/Theme";
import AddTheme from "../Layout/Superadmin/Themes/AddTheme";
import Edittheme from "../Layout/Superadmin/Themes/EditTheme";
import Modals from "../components/Models/Modals";
import Services from "../pages/Services";
import Company from "../Layout/Superadmin/Company/Company";

import Superadmin from "./superadmin.routes";

import User from "./user.routes";
import Admin from "./admin.routes";

const MainRoutes = () => {


  return (
    <Routes>
      <Route path="/superadmin/*" element={<Superadmin />} />
      <Route path="/user/*" element={<User />} />
      <Route path="/admin/*" element={<Admin />} />

  
    </Routes>
  );
};
export default MainRoutes;
