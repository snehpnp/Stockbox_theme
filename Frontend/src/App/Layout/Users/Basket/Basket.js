import React, { useState, useEffect } from "react";
import Content from "../../../components/Contents/Content";
import { UserBasketData } from "../../../Services/UserService/User";

function Basket() {
  const [showModal, setShowModal] = useState(false);
  const UserId = localStorage.getItem("id");
  const [basketData, setBasketData] = useState([]);


  const accordionData = [
    {
      id: 1,
      title: "Vision2030 (Cash)",
      expiresOn: "28 Apr 2025",
      plans: [
        {
          duration: "6 Months",
          purchasedOn: "28 Oct 2024",
          purchasedPrice: "51999",
          expiresOn: "28 Apr 2025",
          planPrice: "51999",
          discountPrice: "0",
        },
      ],
    },
    {
      id: 2,
      title: "Another Plan (Cash)",
      expiresOn: "28 Apr 2025",
      plans: [
        {
          duration: "6 Months",
          purchasedOn: "28 Oct 2024",
          purchasedPrice: "51999",
          expiresOn: "28 Apr 2025",
          planPrice: "51999",
          discountPrice: "0",
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await UserBasketData({ clientid: UserId });
      if (data.status) {
        setBasketData(data.data);
      } else {
        setBasketData([]);
      }
    };
    fetchData();
  }, []);


  return (
    <Content
      Page_title="Basket"
      button_title="Add Basket"
      backbutton_title="Back"
      button_status={true}
      backbutton_status={true}
    >
      {/* Dynamic Cards Section */}
      <div className="row">
        {basketData.map((card) => (
          <div key={card._id} className="col-md-12 col-lg-4 mb-3">
            <div className="card radius-10 overflow-hidden shadow">
              <div className="card-body">
                <h5>{card.title}</h5>
              </div>
              <div className="progress-wrapper">
                <div className="progress" style={{ height: 7 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    // style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush list shadow-none">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Minimum Investment
                    <span className="badge bg-dark rounded-pill">
                      {card.mininvamount}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    CAGR
                    <span className="badge bg-success rounded-pill">
                      {card.cagr}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                    Type
                    <span className="badge bg-danger rounded-pill">
                      {card.type}
                    </span>
                  </li>
                  <li className="list-group-item align-items-center">
                    <button
                      onClick={() => setShowModal(true)}
                      className="card-link btn btn-sm btn-primary w-100 text-white"
                    >
                      View Details
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Accordion Section */}
      <div className="mt-4">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {accordionData.map((accordion) => (
            <div
              key={accordion.id}
              className="accordion-item rounded-3 border-0 shadow mb-2"
            >
              <h2 className="accordion-header">
                <button
                  className="accordion-button border-bottom collapsed fw-semibold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse${accordion.id}`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse${accordion.id}`}
                >
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="m-0">{accordion.title}</h5>
                    <p className="m-0 pe-2">
                      Expires on: {accordion.expiresOn}
                    </p>
                  </div>
                </button>
              </h2>
              <div
                id={`flush-collapse${accordion.id}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <td>Plan Duration</td>
                          <td>Purchased On</td>
                          <td>Purchased Price</td>
                          <td>Expires On</td>
                          <td>Plan Price</td>
                          <td>Discount Price</td>
                        </tr>
                      </thead>
                      <tbody>
                        {accordion.plans.map((plan, index) => (
                          <tr key={index}>
                            <td>{plan.duration}</td>
                            <td>{plan.purchasedOn}</td>
                            <td>{plan.purchasedPrice}</td>
                            <td>{plan.expiresOn}</td>
                            <td>{plan.planPrice}</td>
                            <td>{plan.discountPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Content>
  );
}

export default Basket;
