import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2"; // Line chart import kiya
import Content from "../../../components/Contents/Content";
import { Link, useLocation } from "react-router-dom";

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
    <Content
      Page_title="Basket Detail"
      button_status={false}
      backbutton_status={true}
      backbutton_title="Back"
    >
      <div className=" pb-3">
        <div className="card ">
          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <img
                  src="https://stockboxpnp.pnpuniverse.com/uploads/blogs/image-1742206277154-910627492.png"
                  alt="Basket"
                  className=" img-fluid mb-3"
                />
              </div>
              <div className="col-md-10">
                <h5 className="mb-0">
                  <b>{item?.title}</b>
                </h5>
                <p>{stripHtmlTags(item?.description)}</p>
              </div>
              <div className="row">
                <div className="col-md-7">
                  <ul className="list-group list-group-flush list  mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Launch Date{" "}
                      <span className="badge bg-dark rounded-pill">
                        {item?.mininvamount}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Theme{" "}
                      <span className="badge bg-success rounded-pill">
                        {item?.cagr} %
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                      Since Launch{" "}
                      <span className="badge bg-danger rounded-pill">
                        {item?.type}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      No. of stocks{" "}
                      <span className="badge bg-warning rounded-pill">
                        {item?.themename}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Validity{" "}
                      <span className="badge bg-primary rounded-pill">
                        {item?.next_rebalance_date}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Rebalance Frequency{" "}
                      <span className="badge bg-success rounded-pill">
                        {item?.frequency}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Next Rebalance Date{" "}
                      <span className="badge bg-primary rounded-pill">
                        {item?.next_rebalance_date}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-5">
                  <div className="">
                    <Doughnut data={chartData} className="mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart Integration */}
      <div className="row px-4 pt-4">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-body">
              <Line data={chartDataLine} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="row px-4  pt-3 align-items-center">
        <div className="col-md-12">
          <ul className="nav nav-pills mb-3 justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "rational" ? "active btn-primary" : ""
                }`}
                onClick={() => setActiveTab("rational")}
              >
                Rational
              </button>
            </li>
            <hr />
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "methodology" ? "active btn-primary" : ""
                }`}
                onClick={() => setActiveTab("methodology")}
              >
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
        <Link
          to="/user/basketstocklist"
          state={{ item }}
          className="btn btn-primary w-50 mx-auto mt-3"
        >
          View Detail
        </Link>
      </div>
    </Content>
  );
};

export default BasketDetail;
