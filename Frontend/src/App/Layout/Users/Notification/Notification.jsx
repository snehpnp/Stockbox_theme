import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { GetNotificationData } from "../../../Services/UserService/User";

const Notification = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  // Get data from API
  const GetNotificationDataApi = async () => {
    try {
      const response = await GetNotificationData({ user_id: userid }, token);
      if (response.status) {
        setNotificationData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch notification data on page load
  useEffect(() => {
    GetNotificationDataApi();
  }, []);

  // Logic for pagination
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notificationData.slice(indexOfFirstNotification, indexOfLastNotification);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-content">
      <div className="notifications-list">
        {currentNotifications.map((notification, index) => (
          <div key={index} className="notification-item d-flex align-items-center border-bottom py-3">
            <div
              className="rounded-circle p-2 border d-flex align-items-center justify-content-center btn-primary"
              style={{ width: "50px", height: "50px", textAlign: "center" }}
            >
              <Bell />
            </div>

            <div className="flex-grow-1 ms-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mt-0 mb-1 text-dark">{notification.title}</h6>
                <small className="text-muted">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
              <p className="mt-0 mb-1">{notification.message}</p>
            </div>

            {/* Status Indicator */}
            <div className="ms-3">
              {notification.status === 0 ? (
                <span className="badge bg-success">
                  ✔️ Viewed
                </span>
              ) : (
                <span className="badge bg-warning">
                  ⏳ Unseen
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center mt-4">
          {Array.from({ length: Math.ceil(notificationData.length / notificationsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Notification;
