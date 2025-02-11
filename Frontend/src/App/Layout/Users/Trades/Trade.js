import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import ReusableModal from "../../../components/Models/ReusableModal";
import {
  GetSignalClient,
  GetServicedata,
  GetCloseSignalClient,
  PlaceOrderApi,
  GetUserData,
  ExitPlaceOrderData
} from "../../../Services/UserService/User";
import { fDate } from "../../../../Utils/Date_formate";
import { image_baseurl } from "../../../../Utils/config";
import Swal from "sweetalert2";
import Loader from "../../../../Utils/Loader";


function Trade() {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [isLoading, setIsLoading] = useState(true)

  const [model, setModel] = useState(false);
  const [calltypedata, setCalltypedata] = useState("");
  const [viewModel, setViewModel] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const [service, setService] = useState([]);
  const [tradeData, setTradeData] = useState({ live: [], close: [] });
  const [description, setDescription] = useState("");
  const [brokerstatus, setBrokerstatus] = useState([])
  const [targetEnabled, setTargetEnabled] = React.useState(false);



  const [orderdata, setOrderdata] = useState({
    id: "",
    signalid: "",
    quantity: "",
    price: "",
    tsprice: "",
    tsstatus: "",
    slprice: "",
    exitquantity: ""
  })


  const [exitorderdata, setExitOrderdata] = useState({
    id: "",
    signalid: "",
    quantity: "",
    price: "",
  })



  const [selectedService, setSelectedService] = useState(
    "66d2c3bebf7e6dc53ed07626"
  );



  const [selectedTab, setSelectedTab] = useState("live");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchServiceData();
    fetchData();
    fetchuserDetail()
  }, [selectedService]);

  useEffect(() => {
    fetchData();
  }, [page, selectedTab]);



  useEffect(() => {
    setPage(1);
  }, [selectedTab]);




  const fetchData = async () => {
    if (selectedTab === "live") {
      await fetchTradeData();
    } else if (selectedTab === "close") {
      await fetchCloseData();
    }
  };





  const fetchServiceData = async () => {
    try {
      const response = await GetServicedata(token);
      if (response.status)
        setService(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };



  const fetchuserDetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status)
        setBrokerstatus(response?.data?.brokerid);

    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };



  const PlanceOrderdata = async () => {
    try {
      const data = {
        id: userid,
        signalid: calltypedata?._id,
        quantity: orderdata?.quantity,
        price: orderdata?.price,
        tsprice: orderdata?.tsprice,
        tsstatus: targetEnabled,
        slprice: orderdata?.slprice,
        exitquantity: orderdata?.exitquantity,
      };

      const response = await PlaceOrderApi(data, token, brokerstatus);

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: response.message || "Order Placed Successfully!",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.message || "Order Failed",
          text: "Failed to place the order. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while placing the order. Please check your network or try again later.",
        confirmButtonText: "Retry",
      });
    }
  };



  const ExitPlaceOrder = async () => {
    try {
      const data = {
        id: userid,
        signalid: calltypedata?._id,
        quantity: exitorderdata?.quantity,
        price: exitorderdata?.price,

      };

      const response = await ExitPlaceOrderData(data, token, brokerstatus);

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: response.message || "Order Exit Successfully!",
          text: "Your order has been Exit  successfully.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.message || "Order Failed",
          text: "Failed to place the order. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while placing the order. Please check your network or try again later.",
        confirmButtonText: "Retry",
      });
    }
  };





  const fetchTradeData = async () => {
    try {
      const data = {
        page: page,
        service_id: selectedService,
        client_id: userid,
        search: "",
      };
      const response = await GetSignalClient(data, token);
      if (response.status) {
        setTradeData((prev) => ({ ...prev, live: response.data }));
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false)
  };




  const fetchCloseData = async () => {
    try {
      const data = {
        page: page,
        service_id: selectedService,
        client_id: userid,
        search: "",
      };
      const response = await GetCloseSignalClient(data, token);
      if (response.status) {
        setTradeData((prev) => ({ ...prev, close: response.data }));
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching close trade data:", error);
    }
    setIsLoading(false)
  };




  const handleDownload = (item) => {
    const url = `${image_baseurl}uploads/report/${item.report}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const renderTradeCard = (item) => (
    <div className="row" key={item._id}>
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

            <div className="col-md-12 col-lg-7">
              <div className="trade-content">
                <div className="d-sm-flex justify-content-between tradehead mb-3">
                  <h3>{item.tradesymbol || "Trade Symbol"}</h3>
                  <span>{item?.stock}</span>
                </div>
                <div className="trade-details row justify-content-center">
                  {[
                    { label: "Entry price", value: `₹${item?.price}` },
                    ...(selectedTab === "close"
                      ? [{ label: "Exit Price", value: item?.closeprice || "--" }]
                      : []),
                    { label: "Call Type", value: item?.calltype || "15-30 days" },
                    { label: "Stoploss", value: item?.stoploss || "--" },
                    { label: "Target", value: item?.tag1 || "--" },
                    { label: "Target", value: item?.tag2 || "--" },
                    { label: "Target", value: item?.tag3 || "--" },

                  ].map((detail, idx) => (
                    <div
                      className={`col-md-${idx < 2 ? 4 : 4} d-flex justify-content-md-${idx < 2 ? "start" : "start"
                        }`}
                      key={idx}
                    >
                      <div>
                        <strong>{detail.label}:</strong>
                        <p>{detail.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="col-md-12 col-lg-3 d-flex align-items-center">
              <div className="d-flex flex-column w-100">

                {selectedTab === "close" ? (
                  <button
                    className="btn btn-primary w-100 my-1"
                    disabled={
                      item?.purchased === false ||
                      new Date(item?.created_at) > new Date()
                    }
                    onClick={() => { setExitModel(true); setCalltypedata(item) }}
                  >
                    EXIT
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-100 my-1"
                    onClick={() => {
                      setModel(true);
                      setCalltypedata(item);
                    }}
                  >
                    {item?.calltype}
                  </button>
                )}


                <button
                  className="btn btn-secondary w-100 my-1"
                  onClick={() => {
                    setViewModel(true);
                    setDescription(item?.description);

                  }}
                >
                  View Detail
                </button>
                <button
                  className="btn btn-secondary w-100 my-1"
                  onClick={() => handleDownload(item)}
                >
                  View Analysis
                </button>
                <Link to="/user/broker-response">
                  <button className="btn btn-secondary w-100 my-1">
                    Broker Response
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 1) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    }
  };




  return (
    <Content Page_title="Trade" button_title="Add Trade" button_status={false}>
      <div className="page-content">
        <div>
          <label htmlFor="planSelect" className="mb-1">
            Plans For You
          </label>
          <div className="col-lg-4 d-flex">
            <select
              id="planSelect"
              className="form-select"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {service.map((item) => (
                <option key={item._id} value={item._id}>
                  {item?.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul
          className="nav nav-pills border-bottom my-3 justify-content-center"
          role="tablist"
        >
          {[
            { tab: "live", icon: "bx-home", label: "Live Trade" },
            { tab: "close", icon: "bx-user-pin", label: "Close Trade" },
          ].map(({ tab, icon, label }) => (
            <li className="nav-item" role="presentation" key={tab}>
              <a
                className={`nav-link ${selectedTab === tab ? "btn-primary active" : ""
                  }`}
                onClick={() => setSelectedTab(tab)}
                role="tab"
              >
                <div className="d-flex align-items-center">
                  <div className="tab-icon">
                    <i className={`bx ${icon} font-18 me-1`} />
                  </div>
                  <div
                    className={`tab-title ${selectedTab === tab ? "btn-primary" : ""
                      }`}
                  >
                    {label}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {isLoading ? <Loader /> : tradeData[selectedTab]?.map(renderTradeCard)}
        </div>
        <div className="pagination-controls d-flex justify-content-between mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("prev")}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <ReusableModal
        show={model}
        onClose={() => setModel(false)}
        title={<span>{calltypedata?.calltype}</span>}
        body={
          <form className="row g-3">
            <div className="col-md-12">
              <label htmlFor="inputName" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="inputName"
                placeholder="Price"
                value={orderdata?.price}
                onChange={(e) => {
                  setOrderdata({ ...orderdata, price: e.target.value });
                }}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputQuantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="inputQuantity"
                placeholder="Quantity"
                value={orderdata?.quantity}
                onChange={(e) => {
                  setOrderdata({ ...orderdata, quantity: e.target.value });
                }}
              />
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="targetCheckbox"
                      checked={targetEnabled === 1}
                      onChange={(e) => setTargetEnabled(e.target.checked ? 1 : 0)}
                    />
                    <label className="form-check-label" htmlFor="targetCheckbox">
                      Target
                    </label>
                  </div>

                </div>
                <div className="col-md-6">

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="stoplossCheckbox"
                      checked={targetEnabled === 2}
                      onChange={(e) => setTargetEnabled(e.target.checked ? 2 : 0)}
                    />
                    <label className="form-check-label" htmlFor="stoplossCheckbox">
                      Stoploss
                    </label>
                  </div>
                </div>
              </div>

              <input
                type="text"
                className="form-control"
                id="sharedInput"
                placeholder={targetEnabled === 1 ? "Target Price" : targetEnabled === 2 ? "Stoploss Price" : "Select Target/Stoploss"}
                disabled={targetEnabled === 0}
                value={targetEnabled === 1 ? orderdata.tsprice : targetEnabled === 2 ? orderdata.slprice : ""}
                onChange={(e) => {
                  if (targetEnabled === 1) {
                    setOrderdata({ ...orderdata, tsprice: e.target.value });
                  } else if (targetEnabled === 2) {
                    setOrderdata({ ...orderdata, slprice: e.target.value });
                  }
                }}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputQuantity" className="form-label">
                Exit Price
              </label>
              <input
                type="number"
                className="form-control"
                id="inputQuantity"
                placeholder="Quantity"
                value={orderdata?.exitquantity}
                onChange={(e) => {
                  setOrderdata({ ...orderdata, exitquantity: e.target.value });
                }}
              />
            </div>
          </form>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                PlanceOrderdata();
              }}
            >
              Buy
            </button>
            <button className="btn btn-secondary" onClick={() => setModel(false)}>
              Cancel
            </button>
          </>
        }
      />



      <ReusableModal
        show={exitModel}
        onClose={() => setExitModel(false)}
        title={<span>{calltypedata?.tradesymbol}</span>}
        body={
          <form className="row g-3">
            <div className="col-md-12">
              <label htmlFor="inputName" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="inputName"
                placeholder="Price"
                value={exitorderdata?.price}
                onChange={(e) => {
                  setExitOrderdata({ ...exitorderdata, price: e.target.value });
                }}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputQuantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="inputQuantity"
                placeholder="Quantity"
                value={exitorderdata?.quantity}
                onChange={(e) => {
                  setExitOrderdata({ ...exitorderdata, quantity: e.target.value });
                }}
              />
            </div>
          </form>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                ExitPlaceOrder();
              }}
            >
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setModel(false)}>
              Cancel
            </button>
          </>
        }
      />




      <ReusableModal
        show={viewModel}
        onClose={() => setViewModel(false)}
        title={<span>Detail</span>}
        body={<div dangerouslySetInnerHTML={{ __html: description }} />}
      />
    </Content>
  );
}

export default Trade;
