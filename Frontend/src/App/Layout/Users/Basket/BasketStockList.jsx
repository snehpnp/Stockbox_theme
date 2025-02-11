import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { useLocation } from "react-router-dom";
import { BasketStockListdata, AddStockplaceorder, PortfolioStock, GetUserData } from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import Swal from "sweetalert2";

const BasketStockList = () => {


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
        Swal.fire({
          icon: "success",
          title: response.message || "Order Placed Successfully!",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          if (type === 1) {
            setShowModal(false);
            setInputdata("")
          }
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
      setIsPlacingOrder(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while placing the order. Please check your network or try again later.",
        confirmButtonText: "Retry",
      });
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
                            <h5 className="mb-0">₹ {item?.mininvamount}</h5>
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
                            <h5 className="mb-0">₹10</h5>
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
                            <h5 className="mb-0">₹1055666</h5>
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
                          <th>Stock Weightage</th>
                          <th>Current Market Price</th>
                          <th>Current Value</th>
                          <th>Quanty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasedata?.map((item) => (
                          <tr key={item?.name}>
                            <td>{item?.name}</td>
                            <td>{item?.price}</td>
                            <td>{item?.weightage}</td>
                            <td>0</td>
                            <td>0</td>
                            <td>{item?.quantity}</td>
                            <td>{item?.price}</td>
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
                            <h5 className="mb-0">₹ {item?.mininvamount}</h5>
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
                            <h5 className="mb-0">₹10</h5>
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
                            <h5 className="mb-0">₹1055666</h5>
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
                          {/* <th>Stock Weightage</th> */}
                          <th>Current Market Price</th>
                          <th>Current Value</th>
                          <th>Quanty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio?.map((item) => (
                          <tr key={item?.name}>
                            <td>{item?.tradesymbol}</td>
                            <td>{item?.price}</td>
                            {/* <td>{item?.weightage}</td> */}
                            <td>0</td>
                            <td>0</td>
                            <td>{item?.totalQuantity}</td>
                            <td>{item?.price}</td>
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
                className="btn btn-primary"
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
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
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
