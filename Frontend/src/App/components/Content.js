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
          <ol className="row breadcrumb">
            <div className="col-lg-6">
              <li className="breadcrumb-item">
                <h4 className="font-w500 mb-0">{Page_title}</h4>
                <h4 className="font-w500 mb-0">{Page_title_showClient}</h4>
              </li>
            </div>

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
          </ol>
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
