import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrokerResponsedata } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";
import { fDate, fDateTimeH } from "../../../../Utils/Date_formate";
import Loader from "../../../../Utils/Loader";

const BrokerResponse = () => {



  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");


  const [responsedata, setResponseData] = useState([]);

  const [isLoading, setIsLoading] = useState(true)




  const getBrokerHistory = async () => {
    try {
      const data = { clientid: userid };
      const response = await BrokerResponsedata(data, token);
      if (response.status) {
        setResponseData(response?.data);
      }
    } catch (error) {
      console.log("Error fetching broker history:", error);
    }
    setIsLoading(false)
  };



  useEffect(() => {
    getBrokerHistory();
  }, []);


  let BrokerDAta = ["", "Angel", "Alice Blue", "Kotak Neo", "Market Hub", "Zerodha"];




  return (
    <Content
      Page_title="Broker Response"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {isLoading ? (
          <div className="text-center my-5">
            <Loader />
          </div>
        ) : responsedata.length > 0 ? (
          responsedata.map((data, index) => (
            <div
              className="accordion-item rounded-3 border-0 shadow mb-2"
              key={data.id || index}
            >
              <h2 className="accordion-header">
                <button
                  className="accordion-button border-bottom collapsed fw-semibold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse${index}`}
                >
                  <div className="d-md-flex justify-content-between align-items-center w-100">
                    <div>
                      <h5 className="m-0">
                        <strong>{data.signalDetails.tradesymbol}</strong>
                      </h5>
                      <p className="m-0 pe-2 pt-2">
                        Price : {data.signalDetails.price || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span
                        className="badge bg-success badgespan mb-2"
                        style={{ marginLeft: "200px" }}
                      >
                        {data.ordertype || "N/A"}
                      </span>
                      <p className="m-0 pe-2 pt-2">
                        Expires on: {fDateTimeH(data.createdAt) || "N/A"}
                      </p>
                    </div>
                  </div>
                </button>
              </h2>
              <div
                id={`flush-collapse${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <table className="table mb-0 border">
                        <thead>
                          <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Symbol</td>
                            <td>{data.signalDetails.tradesymbol || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Quantity</td>
                            <td>{data.quantity || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Broker</td>
                            <td>{BrokerDAta[data?.borkerid] || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Order Id</td>
                            <td>{data.orderid || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Order Status</td>
                            {/* {console.log("data.data",data)} */}
                            <td>
                              {["Success", "Done", "Ok", "open"].includes(data.data?.data?.status) ? (
                                <span
                                  className="badge"
                                  style={{ color: "green", fontSize: "16px", marginLeft: "-12px" }}
                                >
                                  {/* ✅ {data?.data?.data?.status || "-"} */}
                                  {(data?.data?.data?.status)?.toUpperCase() || "-"}
                                </span>
                              ) : (
                                <span
                                  className="badge"
                                  style={{ color: "red", fontSize: "16px", marginLeft: "-12px" }}
                                >
                                  {/* ❌ {data?.data?.data?.status || "UNKNOWN"} */}
                                  {(data?.data?.data?.status)?.toUpperCase() || "UNKNOWN"}
                                </span>
                              )}
                            </td>
                            {/* {data?.data?.data?.status || "N/A"} */}

                          </tr>
                          <tr>
                            {["Success", "Done", "Ok"].includes(data?.data?.data?.Status) ? (
                              <td>Order Detail </td>
                            ) : (
                              <td>Reject Reason </td>
                            )}
                            <td
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "200px",
                              }}
                            >
                              {data?.data?.data?.text || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <img src="/assets/images/norecordfound.png" alt="No Records Found" />
          </div>
        )}
      </div>

    </Content >
  );
};

export default BrokerResponse;
