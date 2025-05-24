import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { LoginApi } from "../../Services/Auth/Login";
import { image_baseurl } from "../../../Utils/config";
import { Link } from "react-router-dom";
import BgImg from "./bg-login-img.png";
import showCustomAlert from "../../Extracomponents/CustomAlert/CustomAlert";
import { basicsettinglist } from "../../Services/Admin/Admin";
import $ from "jquery";


const Login = () => {


  const navigate = useNavigate();
  const [information, setInformation] = useState([]);
  const [status, setStatus] = useState(2);
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      showCustomAlert("error", "Please enter both Username and Password", navigate, null);
      return;
    }

    setIsLoading(true);
    const ResData = await LoginApi({ UserName: username, password: password });
    setIsLoading(false);

    if (ResData.status) {
      localStorage.setItem("token", ResData.data?.token);
      localStorage.setItem("id", ResData.data?.id);


      const roleMap = {
        0: "SUPERADMIN",
        1: "ADMIN",
        2: "EMPLOYEE",
      };

      const role = roleMap[ResData?.data?.Role] || "";
      localStorage.setItem("Role", role);

      const redirectTo = () => {
        const routes = {
          0: "/superadmin/company",
          1: "/admin/dashboard",
          2: "/employee/dashboard",
        };
        navigate(routes[ResData?.data?.Role] || "/");
        window.location.reload();
      };

      showCustomAlert("success", "Login successful!", navigate, redirectTo);
    } else {
      showCustomAlert("error", ResData.message, navigate, null);
    }
  };




  const getsettinglist = async () => {
    try {
      let token = "";
      const response = await basicsettinglist(token);
      if (response.status) {
        localStorage.setItem("theme", JSON.stringify(response?.Theme));

        const faviconElement = document.querySelector("link[rel='icon']");
        if (faviconElement) {
          faviconElement.href =
            image_baseurl + "uploads/basicsetting/" + response.data[0].favicon;

          $(".companyName").html(response.data[0].from_name);
        } else {
          console.log("Favicon element not found");
        }

        setInformation(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getsettinglist();
  }, []);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="main-login" style={{ backgroundImage: `url(${BgImg})` }}>
      <div className="row align-items-center h-100">
        <div className="col-lg-12 mx-auto">
          {status === 1 ? (
            <div className="login-wrapper">
              <div className="background"></div>
              <div className="login-container active">
                <img
                  src={`${image_baseurl}uploads/basicsetting/${information[0]?.logo}`}
                  alt="Logo" />
                <div className="inner-div mt-4">
                  <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-item">
                      <label htmlFor="username-login">Username</label>
                      <input
                        id="username-login"
                        name="username"
                        type="text"
                        aria-label="Enter your username"
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
          ) : status === 2 ? (
            <div className="bg-login" style={{ width: "100%", height: "100%" }}>
              <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
                <div className="container-fluid ">
                  <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                    <div className="col mx-auto">
                      <div className="card mb-0">
                        <div className="card-body">
                          <div className="p-4">
                            <div className="mb-5 text-center">
                              <img
                                style={{ width: "241px" }}
                                src={`${image_baseurl}uploads/basicsetting/${information[0]?.logo}`}
                              />
                            </div>

                            <div className="form-body">
                              <form className="row g-3" onSubmit={handleLogin}>
                                <div className="col-12">
                                  <label
                                    htmlFor="inputEmailAddress"
                                    className="form-label"
                                  >
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder="Enter Your Username"
                                    value={username}
                                    onChange={(e) =>
                                      setusername(e.target.value)
                                    }
                                  />
                                </div>

                                <div className="col-12">
                                  <label
                                    htmlFor="inputChoosePassword"
                                    className="form-label"
                                  >
                                    Password
                                  </label>
                                  <div
                                    className="input-group"
                                    id="show_hide_password"
                                  >
                                    <input
                                      type={showPassword ? "text" : "password"}
                                      className="form-control border-end-0"
                                      id="inputChoosePassword"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      placeholder="Enter Password"
                                    />
                                    <a
                                      href="javascript:;"
                                      onClick={togglePasswordVisibility}
                                      className="input-group-text bg-transparent"
                                    >
                                      <i
                                        className={`bx ${showPassword ? "bx-show" : "bx-hide"
                                          }`}
                                      />
                                    </a>
                                  </div>
                                </div>

                                <div className="col-md-6 ">
                                  <p className="mb-0">
                                    <Link to="/forget">Forgot Password?</Link>
                                  </p>
                                </div>

                                <div className="col-12">
                                  <div className="d-grid">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                    >
                                      Sign in
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className="login-separater text-center mb-5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-container">
              <div className="wrapper">
                <img
                  src={`${image_baseurl}uploads/basicsetting/${information[0]?.logo}`}
                  alt="Logo" />
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
