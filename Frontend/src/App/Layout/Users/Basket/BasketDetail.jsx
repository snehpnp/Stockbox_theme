import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Content from "../../../components/Contents/Content";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fDate } from "../../../../Utils/Date_formate";


const BasketDetail = () => {

  const [activeTab, setActiveTab] = useState("rational");
  const [itemdata, setItemdata] = useState()

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const location = useLocation();
  const { item } = location?.state;

  const stripHtmlTags = (input) => {
    if (!input) return "";
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };



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


  useEffect(() => {
    setItemdata(item)
  }, [item])


  return (
    <Content
      Page_title="Basket Detail"
      button_status={false}
      backbutton_status={true}
      backbutton_title="Back"
    >
      <div className="row border-bottom pb-3">
        <div className="col-md-8">
          <h5>{item?.title}</h5>
          <ul className="list-group list-group-flush list shadow-none">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Minimum Investment
              <span className="badge bg-dark rounded-pill">{item?.mininvamount}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              CAGR<span className="badge bg-success rounded-pill">{item?.cagr} %</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
              Type<span className="badge bg-danger rounded-pill">{item?.type}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Theme<span className="badge bg-warning rounded-pill">{item?.themename}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Next Rebalance Date
              <span className="badge bg-primary rounded-pill">
                {item?.next_rebalance_date}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Rebalance Frequency<span className="badge bg-success rounded-pill">{item?.frequency}</span>
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
              {stripHtmlTags(item?.description)}
            </p>
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
          )}  </div>


      </div>
      <div className="card-footer mt-3 text-center">
        <Link to="/user/basketstocklist" state={{ item }} className="btn btn-primary w-50 mx-auto mt-3">View Detail</Link>
      </div>
    </Content>
  );
};

export default BasketDetail;
