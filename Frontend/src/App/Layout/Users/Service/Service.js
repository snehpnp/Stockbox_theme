import React, { useEffect, useState, useMemo, useRef } from "react";
import Content from "../../../components/Contents/Content";
import { Modal, Accordion, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  GetCategorylist,
  GetPlanByCategory,
  AddplanSubscription,
  GetCouponlist,
  ApplyCoupondata,
  GetUserData
} from "../../../Services/UserService/User";
import { IndianRupee } from "lucide-react";
import { loadScript } from "../../../../Utils/Razorpayment";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import Loader from "../../../../Utils/Loader";
import ReusableModal from "../../../components/Models/ReusableModal";
import ShowCustomAlert from "../../../../App/Extracomponents/CustomAlert/CustomAlert"
import showCustomAlert from "../../../../App/Extracomponents/CustomAlert/CustomAlert";
import { useNavigate } from "react-router-dom";
import Kyc from "../Profile/Kyc"



const Service = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const applyButtonRef = useRef(null);

  const navigate = useNavigate();



  const [selectedPlan, setSelectedPlan] = useState("all");
  const [category, setCategory] = useState([]);
  const [plan, setPlan] = useState([]);
  const [userdata, setUserdata] = useState([]);



  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);



  const [gstStatus, setGstStatus] = useState()
  const [onlinePaymentStatus, setOnlinePaymentStatus] = useState()
  const [offlinePaymentStatus, setOfflinePaymentStatus] = useState()



  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [manualCoupon, setManualCoupon] = useState("");
  const [coupondata, setCouponData] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);



  const [coupons, setCoupon] = useState([]);
  const [getkey, setGetkey] = useState([]);
  const [company, setCompany] = useState([]);
  const [gstdata, setGstdata] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [viewmodel, setViewModel] = useState(false);
  const [viewmodel2, setViewModel2] = useState(false);
  const [viewmodel3, setViewModel3] = useState(false);
  const [discription, setDiscription] = useState("");
  const [kycStatus, setKycStatus] = useState("")




  useEffect(() => {
    getPlan();
    getCoupon();
    getkeybydata();
    fetchUserData();
  }, []);





  const fetchUserData = async () => {
    try {
      const userData = await GetUserData(userid, token);
      if (userData && userData.data) {
        setUserdata(userData.data)
      }
    } catch (error) {
      showCustomAlert("error", "Failed to load user data. Please refresh and try again.");
    }
  };





  const handleCouponSelect = (coupon) => {
    setManualCoupon(coupon?.code);
    setCouponData(coupon);
    if (applyButtonRef.current) {
      applyButtonRef.current.focus();
    }
  };



  const applyCoupon = async (coupon) => {
    try {
      const data = {
        code: coupon?.code,
        purchaseValue: selectedPlanDetails?.price,
        planid: selectedPlanDetails?._id,
      };
      const response = await ApplyCoupondata(data, token);

      if (response.status) {
        ShowCustomAlert("Success", response.message || "Your discount has been applied successfully.")

        const originalPrice = selectedPlanDetails?.price || 0;
        const discount = coupondata?.value || 0;
        const discountedPrice = originalPrice - discount;
        setDiscountedPrice(originalPrice - discountedPrice);
        setAppliedCoupon(coupondata);
        setDiscountedPrice(coupondata?.value);
      } else {
        ShowCustomAlert("error", response?.message || "Failed to apply coupon. Please try again.")
      }
    } catch (error) {
      ShowCustomAlert("error", "Something went wrong. Please try again later.")
    }
  };



  const removeCoupon = () => {
    setManualCoupon("");
    setAppliedCoupon(null);
    setDiscountedPrice(selectedPlanDetails?.price || "N/A");
  };



  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };




  const getCoupon = async () => {
    try {
      const response = await GetCouponlist();
      if (response.status) {
        setCoupon(response?.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };



  const getkeybydata = async () => {
    try {
      const response = await basicsettinglist();

      if (response.status) {
        setGetkey(response?.data[0]?.razorpay_key);
        setCompany(response?.data[0]?.from_name);
        setGstdata(response?.data[0]?.gst);
        setGstStatus(response.data[0].gststatus)
        setOnlinePaymentStatus(response.data[0].paymentstatus)
        setOfflinePaymentStatus(response.data[0].officepaymenystatus)
        setKycStatus(response?.data[0].kyc)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };



  const getPlan = async () => {
    try {
      const response = await GetPlanByCategory(userid, token);
      if (response.status) {
        setPlan(response?.data);
        setCategory(response?.data.sort((a, b) => b._id.localeCompare(a._id)));
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setIsLoading(false);
  };



  const handleShowModal = (item, freetrial_status) => {
    if (
      kycStatus == 1 &&
      (userdata?.kyc_verification == 0 || userdata?.kyc_verification == 2) &&
      item.price > 0
    ) {
      setViewModel2(true);
    }
    else if (freetrial_status == 1 && item.price == 0) {
      freeTrialsubscription(item);
    }
    else {
      setSelectedPlanDetails(item);
      setShowModal(true);
    }
  };




  const freeTrialsubscription = async (item) => {
    setIsLoading1(true);

    try {
      const data = {
        plan_ids: Array.isArray(item) ? item.map(i => i._id) : [item._id],
        client_id: userid,
        coupon_code: appliedCoupon?.code || 0,
        orderid: "",
        discount: appliedCoupon?.value || 0,
        price: item.price,
      };

      const response = await AddplanSubscription(data, token);
      if (response.status) {
        navigate("/user/thankyou", {
          state: {
            planType: data,
          }
        });
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
    setIsLoading1(false);

  };



  const AddSubscribeplan = async (item) => {
    try {
      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      }

      const basePrice = selectedPlanDetails?.price - (discountedPrice || 0);
      const gstAmount = (basePrice * gstdata) / 100;
      const finalAmount = Math.round((basePrice + gstAmount) * 100);

      const options = {
        key: getkey,
        amount: finalAmount,
        name: company,
        currency: "INR",
        title: item?.title || "Subscription Plan",

        handler: async function (response1) {
          const data = {
            plan_ids: Array.isArray(item) ? item.map(i => i._id) : [item._id],
            client_id: userid,
            coupon_code: appliedCoupon?.code || 0,
            orderid: response1?.razorpay_payment_id,
            discount: appliedCoupon?.value || 0,
            price: finalAmount,
          };

          setIsLoading1(true);
          setShowModal(false);
          try {
            const response2 = await AddplanSubscription(data, token);

            if (response2?.status) {
              if (kycStatus === 2 && userdata?.kyc_verification == 2) {
                setShowModal(false);
                setViewModel3(true);
              } else {
                navigate("/user/thankyou", {
                  state: {
                    planType: data,
                  },
                });
              }
            }
          } catch (error) {
            console.error("Error while adding plan subscription:", error);
          } finally {
            setIsLoading1(false);
          }
        },

        prefill: {},
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Subscription error:", error);
      setIsLoading1(false);
    }
  };




  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlanDetails(null);
    setDiscountedPrice(0);
    setManualCoupon("")
    setAppliedCoupon(null)
  };




  const getFilteredPlans = useMemo(() => {
    let filteredPlans =
      selectedPlan === "all"
        ? plan
        : plan.filter((item) => item?._id === selectedPlan);

    if (sortCriteria) {
      filteredPlans = filteredPlans.filter((item) =>
        item.services.some((data) => data.title === sortCriteria)
      );
    }

    return filteredPlans;

  }, [plan, selectedPlan, sortCriteria]);



  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };





  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };


  const loaderBoxStyle = {
    backgroundColor: "#fff",
    padding: "40px 60px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    minWidth: "280px",
  };




  return (
    <Content Page_title="Service" button_title="Back" button_status={false}>
      <div className="pricing-table">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="row w-100">

            <div className="col-md-6">
              <label htmlFor="sortSelect" className="mb-1">
                Segment
              </label>
              <select
                id="sortSelect"
                className="form-select"
                onChange={(e) => setSortCriteria(e.target.value)}
                value={sortCriteria}
              >
                <option value="">All</option>
                <option value="Cash">Cash</option>
                <option value="Future">Future</option>
                <option value="Option">Option</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="planSelect" className="mb-1">
                Plans For You
              </label>
              <div className="d-flex">
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
                  {category?.map((item) => (
                    <option value={item?._id} key={item?._id}>
                      {item?.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : getFilteredPlans?.length > 0 ? (
          <div className="pricing-container price1 mt-4">

            <div className="row row-cols-1 row-cols-lg-3">
              {[...getFilteredPlans]
                ?.sort((a, b) => b.freetrial_status - a.freetrial_status)
                ?.map((item) =>
                  item?.plans?.length > 0 ? (
                    item?.plans?.map((plan, index) => (
                      <div className="col mb-3" key={`${item?._id}-${index}`}>
                        <div className="card mb-5 mb-lg-0">
                          <div className="card-header py-3">
                            <h5 className="card-title text-white text-uppercase text-center">
                              {item?.title}
                            </h5>
                            <h6 className="card-price text-white text-center">
                              {plan?.price?.toFixed(2)}
                              <span className="term">
                                {Array.isArray(item?.services) && item?.services?.length > 0
                                  ? item.services
                                    .map((service) =>
                                      typeof service.title === "string"
                                        ? service.title.split(/(?=[A-Z])/).join(" + ")
                                        : "N/A"
                                    )
                                    .join(" + ")
                                  : "N/A"}
                              </span>
                            </h6>
                          </div>
                          <div className="card-body">
                            <ul className="list-group list-group-flush" style={{ minHeight: "200px" }}>
                              <li className="list-group-item">
                                <i className="bx bx-check me-2 font-18" />
                                Validity: {plan?.validity}
                              </li>

                              <li className="list-group-item text-secondary">
                                <p style={{ minHeight: "3em", overflow: "hidden" }}>
                                  {(() => {
                                    const text = stripHtmlTags(plan?.description || "");
                                    const words = text.split(" ");
                                    if (text === "") {
                                      return "No description available.....";
                                    }
                                    return words.length > 20
                                      ? words.slice(0, 20).join(" ") + "....."
                                      : text.padEnd(100, " ");
                                  })()}
                                </p>
                                <Link
                                  className="text-decoration-underline"
                                  onClick={() => {
                                    setViewModel(true);
                                    setDiscription(plan?.description);
                                  }}
                                >
                                  Know More...
                                </Link>
                              </li>
                            </ul>

                            <div className="border-top pt-3">
                              <button
                                className="btn btn-primary rounded-pill mt-2 mt-sm-0 ms-3"
                                onClick={() => handleShowModal(plan, item.freetrial_status)}
                              >
                                Subscribe Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : null
                )}
            </div>


          </div>
        ) : (
          <div className="text-center mt-4">
            <img src="/assets/images/norecordfound.png" alt="No Records Found" />
          </div>
        )}

      </div>


      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered size="xxl"

      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 heading-color modal-title h4 ">
            Plan Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlanDetails && (
            <>

              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* <h5>
                  {
                    plan.find((item) =>
                      item.plans?.some((subPlan) => subPlan._id === selectedPlanDetails?._id)
                    )?.title || "No Plan Found"
                  }
                </h5> */}

                <h5>
                  {
                    (() => {
                      const matchedPlan = plan.find((item) =>
                        item.plans?.some((subPlan) => subPlan._id === selectedPlanDetails?._id)
                      );

                      if (!matchedPlan) return "No Plan Found";

                      const serviceTitles = matchedPlan.services?.map((s) => s.title).join(", ");

                      return `${matchedPlan.title}${serviceTitles ? ` (${serviceTitles})` : ""}`;
                    })()
                  }
                </h5>



                <span className="text-success fw-bold">
                  <IndianRupee style={{ width: '15%;' }} />{" "}
                  {(selectedPlanDetails?.price)?.toFixed(2) || "N/A"}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  Validity:
                </span>
                <span>{selectedPlanDetails?.validity || "N/A"}</span>
              </div>

              <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>🎟️ Apply Coupon Code</Accordion.Header>
                  <Accordion.Body
                    style={{
                      maxHeight: "230px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      padding: '0',
                    }}
                  >
                    <div style={{ position: "sticky", top: 0, background: "white", zIndex: 10, padding: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          id="couponInput"
                          className="form-control me-2"
                          placeholder="Enter coupon code"
                          value={manualCoupon}
                          onChange={(e) => setManualCoupon(e.target.value)}
                        />
                        {manualCoupon && (
                          <button
                            ref={applyButtonRef}
                            className="btn btn-primary"
                            onClick={() => applyCoupon({ code: manualCoupon })}
                          >
                            Apply
                          </button>
                        )}
                        {appliedCoupon && (
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => removeCoupon()}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 px-2">
                      {coupons.map((coupon) => (
                        <li
                          key={coupon.code}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid #dcdcdc",
                            backgroundColor: "#ffffff",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            marginBottom: "15px",
                            borderRadius: "12px",
                            padding: "15px 20px",
                            listStyle: "none",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 12px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 8px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <div
                            className="btn-primary"
                            style={{
                              width: "40px",
                              height: "130px",

                              color: "#fff",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              borderTopLeftRadius: "12px",
                              borderBottomLeftRadius: "12px",
                              padding: "0",
                              marginLeft: "-20px",
                              marginTop: "-20px",
                              marginBottom: "-20px",
                            }}
                          >
                            {coupon?.serviceName
                              ?.split("")
                              .map((char, index) => (
                                <span
                                  key={index}
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {char.toUpperCase()}
                                </span>
                              ))}
                          </div>

                          <div
                            style={{
                              flexGrow: 1,
                              marginLeft: "15px",
                              textAlign: "left",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 5px",
                                fontWeight: "500",
                                color: "#333",
                                fontSize: "16px",
                              }}
                            >
                              Use code{" "}
                              <span
                                style={{
                                  fontWeight: "700",
                                  color: "#007bff",
                                  marginLeft: "5px",
                                }}
                              >
                                {coupon?.code}
                              </span>
                            </p>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              <span
                                style={{
                                  display: "block",
                                  marginBottom: "4px",
                                }}
                              >
                                🛡️ Validity:{" "}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {coupon?.enddate?.split("T")[0]}
                                </span>
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  marginBottom: "4px",
                                }}
                              >
                                💸 Save Upto: <strong>₹{coupon?.value}</strong>
                              </span>

                              <span style={{ display: "block" }}>
                                🛒 Min Purchase:{" "}
                                <strong>₹{coupon?.minpurchasevalue}</strong>
                              </span>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => handleCouponSelect(coupon)}
                              className={`btn ${manualCoupon === coupon.code ? "btn-success" : "btn-secondary"}`}
                              disabled={manualCoupon === coupon.code}
                            >
                              {manualCoupon === coupon.code ? "Selected" : "Select"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <hr />
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <b> Original Price:</b>
                  <span className="text-primary fw-bold">
                    <IndianRupee style={{ width: '15%;' }} /> {(selectedPlanDetails?.price)?.toFixed(2)}
                  </span>
                </div>
                {gstStatus == 1 && (

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <b>💰 GST ({gstdata}％):</b>
                    <span className="text-primary fw-bold">
                      <IndianRupee style={{ width: '15%;' }} /> {(gstStatus === 1 ? ((selectedPlanDetails?.price - (appliedCoupon ? discountedPrice || 0 : 0)) * gstdata) / 100 : 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="d-flex justify-content-between align-items-center text-danger mb-2">
                    <b> Coupon Discount:</b>
                    <span className="fw-bold">
                      - <IndianRupee style={{ width: '15%;' }} /> {(appliedCoupon?.value)?.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3 py-2 border-top">
                  <b> Total Price:</b>
                  <span
                    className="text-success fw-bold"

                  >
                    <IndianRupee style={{ width: '15%;' }} />{" "}
                    {(
                      selectedPlanDetails?.price -
                      (appliedCoupon ? discountedPrice || 0 : 0) +
                      (gstStatus === 1 ? ((selectedPlanDetails?.price - (appliedCoupon ? discountedPrice || 0 : 0)) * gstdata) / 100 : 0)
                    )?.toFixed(2)}

                  </span>
                </div>


              </div>
              <div className="d-flex justify-content-between">
                <div className="mt-4">
                  {onlinePaymentStatus !== 0 && (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => AddSubscribeplan(selectedPlanDetails)}
                    >

                      ✅ Pay Online
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  {offlinePaymentStatus !== 0 && (
                    <button
                      className="btn btn-success w-100"
                      onClick={() =>
                        navigate("/user/payment", { state: { key: "servicePageOfflinePayment" } })
                      }
                    >
                      ✅ Pay Offline
                    </button>
                  )}
                </div>
              </div>

            </>
          )}
        </Modal.Body>
      </Modal>



      <ReusableModal
        show={viewmodel}
        onClose={() => setViewModel(false)}
        title={<>Detail</>}

        body={
          <>
            <div className="modal-body">
              <div className="p-2 dynamic-content">
                <div dangerouslySetInnerHTML={{ __html: discription }} />
              </div>
            </div>
          </>
        }
      />



      {isLoading1 && (
        <div style={modalStyle}>
          <div style={loaderBoxStyle}>
            <div className="custom-spinner" />
            <p><Loader /></p>
          </div>

        </div>
      )}


      <ReusableModal
        show={viewmodel2}
        onClose={() => setViewModel2(false)}
        title={<>KYC</>}
        body={<Kyc setViewModel2={setViewModel2} />}
        size="lg"
      />

      <ReusableModal
        show={viewmodel3}
        onClose={() => setViewModel3(false)}
        title={<>KYC</>}
        body={<Kyc />}
        disableClose={false}
        size="lg"
      />

    </Content>
  );
};

export default Service;
