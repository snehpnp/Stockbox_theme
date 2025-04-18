import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Content from "../../../components/Contents/Content";
import { getChatLineData } from "../../../Services/UserService/User";
import { Link, useLocation } from "react-router-dom";
import { fDateTime } from "../../../../Utils/Date_formate";
import ReusableModal from '../../../components/Models/ReusableModal';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const BasketDetail = () => {
  const [activeTab, setActiveTab] = useState("rational");
  const [itemdata, setItemdata] = useState();
  const [model, setModel] = useState(false);
  const location = useLocation();
  const { item } = location?.state;

  const [newChartData, setNewChartData] = useState();
  const [limitData, setLimitData] = useState(5);
  const token = localStorage.getItem("token");

  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };

  function calculateTypeWeightages(stockDetails) {
    const typeWeightages = {};

    stockDetails.forEach((item) => {
      const { type, weightage } = item;
      typeWeightages[type] = (typeWeightages[type] || 0) + weightage;
    });

    const labels = [];
    const values = [];

    for (const type in typeWeightages) {
      labels.push(`${type} (${typeWeightages[type]}%)`);
      values.push(typeWeightages[type]);
    }

    return { labels, values };
  }

  const typeData = calculateTypeWeightages(item.stock_details);

  const chartData = {
    labels: typeData.labels,
    datasets: [
      {
        data: typeData.values,
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF867F"],
      },
    ],
  };

  const chartDataLine = {
    labels: newChartData?.map((item) =>
      new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    ),
    datasets: [
      {
        label: "Performance",
        data: newChartData?.map((item) => item.profitloss),
        fill: false,
        borderColor: "#007bff",
        tension: 0.1,
      },
    ],
  };


  const chartLineData = async () => {
    try {
      const data = {
        basket_id: item._id,
        limit: limitData,
      };
      const response = await getChatLineData(data, token);
      if (response.status) {
        setNewChartData(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    chartLineData();
  }, [limitData]);

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
      <div className="pb-3">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <img
                  src="https://stockboxpnp.pnpuniverse.com/uploads/blogs/image-1742206277154-910627492.png"
                  alt="Basket"
                  className="img-fluid mb-3"
                />
              </div>
              <div className="col-md-10">
                <h5 className="mb-0">
                  <b>{item?.title}</b>
                </h5>
                <p className="basket-description">
                  {stripHtmlTags(item?.description)}
                </p>
                {item?.description.length > 350 && (
                  <button
                    onClick={() => setModel(true)}
                    className="btn btn-sm btn-secondary"
                  >
                    Read More..
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-md-7">
                  <ul className="list-group list-group-flush list mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Launch Date{" "}
                      <span className="badge bg-dark rounded-pill">
                        {fDateTime(item?.created_at)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Theme{" "}
                      <span className="badge bg-success rounded-pill">
                        {item?.themename}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                      Since Launch{" "}
                      <span className="badge bg-danger rounded-pill">
                        {item?.cagr_live} %
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      No. of stocks{" "}
                      <span className="badge bg-warning rounded-pill">
                        {item?.stock_details.length}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Validity{" "}
                      <span className="badge bg-primary rounded-pill">
                        {item?.validity}
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
                  <Doughnut data={chartData} className="mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-warning" role="alert">
        Minimum Investment Amount: <strong>{item?.mininvamount}</strong>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card shadow ch">
            <div className="card-body">
              <div className="chart-tab">
                <ul className="nav nav-pills justify-content-end " role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="pill" onClick={() => setLimitData(5)}>
                      5D
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" onClick={() => setLimitData(30)}>
                      1M
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" onClick={() => setLimitData(183)}>
                      6M
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" onClick={() => setLimitData(100000)}>
                      Max
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content basket-chart-data mx-auto  custom-width" style={{ width: "1180" }}>
                <div id="home" className="container tab-pane active">
                  <br />
                  <h4>
                    Live Performance {" "}
                    {/* <span className="text-primary">Equity large Cap</span> */}
                  </h4>
                  <hr />

                  {/* <div className="row mb-4 mt-4">
                    <div className="col-md-4">
                      <h6 className="text-muted">
                        Current value of <b>₹100</b> invested once
                        <br />
                        <u>3 year</u> ago would be
                      </h6>
                    </div>
                    <div className="col-md-4">
                      <li className="text-primary">Equity & Gold assets </li>
                      <p className="ms-4 text-muted"> ₹5142</p>
                    </div>
                    <div className="col-md-4">
                      <li className="text-warning">Equity Large Cap </li>
                      <p className="ms-4 text-muted"> ₹5142</p>
                    </div>
                  </div> */}

                  <Line data={chartDataLine} />
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>

      <div className="row pt-3 align-items-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills mb-3 justify-content-center">
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
              </ul>

              <div>
                {activeTab === "rational" && (
                  <div className="row">
                    <div className="col-md-12">
                      <div dangerouslySetInnerHTML={{ __html: item?.rationale }} />
                    </div>
                  </div>
                )}
                {activeTab === "methodology" && (
                  <div className="row">
                    <div className="col-md-12">
                      <div dangerouslySetInnerHTML={{ __html: item?.methodology }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer mt-3 text-center">
        <Link
          to="/user/basketstocklist"
          state={{ item }}
          className="btn btn-primary w-50 mx-auto mt-3"
        >
          View Detail
        </Link>
      </div>

      <ReusableModal
        show={model}
        onClose={() => setModel(false)}
        title={<span><b>{item?.title}</b></span>}
        body={<p>{stripHtmlTags(item?.description)}</p>}
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModel(false)}
          >
            Close
          </button>
        }
      />
    </Content>
  );
};

export default BasketDetail;
