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
import Theme from "../pages/Themes/Theme";
import AddTheme from "../pages/Themes/AddTheme";
import Edittheme from "../pages/Themes/EditTheme";
import Modals from '../components/Models/Modals';

import Login from "../Layout/Auth/Login";
import Company from '../Layout/Superadmin/Company/Company'
import Trade from "../pages/Trade";
import Basket from "../pages/Basket/Basket";
import Registration from "../Layout/Auth/Registration";
import Forgetpassword from "../Layout/Auth/Forgetpassword";
import Forgetpassworduser from "../Layout/Auth/Forgetpassworduser";

export default function App() {



  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forget" element={<Forgetpassword />} />
      <Route path="/forget-user" element={<Forgetpassworduser />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forms/classic" element={<Classicform />} />
      <Route path="/forms/Glassmorphism" element={<Glassform />} />
      <Route path="/forms/Darktheme" element={<Darktheme />} />
      <Route path="/forms/Modern" element={<Modern />} />
      <Route path="/forms/Floating" element={<Floating />} />

      <Route path="/tables/basic" element={<BasicTable />} />
      <Route path="/tables/card" element={<CardTable />} />
      <Route path="/tables/striped" element={<StripedTable />} />
      <Route path="/tables/bordered" element={<BorderTable />} />
      <Route path="/tables/hover" element={<HoverTable />} />
      <Route path="/tables/reacttable" element={<Reacttabel />} />
      <Route path="/products" element={<Product />} />
      <Route path="/charts" element={<Chart />} />
      <Route path="/themes" element={<Theme />} />
      <Route path="/add-theme" element={<AddTheme />} />
      <Route path="/edit-theme/:id" element={<Edittheme />} />
      <Route path="/modals" element={<Modals />} />

      <Route path="/trades" element={<Trade />} />
      <Route path="/login" element={<Login />} />
      <Route path="/basket" element={<Basket />} />


      <Route path="/company" element={<Company />} />
    </Routes>
  );
}

