import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { GetBroadcastData } from "../../../Services/UserService/User";
import { MessageCircleMore } from "lucide-react";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";




const Broadcast = () => {

  const [broadcastData, setBroadcastData] = useState([]);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    GetBrodcast();
  }, []);


  const GetBrodcast = async () => {
    setIsLoading(true);
    try {
      const response = await GetBroadcastData(userid, token);
      if (response.status) {
        setBroadcastData(response.data);
      } else {
        setBroadcastData([])
      }
    } catch (error) {

      showCustomAlert("error", "Something went wrong while fetching broadcast data!");
    }

    setIsLoading(false);
  };




  return (
    <div>
      <Content
        Page_title="Broadcast"
        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content">
          {isLoading ? <Loader />
            :
            <div className="page-content" style={{ padding: "20px" }}>
              <ul className="list-unstyled" style={{ margin: "0", padding: "0" }}>
                {broadcastData.length === 0 ? (
                  <div className="text-center mt-5">
                    <div className="text-center mt-5">
                      <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                    </div>
                  </div>
                ) : (
                  broadcastData.map((item, index) => (
                    <li
                      key={index}
                      className="d-md-flex align-items-center border-bottom py-2"
                      style={{

                        alignItems: "center",
                        borderBottom: "1px solid #ddd",
                        padding: "10px 0",
                      }}
                    >
                      <div
                        className="rounded-circle mb-3 mb-md-0 p-1 border d-flex align-items-center justify-content-center btn-primary"
                        style={{
                          width: "50px",
                          height: "50px",
                          textAlign: "center",
                          backgroundColor: "#007bff",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MessageCircleMore />
                      </div>

                      <div
                        className="flex-grow-1 ms-sm-3"

                      >
                        <p className="mb-0" style={{ marginBottom: "10px" }}>
                          <strong>From:</strong> {item.sender_name || "Admin"}
                        </p>
                        <p className="mt-0 mb-1" style={{ marginTop: "0" }}>
                          {item.subject}
                        </p>
                        <p
                          className="mt-0 text-muted"
                          style={{ color: "#6c757d", marginTop: "0" }}
                        >
                          <small>{item.created_at}</small>
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          }
        </div>
      </Content>
    </div>
  );
};

export default Broadcast;


