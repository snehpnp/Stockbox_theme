import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getstaffperuser,
  WebLinkforMedia,
  basicsettinglist,
} from "../../../Services/Admin/Admin";
import Swal from "sweetalert2";

const Profile = () => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [data, setData] = useState([]);
  const [clients, setClients] = useState(null);

  const [weblink, setWeblink] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });

  useEffect(() => {
    getpermissioninfo();
    getsettingdetail();
  }, []);

  const getpermissioninfo = async () => {
    try {
      const response = await getstaffperuser(userid, token);
      if (response.status) {
        setData([response.data]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getsettingdetail = async () => {
    try {
      const response = await basicsettinglist(token);
      if (response.status) {
        setWeblink(response.data[0]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const Updateweblink = async () => {
    try {
      const data = {
        facebook: weblink.facebook,
        instagram: weblink.instagram,
        twitter: weblink.twitter,
        youtube: weblink.youtube,
      };

      const response = await WebLinkforMedia(data, token);

      if (response.status) {
        Swal.fire({
          title: "Success!",
          text: "Web links updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "There was an issue updating the web links.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div className="page-content">
        <div className="page-breadcrumb  d-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Admin Profile</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard">
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <hr />
        {/*breadcrumb*/}

        {/*end breadcrumb*/}
        <div className="container">
          <div className="main-body">
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="row ">
                
                    </div>
                    <div className="d-flex flex-column align-items-center text-center">
                   
                      {data.map((item) => (
                        <div className="mt-3" key={item.FullName}>
                          <h4>{item.FullName}</h4>
                        </div>
                      ))}
                    </div>
                    <hr className="my-4" />
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <div class="app-icon">
                            <img
                              src="assets/images/app/youtube.png"
                              width="30"
                              alt=""
                            />
                          </div>
                        </h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.youtube.com/"
                          style={{ width: "auto" }}
                          value={weblink.youtube}
                          onChange={(e) => {
                            setWeblink({ ...weblink, youtube: e.target.value });
                          }}
                        />
                      </li>

                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-twitter me-2 icon-inline text-info"
                          >
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                          </svg>
                        </h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://x.com/?lang=en"
                          style={{ width: "auto" }}
                          value={weblink.twitter}
                          onChange={(e) => {
                            setWeblink({ ...weblink, twitter: e.target.value });
                          }}
                        />
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-instagram me-2 icon-inline text-danger"
                          >
                            <rect
                              x={2}
                              y={2}
                              width={20}
                              height={20}
                              rx={5}
                              ry={5}
                            />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.instagram.com/accounts/login/?hl=en"
                          style={{ width: "auto" }}
                          value={weblink.instagram}
                          onChange={(e) => {
                            setWeblink({
                              ...weblink,
                              instagram: e.target.value,
                            });
                          }}
                        />
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-facebook me-2 icon-inline text-primary"
                          >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                          </svg>
                        </h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.facebook.com/help"
                          style={{ width: "auto" }}
                          value={weblink.facebook}
                          onChange={(e) => {
                            setWeblink({
                              ...weblink,
                              facebook: e.target.value,
                            });
                          }}
                        />
                      </li>
                    </ul>

                    <div className="col-sm-12 d-flex justify-content-end">
                      <div
                        className="btn btn-primary mb-0"
                        style={{ fontSize: "14px" }}
                        onClick={Updateweblink}
                      >
                        Update
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body mt-1">
                    {data &&
                      data.map((item, index) => (
                        <div key={index}>
                          <div className="row mb-3">
                            <div className="col-sm-12 d-flex justify-content-end">
                              <Link
                                to="/admin/changepass"
                                className="btn btn-primary mb-0"
                                style={{ fontSize: "14px" }}
                              >
                                Change Password
                              </Link>
                            </div>
                            <div className="col-sm-9 text-secondary"></div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Full Name</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              <p>{item.FullName}</p>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Email</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              <p>{item.Email}</p>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Phone</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              <p>{item.PhoneNo}</p>
                            </div>
                          </div>
                  
                        </div>
                      ))}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-group">
        <div
          className="modal fade"
          id="example2"
          tabIndex={-1}
          aria-labelledby="example2"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="example"></h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <ul>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Title</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Price</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Validity</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Description</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Created At</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                  <li>
                    <div className="row justify-content-between">
                      <div className="col-md-6">
                        <b>Updated At</b>
                      </div>
                      <div className="col-md-6"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
