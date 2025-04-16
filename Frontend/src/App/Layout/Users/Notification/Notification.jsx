import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { GetNotificationData } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";
import Loader from "../../../../Utils/Loader";

const Notification = () => {


  const [notificationData, setNotificationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");


  const GetNotificationDataApi = async () => {

    setIsLoading(true);
    try {
      const data = { user_id: userid, page: currentPage };
      const response = await GetNotificationData(data, token);
      if (response.status) {
        setNotificationData(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  console.log("currentPage", currentPage)


  useEffect(() => {
    GetNotificationDataApi();
  }, [currentPage]);




  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);




  return (

    <Content Page_title="Notifications"
      button_status={false}
      backbutton_status={true}>
      <div className="page-content">
        {isLoading ? (
          <Loader />
        ) : notificationData.length === 0 ? (
          <div className="text-center text-muted mt-4">
            <div className="text-center mt-5">
              <img src="/assets/images/norecordfound.png" alt="No Records Found" />
            </div>
          </div>
        ) : (
          <div className="notifications-list">
            {notificationData.map((notification, index) => (
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
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center mt-4">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prevPage}>
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={nextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </Content>
  );
};

export default Notification;
