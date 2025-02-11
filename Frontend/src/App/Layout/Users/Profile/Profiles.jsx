import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { useFormik } from "formik";
import { ChangePasswordOfclient } from "../../../Services/UserService/User";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import {
  GetUserData,
  UpdateUserProfile,
  DeleteClient,
  DeleteDematAccount,
} from "../../../Services/UserService/User";





const Profiles = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");



  const [showModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState({});

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

      if (!values.currentPassword) {
        errors.currentPassword = "Please enter your current password";
      }
      if (!values.newPassword) {
        errors.newPassword = "Please enter a new password";
      } else {
        if (values.newPassword.length < 8) {
          errors.newPassword = "Password must be at least 8 characters long";
        }

        if (!/[A-Z]/.test(values.newPassword)) {
          errors.newPassword = "Password must contain at least one uppercase letter";
        }

        if (!/\d/.test(values.newPassword)) {
          errors.newPassword = "Password must contain at least one number";
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.newPassword)) {
          errors.newPassword = "Password must contain at least one special character";
        }
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await ChangePasswordOfclient(
          { id: localStorage.getItem("id"), ...values },
          localStorage.getItem("token")
        );
        if (response.status) {
          Swal.fire("Success", "Password changed successfully!", "success");
          setShowModal(false);
          resetForm();
        } else {
          Swal.fire(
            "Error",
            response.message || "Error changing password",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    },
  });




  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getuserdetail();
  }, []);



  const UpdateProfileInfo = async () => {
    try {
      if (!userDetail.FullName) {
        Swal.fire("Error", "Please enter Full Name", "error");
        return;
      }

      let Data = {
        id: userDetail._id,
        FullName: userDetail.FullName,
      };
      const response = await UpdateUserProfile(Data, token);
      if (response.status) {
        setUserDetail(response.data);
        Swal.fire("Success", "Profile updated successfully!", "success");
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const DeleteAccount = async () => {
    try {
      const { value: email } = await Swal.fire({
        title: "Confirm Deletion",
        text: "Enter your Email to confirm deletion.",
        input: "text",
        inputPlaceholder: "Enter your Email",
        showCancelButton: true,
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "Email is required!";
          }
        },
      });

      if (!email) return;

      if (email !== userDetail.Email) {
        Swal.fire("Error", "Email does not match", "error");
        return;
      }

      let timerInterval;
      let isCancelled = false;

      await Swal.fire({
        title: "Account will be deleted in...",
        html: "<b>10</b> seconds remaining. <br><br> <button id='cancel-delete' class='swal2-cancel btn btn-danger'>Cancel</button>",
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          const popup = Swal.getPopup();
          const timer = popup.querySelector("b");
          const cancelButton = popup.querySelector("#cancel-delete");

          timerInterval = setInterval(() => {
            timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);

          cancelButton.addEventListener("click", () => {
            isCancelled = true;
            Swal.close();
          });
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      if (isCancelled) {
        Swal.fire("Cancelled", "Account deletion was cancelled.", "info");
        return;
      }

      const response = await DeleteClient(userDetail._id, token);
      if (response.status) {
        Swal.fire("Deleted!", "Your account has been deleted.", "success");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        Swal.fire(
          "Error!",
          response.message || "Something went wrong.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Swal.fire(
        "Error!",
        "Failed to delete account. Try again later.",
        "error"
      );
    }
  };



  const DeleteDematAccountApi = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("userDetail._id", userid);
          const response = await DeleteDematAccount({ id: userid }, token);
          if (response.status) {
            Swal.fire("Deleted!", "Your account has been deleted.", "success");
          } else {
            Swal.fire("Error!", response.message || "Something went wrong.", "error");
          }
        } catch (error) {
          console.error("Error deleting account:", error);
          Swal.fire("Error!", "Failed to delete account. Try again later.", "error");
        }
      }
    });
  };




  return (
    <Content
      Page_title="User Profile"
      button_status={false}
      backbutton_status={false}
    >
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTox5GjcAiQFx_AhZfdb1Y4Y5TViXM613ATDg&s"
                  alt="User"
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <Link onClick={() => setShowModal(true)}>
                    Change Password
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/subscription">My Subscription</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/wallet">Wallet</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/payment-history">Payment History</Link>
                </li>
                <li className="list-group-item">
                  <Link to="">My Basket Subscription</Link>
                </li>
                <li className="list-group-item">
                  <Link to="" onClick={(e) => DeleteDematAccountApi()}
                    className="btn btn-secondary w-100">
                    Delete Demat Account
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link
                    to=""
                    className="btn btn-primary w-100"
                    onClick={(e) => DeleteAccount()}
                  >
                    Delete Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header btn-primary text-white">
                <h5 className="mb-0">Profile Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Full Name</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={userDetail?.FullName}
                      onChange={(e) => {
                        if (!e.target.value) {
                          Swal.fire("Error", "Please enter Full Name", "error");
                          return;
                        }
                        setUserDetail({
                          ...userDetail,
                          FullName: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Email</label>
                  <div className="col-sm-9">
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={userDetail?.Email}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Phone</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      disabled={true}
                      defaultValue={userDetail?.PhoneNo}
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-primary px-4"
                    onClick={(e) => UpdateProfileInfo()}
                  >
                    Update
                  </button>
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
            {["currentPassword", "newPassword", "confirmPassword"].map(
              (field, index) => (
                <div className="mb-3 position-relative" key={index}>
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    className="form-control"
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    {...formik.getFieldProps(field)}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                    onClick={() => togglePassword(field)}
                  >
                    {showPassword[field] ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </span>
                  {formik.touched[field] && formik.errors[field] && (
                    <div className="text-danger">{formik.errors[field]}</div>
                  )}
                </div>
              )
            )}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        }
      />
    </Content>
  );
};

export default Profiles;
