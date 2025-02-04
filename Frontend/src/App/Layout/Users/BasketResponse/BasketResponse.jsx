import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";
import { Getbasketorderlist } from "../../../Services/UserService/User";
import {fDateTimeH} from "../../../../Utils/Date_formate";

const BasketResponse = () => {
  let userid = localStorage.getItem("id");
  let token = localStorage.getItem("token");
  const [orderlist, setOrderlist] = useState([]);

  const getorderlist = async () => {
    try {
      const data = { clientid: userid };
      const response = await Getbasketorderlist(data, token);
      if (response.status) {
        setOrderlist(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getorderlist();
  }, []);

  console.log("orderlist", orderlist);
  let BrokerDAta = ["Demo", "Angel", "Alice Blue", "Kotak Neo", "Market Hub"];

  return (
    <Content
      Page_title="Basket"
      button_title="Add Basket"
      button_status={false}
    >
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {orderlist &&
          orderlist?.map((data, index) => (
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
                        <strong>{data.tradesymbol}</strong>{" "}
                      </h5>
                      <p className="m-0 pe-2 pt-2">
                        Price : {data.price || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="badge bg-success badgespan mb-2">
                        {data.ordertype || "N/A"}
                      </span>

                      <p className="m-0 pe-2 pt-2">
                        {data?.createdAt && fDateTimeH(data?.createdAt) || "N/A"}
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
                            <td>{data.tradesymbol || "N/A"}</td>
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

                          {data?.data && (
                            <tr>
                              <td>Order Status</td>
                              <td>
                                {["Success", "Done", "Ok"].includes(
                                  data?.data[0]?.Status
                                ) ? (
                                  <span className="badge bg-success badgespan">
                                    ✅{" "}
                                    {data?.data[0]?.Status
                                      ? data?.data[0]?.Status.toUpperCase()
                                      : "-"}
                                  </span>
                                ) : (
                                  <span
                                    className="badge"
                                    style={{ color: "red", fontSize: "0.9rem" }}
                                  >
                                    {data?.data[0]?.Status
                                      ? data?.data[0]?.Status?.toUpperCase()
                                      : "UNKNOWN"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          )}
                          {data?.data && (
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
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Content>
  );
};

export default BasketResponse;
