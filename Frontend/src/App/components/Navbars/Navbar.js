import React, { useEffect, useState } from "react";
import Logo from "../Images/LOGO.png";
import ProfileImage from "../Images/logo1.png";
import { FaBell, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ReadNotificationStatus, getDashboardNotification, GetAllNotificationRead } from '../../Services/Admin/Admin'
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';


const Navbar = ({ headerStatus, toggleHeaderStatus }) => {


  useEffect(() => {
    getdemoclient()
  }, [])

  const navigate = useNavigate();

  const theme = JSON.parse(localStorage.getItem("theme")) || {};
  const Role = localStorage.getItem("Role");
  const token = localStorage.getItem('token');

  const [clients, setClients] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [model, setModel] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [getstatus, setGetstatus] = useState([]);
  const [badgecount, setBadgecount] = useState([]);




  const Logout = () => {
    localStorage.clear();
    if (Role == "USER") {
      window.location.href = "/user-login";
    } else {
      window.location.href = "/login";
    }
  };







  const handleNotificationClick = async (event, notification) => {
    const user_active_status = "1";
    const data = { id: notification._id, status: user_active_status };

    try {
      const response = await ReadNotificationStatus(data, token);
      if (response.status) {
        if (notification.type === "payout") {
          navigate("/admin/paymentrequest")
          getdemoclient()
        } else if (notification.type === "add client") {
          navigate("/admin/client")
          getdemoclient()
        } else if (notification.type === "plan purchase") {
          navigate("/admin/paymenthistory")
          getdemoclient()
        } else if (notification.type === "plan expire") {
          navigate("/admin/planexpiry")
          getdemoclient()
        } else {
          navigate("/admin/client")
          getdemoclient()

        }
      } else {
        Swal.fire(
          "Error",
          "Failed to update the notification status.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "There was an error processing your request.",
        "error"
      );
    }
  };



  const getdemoclient = async () => {
    try {
      const response = await getDashboardNotification(token);
      if (response.status) {
        setBadgecount(response?.unreadCount)
        setClients(response?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };




  const getAllMessageRead = async () => {
    try {
      const response = await GetAllNotificationRead(token);
      navigate("/admin/notificationlist");
      getdemoclient()
    } catch (error) {
      console.error("Error while marking notifications as read:", error);
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
          <div className="row w-100 align-items-center">
            <div className="col-5 ps-0">
              <div className="d-flex align-items-center">
                <a className="navbar-brand me-1 p-0" href="#">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "150px", height: "50px", objectFit: "contain" }}
                  />
                </a>
                <button
                  className="btn btn-light ms-1 me-2 px-1 pb-1"
                  onClick={toggleSidebar}
                  style={{
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    height: "35px",
                  }}
                >
                  <i className="bx bx-menu" style={{ fontSize: "24px" }}></i>
                </button>
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
            <div className="col-7 pe-0">
              <div className="d-flex align-items-center position-relative justify-content-end">
                <div className="d-sm-flex">
                  <span className="switch-label p-1">
                    Trading Status:
                  </span>
                  <div
                    className="form-check form-switch form-check-dark mb-0"
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

                {/* <div className="dropdown">
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
                </div> */}
                {Role === "ADMIN" && (
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
                      {badgecount ? (
                        <span
                          className="alert-count"
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            padding: "4px 8px",
                            zIndex: 1051,
                          }}
                        >
                          {badgecount > 100 ? "99+" : badgecount}
                        </span>
                      ) : null}
                      <FaBell size={24} />
                    </div>

                    <div
                      style={{
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        minWidth: "320px",
                        maxWidth: "400px",
                        zIndex: 1050,
                        padding: "10px",
                        overflow: "hidden",
                      }}
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <div
                        className="msg-header d-flex justify-content-between align-items-center"
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <p
                          className="msg-header-title"
                          style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}
                        >
                          Notifications
                        </p>
                        <span
                          className="msg-header-badge"
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "500",
                            borderRadius: "12px",
                            padding: "2px 8px",
                          }}
                        >
                          {clients.filter((notification) => notification.status === 0).length}
                        </span>
                      </div>
                      <div
                        className="header-notifications-list"
                        style={{
                          overflowY: "auto",
                          maxHeight: "300px",
                          paddingRight: "10px",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#c1c1c1 transparent",
                        }}
                      >
                        {clients.length > 0 ? (
                          clients.map((notification, index) => (
                            <div
                              key={index}
                              className={`dropdown-item notification ${notification.status === 1
                                ? "text-info font-bold"
                                : "text-muted bg-light"
                                }`}
                              onClick={(event) =>
                                handleNotificationClick(event, notification)
                              }
                              style={{
                                padding: "10px",
                                marginBottom: "5px",
                                borderRadius: "6px",
                                background: notification.status === 0 ? "#f8f9fa" : "white",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <h6
                                    className="msg-name"
                                    style={{
                                      margin: 0,
                                      fontWeight: notification.status === 1 ? "normal" : "bold",
                                    }}
                                  >
                                    {notification?.title}
                                    <span
                                      className="msg-time float-end"
                                      style={{ fontSize: "12px", color: "#6c757d" }}
                                    >
                                      {notification.createdAt
                                        ? formatDistanceToNow(new Date(notification.createdAt), {
                                          addSuffix: true,
                                        })
                                        : "Empty Message"}
                                    </span>
                                  </h6>
                                  <p
                                    className="msg-info"
                                    title={notification.message}
                                    style={{
                                      fontSize: "14px",
                                      color: "#6c757d",
                                      margin: "4px 0 0",
                                    }}
                                  >
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              color: "#6c757d",
                            }}
                          >
                            <h4>No Notifications</h4>
                          </div>
                        )}
                      </div>
                      <div className="text-center msg-footer mt-2">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => getAllMessageRead()}
                          style={{
                            borderRadius: "6px",
                            fontWeight: "500",
                          }}
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}










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
