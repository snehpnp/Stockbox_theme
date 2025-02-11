import React, { useEffect, useState } from 'react'
import Content from "../../../components/Contents/Content";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate } from 'react-router-dom';
import { GetBasketService, BasketPurchaseList } from '../../../Services/UserService/User';
import { loadScript } from '../../../../Utils/Razorpayment';
import Loader from '../../../../Utils/Loader';


function Basket() {


  const [activeTab, setActiveTab] = useState("allbasket");
  const [basketdata, setBasketdata] = useState([])
  const [purchasedata, setPurchasedata] = useState([])

  const [isLoading, setIsLoading] = useState(true)




  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const navigate = useNavigate();



  useEffect(() => {
    if (activeTab === "allbasket") {
      getbasketdata()
    } else if (activeTab === "subscribedbasket") {
      getbasketpurchasedata()
    }
  }, [activeTab, isLoading])





  const getbasketdata = async () => {
    try {
      const data = { clientid: userid }
      const response = await GetBasketService(data, token)
      if (response.status) {
        setBasketdata(response.data)

      }
    } catch (error) {
      console.log("error", error)
    }
    setIsLoading(false)
  }




  const getbasketpurchasedata = async () => {
    try {
      const data = { clientid: userid }
      const response = await BasketPurchaseList(data, token)
      if (response.status) {
        setPurchasedata(response.data)

      }
    } catch (error) {
      console.log("error", error)
    }
    setIsLoading(false)
  }



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

      <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
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
      {activeTab === "allbasket" && (
        isLoading ? <Loader /> :
          <>
            <div className="row">

              {basketdata?.map((item) => {
                return (
                  <div className="col-md-12 col-lg-4 mb-3" key={item?.id}>
                    <div className="card radius-10 overflow-hidden">
                      <div className="card-body">
                        <h5>{item?.title} ({item?.themename})</h5>
                      </div>
                      <div className="progress-wrapper">
                        <div className="progress" style={{ height: 7 }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "75%" }}
                          />
                        </div>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush list shadow-none">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <textarea
                              className="form-control"
                              value={stripHtmlTags(
                                item?.description || ""
                              )}
                              readOnly
                            />
                            {/* <p className="basket-short-description">
                          {stripHtmlTags(item?.description)}
                        </p> */}
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Minimum Investment
                            <span className="badge bg-dark rounded-pill">{item?.mininvamount}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            CAGR
                            <span className="badge bg-success rounded-pill">{item?.cagr}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                            Validity
                            <span className="badge bg-danger rounded-pill">{item?.validity}</span>
                          </li>

                          {
                            item?.isSubscribed || item?.isActive ? (
                              <Link to="/user/basketstocklist" state={{ item }} className="btn btn-primary w-100">
                                View Stock Detail
                              </Link>
                            ) : item?.isSubscribed === false && item?.isActive === false ? (
                              <Link to="/user/payment" state={{ item }} className="btn btn-primary w-100">
                                Subscribe <del>{item?.full_price}</del> {item?.basket_price}
                              </Link>
                            ) : item?.isSubscribed === true && item?.isActive === false ? (
                              <Link to="/user/rebalancestock" state={{ item }} className="btn btn-primary w-100">
                                View Rebalance
                              </Link>
                            ) : ""
                          }


                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </>

      )}

      {activeTab === "subscribedbasket" && (
        isLoading ? <Loader /> : <div className="row">
          {purchasedata?.map((item) => {
            return (
              <>
                <div className="col-md-12 col-lg-4 mb-3" key={item?.id}>
                  <div className="card radius-10 overflow-hidden">
                    <div className="card-body">
                      <h5>{item?.title}</h5>
                    </div>
                    <div className="progress-wrapper">
                      <div className="progress" style={{ height: 7 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "75%" }}
                        />
                      </div>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush list shadow-none">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <textarea
                            className="form-control"
                            value={stripHtmlTags(
                              item?.description || ""
                            )}
                            readOnly
                          />
                          {/* <p className="basket-short-description">
                          {stripHtmlTags(item?.description)}
                        </p> */}
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Minimum Investment
                          <span className="badge bg-dark rounded-pill">{item?.mininvamount}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          CAGR
                          <span className="badge bg-success rounded-pill">{item?.cagr}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                          Validity
                          <span className="badge bg-danger rounded-pill">{item?.validity}</span>
                        </li>
                        <Link to="/user/basketdetail" state={{ item }} className="btn btn-primary w-100">
                          View Details
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>

              </>
            )
          })}

        </div>
      )}

    </Content>
  )
}

export default Basket