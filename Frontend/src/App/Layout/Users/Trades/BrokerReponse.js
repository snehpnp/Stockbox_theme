import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrokerResponsedata } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";

const BrokerResponse = () => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [responsedata, setResponseData] = useState([]);

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
  };

  useEffect(() => {
    getBrokerHistory();
  }, []);

  let BrokerDAta = ["Demo", "Angel", "Alice Blue", "Kotak Neo", "Market Hub"];

  return (
    <Content
      Page_title="Broker Response"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {responsedata.length > 0 ?
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
                        <strong>{data.signalDetails.tradesymbol}</strong>{" "}
                      </h5>
                      <p className="m-0 pe-2 pt-2">
                        Price : {data.signalDetails.price || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="badge bg-success badgespan mb-2">
                        {data.ordertype || "N/A"}
                      </span>

                      <p className="m-0 pe-2 pt-2">
                        Expires on: {data.signalDetails.expirydate || "N/A"}
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
                            <td>{BrokerDAta[data.borkerid] || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Order Id</td>
                            <td>{data.orderid || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Order Status</td>
                            <td>
                              {["Success", "Done", "Ok"].includes(
                                data.data[0]?.Status
                              ) ? (
                                <span className="badge bg-success badgespan">
                                  ✅{" "}
                                  {data.data[0]?.Status
                                    ? data.data[0]?.Status.toUpperCase()
                                    : "-"}
                                </span>
                              ) : (
                                // <span className="badge bg-danger badgespan">
                                //   ❌{" "}
                                //   {data.data[0]?.Status
                                //     ? data.data[0]?.Status.toUpperCase()
                                //     : "UNKNOWN"}
                                // </span>

                                <span
                                  className="badge"
                                  style={{ color: "red", fontSize: "0.9rem" }}
                                >
                                  {data.data[0]?.Status
                                    ? data.data[0]?.Status.toUpperCase()
                                    : "UNKNOWN"}
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            {["Success", "Done", "Ok"].includes(
                              data.data[0]?.Status
                            ) ? (
                              <td>Order Detail </td>
                            ) : (
                              <td>Reject Reason </td>
                            )}
                            <td>{data.data[0]?.rejectionreason || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : <strong>No Data</strong>}
      </div>
    </Content>
  );
};

export default BrokerResponse;
