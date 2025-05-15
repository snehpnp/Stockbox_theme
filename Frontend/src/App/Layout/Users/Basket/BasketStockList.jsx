import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { useLocation } from "react-router-dom";
import { BasketStockListdata, AddStockplaceorder, GetLivePricedata, PortfolioStock, GetUserData } from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import io from 'socket.io-client';
import $ from "jquery";
import { soket_url } from '../../../../Utils/config';
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";


const BasketStockList = () => {


  // const SOCKET_SERVER_URL = "https://stockboxpnp.pnpuniverse.com:1001/"
  const SOCKET_SERVER_URL = soket_url



  const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });


  useEffect(() => {
    getbasketpurchasedata();
    getuserdetail();
    getportfolio();
  }, []);



  const location = useLocation();
  const item = location?.state?.item;



  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");


  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const [activeTab, setActiveTab] = useState("baskets");


  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [isConfirming, setIsConfirming] = useState(false);
  const [purchasedata, setPurchasedata] = useState([]);
  const [inputdata, setInputdata] = useState({});
  const [userDetail, setUserDetail] = useState();
  const [portfolio, setPortfolio] = useState([]);
  const [getlivedata, setLiveprice] = useState([])


  const totalInvestment = portfolio.reduce((acc, curr) => acc + curr.price * curr.totalQuantity, 0);
  const totalInvestment1 = purchasedata.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);





  // calculation of Basket base

  const calculateValues1 = () => {
    let totalPL = 0;
    let currentVal = 0;
    let totalInvestment = 0;



    purchasedata.forEach((item) => {
      const livePriceElement = $(`#stock-price-${item.instrument_token}`);
      const livePrice = livePriceElement.length ? parseFloat(livePriceElement.text()) : null;

      if (livePrice && !isNaN(livePrice)) {
        const investment = item.price * item.quantity;
        totalInvestment += investment;
        currentVal += livePrice * item.quantity;
        totalPL += (livePrice - item.price) * item.quantity;
      }
    });


    const currentValueElement = $("#current-value");
    const totalPLElement = $("#total-pl");

    currentValueElement.text(`₹ ${currentVal.toFixed(2)}`);
    totalPLElement.text(`₹ ${totalPL.toFixed(2)}`);


    if (currentVal >= totalInvestment) {
      currentValueElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
    } else {
      currentValueElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
    }

    if (totalPL >= 0) {
      totalPLElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
    } else {
      totalPLElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
    }
  };



  const handleLiveData = (livedata) => {
    const stockData = purchasedata?.find((item) => item?.instrument_token === livedata?.tk);
    if (stockData) {
      const priceElement = $(`#stock-price-${livedata.tk}`);

      if (priceElement.length && livedata.lp && stockData.price) {
        priceElement.text(livedata.lp);

        if (livedata.lp > stockData.price) {
          priceElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
        } else if (livedata.lp < stockData.price) {
          priceElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
        }

        calculateValues1();
      }
    }
  };


  useEffect(() => {

    socket.on("Live_data", handleLiveData);

    return () => {
      socket.off("Live_data", handleLiveData);
    };
  }, [purchasedata]);




  // calculation of  portfolio base



  const calculateValues = () => {
    let totalPL = 0;
    let currentVal = 0;
    let totalInvestment = 0;

    portfolio.forEach((item) => {
      const livePriceElement = $(`#stock-prices-${item.ordertoken}`);
      const livePrice = livePriceElement.length ? parseFloat(livePriceElement.text()) : null;

      if (livePrice && !isNaN(livePrice)) {
        const investment = item.price * item.totalQuantity;
        totalInvestment += investment;
        currentVal += livePrice * item.totalQuantity;
        totalPL += (livePrice - item.price) * item.totalQuantity;
      }
    });


    const currentValueElement = $("#current-value1");
    const totalPLElement = $("#total-pl1");

    currentValueElement.text(`₹ ${currentVal.toFixed(2)}`);
    totalPLElement.text(`₹ ${totalPL.toFixed(2)}`);


    if (currentVal >= totalInvestment) {
      currentValueElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
    } else {
      currentValueElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
    }

    if (totalPL >= 0) {
      totalPLElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
    } else {
      totalPLElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
    }
  };



  const handleLiveData1 = (livedata) => {
    const stockData = portfolio?.find((item) => item?.ordertoken === livedata?.tk);
    if (stockData) {
      const priceElement = $(`#stock-prices-${livedata.tk}`);

      if (priceElement.length && livedata.lp && stockData.price) {
        priceElement.text(livedata.lp);

        if (livedata.lp > stockData.price) {
          priceElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
        } else if (livedata.lp < stockData.price) {
          priceElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
        }
        calculateValues();
      }
    }

  };



  useEffect(() => {
    socket.on("Live_data", handleLiveData1);
    return () => {
      socket.off("Live_data", handleLiveData1);
    };
  }, [portfolio]);





  const getportfolio = async () => {
    try {
      const data = { id: item?._id, clientid: userid };
      const response = await PortfolioStock(data, token);
      if (response.status) {
        setPortfolio(response?.data)
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };




  const getbasketpurchasedata = async () => {
    try {
      const data = { id: item?._id };
      const response = await BasketStockListdata(data, token);
      if (response.status) {
        setPurchasedata(response?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };



  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data?.brokerid);
      }
    } catch (error) {
      console.log("error", error);
    }
  };





  const BUYstockdata = async (type) => {
    try {
      setIsPlacingOrder(true);
      const data = {
        basket_id: item?._id,
        clientid: userid,
        brokerid: userDetail,
        investmentamount: inputdata,
        type: type,
      };

      const response = await AddStockplaceorder(data, token);
      setIsPlacingOrder(false);
      setIsConfirming(false);

      if (response.status) {
        showCustomAlert("Success", response.message || "Order Placed Successfully!")
          .then(() => {
            if (type === 1) {
              setShowModal(false);
              setInputdata("")
            }
          });
      } else {
        showCustomAlert("error", response.message || "Order Failed")
      }
    } catch (error) {
      setIsPlacingOrder(false);
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")
    }
  };






  return (
    <div className="basket-stock-list">
      <Content

        Page_title="Stock List"
        button_status={true}
        button_status1={portfolio.length > 0 ? true : false}
        button_title={"Rebalance History"}
        button_title1={"Rebalance"}
        route={`/user/rebalancehistory/${item._id}`}
        route1={`/user/rebalancestock/${item?._id}`}
        state1={{ data: item }}
        backbutton_status={false}
        backbutton_title="Back"
        backForword={true}
      >

        <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "baskets" ? "active btn-primary" : ""
                }`}
              onClick={() => setActiveTab("baskets")}
            >
              Baskets
            </button>
          </li>
          {portfolio.length > 0 ? <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "portfolio" ? "active btn-primary" : ""
                }`}
              onClick={() => setActiveTab("portfolio")}
            >
              My Portfolio
            </button>
          </li> : ""}
        </ul>


        {
          activeTab === "baskets" && (
            isLoading ? <Loader /> :
              <>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Total Investment
                            <hr />
                            <h5 className="mb-0">₹ {totalInvestment1.toFixed(2)}</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Current Value
                            <hr />
                            <h5 id="current-value" className="mb-0">₹ 0.00</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Total P&L
                            <hr />
                            <h5 id="total-pl" className="mb-0">₹ 0.00</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="table-responsive">
                    <table className="table ">
                      <thead className="table-primary">
                        <tr>
                          <th>Symbol</th>
                          <th>Suggested Price</th>
                          <th>Quantity</th>
                          <th>Current Market Price</th>
                          <th>Stock Weightage</th>

                        </tr>
                      </thead>
                      <tbody>
                        {purchasedata?.map((item) => (
                          <tr key={item?.name}>
                            <td>{item?.name}</td>
                            <td>{item?.price}</td>
                            <td>{item?.quantity}</td>
                            <td id={`stock-price-${item?.instrument_token}`} >
                              <span className="stock-price"> {"-"} </span>
                            </td>
                            <td>{item?.weightage}%</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn btn-success w-auto ms-3"
                    onClick={() => setShowModal(true)}
                  >
                    Buy Now
                  </button>
                </div>
              </>

          )
        }


        {
          portfolio.length > 0 && activeTab === "portfolio" && (
            isLoading ? <Loader /> :
              <>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Total Investment
                            <hr />
                            <h5 className="mb-0">₹ {totalInvestment.toFixed(2)}</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Current Value
                            <hr />
                            <h5 id="current-value1" className="mb-0">₹ 0.00</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body p-2">
                        <ul className="list-group list-group-flush list shadow-none ">
                          <li className="list-group-item ">
                            Total P&L
                            <hr />
                            <h5 id="total-pl1" className="mb-0">₹ 0.00</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="table-responsive">
                    <table className="table ">
                      <thead className="table-primary">
                        <tr>
                          <th>Symbol</th>
                          <th>Suggested Price</th>
                          <th>Current Market Price</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio?.map((item) => (

                          <tr key={item?.name}>
                            <td>{item?.tradesymbol}</td>
                            <td>{item?.price}</td>
                            <td id={`stock-prices-${item?.ordertoken}`} >
                              <span className="stock-prices"> {"-"} </span>
                            </td>
                            <td>{item?.totalQuantity}</td>
                          </tr>
                        ))
                        }

                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn btn-success w-auto ms-3"
                    onClick={() => setShowModal(true)}
                  >
                    Buy Now
                  </button>
                </div>
              </>
          )
        }

        <ReusableModal
          show={showModal}
          onClose={handleCloseModal}
          title={<>Investment Amount</>}
          body={
            <div>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Investment Amount"
                value={inputdata}
                onChange={(e) => setInputdata(e.target.value)}
              />

              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  setIsConfirming(true);
                  BUYstockdata(0);
                }}
                disabled={isConfirming}
              >
                Confirm
              </button>
              <p className="fs-14 mb-0 mt-1">
                Minimum Investment Amount: <strong>₹ {item?.mininvamount}</strong>
              </p>
            </div>
          }
          footer={
            <>
              <button
                className="btn btn-primary"
                onClick={() => BUYstockdata(1)}
                // disabled={isPlacingOrder}
                disabled={!isConfirming}
              >
                Place Order
              </button>
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
            </>
          }
        />
      </Content >
    </div>
  );
};

export default BasketStockList;
