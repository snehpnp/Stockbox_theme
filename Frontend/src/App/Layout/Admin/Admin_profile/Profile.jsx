import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getstaffperuser,
  WebLinkforMedia,
  basicsettinglist,
} from "../../../Services/Admin/Admin";
import Swal from "sweetalert2";
import { FaYoutube, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import Content from "../../../components/Contents/Content";

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
              {/* Profile Card */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body text-center">
                    {data.map((item) => (
                      <div className="mt-3" key={item.FullName}>
                        <h4>{item.FullName}</h4>
                      </div>
                    ))}
                    <hr className="my-4" />
                    <ul className="list-group list-group-flush f">
                      {[
                        { icon: <FaYoutube color="red" />, key: "youtube", placeholder: "https://www.youtube.com/" },
                        { icon: <FaTwitter color="#1DA1F2" />, key: "twitter", placeholder: "https://x.com/?lang=en" },
                        { icon: <FaInstagram color="#C13584" />, key: "instagram", placeholder: "https://www.instagram.com/" },
                        { icon: <FaFacebook color="#1877F2" />, key: "facebook", placeholder: "https://www.facebook.com/help" },
                      ].map(({ icon, key, placeholder }) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap" key={key}>
                          <h6 className="mb-0 " style={{ fontSize: "20px" }}>{icon}</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={placeholder}
                            style={{ width: "auto" }}
                            value={weblink[key]}
                            onChange={(e) => setWeblink({ ...weblink, [key]: e.target.value })}
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-end mt-3">
                      <button className="btn btn-primary" style={{ fontSize: "14px" }} onClick={Updateweblink}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body mt-1">
                    {data.map((item, index) => (
                      <div key={index}>
                        <div className="d-flex justify-content-end mb-3">
                          <Link to="/admin/changepass" className="btn btn-primary" style={{ fontSize: "14px" }}>
                            Change Password
                          </Link>
                        </div>
                        {[
                          { label: "Full Name", value: item.FullName },
                          { label: "Email", value: item.Email },
                          { label: "Phone", value: item.PhoneNo },
                        ].map(({ label, value }, i) => (
                          <div className="row mb-3" key={i}>
                            <div className="col-sm-3">
                              <h6 className="mb-0">{label}</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              <p>{value}</p>
                            </div>
                          </div>
                        ))}
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
