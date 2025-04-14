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
  ExitPlaceOrderData,
  GetNsePriceData
} from "../../../Services/UserService/User";

import { fDate, fDateTimeH } from "../../../../Utils/Date_formate";
import { image_baseurl } from "../../../../Utils/config";

import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import { Eye } from "lucide-react";




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
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [avoidDescription, setAvoidDescription] = useState("");

  const [brokerstatus, setBrokerstatus] = useState([])
  const [targetEnabled, setTargetEnabled] = useState(false);
  const [checkdata, setCheckdata] = useState([])



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
    entrytype: ""
  })


  const UpdateExitdata = (item) => {
    setExitModel(true)
    setExitOrderdata({
      ...item,
      price: item.price,
      quantity: item.order_quantity,
    });
  };





  const UpdateData = (item) => {
    setModel(true);
    setOrderdata({
      ...item,
      price: item.price,
      tsprice: Math.max(item.tag1 || 0, item.tag2 || 0, item.tag3 || 0),
      slprice: item.stoploss,
      quantity: item.order_quantity,
      exitquantity: item.order_quantity
    });
  };





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
    getnsedata()
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


  const getnsedata = async () => {
    try {
      const response = await GetNsePriceData(token);
      const checkdata = response?.data?.data?.map((item) => {
        return item
      })
      setCheckdata(checkdata)

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
        exitquantity: orderdata?.quantity,
      };

      const response = await PlaceOrderApi(data, token, brokerstatus);

      if (response.status) {
        showCustomAlert("Success", response.message || "Order Placed Successfully!")
      } else {
        showCustomAlert("error", response.message || "Failed to place the order. Please try again.")
      }
    } catch (error) {
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")

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
        showCustomAlert("Success", response.message || "Order Exit Successfully!")
      } else {
        showCustomAlert("error", response.message || "Order Failed")
      }
    } catch (error) {
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")
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
    if (item.report == null) {
      showCustomAlert("error", "No Data Available To See")
      return
    } else {
      const url = `${image_baseurl}uploads/report/${item.report}`;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  const calculatePnL = (item) => {
    if (!item || !item.price || !item.calltype) return "N/A";

    const entryPrice = parseFloat(item.price);
    const targetPrice = item.closeprice ? parseFloat(item.closeprice) : parseFloat(item.targetprice1);
    const callType = item.calltype.toUpperCase();

    if (isNaN(entryPrice) || isNaN(targetPrice)) return "N/A";

    let profitLossPercentage = 0;

    if (callType === "BUY") {
      profitLossPercentage = ((targetPrice - entryPrice) / entryPrice) * 100;
    } else if (callType === "SELL") {
      profitLossPercentage = ((entryPrice - targetPrice) / entryPrice) * 100;
    } else {
      return "Invalid Call Type";
    }

    return profitLossPercentage.toFixed(2) + "%";
  };



  const PotentialLeftButton = (item) => {
    if (!item || !checkdata) return null;
    const matchedStock = checkdata?.find(stock => stock?.SYMBOL === item?.stock);
    const entryPrice = parseFloat(matchedStock?.price) || 0;


    const targetPrices = [
      parseFloat(item?.tag1) || 0,
      parseFloat(item?.tag2) || 0,
      parseFloat(item?.tag3) || 0
    ].filter(price => price > 0);

    let potentialLeft = 0;

    if (item?.calltype === "BUY") {
      const highestTarget = Math.max(...targetPrices);
      potentialLeft = highestTarget - entryPrice;

    } else if (item?.calltype === "SELL") {
      const lowestTarget = Math.min(...targetPrices);
      potentialLeft = entryPrice - lowestTarget;


    }

    const potentialPercentage = ((potentialLeft / entryPrice) * 100).toFixed(2);
    return <div>{potentialPercentage}</div>;


  };




  const renderTradeCard = (item) => (
    <div className="row" key={item._id}>
    <div className="col-md-12">
        <div className="trade-card shadow" style={{ backgroundColor: "#dcedf2" }}>
      
          <div className="row mb-3">
            <div className="col-lg-3">
              <span className="date-btn">
                <i class="fa-solid fa-calendar me-3"></i>
                <b>{fDateTimeH(item?.created_at)}</b>
              </span>
            </div>

            {selectedTab === "live" && <div className="col-lg-3">
              <button className="btn btn-secondary" style={{ borderRadius: "20px", padding: "0px 10px", fontSize: "15px" }}>
                Sugg. Qty : {item?.lot}
              </button>
            </div>}

            <div className={`${selectedTab === "live" ? "col-lg-3" : "offset-5 col-lg-2"} `}>
              <button className="btn btn-secondary" style={{ borderRadius: "20px", padding: "0px 10px", fontSize: "15px" }}>
                {item?.callduration}
              </button>
            </div>



            {selectedTab === "live" ?
              <div className="col-lg-3 text-end">
                <button className="btn btn-success d-flex " style={{ marginLeft: "40px", padding: "0px 10px", fontSize: "15px" }}>
                  Potential Left : {PotentialLeftButton(item)}%
                </button>
              </div> :
              <div className="col-lg-2 text-end ">
                <button className={`btn btn-success ${parseFloat(calculatePnL(item)) >= 0 ? "btn-success" : "btn-danger"}`} style={{ padding: "0px 10px", fontSize: "15px" }}>
                  P&L : {calculatePnL(item)}
                </button>
              </div>
            }
          </div>

          <div className="row bg-white">

            <div className="col-md-2 d-flex align-items-center">
              <div className="trade-header">

                <div className="mb-3">
                  <span className="trade-type">
                    Hold Duration : <br />
                    {
                      item?.callduration === "Intraday" ? "Intraday" :
                        item?.callduration === "Short Term" ? "(15-30 days)" :
                          item?.callduration === "Medium Term" ? "(Above 3 months)" :
                            "(Above 1 year)"
                    }
                  </span>
                </div>

                <div>
                  <span className="trade-type1">
                    {service?.find((srv) => srv?._id === item?.service)?.title}
                  </span>
                  <span style={{ color: "red" }}>
                  
                    {item?.close_description &&  <>
                        {" (Avoid) "}
                        <Eye
                          onClick={() => {
                            setShowModal(true);
                            setAvoidDescription(item?.close_description
                           
                            );
                          }}
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                        />
                      </>}
                 
                  </span>

                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-7">
              <div className="trade-content">
                <div className="d-sm-flex justify-content-between tradehead mb-3">
                  <h3>{item.tradesymbol || "Trade Symbol"}</h3>
                  {/* <span>{item?.stock}</span> */}
                  {selectedTab !== "live" && (
                    <span><b>Entry Type</b>: {item?.calltype} {item?.entrytype}</span>)}
                </div>
                <div className="trade-details row justify-content-center">
                  {[
                    { label: "Entry price", value: `₹${item?.price}` },
                    ...(selectedTab === "close"
                      ? [{ label: "Exit Price", value: item?.closeprice || "--" }]
                      : []),
                    ...(selectedTab === "live" ? [{ label: "Entry Type", value: `${item?.calltype} ${item?.entrytype}` }] : []),
                    { label: "Stoploss", value: item?.stoploss || "--" },
                    { label: "Target1", value: item?.tag1 || "--" },
                    { label: "Target2", value: item?.tag2 || "--" },
                    { label: "Target3", value: item?.tag3 || "--" },

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
                    className="btn w-100 my-1"
                    style={{
                      backgroundColor:
                        item?.purchased === false || new Date(item?.created_at) > new Date()
                          ? "#ccc"
                          : "#0d6efd",
                      color: "black",
                      border: "1px solid black",
                    }}
                    disabled={
                      item?.purchased === false || new Date(item?.created_at) > new Date()
                    }
                    onClick={() => {
                      UpdateExitdata(item);
                      setCalltypedata(item);
                    }}
                  >
                    {item?.purchased === false || new Date(item?.created_at) > new Date()
                      ? "Trade Closed"
                      : "EXIT"}
                  </button>

                ) : (
                  <button
                    className="btn w-100 my-1"
                    onClick={() => {
                      setCalltypedata(item);
                      UpdateData(item)
                    }}
                    style={{ backgroundColor: item?.calltype ? "green" : "red", color: "white" }}
                  >
                    {`BUY${item?.purchased ? " (Add more)" : ""}`}

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
                  className="btn w-100 my-1"
                  style={{
                    backgroundColor: item?.report ? "green" : "#ccc",
                    color: item?.report ? "white" : "black",
                    border: "1px solid black",
                  }}
                  onClick={() => handleDownload(item)}
                  disabled={!item?.report} // Button disabled if report is not available
                >
                  View Analysis
                </button>



                {item?.purchased && (
                  <Link to="/user/broker-response">
                    <button className="btn btn-secondary w-100 my-1">
                      Broker Response
                    </button>
                  </Link>
                )}
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
            { tab: "live", label: "Live Trade" },
            { tab: "close",  label: "Close Trade" },
            // { tab: "live", icon: "bx-home", label: "Live Trade" },
            // { tab: "close", icon: "bx-user-pin", label: "Close Trade" },
          ].map(({ tab, icon, label }) => (
            <li className="nav-item" role="presentation" key={tab}>
              <a
                className={`nav-link ${selectedTab === tab ? "btn-primary active" : ""
                  }`}
                onClick={() => setSelectedTab(tab)}
                role="tab"
                style={{ cursor: "pointer" }}
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
                disabled={targetEnabled === 0 || targetEnabled === 1}
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
                disabled
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
              <label htmlFor="inputName" className="form-label">
                Entry Type
              </label>
              <input
                disabled
                type="string"
                className="form-control"
                id="inputName"
                placeholder=""
                value={exitorderdata?.calltype}
                onChange={(e) => {
                  setExitOrderdata({ ...exitorderdata, calltype: e.target.value });
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


       <ReusableModal
              show={showModal}
              onClose={() => setShowModal(false)}
              title="Description"
              body={<p>{avoidDescription || "No description available."}</p>}
            />
    </Content>
  );
}

export default Trade;

