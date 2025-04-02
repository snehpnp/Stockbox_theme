import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserSignupApi, UserOtpSubmit } from "../../Services/Auth/Login";
import { image_baseurl } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { basicsettinglist } from "../../Services/Admin/Admin";
import BgImg from "./bg-login-img.png";
import ReusableModal from "../../components/Models/ReusableModal";
import showCustomAlert from "../../Extracomponents/CustomAlert/CustomAlert";

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    referralCode: "",
    password: "",
    state: "",
  });

  const [otpInfo, setOtpInfo] = useState({
    "status": "",
    "otp": "",
    "otpmobile": "",
    "email": "",
    "message": "",
  })

  const indianStates = [
    { name: "Andhra Pradesh" },
    { name: "Arunachal Pradesh" },
    { name: "Assam" },
    { name: "Bihar" },
    { name: "Chhattisgarh" },
    { name: "Goa" },
    { name: "Gujarat" },
    { name: "Haryana" },
    { name: "Himachal Pradesh" },
    { name: "Jharkhand" },
    { name: "Karnataka" },
    { name: "Kerala" },
    { name: "Madhya Pradesh" },
    { name: "Maharashtra" },
    { name: "Manipur" },
    { name: "Meghalaya" },
    { name: "Mizoram" },
    { name: "Nagaland" },
    { name: "Odisha" },
    { name: "Punjab" },
    { name: "Rajasthan" },
    { name: "Sikkim" },
    { name: "Tamil Nadu" },
    { name: "Telangana" },
    { name: "Tripura" },
    { name: "Uttar Pradesh" },
    { name: "Uttarakhand" },
    { name: "West Bengal" }
  ];



  const [enteredOtp, setEnteredOtp] = useState("")

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [information, setInformation] = useState([]);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [isReferralEnabled, setIsReferralEnabled] = useState(false);

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
      case "state":
        if (value.trim() === "") {
          errorMsg = "State is required";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, referralCode, password, state } = formData;

    // Validate all fields before submitting
    validateField("fullName", fullName);
    validateField("email", email);
    validateField("phone", phone);
    validateField("password", password);
    validateField("state", state);

    // Check if there are any errors
    if (Object.values(errors).some((err) => err)) {
      showCustomAlert("error", "Please correct the errors before submitting")
      return;
    }



    // return

    const ResData = await UserSignupApi({
      FullName: fullName,
      Email: email,
      PhoneNo: phone,
      password,
      state: state,
      token: referralCode,
    });


    if (ResData.status) {
      showCustomAlert("Success", ResData.message)
      setIsOtpModalOpen(true)
      setOtpInfo(ResData)
    } else {
      showCustomAlert("error", ResData.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!enteredOtp) {
      showCustomAlert("error", "Please enter OTP before submitting")
      return;
    }

    try {
      const otpSubmit = await UserOtpSubmit({
        email: otpInfo.email,
        otp: enteredOtp,
      });

      if (enteredOtp == otpInfo.otp) {
        showCustomAlert("Success", "OTP verification successful!", navigate, "/user-login")
        setIsOtpModalOpen(false);
      } else {
        showCustomAlert("error", "Invalid OTP, please try again!")
      }
    } catch (error) {
      showCustomAlert("error", "Something went wrong, please try again!")
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
                              { label: "Password", name: "password", type: "password" },
                              { label: "State", name: "state", type: "select" }, // ✅ State added inside map
                            ].map((field) => (
                              <div className="col-12 mb-3" key={field.name}>
                                <label className="form-label">{field.label}</label>

                                {field.name === "password" ? (
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
                                  </div>
                                ) : field.name === "state" ? (
                                  <select
                                    className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                  >
                                    <option value="">Select State</option>
                                    {indianStates.map((state, index) => (
                                      <option key={index} value={state.name}>
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${field.label}`}
                                  />
                                )}

                                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                              </div>
                            ))}

                            {/* ✅ Referral Code Checkbox */}
                            <div className="col-12 mb-3">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="enableReferral"
                                  checked={isReferralEnabled}
                                  onChange={() => setIsReferralEnabled(!isReferralEnabled)}
                                />
                                <label className="form-check-label" htmlFor="enableReferral">
                                  Do you have a Referral Code?
                                </label>
                              </div>
                            </div>

                            {/* ✅ Referral Code Field (Only shows when checkbox is checked) */}
                            {isReferralEnabled && (
                              <div className="col-12 mb-3">
                                <label className="form-label">Referral Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="referralCode"
                                  value={formData.referralCode}
                                  onChange={handleChange}
                                  placeholder="Enter Referral Code"
                                />
                              </div>
                            )}




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
      {isOtpModalOpen && (
        <ReusableModal
          show={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          title="Enter OTP"
          body={
            <form>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="otp">Enter OTP</label>
                  <span className="text-danger">*</span>
                  <input
                    type="text"
                    id="otp"
                    className="form-control"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)} // ✅ Store user OTP
                  />
                </div>
              </div>
            </form>
          }
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOtpModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOtpSubmit} // ✅ Direct function reference diya hai
              >
                Submit
              </button>
            </>
          }
        />
      )}
    </div>
  );
};

export default UserSignup;
