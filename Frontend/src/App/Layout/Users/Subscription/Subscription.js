import React, { useEffect, useState } from "react";
import Table from "../../../Extracomponents/Table";
import { getMySubscription } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";
import { fDateTime } from "../../../../Utils/Date_formate";
import ReusableModal from "../../../components/Models/ReusableModal";
import Loader from "../../../../Utils/Loader";


const Subscription = () => {
  const [planData, setPlanData] = useState([]);
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discription, setDiscription] = useState("");
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true)


  const fetchMySubscription = async () => {
    try {
      const res = await getMySubscription(id, token);
      if (res?.status) {
        setPlanData(res?.data);
      } else {
        setPlanData([]);
      }
    } catch (err) {
      setPlanData([]);
    }
    setIsLoading(false)
  };

  const columns = [
    {
      name: "Basket Name",
      selector: (row) => row?.categoryDetails?.title,
      sortable: true,
      width: "200px",
    },
    {
      name: "Title",
      selector: (row) => row?.serviceNames,
    },
    {
      name: "Year",
      selector: (row) => row?.year,
    },
  ];

  useEffect(() => {
    fetchMySubscription();
  }, []);

  const handleViewClick = (plan) => {
    setDiscription(plan);
  };



  const renderAccordionItems = () => {
    return planData.map((accordion) => (
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
                  {accordion?.categoryDetails?.title} (
                  {accordion?.serviceNames?.map((value) => value).join("+ ")})
                </h4>
                <p className="m-0 pe-2">
                  Expires on: {fDateTime(accordion?.plan_end) || "-"}
                </p>
              </div>
              <p className="m-0 pe-2">
                <span className="badge bg-primary rounded-pill">
                  {accordion?.planDetails.status}
                </span>
              </p>
            </div>
          </button>
        </h2>
        {/* Accordion Collapse */}
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
                <table className="table table-bordered mb-0">
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
                      <td>{accordion?.plan_start || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Purchase Price:</strong>
                      </td>
                      <td>₹{accordion?.plan_price || "--"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Expired On:</strong>
                      </td>
                      <td>{accordion?.plan_end || "--"}</td>
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
                      <td>₹{accordion?.discount || "--"}</td>
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
        Page_title="Subscription"
        button_title="Add Basket"
        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content">
          <ul className="nav nav-pills mb-3 justify-content-center">
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


          {isLoading ? <Loader /> : activeTab === "plan" && (
            <div>
              <div className="row">
                {/* Static Plan Cards */}
                {["Cash", "Future", "Option"].map((item, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card">
                      <ul className="list-group list-group-flush mt-0">
                        <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                          {item} <span></span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Expiry Date
                          <span className="badge bg-primary rounded-pill badgespan">
                            28 Sep 2025
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Accordion Section */}
              <div className="mt-4">
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  {renderAccordionItems()}
                </div>
              </div>
            </div>
          )}

          {activeTab === "basket" && (
            <div>

              <div className="card">
                <h1 className="card-header">Basket Subscription</h1>
                <Table columns={columns} data={planData} />
              </div>
            </div>
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

      {/* Modal for Plan Details */}
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
