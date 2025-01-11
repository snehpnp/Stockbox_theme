import React from "react";
import { Link } from "react-router-dom";

const Content = ({
  Page_title,
  button_title,
  Page_title_showClient,
  button_status,
  route,
  ...rest
}) => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="page-titles">
          {/* <div className="row mb-3">
            <div className="col-lg-6"></div>
          </div> */}

          <nav className="breadcrumb">
            <div className="col-lg-6">
              <ul className="breadcrumb-links">
                <li>
                  <a href="#" className="breadcrumb-box">
                    <svg
                      className="breadcrumb-icon-home"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <div className="breadcrumb-box">
                    <svg
                      className="breadcrumb-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="mb-0 breadcrumb-text">{Page_title}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              {button_status == false ? null : (
                <div className="col-lg-6 ">
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
                </div>
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
