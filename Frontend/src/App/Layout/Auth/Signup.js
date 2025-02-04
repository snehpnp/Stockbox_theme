import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserSignupApi } from "../../Services/Auth/Login";
import { image_baseurl } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { basicsettinglist } from "../../Services/Admin/Admin";
import BgImg from "./bg-login-img.png";

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    referralCode: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [information, setInformation] = useState([]);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = "Invalid email format";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Phone number must be 10 digits";
        }
        break;
      case "password":
        if (
          !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        ) {
          errorMsg =
            "Password must be at least 8 characters, include a number, an uppercase letter, and a special character";
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          errorMsg = "Full Name is required";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, referralCode, password } = formData;

    // Validate all fields before submitting
    validateField("fullName", fullName);
    validateField("email", email);
    validateField("phone", phone);
    validateField("password", password);

    // Check if there are any errors
    if (Object.values(errors).some((err) => err)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please correct the errors before submitting",
      });
      return;
    }

    console.log("formData", formData);

    const ResData = await UserSignupApi({
      FullName: fullName,
      Email: email,
      PhoneNo: phone,
      password,
      token: referralCode,
    });

    if (ResData.status) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Signup successful!",
        timer: 1500,
      }).then(() => {
        navigate("/register");
        window.location.reload();
      });
    } else {
      Swal.fire({ icon: "error", title: "Error", text: ResData.message });
    }
  };

  useEffect(() => {
    const getSettingList = async () => {
      try {
        let token = "";
        const response = await basicsettinglist(token);
        if (response.status) {
          localStorage.setItem("theme", JSON.stringify(response?.Theme));
          setInformation(response.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getSettingList();
  }, []);

  return (
    <div className="main-login" style={{ backgroundImage: `url(${BgImg})` }}>
      <div className="row align-items-center h-100">
        <div className="col-lg-12 mx-auto">
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
                              alt="Company Logo"
                            />
                          </div>
                          <form onSubmit={handleSignup}>
                            {[
                              { label: "Full Name", name: "fullName", type: "text" },
                              { label: "Email", name: "email", type: "text" },
                              { label: "Phone", name: "phone", type: "text" },
                              { label: "Referral Code", name: "referralCode", type: "text" },
                            ].map((field) => (
                              <div className="col-12 mb-3" key={field.name}>
                                <label className="form-label">{field.label}</label>
                                <input
                                  type={field.type}
                                  className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                                  name={field.name}
                                  value={formData[field.name]}
                                  onChange={handleChange}
                                  placeholder={`Enter your ${field.label}`}
                                />
                                {errors[field.name] && (
                                  <div className="invalid-feedback">{errors[field.name]}</div>
                                )}
                              </div>
                            ))}
                            <div className="col-12 mb-3">
                              <label className="form-label">Password</label>
                              <div className="input-group">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  className={`form-control border-end-0 ${errors.password ? "is-invalid" : ""}`}
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  placeholder="Enter Password"
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="input-group-text bg-transparent"
                                >
                                  <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`} />
                                </button>
                                {errors.password && (
                                  <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-12 d-grid">
                              <button type="submit" className="btn btn-primary">
                                Sign Up
                              </button>
                            </div>
                          </form>
                          <div className="text-center mt-3">
                            <p>
                              Already have an account?
                              <Link to="/user-login" className="btn btn-link p-0 text-primary fw-bold">
                                {" "}
                                Sign in
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
