// import React, { useEffect, useState } from "react";
// import Content from "../../../components/Contents/Content";
// import { clientKycAndAgreement } from "../../../Services/UserService/User"
// import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
// import Loader from "../../../../Utils/Loader";

// function Kyc() {
//   const userid = localStorage.getItem("id")
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     aadhar: "",
//     panno: "PAN",
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleKycSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true)

//     const data = new FormData();
//     data.append('email', formData.email);
//     data.append('name', formData.fullName);
//     data.append('phone', formData.phone);
//     data.append('panno', formData.panno);
//     data.append('aadhaarno', formData.aadhar);
//     data.append('id', userid);

//     try {
//       const token = localStorage.getItem('token');
//       const result = await clientKycAndAgreement(data, token);
//       showCustomAlert("success", "KYC form submitted successfully!");
//     } catch (err) {
//       console.error('KYC Failed:', err);
//       showCustomAlert("error", "KYC submission failed. Please try again.");
//     }
//     setLoading(false)
//   };



//   const handleSubmit = (e) => {
//     e.preventDefault();

//     alert("KYC form submitted successfully!");
//   };

//   return (
//     <Content Page_title="KYC" button_status={false} backbutton_status={false}
//       backForword={true}>
//       <div className="container mt-4">
//         <div className="card shadow-sm">
//           {/* <div className="card-header bg-primary text-white">
//             <h5 className="mb-0">KYC Verification Form</h5>
//           </div> */}
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="fullName" className="form-label">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="fullName"
//                   name="fullName"
//                   placeholder="Enter your full name"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="email" className="form-label">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="phone" className="form-label">
//                   Mobile No.
//                 </label>
//                 <input
//                   type="tel"
//                   className="form-control"
//                   id="phone"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="aadhar" className="form-label">
//                   {/* Address */}
//                   Aadhar No.
//                 </label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   id="aadhar"
//                   name="aadhar"
//                   placeholder="Enter your aadhar"
//                   value={formData.aadhar}
//                   onChange={handleChange}
//                   rows="3"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="panno" className="form-label">
//                   {/* Address */}
//                   PAN No.
//                 </label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   id="panno"
//                   name="panno"
//                   placeholder="Enter your Pan No"
//                   value={formData.panno}
//                   onChange={handleChange}
//                   rows="3"
//                   required
//                 />
//               </div>
//               <div className="d-grid">
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   onClick={handleKycSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Submitting...
//                     </>
//                   ) : (
//                     "Submit"
//                   )}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       </div>
//     </Content>
//   );
// }

// export default Kyc;


import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { clientKycAndAgreement, GetUserData } from "../../../Services/UserService/User";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";

function Kyc() {
  const userid = localStorage.getItem("id");
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhar: "",
    panno: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    aadhar: false,
    panno: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhar: "",
    panno: "",
  });

  const fetchUserData = async () => {
    try {
      const userData = await GetUserData(userid, token);
      console.log("userData", userData)

      // Check if userData and required properties exist
      if (userData && userData.data) {
        const user = userData.data;

        // Update the form with user data
        setFormData({
          fullName: user.FullName || "",
          email: user.Email || "",
          phone: user.PhoneNo || "",
          aadhar: "",
          panno: "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      showCustomAlert("error", "Failed to load user data. Please refresh and try again.");
    }
  };
  useEffect(() => {
    if (userid) {
      fetchUserData();
    }
  }, [userid]);

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 3) {
          errorMessage = "Name must be at least 3 characters";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Name should contain only letters and spaces";
        }
        break;

      case "email":
        if (!value) {
          errorMessage = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value) {
          errorMessage = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          errorMessage = "Please enter a valid 10-digit Indian mobile number";
        }
        break;

      case "aadhar":
        if (!value) {
          errorMessage = "Aadhar number is required";
        } else if (!/^\d{12}$/.test(value)) {
          errorMessage = "Aadhar number must be 12 digits";
        }
        break;

      case "panno":
        if (!value) {
          errorMessage = "PAN number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          errorMessage = "PAN must be in valid format (e.g., ABCDE1234F)";
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {};

    // Mark all fields as touched and validate
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const errorMessage = validateField(key, formData[key]);
      newErrors[key] = errorMessage;
      if (errorMessage) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    if (!validateForm()) {
      showCustomAlert("error", "Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('email', formData.email);
    data.append('name', formData.fullName);
    data.append('phone', formData.phone);
    data.append('panno', formData.panno);
    data.append('aadharno', formData.aadhar);
    data.append('id', userid);

    try {
      const token = localStorage.getItem('token');
      const result = await clientKycAndAgreement(data, token);
      console.log("result", result)
      showCustomAlert("success", "KYC form submitted successfully!");
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        aadhar: "",
        panno: "",
      });
      setTouched({
        fullName: false,
        email: false,
        phone: false,
        aadhar: false,
        panno: false,
      });
    } catch (err) {
      console.error('KYC Failed:', err);
      showCustomAlert("error", "KYC submission failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    // <Content
    //   Page_title="KYC"
    //   button_status={false}
    //   backbutton_status={false}
    //   backForword={true}
    // >
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleKycSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && errors.fullName && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {errors.fullName}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
              />
              {touched.email && errors.email && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Mobile No.
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Enter your 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
                disabled
              />
              {touched.phone && errors.phone && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="aadhar" className="form-label">
                Aadhar No.
              </label>
              <input
                type="text"
                className="form-control"
                id="aadhar"
                name="aadhar"
                placeholder="Enter your 12-digit Aadhar number"
                value={formData.aadhar}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="12"
              />
              {touched.aadhar && errors.aadhar && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {errors.aadhar}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="panno" className="form-label">
                PAN No.
              </label>
              <input
                type="text"
                className="form-control"
                id="panno"
                name="panno"
                placeholder="Enter your PAN (e.g., ABCDE1234F)"
                value={formData.panno}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
              />
              {touched.panno && errors.panno && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {errors.panno}
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    // </Content>
  );
}

export default Kyc;