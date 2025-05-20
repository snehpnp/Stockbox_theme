import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Content from "../../../components/Contents/Content";
import { getOpenSignalStrategyData, getCloseSignalStrategyData, PlaceOrderofmultiplesignal, GetUserData, ExitPlaceOrderofmultiplesignal } from "../../../Services/UserService/User";
import { fDateTimeH } from "../../../../Utils/Date_formate";
import ReusableModal from "../../../components/Models/ReusableModal";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import { image_baseurl } from "../../../../Utils/config";

const Strategy = () => {

  useEffect(() => {
    fetchuserDetail()
  }, [])


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [getsignaldata, setSignaldata] = useState([]);
  const [selectedTab, setSelectedTab] = useState("live");
  const [description, setDescription] = useState("");
  const [viewModel, setViewModel] = useState(false);
  const [model, setModel] = useState(false);
  const [signaldetail, setSignaldetail] = useState("");
  const [brokerstatus, setBrokerstatus] = useState([])
  const [signalquantity, setSignalquantity] = useState("")
  const [searchInput, setSearchInput] = useState("");




  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const getSignalopenStrategydata = async () => {
    try {
      const data = { client_id: userid, search: searchInput, page: page };
      const response = await getOpenSignalStrategyData(data, token);
      if (response.status) {
        setSignaldata(response.data);
        setTotalPages(response.pagination?.totalPages)
      }
    } catch (err) {
      console.error("Error fetching strategy data:", err);
    }
  };


  const getSignalcloseStrategydata = async () => {
    try {
      const data = { client_id: userid, search: searchInput, page: page };
      const response = await getCloseSignalStrategyData(data, token);
      if (response.status) {
        setSignaldata(response.data);
        setTotalPages(response.pagination?.totalPages)
      }
    } catch (err) {
      console.error("Error fetching strategy data:", err);
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


  useEffect(() => {
    if (selectedTab !== "live") {
      getSignalcloseStrategydata();
    } else {
      getSignalopenStrategydata();
    }

  }, [selectedTab, searchInput]);


  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 1) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    }
  };



  const PlanceOrderstartegydata = async () => {
    try {

      if (!signalquantity) {
        showCustomAlert("error", "Please enter the lot value.");
        return;
      }

      const data = {
        id: userid,
        signalid: signaldetail?._id,
        quantity: signalquantity,
      };
      const response = await PlaceOrderofmultiplesignal(data, token, brokerstatus);

      if (response.status) {
        showCustomAlert("Success", response.message || "Order Placed Successfully!")
        setSignalquantity("")
      } else {
        showCustomAlert("error", response.message || "Failed to place the order. Please try again.")
      }
    } catch (error) {
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")

    }
  };



  const ExitPlaceOrderStrategy = async () => {
    try {

      if (!signalquantity) {
        showCustomAlert("error", "Please enter the lot value");
        return;
      }
      const data = {
        id: userid,
        signalid: signaldetail?._id,
        quantity: signalquantity,
      };
      const response = await ExitPlaceOrderofmultiplesignal(data, token, brokerstatus);
      if (response.status) {
        showCustomAlert("Success", response.message || "Order Exit Successfully!")
      } else {
        showCustomAlert("error", response.message || "Order Failed")
      }
    } catch (error) {
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")
    }
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


  const Orderhandle = () => {
    if (selectedTab === "live") {
      PlanceOrderstartegydata();
    } else {
      ExitPlaceOrderStrategy();
    }
  }



  const renderLiveStrategies = () => {
    return getsignaldata?.map((item, index) => (
      <div className="col-md-6" key={index}>
        <div className="trade-card">
          <div className="trade-header ">
            <div>📅 {fDateTimeH(item?.created_at)}</div>
            <div className="tags">
              <div className="tag">{item?.callduration}</div>
              <div className="tag">{item?.strategy_name}</div>
            </div>
          </div>
          <div className="strategy-title ">
            {item?.stock}
            <button className="btn btn-sm btn-primary" style={{ float: "right" }} onClick={(e) => {
              handleDownload(item)
            }}>
              <i className="fa fa-eye fs-6" /> Report
            </button>
          </div>
          <table className="strategy-table table border mt-4">
            <tbody>
              <tr>
                <th>Strategy (execute all)</th>
                <th>Entry</th>
                <th>LTP</th>
              </tr>
              {item?.stockDetails?.map((stock, i) => (
                <tr key={i}>
                  <td>
                    <span className="alert alert-success px-2 py-1 me-2">{stock?.calltype}</span>
                    {stock?.tradesymbol}
                  </td>
                  <td>₹{stock?.price}</td>
                  <td>₹{stock?.strikeprice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="strategy-actions">
            <div className="info d-flex justify-content-between w-100">
              <div>Maximum Loss: ₹{item?.maximum_loss}</div>
              <div>Maximum Profit: ₹{item?.maximum_profit}</div>
              <div>Maximum Profit: ₹{item?.required_margin}</div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between mt-2">
            <button className="btn-success btn" onClick={() => {
              setModel(true);
              setSignaldetail(item)

            }}>Place Order</button>
            <button className="btn btn-secondary"
              onClick={() => {
                setViewModel(true);
                setDescription(item?.description);

              }}>About trade</button>
          </div>
        </div>
      </div>
    ));
  };




  const renderClosedStrategies = () => {
    const today = new Date().toISOString().split("T")[0];

    return getsignaldata?.map((item, index) => {
      const isClosedDatePassed = new Date(item?.closedate) > new Date(today);

      const tradeStatus =
        item?.closeprice == 0
          ? "Avoid Trade"
          : item?.isPurchased === false
            ? "Closed Trade"
            : item.closedate === isClosedDatePassed
              ? "Closed Trade"
              : "Exit Trade";

      const isButtonDisabled = tradeStatus !== "Exit Trade";

      return (
        <div className="col-md-6" key={index}>
          <div className="trade-card">
            <div className="trade-header">
              <div>📅 {fDateTimeH(item?.created_at)}</div>
              <div className="tags">
                <div className="tag">{item?.callduration}</div>
                <div className="tag">{item?.strategy_name}</div>
              </div>
            </div>
            <div className="strategy-title">
              {item?.stock}
              <button
                className="btn btn-sm btn-primary"
                style={{ float: "right" }}
                onClick={() => handleDownload(item)}
              >
                <i className="fa fa-eye fs-6" /> Report
              </button>
            </div>
            <table className="strategy-table table border mt-4">
              <tbody>
                <tr>
                  <th>Strategy (execute all)</th>
                  <th>Entry</th>
                  <th>LTP</th>
                </tr>
                {item?.stockDetails?.map((stock, i) => (
                  <tr key={i}>
                    <td>
                      <span className="alert alert-success px-2 py-1 me-2">
                        {stock?.calltype}
                      </span>
                      {stock?.tradesymbol}
                    </td>
                    <td>₹{stock?.price}</td>
                    <td>₹{stock?.strikeprice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="strategy-actions">
              <div className="info d-flex justify-content-between w-100">
                <div>Maximum Loss: ₹{item?.maximum_loss}</div>
                <div>Maximum Profit: ₹{item?.maximum_profit}</div>
                <div>Required Margin: ₹{item?.required_margin}</div>
              </div>
            </div>
            <hr />

            <div className="d-flex justify-content-between mt-2">
              <button
                className="btn-success btn"
                onClick={() => {
                  setModel(true);
                  setSignaldetail(item);
                }}
                disabled={isButtonDisabled}
              >
                {tradeStatus}
              </button>
              <div>
                <button
                  className={`btn ${parseFloat(item.mtype) == 1 ? "btn-success" : "btn-danger"}`}
                  style={{ padding: "0px 10px", fontSize: "15px" }}
                >
                  P&L: {item.closeprice && item.closeprice != 0
                    ? (parseFloat(item.mtype) == 1
                      ? item.closeprice
                      : `-${item.closeprice}`)
                    : "0"}
                </button>

              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setViewModel(true);
                  setDescription(item?.description);
                }}
              >
                About trade
              </button>
            </div>
          </div>
        </div>
      );
    });
  };




  return (
    <Content
      Page_title="Strategy"
      button_status={false}
      backbutton_status={false}
    // backForword={true}
    >
      <div className="row align-items-end g-3">
        <div className="col-lg-6 mb-3">
          <label htmlFor="searchInput" className="form-label fw-semibold">
            🔍 Search
          </label>
          <div className="input-group">
            <input
              type="text"
              id="searchInput"
              className="form-control rounded shadow-sm"
              placeholder="Type to search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search input"
            />
          </div>
        </div>

      </div>
      <ul
        className="nav nav-pills border-bottom my-3 justify-content-center"
        role="tablist"
      >
        {[
          { tab: "live", icon: "bx-home", label: "Live Trade" },
          { tab: "closed", icon: "bx-user-pin", label: "Close Trade" },
        ].map(({ tab, icon, label }) => (
          <li className="nav-item" role="presentation" key={tab}>
            <a
              className={`nav-link ${selectedTab === tab ? "btn-primary active" : ""}`}
              onClick={() => setSelectedTab(tab)}
              role="tab"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <div className="tab-icon">
                  <i className={`bx ${icon} font-18 me-1`} />
                </div  >
                <div className={`tab-title ${selectedTab === tab ? "btn-primary" : ""
                  }`}>{label}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>



      <div className=" nav nav-pills border-bottom my-3 justify-content-center row">
        {selectedTab === "live" ? renderLiveStrategies() : renderClosedStrategies()}
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

      <ReusableModal
        show={viewModel}
        onClose={() => setViewModel(false)}
        title={<span>Detail</span>}
        body={<div dangerouslySetInnerHTML={{ __html: description }} />}
      />

      <ReusableModal
        show={model}
        onClose={() => { setModel(false); setSignalquantity("") }}
        title={<span>{signaldetail?.stock}</span>}
        body={
          <>
            <table className="strategy-table table border mt-4">
              <tbody>
                <tr>
                  <th>Call Type</th>
                  <th>Trade Symbol</th>
                  <th>Lot</th>
                </tr>
                {signaldetail?.stockDetails?.map((stock, i) => (
                  <tr key={i}>
                    <td>
                      <span className="alert alert-success px-2 py-1 me-2">{stock?.calltype}</span>
                    </td>
                    <td>{stock?.tradesymbols}</td>
                    <td>{stock?.lot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-md-12">
              <label htmlFor="inputName" className="form-label">
                Lot
              </label>
              <input
                type="number"
                className="form-control"
                id="inputName"
                placeholder="Lot"
                value={signalquantity}
                onChange={(e) => {
                  setSignalquantity(e.target.value);
                }}
              />

            </div>
          </>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                Orderhandle();
              }}
            >
              {selectedTab === "live" ? "Place Order" : "Close Trade"}
            </button>
            <button className="btn btn-secondary" onClick={() => { setModel(false); setSignalquantity("") }}>
              Cancel
            </button>
          </>
        }
      />



    </Content>
  );
};

export default Strategy;