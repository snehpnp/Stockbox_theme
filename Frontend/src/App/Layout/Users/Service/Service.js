import React, { useEffect, useState, useMemo, useRef } from "react";
import Content from "../../../components/Contents/Content";
import { Modal, Accordion, Form } from "react-bootstrap";
import {
  GetCategorylist,
  GetPlanByCategory,
  AddplanSubscription,
  GetCouponlist,
  ApplyCoupondata,
} from "../../../Services/UserService/User";
import { IndianRupee } from "lucide-react";
import { loadScript } from "../../../../Utils/Razorpayment";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import Loader from "../../../../Utils/Loader";
import ReusableModal from "../../../components/Models/ReusableModal";
import ShowCustomAlert from "../../../../App/Extracomponents/CustomAlert/CustomAlert"


const Service = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const applyButtonRef = useRef(null);

  const [selectedPlan, setSelectedPlan] = useState("all");

  const [category, setCategory] = useState([]);
  const [plan, setPlan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);



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

  const [viewmodel, setViewModel] = useState(false);

  const [discription, setDiscription] = useState("");

  const [gstStatus, setGstStatus] = useState()
  const [onlinePaymentStatus, setOnlinePaymentStatus] = useState()


  useEffect(() => {
    getPlan();
    getCoupon();
    getkeybydata();
  }, []);

  // useEffect(()=>{
  //   selectedPlanDetails
  // },[selectedPlanDetails])




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
      // console.log("Online paymentstatus", response.data[0].paymentstatus);

      if (response.status) {
        setGetkey(response?.data[0]?.razorpay_key);
        setCompany(response?.data[0]?.from_name);
        setGstdata(response?.data[0]?.gst);
        setGstStatus(response?.data[0].gststatus)
        setOnlinePaymentStatus(response?.data[0].paymentstatus)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };





  const getPlan = async () => {
    try {
      const response = await GetPlanByCategory(token);
      if (response.status) {
        setPlan(response?.data);
        setCategory(response?.data.sort((a, b) => b._id.localeCompare(a._id)));
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setIsLoading(false);
  };





  const AddSubscribeplan = async (item) => {
    try {
      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      }

      const basePrice = selectedPlanDetails?.price - (discountedPrice || 0);
      const gstAmount = (basePrice * gstdata) / 100;
      const finalAmount = (basePrice + gstAmount) * 100;

      const options = {
        key: getkey,
        amount: finalAmount,
        name: company,
        currency: "INR",
        title: item?.title || "Subscription Plan",
        handler: async function (response1) {
          const data = {
            plan_id: item?._id,
            client_id: userid,
            coupon_code: appliedCoupon?.code || 0,
            orderid: response1?.orderid,
            discount: appliedCoupon?.value || 0,
            price: finalAmount,
          };

          try {
            const response2 = await AddplanSubscription(data, token);
            if (response2?.status) {
              setShowModal(false);
              window.location.reload();
            }
          } catch (error) {
            console.error("Error while adding plan subscription:", error);
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
    }
  };




  const handleShowModal = (item) => {
    setSelectedPlanDetails(item);
    setShowModal(true);
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





  return (
    <Content Page_title="Service" button_title="Back" button_status={false}>
      <div className="">
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
                <option value="">All Segment</option>
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
        ) : (
          <div className="pricing-container price1 mt-4">
            {getFilteredPlans?.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                {getFilteredPlans?.map((item) =>
                  item?.plans?.length > 0
                    ? item?.plans?.map((plan, index) => (
                      <div className="col col-lg-6" key={`${item?._id}-${index}`}>
                        <div className="card card1 mb-4">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="text-left">
                                <span className="price-original">
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
                                <h5 className="mb-0">{item?.title}</h5>
                              </div>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <b>Plan:</b> {plan?.name || `Plan ${index + 1}`}
                              </div>
                              <div className="price">
                                <span className="price-current">
                                  <IndianRupee /> {plan?.price}
                                </span>
                              </div>
                            </div>
                            <ul className="features">
                              <li>
                                <b>Validity</b>: {plan?.validity}
                              </li>
                              <li>
                                <b>Description</b>:
                                <textarea
                                  className="form-control"
                                  value={stripHtmlTags(plan?.description || "")}
                                  readOnly
                                />
                              </li>
                            </ul>
                            <div className="d-block d-sm-flex align-items-center justify-content-between mt-3">
                              <button
                                className="btn btn-secondary rounded-1 mt-2 mt-sm-0 me-2 me-sm-0"
                                onClick={() => {
                                  setViewModel(true);
                                  setDiscription(plan?.description);
                                }}
                              >
                                Know More
                              </button>

                              <button
                                className="btn btn-primary rounded-1 mt-2 mt-sm-0"
                                onClick={() => handleShowModal(plan)}
                              >
                                Subscribe Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    : null
                )}
              </div>
            ) : (
              <div className="text-center mt-4">
                <img src="/assets/images/norecordfound.png" alt="No Records Found" />
              </div>
            )}


          </div>

        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="xxl">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }} className="text-center w-100">
            🌟 Plan Details
          </Modal.Title>

        </Modal.Header>
        <Modal.Body>
          {selectedPlanDetails && (
            <>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>🏷️ {selectedPlanDetails?.title}</h5>
                <span className="text-success fw-bold">
                  <IndianRupee />{" "}
                  {selectedPlanDetails?.price || "N/A"}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  🕒 <b>Validity:</b>
                </span>
                <span>{selectedPlanDetails?.validity || "N/A"}</span>
              </div>

              <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>🎟️ Apply Coupon Code</Accordion.Header>
                  <Accordion.Body
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                    }}
                  >
                    <div className="mb-3">
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

                    <div>
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
                              disabled={manualCoupon === coupon.code} // Already selected coupon ko disable kar diya
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
                  <b>💵 Original Price:</b>
                  <span className="text-primary fw-bold">
                    <IndianRupee /> {selectedPlanDetails?.price}
                  </span>
                </div>
                {gstStatus == 1 && (

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <b>💰 GST :</b>
                    <span className="text-primary fw-bold">
                      <IndianRupee /> {gstdata}％
                    </span>
                  </div>
                )}


                {appliedCoupon && (
                  <div className="d-flex justify-content-between align-items-center text-danger mb-2">
                    <b>🎟️ Coupon Discount:</b>
                    <span className="fw-bold">
                      - <IndianRupee /> {appliedCoupon?.value}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3 py-2 border-top">
                  <b>💰 Total Price:</b>
                  <span
                    className="text-success fw-bold"
                    style={{ fontSize: "1.2rem" }}
                  >
                    <IndianRupee />{" "}

                    {/* if you want to less base price - discount then use this logic */}
                    {gstStatus === 1 && (
                      (
                        (selectedPlanDetails?.price - (appliedCoupon ? discountedPrice || 0 : 0)) +
                        ((selectedPlanDetails?.price - (appliedCoupon ? discountedPrice || 0 : 0)) * gstdata) / 100
                      ).toFixed(2)
                    )}

                    {gstStatus === 0 && (
                      (selectedPlanDetails?.price - (appliedCoupon ? discountedPrice || 0 : 0))
                    )}





                    {/* if want to less totel price - discount price use this logic */}
                    {/* {(
                      (selectedPlanDetails?.price * (1 + gstdata / 100)) -
                      (appliedCoupon ? discountedPrice || 0 : 0)  // Coupon hatne pe discount 0
                    ).toFixed(2)} */}
                  </span>
                </div>


              </div>

              <div className="mt-4">
                <button
                  className="btn btn-success w-100"
                  onClick={() => AddSubscribeplan(selectedPlanDetails)}
                  disabled={onlinePaymentStatus === 0} 
                >
                  ✅ Confirm & Subscribe
                </button>
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
    </Content>
  );
};

export default Service;
