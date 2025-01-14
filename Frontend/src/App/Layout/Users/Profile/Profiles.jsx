import React from "react";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";

const Profiles = () => {
  return (
    <div>
          <Content
      Page_title="Profile"
      
      button_status={false}
      backbutton_status={false}

    >
      <div className="page-content">
        {/*breadcrumb*/}
      
        {/*end breadcrumb*/}
        <div className="container">
          <div className="main-body">
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src="/assets/images/user.png"
                        alt="Admin"
                        className="rounded-circle p-1 bg-primary"
                        width={110}
                      />
                      <div className="mt-3">
                        <h4>Test</h4>
                      </div>
                    </div>
                    {/* <hr className="my-4" /> */}
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">Change Password</h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <Link to="/client/subscription">
                            {" "}
                            My Subscription
                          </Link>
                        </h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <Link to="/client/kyc"> KYC Pending</Link>
                        </h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">Wallet</h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <Link to="/client/paymenthistory">
                            Payment History
                          </Link>
                        </h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">My Basket Subscription</h6>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body py-0">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <Link to="/login" onClick={(e) => localStorage.clear()}>
                          <i className="bx bx-log-out-circle pe-2" />
                          Logout
                        </Link>
                        </h6>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <Link to="">
                            {" "}
                            <i className="bx bxs-message-square-x"></i> Delete
                            Account
                          </Link>
                        </h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3 align-items-center">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Test"
                        />
                      </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="test@gmail.com"
                        />
                      </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Phone</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="(987543210) 816-9029"
                        />
                      </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Address</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Bay Area, San Francisco, CA"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3" />
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="button"
                          className="btn btn-primary px-4"
                          defaultValue="Update"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Content>
    </div>
  );
};

export default Profiles;
