import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Modal, Accordion, Form } from "react-bootstrap"; // Add Bootstrap components
import { Link } from "react-router-dom";
import { GetCategorylist, GetPlanByCategory, AddplanSubscription, GetCouponlist } from "../../../Services/UserService/User";
import { IndianRupee } from "lucide-react";
import { fa_time } from '../../../../Utils/Date_formate';




function Service() {
  const token = localStorage.getItem("Token");
  const userid = localStorage.getItem("Id");

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [category, setCategory] = useState([]);
  const [plan, setPlan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [manualCoupon, setManualCoupon] = useState("");
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [coupons, setCoupon] = useState([])


  useEffect(() => {
    getCategory();
    getPlan();
    getCoupon()
  }, []);


  const handleCouponSelect = (coupon) => {


    setSelectedCouponCode(coupon);
    setManualCoupon(coupon.code);
  };

  const applyCoupon = (coupon) => {

    const originalPrice = selectedPlanDetails?.plans[0]?.price || 0;
    const discount = selectedCouponCode.value || 0;
    const discountedPrice = originalPrice - discount;

    setAppliedCoupon(coupon);
    setDiscountedPrice(discountedPrice > 0 ? discountedPrice : originalPrice);
  };


  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };


  const getCoupon = async () => {
    try {
      const response = await GetCouponlist()
      if (response.status) {
        setCoupon(response?.data)

      }
    } catch (error) {

    }
  }



  const getCategory = async () => {
    try {
      const response = await GetCategorylist();
      if (response.status) {
        setCategory(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPlan = async () => {
    try {
      const response = await GetPlanByCategory(token);
      if (response.status) {
        setPlan(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AddSubscribeplan = async (item) => {
    try {
      const data = {
        plan_id: item?.plans?._id,
        client_id: userid,
        coupon_code: couponCode,
        orderid: "",
        discount: "",
        price: item?.plans?.price,
      };
      const response = await AddplanSubscription(data, token);
      if (response.status) {
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
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







  const getFilteredPlans = () => {
    if (selectedPlan === "all") {
      return plan;
    }
    return plan.filter((item) => item?._id === selectedPlan);
  };





  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };






  return (
    <Content Page_title="Service" button_title="Back" button_status={false}>
      <div className="card">
        <div className="card-body">
          <div>
            <label htmlFor="planSelect" className="mb-1">
              Plans For You
            </label>
            <div className="col-lg-4 d-flex">
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
                {category &&
                  category?.map((item) => (
                    <option value={item?._id} key={item?._id}>
                      {item?.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="pricing-container price1 row mt-4">
            <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
              {getFilteredPlans().map((item) => (
                <div className="col" key={item?._id}>
                  <div className="card card1 mb-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="text-left">
                          <span className="price-original">
                            {Array.isArray(item?.services) && item.services.length > 0
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
                            value={stripHtmlTags(item?.plans[0]?.description || "")}
                            readOnly
                          />
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <button
                          className="btn btn-outline-primary rounded-1"
                        >
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">Plan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlanDetails && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-primary">
                  {Array.isArray(selectedPlanDetails?.services) && selectedPlanDetails.services.length > 0
                    ? selectedPlanDetails.services
                      .map((service) =>
                        typeof service.title === "string"
                          ? service.title.split(/(?=[A-Z])/).join(" + ")
                          : "N/A"
                      )
                      .join(" + ")
                    : "N/A"}
                </h5>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{selectedPlanDetails?.title}</h5>
                <span className="text-success fw-bold">
                  <IndianRupee /> {selectedPlanDetails?.plans[0]?.price || "N/A"}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  <b>Validity:</b>
                </span>
                <span>{selectedPlanDetails?.plans[0]?.validity || "N/A"}</span>
              </div>

              <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Apply Coupon Code</Accordion.Header>
                  <Accordion.Body
                    style={{
                      maxHeight: "200px",
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
                        <button
                          className="btn btn-primary"
                          onClick={() => applyCoupon({ code: manualCoupon, })}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div>

                      {coupons.map((coupon, index) => (
                        <li className="d-flex align-items-center border-bottom pb-3">
                          <div
                            className="rounded-circle p-2 border d-flex align-items-center justify-content-center"
                            style={{
                              width: '70px',
                              height: '70px',
                              backgroundColor: '#f8f8f8',
                              textAlign: 'center',
                              fontSize: '16px',
                              fontWeight: '500',
                              color: '#333',
                            }}
                          >
                            {coupon.serviceName || "Premium Members"}
                          </div>

                          <div className="flex-grow-1 ms-3">
                            <p className="mb-1">
                              <strong style={{ color: '#555' }}>Segment Name:</strong> {coupon.serviceName || "Premium Members"}
                            </p>
                            <p className="use-cod" style={{ color: '#555' }}>
                              Use code <span style={{ fontWeight: '600' }}>{coupon?.code}</span> | Valid till {fa_time(coupon?.enddate)}{" "}
                            </p>
                          </div>

                          <div
                            className="d-flex justify-content-between align-items-center p-2 border-bottom"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderBottom: '1px solid #ddd',
                            }}
                            key={coupon.code}
                          >
                            <div style={{ color: '#555' }}>
                              <span className="d-block mb-1">{coupon?.validity}</span>
                              <span className="d-block mb-1">
                                Save Upto <IndianRupee />{coupon?.value}
                              </span>
                              <span className="d-block">{coupon?.name} Offer</span>
                            </div>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleCouponSelect(coupon)}
                              style={{ padding: '6px 12px', fontSize: '14px' }}
                            >
                              Select
                            </button>
                          </div>

                          <div style={{ height: '1px', backgroundColor: '#e0e0e0', marginTop: '12px', marginBottom: '12px' }}></div>
                        </li>
                      ))}



                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <b>Total Price:</b>
                <span className="text-success fw-bold">
                  <IndianRupee /> {discountedPrice || selectedPlanDetails?.plans[0]?.price}
                </span>
              </div>
              <div className="mt-3">
                <button className="btn btn-success w-100" onClick={AddSubscribeplan}>
                  Confirm & Subscribe
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
