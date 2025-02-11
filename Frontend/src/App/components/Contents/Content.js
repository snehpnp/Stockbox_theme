import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, Tally1 } from "lucide-react";

const Content = ({
  Page_title,
  button_title,
  button_title1,
  backForword,
  Page_title_showClient,
  backbutton_title,
  button_status,
  button_status1,
  backbutton_status,
  route,
  route1,
  state1,
  permissions,
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
            <div className="col-lg-6 col-sm-6 col-12">
              <ul className="breadcrumb-links">
                <li>

                  <a className="bx bx-home-alt" onClick={handleHomeClick} style={{ fontSize: "20px", marginLeft: "3px", marginTop: "5px" }} />
                </li>
                <li style={{ width: "2px" }}>

                  |
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
            <div className="col-lg-6 col-sm-6  col-12">
              {backbutton_status && backbutton_title && (
                <button
                  onClick={handleBackClick}
                  className="btn btn-primary float-sm-end  ms-3  mt-3 mt-sm-0 "


                >
                  <i
                    className={`fa-solid ${backbutton_title === "Back"
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
                  className="btn btn-primary  float-sm-end  float-start mt-3 mt-sm-0"
                  style={{ padding: "10px !important" }}
                >
                  <i
                    className={`fa-solid  ${button_title === "Back" ? "fa-arrow-left" : "fa-plus"
                      } `}
                  ></i>{" "}
                  {button_title}
                </Link>
              )}
              {button_status1 && (
                <Link
                  to={route1}
                  state={state1}
                  className="btn btn-primary  float-sm-end  float-start mt-3 mt-sm-0"
                  style={{ padding: "10px !important" }}
                >
                  <i
                    className={`fa-solid  ${button_title1 === "Back" ? "fa-arrow-left" : "fa-plus"
                      } `}
                  ></i>{" "}
                  {button_title1}
                </Link>
              )}
              {backForword && (
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-primary float-sm-end ms-0 ms-sm-3 mt-3 mt-sm-0"


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
                    <div className="form-validation" style={{ minHeight: "500px" }}>{rest.children}</div>
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
