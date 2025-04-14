import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GetBasketService,
  BasketPurchaseList,
} from "../../../Services/UserService/User";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import { loadScript } from "../../../../Utils/Razorpayment";
import Loader from "../../../../Utils/Loader";

function Basket() {
  const location = useLocation();
  const newActiveTab = location?.state?.activeTab || {};


  // const [activeTab, setActiveTab] = useState("allbasket");
  const [activeTab, setActiveTab] = useState(() =>
    newActiveTab === "basket" ? "subscribedbasket" : "allbasket"
  );
  const [basketdata, setBasketdata] = useState([]);


  const [purchasedata, setPurchasedata] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const navigate = useNavigate();

  const [onlinePaymentStatus, setOnlinePaymentStatus] = useState();
  const [offlinePaymentStatus, setOfflinePaymentStatus] = useState();


  useEffect(() => {
    if (activeTab === "allbasket") {
      getbasketdata();
    } else if (activeTab === "subscribedbasket") {
      getbasketpurchasedata();
    }
  }, [activeTab, isLoading]);

  useEffect(() => {
    getkeybydata();
  }, []);

  const getkeybydata = async () => {
    try {
      const response = await basicsettinglist();
      if (response.status) {
        setOnlinePaymentStatus(response.data[0].paymentstatus);
        setOfflinePaymentStatus(response.data[0].officepaymenystatus);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const getbasketdata = async () => {
    try {
      const data = { clientid: userid };
      const response = await GetBasketService(data, token);
      if (response.status) {
        setBasketdata(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  const getbasketpurchasedata = async () => {
    try {
      const data = { clientid: userid };
      const response = await BasketPurchaseList(data, token);
      if (response.status) {
        setPurchasedata(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };

  // Static details
  const details = {
    title: "SADSD",
    name: "sdad",
    accuracy: "0%",
    cagr: "null %",
    rebalanceFrequency: "Half Yearly",
    portfolioWeightage: "0",
    validity: "1 month",
    type: "null",
    theme: "dsd",
    noOfStocks: "0",
    nextRebalanceDate: "2024-12-10",
    minInvestment: "10",
    description: "Mid Cap",
  };

  return (
    <Content
      Page_title="Basket"
      button_title="Add Basket"
      backbutton_title="back"
      button_status={false}
      backbutton_status={false}
    >
      <ul className="nav nav-pills mb-3 justify-content-center border-bottom mb-">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "allbasket" ? "active btn-primary" : ""
              }`}
            onClick={() => setActiveTab("allbasket")}
          >
            All Basket
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "subscribedbasket" ? "active btn-primary" : ""
              }`}
            onClick={() => setActiveTab("subscribedbasket")}
          >
            Subscribed Basket
          </button>
        </li>
      </ul>
      {activeTab === "allbasket" &&
        (isLoading ? (
          <Loader />
        ) : basketdata?.length > 0 ? (
          <div className="row">
            {basketdata?.map((item) => (
              <div className="col-md-12 col-lg-6 mb-4" key={item?.id}>
                <div className="card radius-10 overflow-hidden shadow"
                style={{ minHeight: "253px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                onClick={() => navigate("/user/basketdetail", { state: { item } })}
                >
                  <div className="card-body pb-0">
                    <div className="d-flex ">
                      <img
                        src={item.image}
                        alt="Basket"
                        style={{ width: "70px", height: "70px" }}
                        className=" img-fluid mb-3"
                      />
                      <div className="mb-0 ms-3 ">
                        <div className="d-flex justify-content-between align-items-center">
                          <h4 className="mb-0">
                            {item?.title} ({item?.themename})
                          </h4>
                          {item?.isSubscribed && (
                            <span
                              className="badge bg-success"
                              style={{ fontSize: "12px"}}
                            >
                              Subscribed
                            </span>
                          )}
                        </div>


                        <p className="basket-short-description mb-1">
                          {stripHtmlTags(item?.description || "")}
                        </p>

                        <div className="text-muted fs-6">
                          {" "}
                          Since Launch
                          <span>
                            <b className="">: {item?.cagr_live}%</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="card-body pt-0  ">
                    <ul className="list-group list-group-flush list d-flex flex-row justify-content-between mb-3">
                      <li className="list-group-item border-bottom-0 border-right">
                        <div className="text-muted fs-6">
                          Minimum Investment
                        </div>
                        <b className="">{item?.mininvamount}</b>
                      </li>

                      <li className="list-group-item border-bottom-0">
                        <div className="text-muted fs-6">Volatility</div>
                        {/* <b className="">{item?.type}</b> */}
                        <b className="">High Risk</b>
                      </li>
                      <li className="list-group-item border-bottom-0">
                        {item?.isSubscribed || item?.isActive ? (
                          <Link
                            to="/user/basketdetail"
                            state={{ item }}
                            className="btn btn-primary w-100"
                          >
                            View Details
                          </Link>
                        ) : item?.isSubscribed === false &&
                          item?.isActive === false ? (
                          <Link
                            to={
                              onlinePaymentStatus || offlinePaymentStatus
                                ? "/user/payment"
                                : "#"
                            }
                            state={{ item }}
                            className="btn btn-primary w-100"
                            style={{
                              pointerEvents:
                                onlinePaymentStatus || offlinePaymentStatus
                                  ? "auto"
                                  : "none",
                              opacity:
                                onlinePaymentStatus || offlinePaymentStatus
                                  ? "1"
                                  : "0.5",
                            }}
                          >
                            Subscribe <del>{item?.full_price}</del>{" "}
                            {item?.basket_price}
                          </Link>
                        ) : item?.isSubscribed === true &&
                          item?.isActive === false ? (
                          <Link
                            to="/user/rebalancestock"
                            state={{ item }}
                            className="btn btn-primary w-100"
                          >
                            View Rebalance
                          </Link>
                        ) : null}
                      </li>
                      {/* <Link to="/user/basketdetail" state={{ item }} className="btn btn-primary w-100 mb-1">
                        View Details
                      </Link> */}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-4">
            <img
              src="/assets/images/norecordfound.png"
              alt="No Records Found"
            />
          </div>
        ))}

      {activeTab === "subscribedbasket" &&
        (isLoading ? (
          <Loader />
        ) : purchasedata?.length > 0 ? (
          <div className="row">
            {purchasedata?.map((item) => (
              <div className="col-md-6 col-lg-6 mb-3" key={item?.id}>
                <div className="card radius-10 overflow-hidden shadow ">

                  <div className="card-body pb-0">
                    <div className="d-flex ">
                      <img
                        // src="https://stockboxpnp.pnpuniverse.com/uploads/blogs/image-1742206277154-910627492.png"
                        src={item?.image}
                        alt="Basket"
                        style={{ width: "70px", height: "70px" }}
                        className=" img-fluid mb-3"
                      />
                      <div className="mb-0 ms-3 ">
                        <h4>
                          {item?.title} ({item?.themename})

                        </h4>

                        <p className="basket-short-description mb-1">
                          {stripHtmlTags(item?.description || "")}
                        </p>

                        <div className="text-muted fs-6">
                          {" "}
                          Since Launch
                          <span>
                            <b className="">: {item?.cagr}</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="card-body pt-0  ">
                    <ul className="list-group list-group-flush list d-flex flex-row justify-content-between mb-3">
                      <li className="list-group-item border-bottom-0 border-right">
                        <div className="text-muted fs-6">
                          Minimum Investment
                        </div>
                        <b className="">{item?.mininvamount}</b>
                      </li>

                      <li className="list-group-item border-bottom-0">
                        <div className="text-muted fs-6">Volatility</div>
                        <b className="">{item?.volatility}</b>
                      </li>
                      <li className="list-group-item border-bottom-0">
                        <Link
                          to="/user/basketdetail"
                          state={{ item }}
                          className="btn btn-primary w-100"
                        >
                          View Details
                        </Link>


                      </li>
                      {/* <Link to="/user/basketdetail" state={{ item }} className="btn btn-primary w-100 mb-1">
                        View Details
                      </Link> */}
                    </ul>
                  </div>





                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-4">
            <img
              src="/assets/images/norecordfound.png"
              alt="No Records Found"
            />
          </div>
        ))}
    </Content>
  );
}

export default Basket;
