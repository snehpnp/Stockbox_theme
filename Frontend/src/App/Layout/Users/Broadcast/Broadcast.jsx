import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { GetBroadcastData } from "../../../Services/UserService/User";
import { MessageCircleMore } from "lucide-react";
import Swal from "sweetalert2";

const Broadcast = () => {
  const [broadcastData, setBroadcastData] = useState([]);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  // Fetch broadcast data on component mount
  useEffect(() => {
    GetBrodcast();
  }, []);

  // Fetch broadcast data function
  const GetBrodcast = async () => {
    try {
      await GetBroadcastData({ id: userid }, token).then((response) => {
        if (response && response.data) {
          setBroadcastData(response.data); // Update state with fetched data
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while fetching broadcast data!",
      });
    }
  };

  return (
    <div>
      <Content
        Page_title="Broadcast"
        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content" style={{ padding: "20px" }}>
          {/* Dynamically rendered list of broadcast messages */}
          <ul className="list-unstyled" style={{ margin: "0", padding: "0" }}>
            {broadcastData.length === 0 ? (
              <li className="text-center py-3">No Broadcast Data Available</li>
            ) : (
              broadcastData.map((item, index) => (
                <li
                  key={index}
                  className="d-sm-flex align-items-center border-bottom py-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    padding: "10px 0",
                  }}
                >
                  <div
                    className="rounded-circle p-1 border d-flex align-items-center justify-content-center btn-primary"
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
                    style={{ paddingLeft: "15px" }}
                  >
                    <p className="mb-2" style={{ marginBottom: "10px" }}>
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
      </Content>
    </div>
  );
};

export default Broadcast;
