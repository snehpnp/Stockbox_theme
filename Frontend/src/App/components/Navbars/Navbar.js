import React, { useState } from "react";
import Logo from "../Images/LOGO.png";
import ProfileImage from "../Images/logo1.png";
import { FaBell, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ headerStatus, toggleHeaderStatus }) => {
  const theme = JSON.parse(localStorage.getItem("theme")) || {};

  const Role = localStorage.getItem("Role");


  const Logout = () => {
    localStorage.clear();
    if (Role == "USER") {
      window.location.href = "/user-login";
    } else {
      window.location.href = "/login";
    }
  };



  const toggleSidebar = () => {
    const body = document.body;

    if (body.classList.contains("sidebar-open")) {
      body.classList.remove("sidebar-open");
      body.classList.add("sidebar-closed", "sidebar-collapsed");
    } else {
      body.classList.remove("sidebar-closed", "sidebar-collapsed");
      body.classList.add("sidebar-open");
    }
  };




  return (
    <>

      <nav
        className="navbar navbar-expand-lg TopNavbar"
        style={{
          background:
            theme.navbarColor || "linear-gradient(to right, #1d37fc, #e81717)",

        }}
      >
        <div className="container-fluid justify-content-center">
          <div className="row w-100">
            <div className="col-5">
              <div className="d-flex ">
                <a className="navbar-brand" href="#">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "150px", height: "50px", objectFit: "contain" }}
                  />
                </a>
                <button
                  className="btn btn-light me-2"
                  onClick={toggleSidebar}
                  style={{
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    height: "30px",
                  }}
                />
              </div>

              <div
                style={profileDropdownStyle}
                className="dropdown-menu"
                aria-labelledby="dropdownMenuLink"
              >
                <ul style={dropdownListStyle}>
                  {Role === "ADMIN" ? (
                    <li style={dropdownItemStyle}>
                      <Link to="/admin/profiles">🛠️ Profile</Link>
                    </li>
                  ) : Role === "EMPLOYEE" ? (
                    <li style={dropdownItemStyle}>
                      <Link to="/employee/profiles">🛠️ Profile</Link>
                    </li>
                  ) : Role === "USER" ? (
                    <li style={dropdownItemStyle}>
                      <Link to="/user/profiles">🛠️ Profile</Link>
                    </li>
                  ) : ""}
                  <li style={dropdownItemStyle} onClick={(e) => Logout()}>
                    🚪 Logout
                  </li>
                </ul>
              </div>

            </div>
            <div className="col-7">
              <div className="d-flex align-items-center position-relative justify-content-end">
                <div className="d-sm-flex">
                  <span className="switch-label p-1">
                    Trading Status:
                  </span>
                  <div
                    className="form-check form-switch form-check-dark"
                    style={{ margin: "inherit", fontSize: 21 }}
                  >
                    <span style={{ color: "red", fontSize: 16 }}>Off</span>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDark"
                    />
                  </div>
                </div>

                <div className="dropdown">
                  <div
                    className="notification-container dropdown-toggle"
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      position: "relative",
                    }}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaBell size={24} />
                  </div>

                  <div
                    style={notificationDropdownStyle}
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <div style={notificationHeaderStyle}>Notifications</div>
                    <ul style={notificationListStyle}>
                      <li style={notificationItemStyle}>
                        🔔 New message from admin
                      </li>
                      <li style={notificationItemStyle}>
                        🔔 Your profile was updated
                      </li>
                      <li style={notificationItemStyle}>
                        🔔 System maintenance scheduled
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="dropdown">
                  <div
                    className="profile-container dropdown-toggle"
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={ProfileImage}
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff",
                      }}
                    />
                  </div>

                  <div
                    style={profileDropdownStyle}
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <ul style={dropdownListStyle}>
                      <li style={dropdownItemStyle}>
                        {Role === 'USER' && (
                          <Link to="/user/profile">🛠️ Profile Settings</Link>
                        )}
                        {Role === 'ADMIN' && (
                          <Link to="/admin/profile">🛠️ Profile Settings</Link>
                        )}


                      </li>

                      <li style={dropdownItemStyle} onClick={(e) => Logout()}>
                        🚪 Logout
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
      </nav>
    </>
  );
};

// 🎨 **Styles**

const profileDropdownStyle = {
  left: "-90px",
};

const notificationDropdownStyle = {
  left: "-180px",
  width: "230px",
};

const dropdownListStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const dropdownItemStyle = {
  padding: "10px 15px",
  borderBottom: "1px solid #f1f1f1",
  cursor: "pointer",
  fontSize: "14px",
};

const notificationHeaderStyle = {
  padding: "10px 15px",
  fontSize: "16px",
  fontWeight: "bold",
  borderBottom: "1px solid #f1f1f1",
};

const notificationListStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const notificationItemStyle = {
  padding: "10px 15px",
  borderBottom: "1px solid #f1f1f1",
  cursor: "pointer",
  fontSize: "14px",
};

export default Navbar;
