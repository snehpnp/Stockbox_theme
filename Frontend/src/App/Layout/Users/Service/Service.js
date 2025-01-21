import React, { useEffect, useState, useMemo } from "react";
import Content from "../../../components/Contents/Content";
import { Modal, Accordion, Form } from "react-bootstrap";
import {
  GetCategorylist,
  GetPlanByCategory,
  AddplanSubscription,
  GetCouponlist,
} from "../../../Services/UserService/User";
import { IndianRupee } from "lucide-react";
import { loadScript } from "../../../../Utils/Razorpayment";

function Service() {
  const token = localStorage.getItem("Token");
  const userid = localStorage.getItem("id");

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [category, setCategory] = useState([]);
  const [plan, setPlan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [manualCoupon, setManualCoupon] = useState("");
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [coupons, setCoupon] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("price");

  useEffect(() => {
    getCategory();
    getPlan();
    getCoupon();
  }, []);

  const handleCouponSelect = (coupon) => {
    const originalPrice = selectedPlanDetails?.plans[0]?.price || 0;
    const discount = coupon?.value || 0;
    setDiscountedPrice(originalPrice - discount);
    setAppliedCoupon(coupon);
  };

  const applyCoupon = (coupon) => {
    const originalPrice = selectedPlanDetails?.plans[0]?.price || 0;
    const discount = selectedCouponCode.value || 0;
    const discountedPrice = originalPrice - discount;

    setAppliedCoupon(coupon);
    setDiscountedPrice(discountedPrice > 0 ? discountedPrice : originalPrice);
  };

  const removeCoupon = () => {
    setManualCoupon("");
    setAppliedCoupon(null);
    setDiscountedPrice(selectedPlanDetails?.plans[0]?.price || "N/A");

    setAppliedCoupon(null);
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

  const getCategory = async () => {
    try {
      const response = await GetCategorylist();
      if (response.status) {
        setCategory(response?.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getPlan = async () => {
    try {
      const response = await GetPlanByCategory(token);
      if (response.status) {
        setPlan(response.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const AddSubscribeplan = async (item) => {
    try {
      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      }
      const options = {
        key: "rzp_test_22mEHcDzJbcUmz",
        amount:
          discountedPrice > 0
            ? (Number(item?.plans[0]?.price) -
                Number(selectedCouponCode?.value)) *
              100
            : Number(item?.plans[0]?.price) * 100,
        currency: "INR",
        title: item?.plans[0]?.title || "Subscription Plan",
        handler: async function (response1) {
          const data = {
            plan_id: item?.plans[0]?._id,
            client_id: userid,
            coupon_code: appliedCoupon?.code || "",
            orderid: response1?.orderid,
            discount: selectedCouponCode?.value || "",
            price: item?.plans?.price,
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
  };

  const getFilteredPlans = useMemo(() => {
    let filteredPlans =
      selectedPlan === "all"
        ? plan
        : plan.filter((item) => item?._id === selectedPlan);

    if (sortCriteria === "price") {
      filteredPlans.sort((a, b) => a?.plans[0]?.price - b?.plans[0]?.price);
    } else if (sortCriteria === "title") {
      filteredPlans.sort((a, b) => a?.title.localeCompare(b?.title));
    } else if (sortCriteria === "validity") {
      filteredPlans.sort(
        (a, b) => a?.plans[0]?.validity - b?.plans[0]?.validity
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
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="row w-100">
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
                    {category.map((item) => (
                      <option value={item?._id} key={item?._id}>
                        {item?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="sortSelect" className="mb-1">
                  Sort By
                </label>
                <select
                  id="sortSelect"
                  className="form-select"
                  onChange={(e) => setSortCriteria(e.target.value)}
                  value={sortCriteria}
                >
                  <option value="price">Price</option>
                  <option value="title">Title</option>
                  <option value="validity">Validity</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pricing-container price1 row mt-4">
            <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
              {getFilteredPlans.map((item) => (
                <div className="col" key={item?._id}>
                  <div className="card card1 mb-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="text-left">
                          <span className="price-original">
                            {Array.isArray(item?.services) &&
                            item.services.length > 0
                              ? item.services
                                  .map((service) =>
                                    typeof service.title === "string"
                                      ? service.title
                                          .split(/(?=[A-Z])/)
                                          .join(" + ")
                                      : "N/A"
                                  )
                                  .join(" + ")
                              : "N/A"}
                          </span>
                          <h5 className="mb-0">{item?.title}</h5>
                        </div>
                        <div className="ms-auto">
                          <div className="price">
                            <span className="price-current">
                              <IndianRupee />
                              {item?.plans[0]?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <ul className="features">
                        <li>
                          <b>Validity</b>: {item?.plans[0]?.validity}{" "}
                        </li>
                        <li>
                          <b>Description</b>:
                          <textarea
                            className="form-control"
                            value={stripHtmlTags(
                              item?.plans[0]?.description || ""
                            )}
                            readOnly
                          />
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <button className="btn btn-secondary rounded-1">
                          Know More
                        </button>
                        <button
                          className="btn btn-primary rounded-1"
                          onClick={() => handleShowModal(item)}
                        >
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            🌟 Plan Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlanDetails && (
            <>
              {/* Plan Title and Price */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>🏷️ {selectedPlanDetails?.title}</h5>
                <span className="text-success fw-bold">
                  <IndianRupee />{" "}
                  {selectedPlanDetails?.plans[0]?.price || "N/A"}
                </span>
              </div>

              {/* Validity */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  🕒 <b>Validity:</b>
                </span>
                <span>{selectedPlanDetails?.plans[0]?.validity || "N/A"}</span>
              </div>

              {/* Coupon Code Accordion */}
              <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>🎟️ Apply Coupon Code</Accordion.Header>
                  <Accordion.Body
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {/* Manual Coupon Input */}
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
                        <button
                          className="btn btn-primary"
                          onClick={() => applyCoupon({ code: manualCoupon })}
                        >
                          Apply
                        </button>
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

                    {/* Available Coupons */}
                    <div>
                      {coupons.map((coupon) => (
                        <li
                          className="d-flex align-items-center pb-3"
                          key={coupon.code}
                          style={{
                            border: "1px solid #eaeaea",
                            marginBottom: "10px",
                            padding: "10px",
                            borderRadius: "8px",
                          }}
                        >
                          <div
                            className="rounded-circle p-2 border d-flex align-items-center justify-content-center"
                            style={{
                              width: "50px",
                              height: "50px",  
                              backgroundColor: "#f8f8f8",
                              textAlign: "center",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#333",
                            }}
                          >
                            {coupon.serviceName || "Premium"}
                          </div>

                          <div className="flex-grow-1 ms-3 text-start">
                            <p
                              className="use-cod mb-1"
                              style={{ color: "#555" }}
                            >
                              Use code{" "}
                              <span style={{ fontWeight: "600" }}>
                                {coupon?.code}
                              </span>{" "}
                              | Valid till {coupon?.enddate}
                            </p>
                            <div className="fs-6" style={{ color: "#555" }}>
                              <span className="mb-1">
                                🛡️ {coupon?.validity}
                              </span>
                              <span className="mb-1">
                                💸 Save Upto <strong>₹{coupon?.value}</strong>
                              </span>
                              <span>
                                ✨ <strong>{coupon?.name}</strong> Offer
                              </span>
                            </div>
                          </div>

                          <button
                            className="btn btn-sm btn-primary ms-4"
                            onClick={() => handleCouponSelect(coupon)}
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                          >
                            Apply
                          </button>
                        </li>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Total Price */}
              <hr />
              <div>
                {/* Original Price */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <b>💵 Original Price:</b>
                  <span className="text-primary fw-bold">
                    <IndianRupee /> {selectedPlanDetails?.plans[0]?.price}
                  </span>
                </div>

                {/* Coupon Discount */}
                {appliedCoupon && (
                  <div className="d-flex justify-content-between align-items-center text-danger mb-2">
                    <b>🎟️ Coupon Discount:</b>
                    <span className="fw-bold">
                      - <IndianRupee /> {appliedCoupon.value}
                    </span>
                  </div>
                )}

                {/* Total Price */}
                <div className="d-flex justify-content-between align-items-center mt-3 py-2 border-top">
                  <b>💰 Total Price:</b>
                  <span
                    className="text-success fw-bold"
                    style={{ fontSize: "1.2rem" }}
                  >
                    <IndianRupee />{" "}
                    {discountedPrice || selectedPlanDetails?.plans[0]?.price}
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-4">
                <button
                  className="btn btn-success w-100"
                  onClick={() => AddSubscribeplan(selectedPlanDetails)}
                >
                  ✅ Confirm & Subscribe
                </button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Content>
  );
}

export default Service;
