import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
// import moment from "moment";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import { House, Tally1 } from "lucide-react";
import { CircleUserRound, ShoppingCart, History, Shield, CreditCard } from 'lucide-react'

const Dashboard = () => {
  const [chartColumnData, setChartColumnData] = useState([]);
  const [chartLineData, setChartLineData] = useState([]);
  const [chartCircleData, setChartCircleData] = useState([]);
  const [chartProgress1Data, setChartProgress1Data] = useState(44);
  const [chartProgress2Data, setChartProgress2Data] = useState(80);
  const [chartProgress3Data, setChartProgress3Data] = useState(74);

  const getRandom = () => {
    return (
      (Math.sin(iteration / trigoStrength) * (iteration / trigoStrength) +
        iteration / trigoStrength +
        1) *
      (trigoStrength * 2)
    );
  };

  const getRangeRandom = (yrange) => {
    return Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  };

  const generateMinuteWiseTimeSeries = (baseval, count, yrange) => {
    let series = [];
    let i = 0;
    while (i < count) {
      let x = baseval;
      let y =
        (Math.sin(i / trigoStrength) * (i / trigoStrength) +
          i / trigoStrength +
          1) *
        (trigoStrength * 2);
      series.push([x, y]);
      baseval += 300000;
      i++;
    }
    return series;
  };

  const trigoStrength = 3;
  const iteration = 11;

  const optionsColumn = {
    chart: {
      height: 350,
      type: "bar",
      animations: {
        enabled: false,
      },
      events: {
        animationEnd: (chartCtx) => {
          const newData = chartCtx.w.config.series[0].data.slice();
          newData.shift();
          window.setTimeout(() => {
            chartCtx.updateOptions(
              {
                series: [{ data: newData }],
                xaxis: {
                  min: chartCtx.minX,
                  max: chartCtx.maxX,
                },
                subtitle: {
                  text: parseInt(getRangeRandom({ min: 1, max: 20 })).toString() + "%",
                },
              },
              false,
              false
            );
          }, 300);
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    series: [
      {
        name: "Load Average",
        data: generateMinuteWiseTimeSeries(
          new Date("12/12/2016 00:20:00").getTime(),
          12,
          {
            min: 10,
            max: 110,
          }
        ),
      },
    ],
    title: {
      text: "Load Average",
      align: "left",
      style: {
        fontSize: "12px",
      },
    },
    subtitle: {
      // text: "20%",
      floating: true,
      align: "right",
      offsetY: 0,
      style: {
        fontSize: "22px",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    xaxis: {
      type: "datetime",
      range: 2700000,
    },
    legend: {
      show: true,
    },
  };

  const optionsLine = {
    chart: {
      height: 350,
      type: "line",
      stacked: true,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      dropShadow: {
        enabled: true,
        opacity: 0.3,
        blur: 5,
        left: -7,
        top: 22,
      },
      events: {
        animationEnd: (chartCtx) => {
          const newData1 = chartCtx.w.config.series[0].data.slice();
          newData1.shift();
          const newData2 = chartCtx.w.config.series[1].data.slice();
          newData2.shift();
          window?.setTimeout(() => {
            chartCtx?.updateOptions(
              {
                series: [
                  { data: newData1 },
                  { data: newData2 },
                ],
                subtitle: {
                  text: parseInt(getRandom() * Math.random()).toString(),
                },
              },
              false,
              false
            );
          }, 300);
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 5,
    },
    series: [
      {
        name: "Running",
        data: generateMinuteWiseTimeSeries(
          new Date("12/12/2016 00:20:00").getTime(),
          12,
          {
            min: 30,
            max: 110,
          }
        ),
      },
      {
        name: "Waiting",
        data: generateMinuteWiseTimeSeries(
          new Date("12/12/2016 00:20:00").getTime(),
          12,
          {
            min: 30,
            max: 110,
          }
        ),
      },
    ],
    xaxis: {
      type: "datetime",
      range: 2700000,
    },
    title: {
      text: "Processes",
      align: "left",
      style: {
        fontSize: "12px",
      },
    },
    subtitle: {
      text: "20",
      floating: true,
      align: "right",
      offsetY: 0,
      style: {
        fontSize: "22px",
      },
    },
    legend: {
      show: true,
      floating: true,
      horizontalAlign: "left",
      onItemClick: {
        toggleDataSeries: false,
      },
      position: "top",
      offsetY: -33,
      offsetX: 60,
    },
  };

  const optionsCircle = {
    chart: {
      type: "radialBar",
      height: 250,
      offsetX: 0,
    },
    plotOptions: {
      radialBar: {
        inverseOrder: false,
        hollow: {
          margin: 5,
          size: "48%",
          background: "transparent",
        },
        track: {
          show: true,
          background: "#40475D",
          strokeWidth: "10%",
          opacity: 1,
          margin: 3,
        },
      },
    },
    series: [71, 63],
    labels: ["Device 1", "Device 2"],
    legend: {
      show: true,
      position: "left",
      offsetX: -30,
      offsetY: -10,
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%";
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
  };

  const optionsProgress1 = {
    chart: {
      height: 70,
      type: "bar",
      stacked: true,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "20%",
        colors: {
          backgroundBarColors: ["#40475D"],
        },
      },
    },
    series: [
      {
        name: "Process 1",
        data: [chartProgress1Data],
      },
    ],
    title: {
      floating: true,
      offsetX: -10,
      offsetY: 5,
      text: "Process 1",
    },
    subtitle: {
      floating: true,
      align: "right",
      offsetY: 0,
      text: chartProgress1Data + "%",
      style: {
        fontSize: "20px",
      },
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      categories: ["Process 1"],
    },
    yaxis: {
      max: 100,
    },
    fill: {
      opacity: 1,
    },
  };

  // Other chart progress configurations follow similarly

  return (

    <div className="">
      <div className="page-titles">
        <nav className="breadcrumb">
          <div className="col-lg-6 col-sm-6 col-12">
            <ul className="breadcrumb-links">
              <li>
                <House ></House>

                <a href="/" className="breadcrumb-box" />
              </li>
              <li style={{ width: "3px" }}>
                <Tally1 />
              </li>
              <li>
                <div className="breadcrumb-box">
                  <h6 className="heading-color mb-0 breadcrumb-text">
                    Dashboard
                  </h6>
                </div>
              </li>
            </ul>
          </div>

        </nav>
      </div>

      <div class="row g-3 mt-4" >
      <div className="col-lg-4 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="btn-primary p-3 rounded-circle " style={{ marginTop: '-50px', width: '100px', height: '100px' }}>
                  <CircleUserRound className="w-100 h-100 " />
                </div>
                <div className="mt-3">
                  <h4>Hello,John Doe</h4>
                  <hr />
                  <h3 class="h6 fw-semibold">Total Balance</h3>
                  <p class="h3 font-weight-bold">$<span id="totalBalance">10,457.00</span></p>
                  <p class="text-success">
                    +$<span id="balanceChange">1,169.28</span> (<span id="balanceChangePercent">12.4</span>%)
                  </p>

                </div>
              </div>
              <hr className="my-3" />

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <Link to="/user/subscription">
                    <CreditCard className="me-2" /> My Subscription
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/kyc">
                    <Shield className="me-2" /> KYC Pending
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/payment-history">
                    <History className="me-2" /> Payment History
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="">
                    <ShoppingCart className="me-2" /> My Basket Subscription
                  </Link>
                </li>
                <li className="list-group-item">
                  <button className="btn btn-primary mt-3 w-100">View Proflie</button>
                </li>
              </ul>

            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-8">
          <div className="card h-100 activity-card">
            <div className="card-body">

              <div className="row ">
                <div class="col-md-6">
                  <h3>Activity</h3>
                </div>
                <div class="col-md-6">
                  <div class="d-flex justify-content-end align-items-center mb-3">

                    <div class="time-selector d-flex gap-2 ">
                      <button class="btn btn-secondary active" data-period="1D">1D</button>
                      <button class="btn btn-secondary" data-period="1W">1W</button>
                      <button class="btn btn-secondary" data-period="1M">1M</button>
                      <button class="btn btn-secondary" data-period="1Y">1Y</button>
                      <button class="btn btn-secondary" data-period="ALL">ALL</button>
                    </div>
                  </div>
                </div>
              </div>
              <>
                <div className="my-4">
                  <label className="fw-semibold">Trades</label>
                  <div className="progress ">

                    <div
                      className="progress-bar progress-bar-striped"
                      role="progressbar"
                      style={{ width: "10%" }}
                      aria-valuenow={10}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <label className="fw-semibold">Past Performance</label>
                  <div className="progress ">

                    <div
                      className="progress-bar progress-bar-striped bg-success"
                      role="progressbar"
                      style={{ width: "25%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <label className="fw-semibold">Basket</label>
                  <div className="progress ">
                    <div
                      className="progress-bar progress-bar-striped bg-info"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <label className="fw-semibold">Subscription</label>
                  <div className="progress " >
                    <div
                      className="progress-bar progress-bar-striped bg-warning"
                      role="progressbar"
                      style={{ width: "75%" }}
                      aria-valuenow={75}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <label className="fw-semibold">Coupon</label>
                  <div className="progress ">
                    <div
                      className="progress-bar progress-bar-striped bg-danger"
                      role="progressbar"
                      style={{ width: "100%" }}
                      aria-valuenow={100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </>



            </div>
          </div>
        </div>
        
      </div>

      <div className="row mt-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 class="h6 fw-semibold mb-2">Sales Statistic</h3>
              <p class="h4 font-weight-bold">$<span id="salesValue">1,062.56</span></p>
              <p class="text-success">Today (+<span id="salesChangePercent">40.8</span>%)</p>
              {/* <ApexCharts
                options={optionsLine}
                series={optionsLine.series}
                type="line"
                height={350}
              /> */}
              <ApexCharts
                options={optionsColumn}
                series={optionsColumn.series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 class="h6 fw-semibold mb-2">Exchange Offer</h3>
              <p class="h4 font-weight-bold">$<span id="exchangeValue">491.20</span></p>
              <p class="text-success">Today (+<span id="exchangeChangePercent">19.5</span>%)</p>
              <ApexCharts
                options={optionsColumn}
                series={optionsColumn.series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 class="h6 fw-semibold mb-2">Greed Index</h3>
              <ApexCharts
                options={optionsCircle}
                series={optionsCircle.series}
                type="radialBar"
                height={250}
              />
              <p class="text-center mt-3">
                <span class="h4 font-weight-bold"><span id="greedIndexValue">75</span>%</span>
                <span class="text-success ms-2"><span id="greedIndexChange">+10.30%</span></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="dashboard-page" class="page-content">

        <div class="card p-4 mt-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 fw-semibold">Tokens</h3>
            <div>
              <button class="btn btn-secondary me-2">Filter</button>
              <button class="btn btn-secondary">Customize</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped token-table">
              <thead>
                <tr>
                  <th class="text-start pb-2">Name</th>
                  <th class="text-end pb-2">Price</th>
                  <th class="text-end pb-2">Balance</th>
                  <th class="text-end pb-2">Market Cap</th>
                  <th class="text-end pb-2">Volume (24H)</th>
                  <th class="text-end pb-2">Circ Supply</th>
                </tr>
              </thead>
              <tbody id="tokenTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="swap-page" class="page-content d-none">
        <div class="card p-4">
          <h2 class="h4 fw-semibold mb-4">Swap Tokens</h2>
          <div class="max-w-md mx-auto">
            <div class="mb-3">
              <label class="form-label" for="swapFullInput">You Pay</label>
              <div class="d-flex align-items-center">
                <input type="number" class="form-control flex-grow-1 me-2" id="swapFullInput" />
                <select class="form-select w-auto" id="swapFullInputCurrency">
                  <option value="bnb">BNB</option>
                  <option value="eth">ETH</option>
                  <option value="btc">BTC</option>
                </select>
              </div>
            </div>
            <div class="swap-icon d-flex justify-content-center align-items-center my-3">
              <button id="swapFullButton" class="btn btn-primary rounded-circle p-2">
                <i class="fas fa-exchange-alt"></i>
              </button>
            </div>
            <div class="mb-4">
              <label class="form-label" for="swapFullOutput">You Receive</label>
              <div class="d-flex align-items-center">
                <input type="number" class="form-control flex-grow-1 me-2" id="swapFullOutput" readonly />
                <select class="form-select w-auto" id="swapFullOutputCurrency">
                  <option value="eth">ETH</option>
                  <option value="bnb">BNB</option>
                  <option value="btc">BTC</option>
                </select>
              </div>
            </div>
            <button id="performFullSwapButton" class="btn btn-gradient w-100">Swap Tokens</button>
          </div>
        </div>
      </div>


    </div>


  );
};

export default Dashboard;
