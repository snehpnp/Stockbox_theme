import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";

const BasketDetail = () => {
  const [activeTab, setActiveTab] = useState("rational");
  const chartData = {
    labels: ["Hit Ratio", "Miss Ratio"],
    datasets: [
      {
        data: [80, 20], // Static values
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF867F"],
      },
    ],
  };

  return (
    <Content
      Page_title="Basket Detail"
      button_status={false}
      backbutton_status={true}
      backbutton_title="Back"
    >
      <div className="row border-bottom pb-3">
        <div className="col-md-8">
          <h5>Test(test)</h5>
          <ul className="list-group list-group-flush list shadow-none">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Minimum Investment
              <span className="badge bg-dark rounded-pill">₹10</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              CAGR<span className="badge bg-success rounded-pill">null %</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
              Type<span className="badge bg-danger rounded-pill">null</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Theme<span className="badge bg-warning rounded-pill">dsd</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              No. of Stocks<span className="badge bg-info rounded-pill">0</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Next Rebalance Date
              <span className="badge bg-primary rounded-pill">2024-12-10</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Rebalance Frequency<span className="badge bg-success rounded-pill">null %</span>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <Doughnut data={chartData} />
        </div>

        <div className="row px-4">
          <div className="col-md-12">
            <h6>
              <b>Description</b>
            </h6>
            <p>
              Lorem ipsum is typically a corrupted version of De finibus bonorum
              et malorum, a 1st-century BC text by the Roman statesman and
              philosopher Cicero, with words altered, added, and removed to make
              it nonsensical and improper Latin. The first two words themselves
              are a truncation of dolorem ipsum ("pain itself").
            </p>
          </div>
          <div className="col-md-4">
            <img
              src="https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg"
              alt="news"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
      <div className="row px-4 border-top pt-3 align-items-center">
        <div className="col-md-2">
          <ul className="nav nav-pills mb-3 justify-content-center flex-column ">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "rational" ? "active btn-primary" : ""
                  }`}
                onClick={() => setActiveTab("rational")}
              >
                Rational
              </button>
            </li>
            <hr />
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "methodology" ? "active btn-primary" : ""
                  }`}
                onClick={() => setActiveTab("methodology")}
              >
                Methodology
              </button>
            </li>
          </ul></div>
        <div className="col-md-10"> {activeTab === "rational" && (
          <div className="row">
            <div className="col-md-8">
              <p>
                Lorem ipsum is typically a corrupted version of De finibus
                bonorum et malorum, a 1st-century BC text by the Roman
                statesman and philosopher Cicero, with words altered, added,
                and removed to make it nonsensical and improper Latin. The
                first two words themselves are a truncation of dolorem ipsum
                ("pain itself").
              </p>
            </div>
            <div className="col-md-4">
              {" "}
              <img
                src="https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg"
                alt="news"
                className="img-fluid"
              />
            </div>
          </div>
        )}

          {activeTab === "methodology" && (
            <div className="row">
              <div className="col-md-8">
                <p>
                  Lorem ipsum is typically a corrupted version of De finibus
                  bonorum et malorum, a 1st-century BC text by the Roman
                  statesman and philosopher Cicero, with words altered, added,
                  and removed to make it nonsensical and improper Latin. The
                  first two words themselves are a truncation of dolorem ipsum
                  ("pain itself").
                </p>
              </div>
              <div className="col-md-4">
                {" "}
                <img
                  src="https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg"
                  alt="news"
                  className="img-fluid"
                />
              </div>
            </div>
          )}  </div>


      </div>
      <div className="card-footer mt-3 text-center">
        <Link to="/user/basketstocklist" className="btn btn-primary w-50 mx-auto mt-3">View Detail</Link>
      </div>
    </Content>
  );
};

export default BasketDetail;
