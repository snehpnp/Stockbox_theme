import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Wrapper from "./App/components/Wrapper/Wrapper";
import Login from "./App/Layout/Auth/Login";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const Token = localStorage.getItem("Token");
  const Role = localStorage.getItem("Role");

  useEffect(() => {
    if (!Token) {
      navigate("/login");
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
    if (location.pathname.includes("login") || location.pathname === "/") {
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
          navigate("/login");
      }
    }
  }, [Token, Role, location.pathname, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<div>Forget Password</div>} />
        <Route path="/signup/*" element={<div>Signup Page</div>} />
        <Route path="/superadmin/*" element={<Wrapper />} />
        <Route path="/admin/*" element={<Wrapper />} />
        <Route path="/user/*" element={<Wrapper />} />
        <Route path="/employee/*" element={<Wrapper />} />
      </Routes>
    </div>
  );
};

export default App;
