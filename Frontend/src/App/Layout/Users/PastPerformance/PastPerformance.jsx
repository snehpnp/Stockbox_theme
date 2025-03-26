import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "chart.js/auto";
import Content from "../../../components/Contents/Content";

import { getpastperformaceCashdata, getpastperformaceFuturedata, getpastperformaceOptiondata } from "../../../Services/UserService/User";




const PastPerformance = () => {


  const [cashpastdata, setCashPastdata] = useState([]);
  const [futurepastdata, setFuturePastdata] = useState([]);
  const [optionpastdata, setOptionPastdata] = useState([]);
  const [cashAvgProfit, setCashAvgProfit] = useState(0);
  const [futureAvgProfit, setFutureAvgProfit] = useState(0);
  const [optionAvgProfit, setOptionAvgProfit] = useState(0);
  const [months, setMonths] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getCashpastdata();
    getFuturepastdata();
    getOptionpastdata();
  }, []);



  const formatMonth = (key) => {
    const [year, month] = key.split("-");
    return new Date(year, month - 1).toLocaleString("en-US", { month: "long" });
  };



  const getCashpastdata = async () => {
    try {
      const response = await getpastperformaceCashdata({ id: "66d2c3bebf7e6dc53ed07626" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setMonths(Object.keys(months).map(formatMonth));
        setCashPastdata(Object.values(months).map(m => m.netProfit));
        setCashAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Cash data:", error);
    }
  };





  const getFuturepastdata = async () => {
    try {
      const response = await getpastperformaceFuturedata({ id: "66dfede64a88602fbbca9b72" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setFuturePastdata(Object.values(months).map(m => m.netProfit));
        setFutureAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Future data:", error);
    }
  };




  const getOptionpastdata = async () => {
    try {
      const response = await getpastperformaceOptiondata({ id: "66dfeef84a88602fbbca9b79" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setOptionPastdata(Object.values(months).map(m => m.netProfit));
        setOptionAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Option data:", error);
    }
  };




  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Cash",
        data: cashpastdata,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Future",
        data: futurepastdata,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Option",
        data: optionpastdata,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };




  return (

    <div>
      <Content Page_title="Past Performance" button_status={false}>
        <div className="page-content">
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>
                    <Link to="/user/past-performance/cash" className="text-decoration-none text-dark">
                      Cash
                    </Link>
                  </h5>
                  <Bar data={{ labels: months, datasets: [chartData.datasets[0]] }} />
                  <hr />
                  <div className="row">
                    <div className="col-md-2 pe-0 border-right">
                      <h6>
                        <i className="bx bx-rupee fs-1 text-success"></i>
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <h6>Average Profit</h6>
                      <h4>{cashAvgProfit.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>
                    <Link to="/user/past-performance/future" className="text-decoration-none text-dark">
                      Future
                    </Link>
                  </h5>
                  <Bar data={{ labels: months, datasets: [chartData.datasets[1]] }} />
                  <hr />
                  <div className="row">
                    <div className="col-md-2 pe-0 border-right">
                      <h6>
                        <i className="bx bx-rupee fs-1 text-success"></i>
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <h6>Average Profit</h6>
                      <h4>{futureAvgProfit.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5>
                    <Link to="/user/past-performance/option" className="text-decoration-none text-dark">
                      Option
                    </Link>
                  </h5>
                  <Bar data={{ labels: months, datasets: [chartData.datasets[2]] }} />
                  <hr />
                  <div className="row">
                    <div className="col-md-2 pe-0 border-right">
                      <h6>
                        <i className="bx bx-rupee fs-1 text-success"></i>
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <h6>Average Profit</h6>
                      <h4>{optionAvgProfit.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default PastPerformance;
