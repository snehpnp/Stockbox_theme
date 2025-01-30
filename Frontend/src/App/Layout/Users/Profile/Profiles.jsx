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
    current: false,
    new: false,
    confirm: false,
  });
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

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
      if (!values.currentPassword) {
        errors.currentPassword = "Please enter current password";
      }
      if (!values.newPassword) {
        errors.newPassword = "Please enter new password";
      }
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },


    onSubmit: async (values, { resetForm }) => {
      const data = {
        id: userid,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      try {
        const response = await ChangePasswordOfclient(data, token);
        if (response.status) {
          Swal.fire("Success",
            "Password changed successfully!",
            "success"
          );
          setShowModal(false);
          resetForm();
        } else {
          Swal.fire("Error",
            response.message || "Error changing password", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    },
  });




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
                <li className="list-group-item">
                  <Link onClick={() => setShowModal(true)}>Change Password</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/subscription">My Subscription</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/kyc">KYC Pending</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/payment-history">Payment History</Link>
                </li>
                <li className="list-group-item">
                  <Link to="">My Basket Subscription</Link>
                </li>
                <li className="list-group-item">
                  <Link to="" className="btn btn-primary w-100">Delete Account</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Profile Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Full Name</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" defaultValue="Test User" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Email</label>
                  <div className="col-sm-9">
                    <input type="email" className="form-control" defaultValue="test@gmail.com" />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Phone</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" defaultValue="(987) 543-2109" />
                  </div>
                </div>
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
            {['current', 'new', 'confirm'].map((field, index) => (
              <div className="mb-3 position-relative" key={index}>
                <input
                  type={showPassword[field] ? "text" : "password"}
                  className="form-control"
                  placeholder={
                    field === "current" ? "Old Password" :
                      field === "new" ? "New Password" : "Confirm Password"
                  }
                  {...formik.getFieldProps(
                    field === "current" ? "currentPassword" :
                      field === "new" ? "newPassword" : "confirmPassword"
                  )}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                  onClick={() => togglePassword(field)}
                >
                  {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                {formik.touched[field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"] &&
                  formik.errors[field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"] && (
                    <div className="text-danger">
                      {formik.errors[field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"]}
                    </div>
                  )}
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
