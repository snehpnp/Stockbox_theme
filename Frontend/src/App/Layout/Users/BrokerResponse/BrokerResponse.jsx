import React from "react";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";

const BrokerResponse = () => {
  return (
    <div>
       <Content
      Page_title="Basket"
      button_title="Add Basket"
      button_status={true}
    >

<div
              className="accordion accordion-flush"
              id="accordionFlushExample"
            >
              <div className="accordion-item rounded-3 border-0 shadow mb-2">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button border-bottom collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <h5 className="m-0">Vision2030 (Cash)</h5>
                        <p className="m-0 pe-2 pt-2">Expires on : 28Apr2025</p>
                      </div>
                      <div className="text-end">
                        <p className="m-0 pe-2">
                          <span class="badge bg-success rounded-pill badgespan mb-2">
                            Buy
                          </span>
                          <br />
                          Expires on : 28Apr2025
                        </p>
                      </div>
                    </div>
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    <div className="row  align-items-center">
                      <div className="col-md-12">
                        <table className="table mb-0 border">
                          <thead className="">
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col"> Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td scope="row">Created At</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Symbol</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Quantity</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Broker</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Id</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Status</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Detail</td>
                              <td>20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item rounded-3 border-0 shadow mb-2">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button border-bottom collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <h5 className="m-0">Vision2030 (Cash)</h5>
                        <p className="m-0 pe-2 pt-2">Expires on : 28Apr2025</p>
                      </div>
                      <div className="text-end">
                        <p className="m-0 pe-2">
                          <span class="badge bg-success rounded-pill badgespan mb-2">
                            Buy
                          </span>
                          <br />
                          Expires on : 28Apr2025
                        </p>
                      </div>
                    </div>
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    <div className="row  align-items-center">
                      <div className="col-md-12">
                        <table className="table mb-0 border">
                          <thead className="">
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col"> Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td scope="row">Created At</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Symbol</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Quantity</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Broker</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Id</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Status</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Detail</td>
                              <td>20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item rounded-3 border-0 mb-2 shadow">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button border-bottom collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <h5 className="m-0">Vision2030 (Cash)</h5>
                        <p className="m-0 pe-2 pt-2">Expires on : 28Apr2025</p>
                      </div>
                      <div className="text-end">
                        <p className="m-0 pe-2">
                          <span class="badge bg-success rounded-pill badgespan mb-2">
                            Buy
                          </span>
                          <br />
                          Expires on : 28Apr2025
                        </p>
                      </div>
                    </div>
                  </button>
                </h2>
                <div
                  id="flush-collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    <div className="row  align-items-center">
                      <div className="col-md-12">
                        <table className="table mb-0 border">
                          <thead className="">
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col"> Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td scope="row">Created At</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Symbol</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Quantity</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Broker</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Id</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Status</td>
                              <td>20</td>
                            </tr>
                            <tr>
                              <td>Order Detail</td>
                              <td>20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

    </Content>
      <div>
       
         

         
        </div>
      </div>
   
  );
};

export default BrokerResponse;
