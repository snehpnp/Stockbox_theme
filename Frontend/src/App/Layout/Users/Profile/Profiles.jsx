import React, { useState } from "react";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { useFormik } from "formik";
import { ChangePasswordOfclient } from "../../../Services/UserService/User";
import { Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';

const Profiles = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.currentPassword) errors.currentPassword = "Please enter current password";
      if (!values.newPassword) errors.newPassword = "Please enter new password";
      if (values.newPassword !== values.confirmPassword) errors.confirmPassword = "Passwords do not match";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await ChangePasswordOfclient({ id: localStorage.getItem("id"), ...values }, localStorage.getItem("token"));
        if (response.status) {
          Swal.fire("Success", "Password changed successfully!", "success");
          setShowModal(false);
          resetForm();
        } else {
          Swal.fire("Error", response.message || "Error changing password", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    },
  });

  const profileFields = [
    { label: "Full Name", value: "Test User", type: "text" },
    { label: "Email", value: "test@gmail.com", type: "email", disabled: true },
    { label: "Phone", value: "(987) 543-2109", type: "text", disabled: true },
  ];

  return (
    <Content Page_title="User Profile" button_status={false} backbutton_status={false}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h4 className="mb-3">Test User</h4>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><Link onClick={() => setShowModal(true)}>Change Password</Link></li>
                <li className="list-group-item"><Link to="/user/subscription">My Subscription</Link></li>
                <li className="list-group-item"><Link to="/user/kyc">KYC Pending</Link></li>
                <li className="list-group-item"><Link to="/user/payment-history">Payment History</Link></li>
                <li className="list-group-item"><Link to="">My Basket Subscription</Link></li>
                <li className="list-group-item"><Link to="" className="btn btn-primary w-100">Delete Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Profile Information</h5>
              </div>
              <div className="card-body">
                {profileFields.map(({ label, value, type, disabled }, index) => (
                  <div className="mb-3 row" key={index}>
                    <label className="col-sm-3 col-form-label">{label}</label>
                    <div className="col-sm-9">
                      <input type={type} className="form-control" defaultValue={value} disabled={disabled} />
                    </div>
                  </div>
                ))}
                <div className="text-end">
                  <button className="btn btn-primary px-4">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Change Password"
        body={
          <form onSubmit={formik.handleSubmit}>
            {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => (
              <div className="mb-3 position-relative" key={index}>
                <input
                  type={showPassword[field] ? "text" : "password"}
                  className="form-control"
                  placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                  {...formik.getFieldProps(field)}
                />
                <span className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer" onClick={() => togglePassword(field)}>
                  {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                {formik.touched[field] && formik.errors[field] && <div className="text-danger">{formik.errors[field]}</div>}
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        }
      />
    </Content>
  );
};

export default Profiles;
