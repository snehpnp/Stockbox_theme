import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Wrapper from "./App/components/Wrapper/Wrapper";
import Login from "./App/Layout/Auth/Login";
import Userlogin from "./App/Layout/Auth/Userlogin";


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const Token = localStorage.getItem("token");
  const Role = localStorage.getItem("Role");

  useEffect(() => {
    if (!Token) {
      if (!location.pathname.includes("login") && !location.pathname.includes("user-login")) {

        navigate("/user-login");

      }
      // navigate("/login");
      // navigate("/user-login");

      return;
    }

    if (
      location.pathname === "/forget" ||
      location.pathname.startsWith("/signup")
    ) {
      // Allow access to /forget and /signup without additional redirection
      return;
    }

    // Redirect to dashboard based on role
    if (location.pathname.includes("login") || location.pathname.includes("user-login") || location.pathname === "/") {

      switch (Role) {
        case "SUPERADMIN":
          navigate("/superadmin/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "USER":
          navigate("/user/dashboard");
          break;
        case "EMPLOYEE":
          navigate("/employee/dashboard");
          break;
        default:
        // navigate("/login");
        // navigate("/user-login");

      }
    }
  }, [Token, Role, location.pathname, navigate]);




  return (
    <div className="App">
      {(location.pathname !== "/login" && location.pathname !== "/user-login") && <Wrapper />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<Userlogin />} />


        <Route path="/forget" element={<div>Forget Password</div>} />
        <Route path="/signup/*" element={<div>Signup Page</div>} />
      </Routes>
    </div>
  );
};




export default App;
