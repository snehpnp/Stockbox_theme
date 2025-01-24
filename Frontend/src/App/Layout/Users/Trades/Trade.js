import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import { Button, Tooltip } from "antd";
import ReusableModal from "../../../components/Models/ReusableModal";
import { GetSignalClient, GetServicedata, GetCloseSignalClient } from "../../../Services/UserService/User";
import { fDateTime, fDate } from "../../../../Utils/Date_formate";
import { image_baseurl } from "../../../../Utils/config";



function Trade() {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [model, setModel] = useState(false);
  const [viewmodel, setViewModel] = useState(false);
  const [service, setService] = useState([]);
  const [gettradedata, setGettradedata] = useState([]);
  const [getclosedata, setGetclosedata] = useState([]);
  const [discription, setDiscription] = useState("");

  const [selectedValue, setSelectedValue] = useState("66d2c3bebf7e6dc53ed07626");
  const [selectedTab, setSelectedTab] = useState("live");



  useEffect(() => {
    getClientdata();
    getServicedata();
    getGetCloseSignaldata()
  }, [selectedValue]);



  const getServicedata = async () => {
    try {
      const response = await GetServicedata(token);
      if (response.status) {
        setService(response.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };



  const getClientdata = async () => {
    try {
      const data = { page: 1, service_id: selectedValue, client_id: userid, search: "" };
      const response = await GetSignalClient(data, token);
      if (response.status) {
        setGettradedata(response.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };



  const getGetCloseSignaldata = async () => {
    try {
      const data = { page: 1, service_id: selectedValue, client_id: userid, search: "" };
      const response = await GetCloseSignalClient(data, token);
      if (response.status) {
        setGetclosedata(response.data);
        console.log("response.data", response.data)
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };




  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };


  const handleDownload = (item) => {
    const url = `${image_baseurl}uploads/report/${item.report}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  return (
    <Content Page_title="Trade" button_title="Add Trade" button_status={true}>
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
                  value={selectedValue}
                  onChange={handleChange}
                >
                  {service.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item?.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <ul className="nav nav-pills border-bottom mb-3 justify-content-center" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${selectedTab === "live" ? "active" : ""}`}
                onClick={() => handleTabClick("live")}
                role="tab"
                aria-selected="true"
              >
                <div className="d-flex align-items-center">
                  <div className="tab-icon">
                    <i className="bx bx-home font-18 me-1" />
                  </div>
                  <div className="tab-title">Live Trade</div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${selectedTab === "close" ? "active" : ""}`}
                onClick={() => handleTabClick("close")}
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
            {selectedTab === "live" && (
              <div className="tab-pane fade show active" id="primary-pills-home" role="tabpanel">
                {gettradedata?.map((item, index) => (
                  <div className="row" key={item._id || index}>
                    <div className="col-md-12">
                      <div className="trade-card shadow">
                        <div className="row">

                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>{fDate(item?.created_at)}</b>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">{item?.callduration}</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  {service?.find((srv) => srv?._id === item?.service)?.title}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>{item.tradesymbol || "Trade Symbol"}</h3>
                                <span className="trade-type1 mb-2">{item?.stock}</span>
                              </div>
                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p>₹{item?.price}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Call Type:</strong>
                                      <p>{item?.calltype || "15-30 days"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>{item?.stoploss || "--"}</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag1 || "--"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag2 || "--"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag3 || "--"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-3 d-flex align-items-center">
                            <div className="d-flex flex-column w-100 h-100 justify-content-evenly">
                              <button className="btn btn-primary w-100" onClick={() => setModel(true)}>
                                BUY
                              </button>
                              <button
                                className="btn btn-secondary w-100"
                                onClick={() => {
                                  setViewModel(true);
                                  setDiscription(item?.description);
                                }}
                              >
                                View Detail
                              </button>

                              <button className="btn btn-secondary w-100" onClick={() => handleDownload(item)} >
                                View Analysis
                              </button>
                              <button className="btn btn-secondary w-100" >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "close" && (
              <div className="tab-pane d-block" id="primary-pills-profile" role="tabpanel">
                {getclosedata?.map((item, index) => (
                  <div className="row" key={item._id || index}>
                    <div className="col-md-12">
                      <div className="trade-card shadow">
                        <div className="row">

                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>{fDate(item?.created_at)}</b>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">{item?.callduration}</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  {service?.find((srv) => srv?._id === item?.service)?.title}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>{item.tradesymbol || "Trade Symbol"}</h3>
                                <span className="trade-type1 mb-2">{item?.stock}</span>
                              </div>
                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p>₹{item?.price}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Call Type:</strong>
                                      <p>{item?.calltype || "15-30 days"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>{item?.stoploss || "--"}</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag1 || "--"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag2 || "--"}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>{item?.tag3 || "--"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-3 d-flex align-items-center">
                            <div className="d-flex flex-column w-100 h-100 justify-content-evenly">
                              <button className="btn btn-primary w-100" onClick={() => setModel(true)}>
                                BUY
                              </button>
                              <button className="btn btn-secondary w-100" onClick={() => {
                                setViewModel(true);
                                setDiscription(item?.description);
                              }} >
                                View Detail
                              </button>
                              <button className="btn btn-secondary w-100" onClick={() => handleDownload(item)} >
                                View Analysis
                              </button>
                              <button className="btn btn-secondary w-100" >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <label htmlFor="input1" className="form-label">Name</label>
                    <input type="text" className="form-control" id="input1" placeholder="Name" />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input4" className="form-label">Email</label>
                    <input type="email" className="form-control" id="input4" placeholder="Email" />
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="input3" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="input3" placeholder="Phone" />
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="input6" className="form-label">Aadhaar No.</label>
                    <input type="password" className="form-control" id="input6" placeholder="Aadhaar No." />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input7" className="form-label">PAN No.</label>
                    <input type="password" className="form-control" id="input7" placeholder="PAN No." />
                  </div>
                </form>
              </div>
            </div>
          </>
        }
        footer={
          <>
            <button type="button" className="btn btn-primary">Save</button>
            <button className="btn btn-primary rounded-1" onClick={() => setModel(false)}>Cancel</button>
          </>
        }
      />

      <ReusableModal
        show={viewmodel}
        onClose={() => setViewModel(false)}
        title={<>Detail</>}
        body={
          <>
            <div className="modal-body">
              <div className="p-2">
                <div dangerouslySetInnerHTML={{ __html: discription }} />
              </div>
            </div>
          </>
        }
        footer={
          <>
            <button type="button" className="btn btn-primary">
              Save
            </button>
            <button
              className="btn btn-primary rounded-1"
              onClick={() => setViewModel(false)}
            >
              Cancel
            </button>
          </>
        }
      />



    </Content>

  );
}

export default Trade;
