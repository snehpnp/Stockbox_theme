import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, ChevronRight } from "lucide-react";

const Content = ({
  Page_title,
  button_title,
  backForword,
  Page_title_showClient,
  backbutton_title,
  button_status,
  backbutton_status,
  route,
  permissions, // Add a permissions prop
  ...rest
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    if (backbutton_title === "Back") {
      window.history.back();
    }
  };
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="page-titles">
          <nav className="breadcrumb">
            <div className="col-lg-6">
              <ul className="breadcrumb-links">
                <li>
                  <House onClick={handleHomeClick}></House>

                  <a href="/" className="breadcrumb-box" />
                </li>
                <li>
                  <ChevronRight />
                </li>
                <li>
                  <div className="breadcrumb-box">
                    <h6 className="heading-color mb-0 breadcrumb-text">
                      {Page_title}
                    </h6>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              {backbutton_status && backbutton_title && (
                <button
                  onClick={handleBackClick} // Handle back button click
                  className="btn btn-primary float-lg-end ms-3"
                >
                  <i
                    className={`fa-solid ${
                      backbutton_title === "Back"
                        ? "fa-arrow-left"
                        : "fa-arrow-left"
                    }`}
                  ></i>{" "}
                  {backbutton_title}
                </button>
              )}
              {button_status === false ? null : (
                <Link
                  to={route}
                  className="btn btn-primary float-lg-end"
                  style={{ padding: "10px !important" }}
                >
                  <i
                    className={`fa-solid  ${
                      button_title === "Back" ? "fa-arrow-left" : "fa-plus"
                    } `}
                  ></i>{" "}
                  {button_title}
                </Link>
              )}
              {backForword && (
                <button
                  onClick={() => window.history.back()} // Handle back button click
                  className="btn btn-primary float-lg-end ms-3"
                >
                  <i className={`fa-solid fa-arrow-left`}></i> Back
                </button>
              )}
            </div>
          </nav>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="row">
              <div className="col-xl-12">
                <div className="card form-card">
                  <div className="card-body">
                    <div className="form-validation">{rest.children}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
