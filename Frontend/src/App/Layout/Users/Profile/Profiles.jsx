import React, { useEffect, useState, useRef } from "react";
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
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Kyc from "./Kyc";
import { FaLock, FaWallet, FaClipboardList, FaIdCard, FaTrashAlt, FaMoneyCheckAlt, FaCartPlus } from 'react-icons/fa';


const Profiles = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [image, setImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTox5GjcAiQFx_AhZfdb1Y4Y5TViXM613ATDg&s"
  );
  const [uploadimage, setUploadimage] = useState([])

  const [showModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [viewmodel2, setViewModel2] = useState(false);



  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });


  // const [dmateStatus, setDemateStatus] = useState(0);



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
        errors.currentPassword = "Please Enter your current password";
      }
      if (!values.newPassword) {
        errors.newPassword = "Please Enter a new password";
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
        errors.confirmPassword = "Please Confirm your new password";
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
          showCustomAlert("Success", "Password changed successfully!")
          setShowModal(false);
          resetForm();
        } else {
          showCustomAlert("error", response.message)
        }
      } catch (error) {
        showCustomAlert("error", "Something went wrong!")
      }
    },
  });



  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);

      if (response.status) {
        setUserDetail(response?.data);
        setImage(response?.data?.image);

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
        showCustomAlert("error", "Please enter Full Name")
        return;
      }

      let Data = {
        id: userDetail._id,
        FullName: userDetail.FullName,
        image: uploadimage
      };
      const response = await UpdateUserProfile(Data, token);
      if (response.status) {
        setUserDetail(response.data);
        showCustomAlert("Success", "Profile updated successfully!")
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
        showCustomAlert("error", "Email does not match");
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
        showCustomAlert("error", "Account deletion was cancelled.");
        return;
      }

      const response = await DeleteClient(userid, token);
      // return
      if (response.status) {
        showCustomAlert("Success", "Your account has been deleted.",);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        showCustomAlert(
          "error!",
          response.message || "Something went wrong.",
        );
      }
    } catch (error) {
      showCustomAlert(
        "error!",
        "Failed to delete account. Try again later."
      );
    }
  };



  const DeleteDematAccountApi = async () => {
    const result = await showCustomAlert("confirm", "You won't be able to revert this action!")
    if (result.isConfirmed) {
      try {
        const response = await DeleteDematAccount({ id: userid }, token);
        if (response.status) {
          showCustomAlert("Deleted!", "Your account has been deleted.", "success");
        } else {
          showCustomAlert("error", response.message || "Something went wrong.");
        }
      } catch (error) {

        showCustomAlert("error", "Failed to delete account. Try again later.");
      }
    }
  };


  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadimage(file)
      setImage(URL.createObjectURL(file));
    }
  }



  return (
    <Content
      Page_title="User Profile"
      button_status={false}
      backbutton_status={false}
      backForword={true}
    >
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center" style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={image}
                  alt="User"
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={handleImageClick}
                />
                <div
                >
                  <i className="fas fa-pencil-alt" style={{ fontSize: "12px", color: "#333" }}></i>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <Link onClick={() => setShowModal(true)} className="d-flex align-items-center gap-2">
                    <FaLock /> Change Password
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/subscription" className="d-flex align-items-center gap-2">
                    <FaClipboardList /> My Subscription
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/wallet" className="d-flex align-items-center gap-2">
                    <FaWallet /> Wallet
                  </Link>
                </li>
                {/* <li className="list-group-item">
               <Link to="/user/payment-history" className="d-flex align-items-center gap-2">
               <FaMoneyCheckAlt /> Payment History
                </Link>
                 </li> */}
                <li className="list-group-item">
                  <Link
                    to="/user/basket"
                    state={{ activeTab: 'basket' }}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaCartPlus /> My Basket Subscription
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link
                    onClick={() => {
                      if (userDetail.kyc_verification !== 1) setViewModel2(true);
                    }}
                    className={`text-decoration-none d-flex align-items-center gap-2 ${userDetail.kyc_verification === 1 ? 'text-success' : 'text-danger'}`}
                    style={{ pointerEvents: userDetail.kyc_verification === 1 ? 'none' : 'auto' }}
                  >
                    <FaIdCard />
                    KYC - {userDetail.kyc_verification === 1 ? 'Completed' : 'Pending'}
                  </Link>
                </li>
                {userDetail?.dlinkstatus === 1 &&
                  <li className="list-group-item">
                    <Link to="" onClick={(e) => DeleteDematAccountApi()} className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                      <FaTrashAlt /> Delete Demat Account
                    </Link>
                  </li>
                }
                <li className="list-group-item">
                  <Link
                    to=""
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={(e) => DeleteAccount()}
                  >
                    <FaTrashAlt /> Delete Account
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
                          showCustomAlert("error", "Please enter Full Name");
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
            {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => {
              const hasError = formik.touched[field] && formik.errors[field]; // Check if error exists
              return (
                <div className="mb-3 position-relative" key={index}>
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    className="form-control"
                    placeholder={field
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(/^./, (str) => str.toUpperCase())}
                    {...formik.getFieldProps(field)}
                    style={{ paddingRight: "40px" }} // To prevent overlap of eye icon
                  />
                  {/* Eye Icon: Upar shift hoga agar error hai */}
                  <span
                    className="position-absolute"
                    style={{
                      right: "10px",
                      top: hasError ? "30%" : "50%", // Jab error ho to 40%, warna 50%
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      transition: "top 0.2s ease-in-out", // Smooth animation
                    }}
                    onClick={() => togglePassword(field)}
                  >
                    {showPassword[field] ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                  {/* Error Message */}
                  {hasError && (
                    <div className="text-danger mt-1">{formik.errors[field]}</div>
                  )}
                </div>
              );
            })}
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>

        }
      />

      <ReusableModal
        show={viewmodel2}
        onClose={() => setViewModel2(false)}
        title={<span><b>KYC Details</b></span>}
        body={
          <Kyc setViewModel2={setViewModel2} />
        }

      />
    </Content>
  );
};

export default Profiles;
