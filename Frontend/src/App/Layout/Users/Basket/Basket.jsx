import React, { useEffect, useState } from 'react'
import Content from "../../../components/Contents/Content";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate } from 'react-router-dom';
import { GetBasketService, BasketPurchaseList, AddBasketsubscription } from '../../../Services/UserService/User';
import { basicsettinglist } from '../../../Services/Admin/Admin';
import { loadScript } from '../../../../Utils/Razorpayment';
import Loader from '../../../../Utils/Loader';


function Basket() {

  const [activeTab, setActiveTab] = useState("allbasket");
  const [basketdata, setBasketdata] = useState([])
  const [purchasedata, setPurchasedata] = useState([])

  const [isLoading, setIsLoading] = useState(true)


  const [getkey, setGetkey] = useState([]);
  const [company, setCompany] = useState([]);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const navigate = useNavigate();



  useEffect(() => {
    getkeybydata()
    if (activeTab === "allbasket") {
      getbasketdata()
    } else if (activeTab === "subscribedbasket") {
      getbasketpurchasedata()
    }
  }, [activeTab])


  const getkeybydata = async () => {
    try {
      const response = await basicsettinglist();
      if (response.status) {
        setGetkey(response?.data[0]?.razorpay_key);
        setCompany(response?.data[0]?.from_name);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };



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



  const AddbasketSubscribeplan = async (item) => {
    try {
      console.log("item", item)
      return
      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      }
      const options = {
        key: getkey,
        amount: item?.basket_price * 100,
        name: company,
        currency: "INR",
        title: item?.title || "Subscription Basket",
        handler: async function (response1) {
          const data = {
            basket_id: item?._id,
            client_id: userid,
            price: item?.full_price ? item?.full_price : item?.basket_price,
            discount: response1?.orderid,
            orderid: response1?.orderid,
            coupon: 0,
          };

          try {
            const response2 = await AddBasketsubscription(data, token);
            if (response2?.status) {
              window.location.reload();
            }
          } catch (error) {
            console.error("Error while adding plan subscription:", error);
          }
        },
        prefill: {

        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Subscription error:", error);
    }
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
                          {/* <Link className="btn btn-primary w-100 " onClick={() => { AddbasketSubscribeplan(item) }}>
                        Subscribe <del>{item?.full_price}</del>  {item?.basket_price}
                      </Link> */}
                          <Link to="/user/payment" state={{ item }} className="btn btn-primary w-100 ">
                            Subscribe <del>{item?.full_price}</del>  {item?.basket_price}
                          </Link>
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

      <div className='mt-4'>
        <div
          className="accordion accordion-flush"
          id="accordionFlushExample"
        >
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <div
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="m-0">Vision2030 (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
                </div>
              </div>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="row  align-items-center">
                  <div className="col-md-12">
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

                        </tbody>

                      </table>
                    </div>
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
                  <h5 className="m-0"> (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
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
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

                        </tbody>

                      </table>
                    </div>
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
                  <h5 className="m-0"> Vision2030 (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
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
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




    </Content>
  )
}

export default Basket