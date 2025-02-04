import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserLoginApi } from "../../Services/Auth/Login";
import { image_baseurl } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { basicsettinglist } from "../../Services/Admin/Admin";
import $ from "jquery";
import BgImg from "./bg-login-img.png";
const Userlogin = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [information, setInformation] = useState([]);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password",
      });
      return;
    }

    setIsLoading(true);
    const ResData = await UserLoginApi({ UserName: email, password: password });
    setIsLoading(false);

    if (ResData.status) {
      localStorage.setItem("token", ResData.data?.token);
      localStorage.setItem("id", ResData.data?.id);
      localStorage.setItem("Role", "USER");

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

  const handleLogin1 = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Set errors before exiting early
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return; // Early exit if there are errors
    }

    setIsLoading(true); // Set loading state before making the API request

    try {
      const ResData = await UserLoginApi({
        UserName: email,
        password: password,
      });

      if (ResData.status) {
        localStorage.setItem("token", ResData.data?.token);
        localStorage.setItem("id", ResData.data?.id);
        localStorage.setItem("Role", "USER");

        localStorage.setItem("email", email);

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
        errors.other = ResData.message;
        setErrors(errors);
      }
    } catch (error) {
      errors.password = "An error occurred while processing your request.";
      setErrors(errors);
    } finally {
      setIsLoading(false); // Always stop loading after the API call completes
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

  return (
    <div className="main-login" style={{ backgroundImage: `url(${BgImg})` }}>
      <div className="row align-items-center h-100">
        <div className="col-lg-12 mx-auto">
          {1 === 1 ? (
            <div className="bg-login">
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
                                    Email / Mobile
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="inputEmailAddress"
                                    placeholder="Enter Your Email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
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
                                        className={`bx ${
                                          showPassword ? "bx-show" : "bx-hide"
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
                                      Sign In
                                    </button>
                                  </div>
                                </div>

                                <div className="col-12 text-center mt-3">
                                  <p className="mb-0">
                                    Don't have an account?{" "}
                                    <Link
                                      to="/register"
                                      className="btn btn-link p-0"
                                    >
                                      Sign Up
                                    </Link>
                                  </p>
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
            <>
              <div
                style={{
                  width: "90%",
                  maxWidth: "400px",
                  margin: "auto",
                  padding: "40px",
                  background: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                <div>
                  <img
                    style={{
                      width: "100%",
                      maxWidth: "240px",
                      marginBottom: "20px",
                    }}
                    src={`${image_baseurl}uploads/basicsetting/${information[0]?.logo}`}
                    alt="Logo"
                  />
                </div>
                <form onSubmit={handleLogin1} noValidate>
                  <div style={{ marginBottom: "20px", textAlign: "left" }}>
                    <label
                      htmlFor="email"
                      style={{
                        display: "block",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "14px",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="Enter your email"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s",
                      }}
                    />
                    {errors.email && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "20px", textAlign: "left" }}>
                    <label
                      htmlFor="password"
                      style={{
                        display: "block",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "14px",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s",
                      }}
                    />
                    {errors.password && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "8px",
                      background: isLoading ? "#ddd" : "#007bff",
                      color: "#fff",
                      fontSize: "16px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      transition: "background-color 0.3s ease-in-out",
                      fontWeight: "bold",
                    }}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </button>
                  <div className="col-12 text-center mt-3">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <Link to="/register" className="btn btn-link p-0">
                        Sign Up
                      </Link>
                    </p>
                  </div>

                  {errors.other && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.other}
                    </div>
                  )}
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userlogin;
