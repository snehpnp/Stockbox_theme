import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../Services/Auth/Login";





const Login = () => {


  const navigate = useNavigate();



  let logoSrc =
    "https://www.pms.crmplus.in/files/system/_file5c2e1123e834d-site-logo.png";



  const [status, setStatus] = useState(2);
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);




  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password",
      });
      return;
    }

    setIsLoading(true);
    const ResData = await LoginApi({ UserName: username, password: password });
    setIsLoading(false);

    if (ResData.status) {
      localStorage.setItem("Token", ResData.data.token);
      localStorage.setItem(
        "Role",
        ResData.data.Role === 0
          ? "SUPERADMIN"
          : ResData.data.Role === 1
            ? "ADMIN"
            : ResData.data.Role === 2
              ? "EMPLOYEE"
              : "USER"
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
        timer: 1500,
      }).then(() => {
        navigate("/user/dashboard");
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: ResData.message,
      });
    }
  };

  return (
    <div className="main-login">
      <div className="row align-items-center h-100">
        <div className="col-lg-7 mx-auto">
          {status === 1 ? (
            <div className="login-wrapper">
              <div className="background"></div>
              <div className="login-container active">
                <img src={logoSrc} alt="Logo" />
                <div className="inner-div mt-4">
                  <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-item">
                      <label htmlFor="username-login">Email</label>
                      <input
                        id="username-login"
                        name="username"
                        type="text"
                        aria-label="Enter your email"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label htmlFor="password-login">Password</label>
                      <input
                        id="password-login"
                        name="password"
                        type="password"
                        aria-label="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      className="form-button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-container">
              <div className="wrapper">
                <img src={logoSrc} alt="Logo" />
                <form onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="username-input">
                      <span>@</span>
                    </label>
                    <input
                      type="username"
                      name="username"
                      id="username-input"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password-input">
                      <i className="fa-solid fa-lock"></i>
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
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
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
