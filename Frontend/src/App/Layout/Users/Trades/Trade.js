import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import { Button, Tooltip } from "antd";
import ReusableModal from "../../../components/Models/ReusableModal";
import { GetSignalClient, GetServicedata } from "../../../Services/UserService/User";


function Trade() {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [model, setModel] = useState(false);
  const [service, setService] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");


  useEffect(() => {
    getClientdata()
    getServicedata()
  }, [])

  console.log("aaaa", service)

  const getServicedata = async () => {
    try {

      const response = await GetServicedata(token);
      if (response.status) {
        console.log("getServicedata", response.data)
        setService(response.data)
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }

  };



  const getClientdata = async () => {
    try {
      const data = { page: 1, service_id: "66d2c3bebf7e6dc53ed07626", client_id: userid, search: "" }
      const response = await GetSignalClient(data, token);
      if (response.status) {
        console.log("response.data", response.data)


      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }

  };


  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };



  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };


  return (

    <Content
      Page_title="Trade"
      button_title="Add Trade"
      button_status={true}
    >

      <div className="card">
        <div className="card-body">
          <div>
            <div>
              <label htmlFor="planSelect" className="mb-1">
                Plans For You
              </label>
              <div className="col-lg-4 d-flex">
                <select
                  id="planSelect"
                  className="form-select"
                  onChange={handleSelectChange}
                  value={selectedPlan}
                >
                  <option value="" disabled>
                    Select Plans
                  </option>
                  <option value="all">All</option>
                  {service.map((item) => (
                    <option value={item._id} >{item?.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <ul
            className="nav nav-pills border-bottom mb-3 justify-content-center"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                data-bs-toggle="pill"
                href="#primary-pills-home"
                role="tab"
                aria-selected="true"
              >
                <div className="d-flex align-items-center">
                  <div className="tab-icon">
                    <i className="bx bx-home font-18 me-1" />
                  </div>
                  <div className="tab-title">Live Trade </div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                data-bs-toggle="pill"
                href="#primary-pills-profile"
                role="tab"
                aria-selected="false"
                tabIndex={-1}
              >
                <div className="d-flex align-items-center">
                  <div className="tab-icon">
                    <i className="bx bx-user-pin font-18 me-1" />
                  </div>
                  <div className="tab-title">Close Trade</div>
                </div>
              </a>
            </li>
          </ul>


          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="primary-pills-home"
              role="tabpanel"
            >

              <div className="row">
                <div className="col-md-12">
                  <div className="trade-card shadow">
                    <div className="row">
                      <div className="col-md-2 d-flex align-items-center">
                        <div className="trade-header ">
                          <div>
                            <span className="trade-time tradetime1">
                              <b>18 Nov 2024</b>
                              <p>17:08:20</p>
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="trade-type">Short Term</span>
                          </div>
                          <div>
                            <span className="trade-type1">
                              Cash,Future,Option
                            </span>
                          </div>
                        </div>
                      </div>
                      <dv className="col-md-7">
                        <div className="trade-content">
                          <div className="d-flex justify-content-between tradehead mb-3">
                            <h3>THERMAX-EQ</h3>
                            <span className="trade-type1 mb-2">open</span>
                          </div>

                          <div className="trade-details">
                            <div className="row justify-content-center">
                              <div className="col-md-6">
                                <div>
                                  <strong>Entry price:</strong>
                                  <p> (₹100)</p>
                                </div>
                              </div>

                              <div className="col-md-6 d-flex justify-content-end">
                                <div>
                                  <strong>Hold duration:</strong>
                                  <p>(15-30 days)</p>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div>
                                  <strong>Stoploss:</strong>
                                  <p>--</p>
                                </div>
                              </div>

                              <div className="col-md-3 d-flex justify-content-center">
                                <div>
                                  <strong>Target:</strong>
                                  <p>--</p>
                                </div>
                              </div>

                              <div className="col-md-3 d-flex justify-content-center">
                                <div>
                                  <strong>Target:</strong>
                                  <p>--</p>
                                </div>
                              </div>
                              <div className="col-md-3 d-flex justify-content-center">
                                <div>
                                  <strong>Target:</strong>
                                  <p>--</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </dv>
                      <div className="col-md-3 d-flex align-items-center">
                      <div className=" d-flex flex-column w-100 h-100 justify-content-evenly"> 
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => { setModel(true) }}
                            >
                              BUY
                            </button>
                            <button
                              className="btn btn-secondary w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Detail
                            </button>
                            <button
                              className="btn btn-secondary w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Ananlysis
                            </button>
                            <button
                              className="btn btn-secondary w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              Broker Response
                            </button>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ReusableModal
                show={model}
                onClose={() => setModel(false)}
                title={<>Kyc</>}
                body={
                  <>
                    <div className="modal-body ">
                      <div className="p-2">
                        <form className="row g-3">
                          <div className="col-md-12">
                            <label htmlFor="input1" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="input1"
                              placeholder="Name"
                            />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="input4" className="form-label">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="input4"
                              placeholder="Email"
                            />
                          </div>

                          <div className="col-md-12">
                            <label htmlFor="input3" className="form-label">
                              Phone
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="input3"
                              placeholder="Phone"
                            />
                          </div>

                          <div className="col-md-12">
                            <label htmlFor="input5" className="form-label">
                              Aadhaar No.
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="input5"
                              placeholder="Aadhaar No."
                            />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="input5" className="form-label">
                              PAN No.
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="input5"
                              placeholder="PAN No."
                            />
                          </div>
                        </form>
                      </div>
                    </div>

                  </>
                }
                footer={
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"

                    >
                      Save
                    </button>
                    <button
                      className="btn btn-primary rounded-1"
                      onClick={() => setModel(false)}
                    >
                      Cancel
                    </button>
                  </>
                }
              />

            </div>

          </div>
        </div>
      </div>


    </Content >
  );
}

export default Trade;
