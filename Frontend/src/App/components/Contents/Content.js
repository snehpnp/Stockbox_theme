import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Content = ({
  Page_title,
  button_title,
  Page_title_showClient,
  button_status,
  route,
  permissions, // Add a permissions prop
  ...rest
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="page-titles">
          <nav className="breadcrumb">
            <div className="col-lg-6">
              <ul className="breadcrumb-links">
                <li>
                  <i className="fa-solid fa-house" onClick={handleHomeClick}></i>
                  <a href="/" className="breadcrumb-box" />
                </li>

                <li>
                  <div className="breadcrumb-box">
                    <i className="fa-solid fa-chevron-right breadcrumb-icon"></i>
                    <p className="mb-0 breadcrumb-text">{Page_title}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              {button_status === false ? null : (
                
                
                  <Link
                    to={route}
                    className="btn btn-primary float-lg-end "
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
