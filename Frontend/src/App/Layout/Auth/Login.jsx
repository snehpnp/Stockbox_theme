import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(2); // Default status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form refresh
    if (email.trim() === "" || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password",
      });
    } else {
      // Simulate successful login
      if (email == "user@gmail.com") {
        localStorage.setItem("Role", "USER");
        localStorage.setItem("Token", "123");
      } else if (email == "superadmin@gmail.com") {
        localStorage.setItem("Role", "SUPERADMIN");
        localStorage.setItem("Token", "123");
      } else if (email == "admin@gmail.com") {
        localStorage.setItem("Role", "ADMIN");
        localStorage.setItem("Token", "123");
      } else {
        localStorage.setItem("Role", "USER");
        localStorage.setItem("Token", "123");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
        timer: 1500,
      }).then(() =>
      {

        navigate("/user/dashboard")
        window.location.reload();
      }
        );
   
    }
  };

  return (
    <div className="main-login">
      <div className="row align-items-center h-100">
        <div className="col-lg-7 mx-auto">
          {status === "1" ? (
            // First Login Form
            <div className="login-wrapper">
              <div className="background"></div>
              <div className="login-container active">
                <img
                  src="https://www.pms.crmplus.in/files/system/_file5c2e1123e834d-site-logo.png"
                  alt="background"
                />
                <div className="inner-div mt-4">
                  <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-item">
                      <label htmlFor="username-login">Email</label>
                      <input
                        id="username-login"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label htmlFor="password-login">Password</label>
                      <input
                        id="password-login"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button className="form-button" type="submit">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            // Second Login Form
            <div className="glass-container">
              <div className="wrapper">
                <img
                  src="https://www.pms.crmplus.in/files/system/_file5c2e1123e834d-site-logo.png"
                  alt="background"
                />
                <form onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email-input">
                      <span>@</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email-input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password-input">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={24}
                        viewBox="0 -960 960 960"
                        width={24}
                      >
                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                      </svg>
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit">Login</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
