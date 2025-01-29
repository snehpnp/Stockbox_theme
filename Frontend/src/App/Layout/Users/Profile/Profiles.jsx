  import React from "react";
  import { Link } from "react-router-dom";
  import Content from "../../../components/Contents/Content";

  const Profiles = () => {
    return (
      <Content
        Page_title="User Profile"
        button_status={false}
        backbutton_status={false}
      >
        <div className="container mt-4">
          <div className="row">
            {/* Sidebar Section */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h4 className="mb-3">Test User</h4>
                </div>
                <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <Link to="/user/subscription">Change Password</Link>
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

            {/* Profile Information Section */}
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Profile Information</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Full Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Test User"
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Email</label>
                    <div className="col-sm-9">
                      <input
                        type="email"
                        className="form-control"
                        defaultValue="test@gmail.com"
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Phone</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="(987) 543-2109"
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Address</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Bay Area, San Francisco, CA"
                      />
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
      </Content>
    );
  };

  export default Profiles;
