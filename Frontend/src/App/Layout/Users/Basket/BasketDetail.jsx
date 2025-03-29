import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2"; // Line chart import kiya
import Content from "../../../components/Contents/Content";
import { Link, useLocation } from "react-router-dom";
import { fDateTime } from "../../../../Utils/Date_formate";

const BasketDetail = () => {
  const [activeTab, setActiveTab] = useState("rational");
  const [itemdata, setItemdata] = useState();

  const location = useLocation();
  const { item } = location?.state;

  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };

  // Doughnut Chart Data
  const chartData = {
    labels: ["Hit Ratio", "Miss Ratio"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF867F"],
      },
    ],
  };

  // Line Chart Data
  const chartDataLine = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance",
        data: [10, 25, 35, 50, 40, 60], // Sample data, API se bhi fetch kar sakte hain
        fill: false,
        borderColor: "#007bff",
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    setItemdata(item);
  }, [item]);

  return (
    <Content Page_title="Basket Detail" button_status={false} backbutton_status={true} backbutton_title="Back">
      <div className="row  pb-3">
        <div className="col-md-7">

          <ul className="list-group list-group-flush list basket-detail-card">
            <li className="list-group-item btn-primary">
              <h5 className="mb-0"><b className="text-white">{item?.title}</b></h5>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Launch Date <span className="badge bg-dark rounded-pill text-white">{fDateTime(item?.created_at)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              CAGR <span className="badge bg-success rounded-pill text-white">{item?.cagr} %</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
            Risk Type <span className="badge bg-danger rounded-pill text-white">{item?.type}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              No. of stocks <span className="badge bg-warning rounded-pill text-white">{(item?.stock_details) ? item.stock_details.length : 0}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Validity <span className="badge bg-secondary rounded-pill text-white">{item?.validity}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Rebalance Frequency <span className="badge bg-success rounded-pill text-white">{item?.frequency}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Next Rebalance Date <span className="badge bg-primary rounded-pill text-white">{item?.next_rebalance_date}</span>
            </li>
          </ul>
        </div>
        <div className="col-md-5 mx-auto">
          <Doughnut data={chartData} className="mx-auto" />
        </div>
      </div>

      {/* Line Chart Integration */}
      <div className="row px-4 pt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <Line data={chartDataLine} />
            </div>
          </div>

        </div>
      </div>

      {/* Description Section */}
      <div className="row px-4 pt-4">
        <div className="col-md-12">
          <h6><b>Description</b></h6>
          <p>{stripHtmlTags(item?.description)}</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="row px-4 border-top pt-3 align-items-center">
        <div className="col-md-12">
          <ul className="nav nav-pills mb-3 justify-content-center">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "rational" ? "active btn-primary" : ""}`}
                onClick={() => setActiveTab("rational")}>
                Rational
              </button>
            </li>
            <hr />
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "methodology" ? "active btn-primary" : ""}`}
                onClick={() => setActiveTab("methodology")}>
                Methodology
              </button>
            </li>
          </ul>
        </div>

        <div>
          {activeTab === "rational" && (
            <div className="row">
              <div className="col-md-8">
                <div dangerouslySetInnerHTML={{ __html: item?.rationale }} />
              </div>
            </div>
          )}
          {activeTab === "methodology" && (
            <div className="row">
              <div className="col-md-8">
                <p>
                  <div dangerouslySetInnerHTML={{ __html: item?.rationale }} />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <div className="card-footer mt-3 text-center">
        <Link to="/user/basketstocklist" state={{ item }} className="btn btn-primary w-50 mx-auto mt-3">
          View Detail
        </Link>
      </div>
    </Content>
  );
};

export default BasketDetail;
