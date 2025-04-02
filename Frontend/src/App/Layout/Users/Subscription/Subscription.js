import React, { useEffect, useState } from "react";
import Table from "../../../Extracomponents/Table";
import { getMySubscription, GETServiceData, getMyBasketSubscription } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";
import { fDate, fDateTime } from "../../../../Utils/Date_formate";
import ReusableModal from "../../../components/Models/ReusableModal";
import Loader from "../../../../Utils/Loader";



const Subscription = () => {

  const token = localStorage.getItem("token");



  const [planData, setPlanData] = useState([]);
  const [basketData, setBasketData] = useState([]);
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discription, setDiscription] = useState("");
  const id = localStorage.getItem("id");
  const [isLoading, setIsLoading] = useState(true)
  const [servicedata, setServicedata] = useState([])





  useEffect(() => {
    if (activeTab === "plan") {
      fetchMySubscription();
      fetchMyService()
    } else if (activeTab === "basket") {
      fetchBasketMySubscription()
    }
  }, [activeTab]);


  const fetchMySubscription = async () => {
    try {
      const res = await getMySubscription(id, token);
      console.log("getMySubscription",res);


      if (res?.status) {
        setPlanData(res?.data);
      } else {
        setPlanData([]);
      }
    } catch (err) {
      console.log("erorr")
    }
    // setIsLoading(false)
  };





  const fetchBasketMySubscription = async () => {
    try {
      const res = await getMyBasketSubscription(id, token);      
      if (res?.status) {
        setBasketData(res?.data);
      } else {
        setBasketData([]);
      }
    } catch (err) {
      console.log("erorr")
    }
    setIsLoading(false)
  };




  const fetchMyService = async () => {
    try {
      const res = await GETServiceData(id, token);
      if (res?.status) {
        setServicedata(res?.data)
      }
    } catch (err) {
      console.log("erorr")
    }
    setIsLoading(false)
  };



  const handleViewClick = (plan) => {
    setDiscription(plan);
  };



  const renderAccordionItems = () => {

    return planData?.map((accordion) => (
      <div
        key={accordion._id}
        className="accordion-item rounded-3 border-0 shadow mb-2"
      >
        <h2 className="accordion-header">
          <button
            className="accordion-button border-bottom collapsed fw-semibold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#flush-collapse${accordion._id}`}
            aria-expanded="false"
            aria-controls={`flush-collapse${accordion._id}`}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <h5 className="mb-2">
                  {accordion?.categoryDetails?.title} (
                  {accordion?.serviceNames?.map((value) => value).join("+ ")})
                </h5>
                <p className="m-0 pe-2">
                  Expires on: {fDateTime(accordion?.plan_end) || "-"}
                </p>
              </div>
              <p className="m-0 pe-2">
                <span className="badge bg-success rounded-pill text-capitalize" >
                  {accordion?.planDetails.status}
                </span>
              </p>
            </div>
          </button>
        </h2>
        <div
          id={`flush-collapse${accordion._id}`}
          className="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div className="accordion-body">
            <div className="card shadow-sm mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{accordion?.categoryDetails?.title}</h5>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleViewClick(accordion?.planDetails?.description)
                  }
                >
                  View
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3 ">
                  <table className="table table-bordered mb-0">
                    <thead>
                      <tr className="table-primary">
                        <th colSpan="2" className="text-center">
                          Plan Details
                        </th>
                      </tr>
                    </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Plan Duration:</strong>
                      </td>
                      <td>{accordion?.planDetails?.validity || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Purchase On:</strong>
                      </td>
                      <td>{fDateTime(accordion?.plan_start) || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Purchase Price:</strong>
                      </td>
                      <td>
                        ₹{accordion?.total}
                        {accordion?.plan_price !== accordion?.total && accordion?.gst ? (
                          <small className="text-muted"> ({accordion?.gst}% Tax included)</small>
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Expired On:</strong>
                      </td>
                      <td>{fDateTime(accordion?.plan_end) || "--"}</td>
                    </tr>
                    
                    <tr>
                      <td>
                        <strong>Plan Price:</strong>
                      </td>
                      <td>₹{accordion?.plan_price ?? "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Discount Price:</strong>
                      </td>
                      <td>₹ {accordion?.discount ?? "--"}</td>
                    </tr>
                  
                   
                    <tr>
                      <td>
                        <strong>Start Date:</strong>
                      </td>
                      <td>{fDateTime(accordion?.plan_start) || "Make By Admin"}</td>
                    </tr>
                  </tbody>
                </table>
                    </div>
                    <div className="col-md-6 mb-3">
                    <table className="table table-bordered mb-0">
                    <thead>
                      <tr className="table-primary">
                        <th colSpan="2" className="text-center">
                          Payment History
                        </th>
                      </tr>
                    </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Plan Duration:</strong>
                      </td>
                      <td>{accordion?.planDetails?.validity || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Purchase On:</strong>
                      </td>
                      <td>{fDateTime(accordion?.plan_start) || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Expired On:</strong>
                      </td>
                      <td>{fDateTime(accordion?.plan_end) || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Plan Price:</strong>
                      </td>
                      <td>₹{accordion?.plan_price || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Discount Price:</strong>
                      </td>
                      <td>₹ {accordion?.discount || "0"}</td>
                    </tr>
                   
                    <tr>
                      <td>
                        <strong>Purchase Price:</strong>
                      </td>
                      <td>
                        ₹{accordion?.total}
                        {accordion?.plan_price !== accordion?.total && accordion?.gst ? (
                          <small className="text-muted"> ({accordion?.gst}% Tax included)</small>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
                      </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };



  const renderAccordionItems1 = () => {
    return basketData && basketData?.map((accordion) => (
      <div
        key={accordion._id}
        className="accordion-item rounded-3 border-0 shadow mb-2"
      >
        <h2 className="accordion-header">
          <button
            className="accordion-button border-bottom collapsed fw-semibold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#flush-collapse${accordion._id}`}
            aria-expanded="false"
            aria-controls={`flush-collapse${accordion._id}`}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <h4 className="m-0">
                  {accordion?.basketDetails?.title || "No Title"}
                </h4>
                <p className="m-0 pe-2">
                  Expires on: {fDateTime(accordion?.enddate) || "-"}
                </p>
              </div>
              <p className="m-0 pe-2">
                <span className="badge bg-primary rounded-pill">
                  {/* {accordion?.planDetails.status} */}
                </span>
              </p>
            </div>
          </button>
        </h2>

        <div
          id={`flush-collapse${accordion._id}`}
          className="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <div className="accordion-body">
            <div className="card shadow-sm mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{accordion?.basketDetails?.title}</h5>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleViewClick(accordion?.basketDetails?.description)
                  }
                >
                  View
                </button>

              </div>
              <div className="card-body">
                <table className="table table-bordered mb-0">
                  <tbody>
                    <tr>
                      <td><strong>Paid Amount:</strong></td>
                      <td>{accordion?.validity || "--"}</td>
                    </tr>
                    <tr>
                      <td><strong>Plan Discount:</strong></td>
                      <td>{fDateTime(accordion?.startdate) || "--"}</td>
                    </tr>
                    <tr>
                      <td><strong>Purchase Type:</strong></td>
                      <td>₹{accordion?.plan_price || "--"}</td>
                    </tr>
                    <tr>
                      <td><strong>Plan Validity:</strong></td>
                      <td>{fDateTime(accordion?.startdate) || "--"}</td>
                    </tr>
                    <tr>
                      <td><strong>Order Id:</strong></td>
                      <td>₹{accordion?.basketDetails?.mininvamount || "--"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };





  return (
    <div>
      <Content
        Page_title="Plan / Basket Subscription"

        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content">
          <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "plan" ? "active btn-primary" : ""
                  }`}
                onClick={() => setActiveTab("plan")}
              >
                Plan Subscription
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "basket" ? "active btn-primary" : ""
                  }`}
                onClick={() => setActiveTab("basket")}
              >
                Basket Subscription
              </button>
            </li>
          </ul>


          {isLoading ? (
            <Loader />
          ) : (
            <>
              {activeTab === "plan" && (
                <div>
                  <div className="row">
                    {servicedata && servicedata.length > 0 ? (
                      servicedata.map((item, index) => (
                        <div key={index} className="col-md-4 mb-3">
                          <div className="card">
                            <ul className="list-group list-group-flush mt-0">
                              <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                                {item?.serviceName} <span></span>
                              </li>
                              <li className="list-group-item d-flex justify-content-between align-items-center">
                                Expiry Date
                                <span className="badge bg-primary rounded-pill badgespan">
                                  {fDate(item?.enddate)}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center mt-5">
                        <img
                          src="/assets/images/norecordfound.png"
                          alt="No Records Found"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="accordion accordion-flush" id="accordionFlushExample">
                      {renderAccordionItems()}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "basket" && (
                <div className="mt-4">
                  <div className="accordion accordion-flush" id="accordionFlushExample">
                    {renderAccordionItems1()}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        <ReusableModal
          size="xl"
          show={discription}
          onClose={() => setDiscription("")}
          title="Description"
          body={
            <>
              <div>
                <p dangerouslySetInnerHTML={{ __html: discription }} />
              </div>
              <style jsx>{`
        .modal-body img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `}</style>
            </>
          }
        />

      </Content>


      {selectedPlan && (
        <div
          className="modal fade"
          id="planModal"
          tabIndex="-1"
          aria-labelledby="planModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="planModalLabel">
                  {selectedPlan?.categoryDetails?.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6>Description</h6>
                <p>
                  {selectedPlan?.categoryDetails?.description ||
                    "No description available."}
                </p>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Plan Duration:</strong>
                      </td>
                      <td>{selectedPlan?.planDetails?.validity || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Purchased On:</strong>
                      </td>
                      <td>{selectedPlan?.plan_start || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Plan Price:</strong>
                      </td>
                      <td>₹{selectedPlan?.plan_price || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Expiry On:</strong>
                      </td>
                      <td>{selectedPlan?.plan_end || "--"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
