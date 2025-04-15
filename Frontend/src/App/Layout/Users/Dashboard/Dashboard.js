import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
// import moment from "moment";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import { House, Tally1 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { CircleUserRound, ShoppingCart, History, Shield, CreditCard, Puzzle } from 'lucide-react'
import { getpastperformaceCashdata, getpastperformaceFuturedata, getpastperformaceOptiondata } from "../../../Services/UserService/User";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReusableModal from '../../../components/Models/ReusableModal';
import {
  getbannerlist,} from "../../../Services/Admin/Admin";
import { image_baseurl } from "../../../../Utils/config";

const Dashboard = () => {


  const [cashpastdata, setCashPastdata] = useState([]);
  const [futurepastdata, setFuturePastdata] = useState([]);
  const [optionpastdata, setOptionPastdata] = useState([]);
  const [cashAvgProfit, setCashAvgProfit] = useState(0);
  const [futureAvgProfit, setFutureAvgProfit] = useState(0);
  const [optionAvgProfit, setOptionAvgProfit] = useState(0);
  const [months, setMonths] = useState([]);
const [bannerimg, setBannerimg] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getCashpastdata();
    getFuturepastdata();
    getOptionpastdata();
  }, []);

  useEffect(() => { 
    const getBannerList = async () => {
      try {
        const response = await getbannerlist(token); // just pass the token
        setBannerimg(response.data);
        console.log(response.data, "bannerimg"); // log the response directly
      } catch (error) {
        console.error("Error fetching banner list:", error);
      }
    };
  
    getBannerList();
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
                  <CircleUserRound className="w-100 h-100 m-0" />
                </div>
                <div className="mt-3">
                  <h4>Hello,John Doe</h4>
                  <hr />
                  <h3 class="h6 fw-semibold">Wallet Balance</h3>
                  <p class="h3 font-weight-bold">$<span id="totalBalance">10,457.00</span></p>


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
                  <Link to="">
                    <Shield className="me-2" /> KYC Pending
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="">
                    <History className="me-2" /> Payment History
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/basket">
                    <ShoppingCart className="me-2" /> My Basket Subscription
                  </Link>

                </li>
                <li className="list-group-item">
                  <Link to="/user/refer-earn">
                    <Puzzle className="me-2" /> Refer & Earn
                  </Link>

                </li>
                {/* <li className="list-group-item">
                  <button className="btn btn-primary mt-3 w-100">View Proflie</button>
                </li> */}
              </ul>

            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-8">
          <div className="card h-100 activity-card">
            <div className="card-body">
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                <div className="col">
                  <div className="card radius-10 bg-gradient-deepblue">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">9526</h5>
                        <div className="ms-auto">
                          <i className="bx bx-cart fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0 text-white">Live Trade</p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card radius-10 bg-gradient-ohhappiness">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">$8323</h5>
                        <div className="ms-auto">
                          <i className="bx bx-dollar fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0  text-white">Close Trade</p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card radius-10 bg-gradient-ibiza">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">6200</h5>
                        <div className="ms-auto">
                          <i className="bx bx-group fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0  text-white">Strategy Trade</p>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="row mt-3">


              <Swiper
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      navigation
      pagination={{ clickable: true }}
      modules={[Autoplay, Navigation, Pagination]}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {bannerimg.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <img
              src={`${image_baseurl}${item.image}`}
              style={{ height: '300px', width: '100%' }}
              alt={`banner-${index}`}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>

              </div>





            </div>
          </div>

        </div>

      </div>
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
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card radius-10 w-100">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-1">News</h5>
                </div>

              </div>
            </div>
            <div className="product-list p-3 mb-3 ps ps--active-y">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between gap-3 p-2 border radius-10">
                  <div className="">
                    <img src="https://codervent.com/rukada/demo/vertical/ltr/assets/images/icons/idea.png" width={50} alt="" />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">Yellow Tshirt</h6>

                  </div>
                  <div className="">
                    <small className="text-muted" style={{ fontSize: 12 }}>1/30/2025</small>

                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-3 p-2 border radius-10">
                  <div className="">
                    <img src="https://codervent.com/rukada/demo/vertical/ltr/assets/images/icons/idea.png" width={50} alt="" />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">Titan Watch </h6>

                  </div>
                  <div className="">
                    <small className="text-muted" style={{ fontSize: 12 }}>1/30/2025</small>

                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between gap-3 p-2 border radius-10">
                  <div className="">
                    <img src="https://codervent.com/rukada/demo/vertical/ltr/assets/images/icons/idea.png" width={50} alt="" />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">Titan Watch </h6>

                  </div>
                  <div className="">
                    <small className="text-muted" style={{ fontSize: 12 }}>1/30/2025</small>

                  </div>
                </div>
              </div>
            </div>


          </div>


        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-1">Blogs</h5>
                </div>

              </div>
            </div>
            <div className="card-body">

              <ul className="list-unstyled" style={{ margin: 0, padding: 0 }}>

                <li
                  className="d-md-flex align-items-center border-bottom py-2"
                  style={{
                    alignItems: "center",
                    borderBottom: "1px solid rgb(221, 221, 221)",
                    padding: "10px 0px"
                  }}
                >
                  <div
                    className="rounded-circle mb-3 mb-md-0 p-1 border d-flex align-items-center justify-content-center btn-primary"
                    style={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      backgroundColor: "rgb(0, 123, 255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle-more"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <path d="M8 12h.01" />
                      <path d="M12 12h.01" />
                      <path d="M16 12h.01" />
                    </svg>
                  </div>
                  <div className="flex-grow-1 ms-sm-3">

                    <p className="mt-0 mb-1" style={{ marginTop: 0 }}>
                      Broadcast Message
                    </p>
                    <p
                      className="mt-0 text-muted"
                      style={{ color: "rgb(108, 117, 125)", marginTop: 0 }}
                    >
                      <small>2025-04-08T12:29:19.182Z</small>
                    </p>
                  </div>
                </li>
                <li
                  className="d-md-flex align-items-center border-bottom py-2"
                  style={{
                    alignItems: "center",
                    borderBottom: "1px solid rgb(221, 221, 221)",
                    padding: "10px 0px"
                  }}
                >
                  <div
                    className="rounded-circle mb-3 mb-md-0 p-1 border d-flex align-items-center justify-content-center btn-primary"
                    style={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      backgroundColor: "rgb(0, 123, 255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle-more"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <path d="M8 12h.01" />
                      <path d="M12 12h.01" />
                      <path d="M16 12h.01" />
                    </svg>
                  </div>
                  <div className="flex-grow-1 ms-sm-3">

                    <p className="mt-0 mb-1" style={{ marginTop: 0 }}>
                      demo gggg
                    </p>
                    <p
                      className="mt-0 text-muted"
                      style={{ color: "rgb(108, 117, 125)", marginTop: 0 }}
                    >
                      <small>2025-04-08T12:15:44.486Z</small>
                    </p>
                  </div>
                </li>
                <li
                  className="d-md-flex align-items-center border-bottom py-2"
                  style={{
                    alignItems: "center",
                    borderBottom: "1px solid rgb(221, 221, 221)",
                    padding: "10px 0px"
                  }}
                >
                  <div
                    className="rounded-circle mb-3 mb-md-0 p-1 border d-flex align-items-center justify-content-center btn-primary"
                    style={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      backgroundColor: "rgb(0, 123, 255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle-more"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <path d="M8 12h.01" />
                      <path d="M12 12h.01" />
                      <path d="M16 12h.01" />
                    </svg>
                  </div>
                  <div className="flex-grow-1 ms-sm-3">

                    <p className="mt-0 mb-1" style={{ marginTop: 0 }}>
                      demo
                    </p>
                    <p
                      className="mt-0 text-muted"
                      style={{ color: "rgb(108, 117, 125)", marginTop: 0 }}
                    >
                      <small>2025-04-07T05:37:54.069Z</small>
                    </p>
                  </div>
                </li>

              </ul>

            </div>
          </div>
        </div>



      </div>
    </div>


  );
};

export default Dashboard;
