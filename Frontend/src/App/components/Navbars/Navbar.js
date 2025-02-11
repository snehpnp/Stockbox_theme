import React, { useEffect, useState } from "react";
import Logo from "../Images/LOGO.png";
import ProfileImage from "../Images/logo1.png";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  ReadNotificationStatus,
  getDashboardNotification,
  GetAllNotificationRead,
  gettradestatus,
  basicsettinglist,
  UpdateLogin_status,
} from "../../Services/Admin/Admin";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import { image_baseurl } from "../../../Utils/config";
import BrokersData from "../../../Utils/BrokersData";
import axios from "axios";
import { GetUserData } from "../../Services/UserService/User";
import { GetNotificationData } from "../../Services/UserService/User";

const Navbar = ({ headerStatus, toggleHeaderStatus }) => {
  useEffect(() => {
    getdemoclient();
    gettradedetail();
    getuserdetail();
  }, []);

  const navigate = useNavigate();
  const theme = JSON.parse(localStorage.getItem("theme")) || {};
  const Role = localStorage.getItem("Role");
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [clients, setClients] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [model, setModel] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [getstatus, setGetstatus] = useState([]);
  const [badgecount, setBadgecount] = useState([]);
  const [viewmodel, setViewModel] = useState(false);
  const [UserDetail, setUserDetail] = useState([]);
  const [userNotification, setUserNotification] = useState([]);
  const [statusinfo, setStatusinfo] = useState({
    aliceuserid: "",
    apikey: "",
    secretkey: "",
  });

  const Logout = () => {
    localStorage.clear();
    if (Role === "USER") {
      window.location.href = "/#/user-login";
    } else if (Role === "ADMIN" || Role === "SUPERADMIN" || Role === "EMPLOYEE") {
      window.location.href = "/#/login";
    }
  };





  const handleNotificationClick = async (event, notification) => {
    const user_active_status = "1";
    const data = { id: notification._id, status: user_active_status };

    try {
      const response = await ReadNotificationStatus(data, token);
      if (response.status) {
        if (notification.type === "payout") {
          navigate("/admin/paymentrequest");
          getdemoclient();
        } else if (notification.type === "add client") {
          navigate("/admin/client");
          getdemoclient();
        } else if (notification.type === "plan purchase") {
          navigate("/admin/paymenthistory");
          getdemoclient();
        } else if (notification.type === "plan expire") {
          navigate("/admin/planexpiry");
          getdemoclient();
        } else {
          navigate("/admin/client");
          getdemoclient();
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
    if (Role == "ADMIN") {
      try {
        const response = await getDashboardNotification(token);
        if (response.status) {
          setBadgecount(response?.unreadCount);
          setClients(response?.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    } else if (Role == "USER") {
      try {
        const response = await GetNotificationData({ user_id: userid }, token);
        if (response.status) {
          setUserNotification(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllMessageRead = async () => {
    try {
      const response = await GetAllNotificationRead(token);
      navigate("/admin/notificationlist");
      getdemoclient();
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

  const gettradedetail = async () => {
    try {
      const response = await basicsettinglist(token);
      if (response?.status) {
        const data = response.data?.[0];
        if (data) {
          setGetstatus(response.data);

          const faviconElement = document.querySelector("link[rel='icon']");
          if (faviconElement) {
            faviconElement.href = `${image_baseurl}uploads/basicsetting/${data.favicon}`;
          } else {
            console.warn("Favicon element not found");
          }

          const companyNameElement = document.querySelector(".companyName");
          if (companyNameElement) {
            companyNameElement.textContent = data.from_name;
          }
          if (data.staffstatus === 0) {
            localStorage.clear();
          }
        }
      } else {
        console.error("Invalid response status:", response);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getstatusdetaile = async () => {
    if (
      !statusinfo.aliceuserid ||
      !statusinfo.apikey ||
      !statusinfo.secretkey
    ) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all fields",
        icon: "warning",
        confirmButtonText: "OK",
        timer: 2000,
      });
      return;
    }
    const data = {
      aliceuserid: statusinfo.aliceuserid || getstatus[0].aliceuserid,
      apikey: statusinfo.apikey || getstatus[0].apikey,
      secretkey: statusinfo.secretkey || getstatus[0].secretkey,
    };
    try {
      const response = await gettradestatus(data, token);
      if (response.status === true && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const UpdateloginOff = async (e) => {
    const dataoff = e.target.checked ? 1 : 0;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log off?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log off",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            brokerloginstatus: dataoff,
          };
          const response = await UpdateLogin_status(data, token);
          if (response?.status) {
            Swal.fire({
              icon: "success",
              title: "Successful!",
              text: "Status Log Out Successful",
              timer: 1500,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an error logging out",
            timer: 1500,
            timerProgressBar: true,
          });
        }
      }
    });
  };

  const handleToggle = () => {
    if (getstatus[0]?.brokerloginstatus === 1) {
      setIsChecked(!isChecked);
    } else {
      setModel(true);
      setStatusinfo({
        aliceuserid: getstatus[0]?.aliceuserid || "",
        apikey: getstatus[0]?.apikey || "",
        secretkey: getstatus[0]?.secretkey || "",
      });
    }
  };

  useEffect(() => {
    if (getstatus[0]?.brokerloginstatus === 1) {
      setIsChecked(true);
    }
    if (UserDetail?.tradingstatus === 1) {
      setIsChecked(true);
    }
  }, [getstatus, UserDetail]);

  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const TradingBtnCall = async (e) => {
    if (UserDetail.dlinkstatus == 0) {
      setViewModel(true);
    } else {
      if (UserDetail.brokerid == 1) {
        window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${UserDetail.apikey}`;
      } else if (UserDetail.brokerid == 2) {
        window.location.href = `https://ant.aliceblueonline.com/?appcode=${UserDetail.apikey}`;
      } else if (UserDetail.brokerid == 3) {
      } else if (UserDetail.brokerid == 4) {
      }
    }
  };

  const closeBrokerModal = () => {
    setViewModel(false);
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
                    style={{
                      width: "150px",
                      height: "50px",
                      objectFit: "contain",
                    }}
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
                  ) : (
                    ""
                  )}
                  <li style={dropdownItemStyle} onClick={(e) => Logout()}>
                    🚪 Logout
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-7 pe-0">
              <div className="d-flex align-items-center position-relative justify-content-end">
                {Role === "ADMIN" ? (
                  <div className="d-flex me-1">
                    <span className="switch-label p-1">
                      Login with API:
                      {/* <span style={{ color: isChecked ? "green" : "red", fontSize: 16 }}>
                        {isChecked ? "On" : "Off"}
                      </span> */}
                    </span>
                    <div
                      className="form-check form-switch form-check-dark mb-0"
                      style={{ margin: "inherit", fontSize: 21 }}
                    >
                      {/* <span style={{ color: "red", fontSize: 16 }}>Off</span> */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDark"
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleToggle();
                          } else {
                            setIsDisabled(true);
                            // UpdateloginOff(e);
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="d-flex">
                    <span className="switch-label p-1">Login with API:</span>
                    <div
                      className="form-check form-switch form-check-dark mb-0"
                      style={{ margin: "inherit", fontSize: 21 }}
                    >
                      {/* <span style={{ color: isChecked ? "green" : "red", fontSize: '16px' }}>
                        {isChecked ? "On" : "Off"}
                      </span> */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDark"
                        disabled={isChecked}
                        checked={isChecked}
                        onClick={(e) => TradingBtnCall()}
                      />
                    </div>
                  </div>
                )}

                {Role === "ADMIN" ? (
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
                      <FaBell size={20} className="" />
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
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            margin: 0,
                          }}
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
                          {
                            clients?.filter(
                              (notification) => notification?.status === 0
                            )?.length
                          }
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
                        {clients?.length > 0 ? (
                          clients?.map((notification, index) => (
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
                                background:
                                  notification.status === 0
                                    ? "#f8f9fa"
                                    : "white",
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
                                      fontWeight:
                                        notification.status === 1
                                          ? "normal"
                                          : "bold",
                                    }}
                                  >
                                    {notification?.title}
                                    <span
                                      className="msg-time float-end"
                                      style={{
                                        fontSize: "12px",
                                        color: "#6c757d",
                                      }}
                                    >
                                      {notification.createdAt
                                        ? formatDistanceToNow(
                                          new Date(notification.createdAt),
                                          {
                                            addSuffix: true,
                                          }
                                        )
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
                ) :
                  Role === "USER" ? (
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
                        <FaBell size={20} />
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
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              margin: 0,
                            }}
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
                            {
                              userNotification?.filter(
                                (notification) => notification?.status === 0
                              )?.length
                            }
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
                          {userNotification?.length > 0 ? (
                            userNotification?.map((notification, index) => (
                              <div
                                key={index}
                                className={`dropdown-item notification ${notification.status === 1
                                  ? "text-info font-bold"
                                  : "text-muted bg-light"
                                  }`}
                                style={{
                                  padding: "10px",
                                  marginBottom: "5px",
                                  borderRadius: "6px",
                                  background:
                                    notification.status === 0
                                      ? "#f8f9fa"
                                      : "white",
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
                                        fontWeight:
                                          notification.status === 1
                                            ? "normal"
                                            : "bold",
                                      }}
                                    >
                                      {notification?.title}
                                      <span
                                        className="msg-time float-end"
                                        style={{
                                          fontSize: "12px",
                                          color: "#6c757d",
                                        }}
                                      >
                                        {notification.createdAt
                                          ? formatDistanceToNow(
                                            new Date(notification.createdAt),
                                            {
                                              addSuffix: true,
                                            }
                                          )
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
                  ) : (
                    ""
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
                        {Role === "USER" && (
                          <Link to="/user/profile">🛠️ Profile Settings</Link>
                        )}
                        {Role === "ADMIN" && (
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

        {model && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal fade show"
              style={{ display: "block" }}
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Login with API
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModel(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <form>
                      <label> User ID </label>
                      <input
                        type="text"
                        className="form-control"
                        value={statusinfo.aliceuserid}
                        onChange={(e) =>
                          setStatusinfo({
                            ...statusinfo,
                            aliceuserid: e.target.value,
                          })
                        }
                      />
                      <label> API Key </label>
                      <input
                        type="text"
                        className="form-control"
                        value={statusinfo.apikey}
                        onChange={(e) =>
                          setStatusinfo({
                            ...statusinfo,
                            apikey: e.target.value,
                          })
                        }
                      />
                      <label> Secret Key </label>
                      <input
                        type="text"
                        className="form-control"
                        value={statusinfo.secretkey}
                        onChange={(e) =>
                          setStatusinfo({
                            ...statusinfo,
                            secretkey: e.target.value,
                          })
                        }
                      />
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModel(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={getstatusdetaile}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {viewmodel && (
          <BrokersData closeModal={closeBrokerModal} data={UserDetail} />
        )}
      </nav>
    </>
  );
};

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
