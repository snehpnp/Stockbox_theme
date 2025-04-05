import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { clientKycAndAgreement } from "../../../Services/UserService/User"
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Loader from "../../../../Utils/Loader";

function Kyc() {
  const userid = localStorage.getItem("id")
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhar: "",
    panno: "PAN",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const data = new FormData();
    data.append('email', formData.email);
    data.append('name', formData.fullName);
    data.append('phone', formData.phone);
    data.append('panno', formData.panno);
    data.append('aadhaarno', formData.aadhar);
    data.append('id', userid);

    try {
      const token = localStorage.getItem('token');
      const result = await clientKycAndAgreement(data, token);
      showCustomAlert("success", "KYC form submitted successfully!");
    } catch (err) {
      console.error('KYC Failed:', err);
      showCustomAlert("error", "KYC submission failed. Please try again.");
    }
    setLoading(false)
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    alert("KYC form submitted successfully!");
  };

  return (
    <Content Page_title="KYC" button_status={false} backbutton_status={false}
      backForword={true}>
      <div className="container mt-4">
        <div className="card shadow-sm">
          {/* <div className="card-header bg-primary text-white">
            <h5 className="mb-0">KYC Verification Form</h5>
          </div> */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
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
                  required
                />
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
                  required
                />
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
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="aadhar" className="form-label">
                  {/* Address */}
                  Aadhar No.
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="aadhar"
                  name="aadhar"
                  placeholder="Enter your aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="panno" className="form-label">
                  {/* Address */}
                  PAN No.
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="panno"
                  name="panno"
                  placeholder="Enter your Pan No"
                  value={formData.panno}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleKycSubmit}
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
    </Content>
  );
}

export default Kyc;
