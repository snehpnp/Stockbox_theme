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
                        {fDateTime(item?.startdate)}
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
          <div className="card shadow ch">
            <div className="card-body">
            <>
            <div className="chart-tab">
            <ul className="nav nav-pills justify-content-end " role="tablist">     
    <li className="nav-item">
      <a className="nav-link active" data-bs-toggle="pill" href="#home">
        5D
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" data-bs-toggle="pill" href="#menu1">
        1M
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" data-bs-toggle="pill" href="#menu2">
     6M
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" data-bs-toggle="pill" href="#max">
     Max
      </a>
    </li>
  </ul>
  </div>
  {/* Tab panes */}
  <div className="tab-content basket-chart-data mx-auto" >
    <div id="home" className="container tab-pane active">
      <br />
      <h4>Live Performance Vs<span className="text-primary"> Equity large Cap</span></h4>
        <hr/>

        <div className="row mb-4 mt-4">
          <div className="col-md-4">
            <h6 className="text-muted">Current value of <b>₹100</b> invested once
          <br/><u>3 year</u> ago would be</h6>
          </div>
          <div className="col-md-4">
            <li className="text-primary">Equity & Gold assets </li>
           <p className="ms-4 text-muted"> ₹5142</p> 
          </div>
          <div className="col-md-4">
            <li className="text-warning">Equity Large Cap </li>
           <p className="ms-4 text-muted"> ₹5142</p> 
          </div>
        </div>
      
   
      <Line data={chartDataLine} />
    </div>
    <div id="menu1" className="container tab-pane fade">
      <br />
      <h3>Menu 1</h3>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </p>
    </div>
    <div id="menu2" className="container tab-pane fade">
      <br />
      <h3>Menu 2</h3>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam.
      </p>
    </div>
    <div id="max" className="container tab-pane fade">
      <br />
      <h3>MAX</h3>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam.
      </p>
    </div>
  </div>
  <hr/>
  
</>

            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="row px-4 pt-3 align-items-center ">
      <div className="col-md-12 ">
        <div className="card">
          <div className="card-body">
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
