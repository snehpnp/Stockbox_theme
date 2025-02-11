/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import "chart.js/auto"; // Enable auto Chart.js integration

import { fDateMonth } from "../../../Utils/Date_formate";
import ReactApexChart from "react-apexcharts";
import { Bar, Pie } from "react-chartjs-2";

const Dashboard1 = ({ monthexpiry }) => {
  const currentMonthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const labelColors = {
    "Current Month Active License": "#2ecc71", // Green
    "Total Clients": "#3498db", // Blue
    "Total Active Clients": "#1abc9c", // Turquoise
    "Total Deactive Clients": "#e74c3c", // Red
    "Today's Open Signal": "#f1c40f", // Yellow
    "Today's Close Signal": "#e67e22", // Orange
    "Total Open Signals": "#9b59b6", // Purple
    "Total Close Signals": "#34495e", // Dark Blue
    "Total Plan Active Clients": "#27ae60", // Dark Green
    "Total Plan Expired": "#8e44ad", // Deep Purple
    "Total Active Free Clients": "#16a085", // Teal
    "Total Inactive Free Clients": "#d35400", // Dark Orange
  };

  // Map colors dynamically
  const cardsData = [
    {
      link: "/admin/planexpirymonth",
      bgClass: "bg-gradient-moonlit",
      value1:
        monthexpiry?.monthexpiry?.length > 0
          ? monthexpiry?.monthexpiry?.some(
            (item) => fDateMonth(item?.month) === currentMonthYear
          )
            ? monthexpiry?.monthexpiry.reduce((acc, item) => {
              return fDateMonth(item?.month) === currentMonthYear
                ? acc + (item.noofclient || 0)
                : acc;
            }, 0)
            : 0
          : 0,

      label: "Current Month Active License",
      icon: "bx-user-plus",
      progress: 55,
      visible: true,
      color: labelColors["Current Month Active License"],
    },
    {
      link: "/admin/client",
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.clientCountTotal,
      label: "Total Clients",
      icon: "bx-user",
      progress: 55,
      visible: true,
      color: labelColors["Total Clients"],
    },
    {
      link: "/admin/client",
      state: { clientStatus: 1 },
      bgClass: "bg-gradient-ohhappiness",
      value1: monthexpiry?.data?.clientCountActive,
      label: "Total Active Clients",
      icon: "bx-user-circle",
      progress: 55,
      visible: true,
      color: labelColors["Total Active Clients"],
    },
    {
      link: "/admin/client",
      state: { clientStatus: 0 },
      bgClass: "bg-gradient-ibiza",
      value1:
        monthexpiry?.data.clientCountTotal -
        monthexpiry?.data.clientCountActive,
      label: "Total Deactive Clients",
      icon: "bx-user-x",
      progress: 55,
      visible: true,
      color: labelColors["Total Deactive Clients"],
    },
    {
      link: "/admin/signal",
      state: { clientStatus: "todayopensignal" },
      bgClass: "bg-gradient-moonlit",
      value1: monthexpiry?.data?.todayOpenSignal,
      label: "Today's Open Signal",
      icon: "bx-wifi-2",
      progress: 55,
      visible: true,
      color: labelColors["Today's Open Signal"],
    },
    {
      link: "/admin/closesignal",
      state: { clientStatus: "todayclosesignal" },
      bgClass: "bg-gradient-ibiza",
      value1: monthexpiry?.data?.todayCloseSignal,
      label: "Today's Close Signal",
      icon: "bx-wifi-off",
      progress: 55,
      visible: true,
      color: labelColors["Today's Close Signal"],
    },
    {
      link: "/admin/signal",
      bgClass: "bg-gradient-ohhappiness",
      value1: monthexpiry?.data?.OpensignalCountTotal,
      label: "Total Open Signals",
      icon: "bxl-redux",
      progress: 55,
      visible: true,
      color: labelColors["Total Open Signals"],
    },
    {
      link: "/admin/closesignal",
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.CloseSignalCountTotal,
      label: "Total Close Signals",
      icon: "bx-wifi-2",
      progress: 55,
      visible: true,
      color: labelColors["Total Close Signals"],
    },
    {
      link: "/admin/client",
      state: { clientStatus: "active" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.activePlanclient,
      label: "Total Plan Active Clients",
      icon: "bx-wifi-2",
      progress: 55,
      visible: true,
      color: labelColors["Total Plan Active Clients"],
    },
    {
      link: "/admin/client",
      state: { clientStatus: "expired" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.inActivePlanclient,
      label: "Total Plan Expired",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
      visible: true,
      color: labelColors["Total Plan Expired"],
    },
    {
      link: "/admin/freeclient",
      state: { clientStatus: "active" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.activeFreetrial,
      label: "Total Active Free Clients",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
      visible: true,
      color: labelColors["Total Active Free Clients"],
    },
    {
      link: "/admin/freeclient",
      state: { clientStatus: "expired" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.inActiveFreetrial,
      label: "Total Inactive Free Clients",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
      visible: true,
      color: labelColors["Total Inactive Free Clients"],
    },
  ];

  const chartData = {
    labels: [
      "Total Clients",
      "Active Clients",
      "Expired Clients",
      "Demo Clients",
      "2 Days Clients",
    ],
    datasets: [
      {
        label: "Client Statistics",
        data: [
          monthexpiry?.data?.clientCountTotal || 0,
          monthexpiry?.data?.clientCountActive || 0,
          monthexpiry?.data.clientCountTotal -
          monthexpiry?.data.clientCountActive || 0,
        ],
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#e74c3c",
          "#f1c40f",
          "#9b59b6",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Active Clients", "Expired Clients", "Demo Clients"],
    datasets: [
      {
        label: "Client Distribution",
        data: [
          monthexpiry?.data?.clientCountActive || 0,
          monthexpiry?.data.clientCountTotal -
          monthexpiry?.data.clientCountActive || 0,
        ],
        backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f"],
      },
    ],
  };

  // ApexCharts area chart state
  const [state] = React.useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  return (
    <div className="theme-1-dashboard dashboard-card" style={{ padding: "20px" }}>
      {/* Cards Section */}
      <div className="row mb-5">
        {cardsData.map((item, index) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
            key={index + 1}
          >
            <div
              className="card shadow"
              style={{
                background: `linear-gradient(135deg, ${item.color}, #ffffff20)`,
                color: "#fff",
                borderRadius: "15px",
                padding: "20px",
              }}
            >
              <div
                className="icon mb-3 text-center"
                style={{
                  fontSize: "40px",
                  background: "rgba(255, 255, 255, 0.3)",
                  padding: "15px",
                  borderRadius: "50%",
                }}
              >
                <i className={`bx ${item.icon} fs-3`} />
                {/* <item.icon /> */}
              </div>
              <h5 className="text-center ">{item.label}</h5>
              <h3 className="my-3 text-center">{item.value1}</h3>
              <div className="text-center">
                <Link
                  to={{ pathname: item.link }} state={item.state || {}}
                  className="btn btn-light"
                  style={{
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: item.color,
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="row mb-4">
        <div className="col-md-12 mb-4">
          <div className="chart-container shadow p-3">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="area"
              height={350}
            />
          </div>
        </div>
      </div> */}

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="chart-container card shadow p-3">
            <h4 className="mb-3">Bar Chart: Client Statistics</h4>
            <Bar data={chartData} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="chart-container card shadow p-3">
            <h4 className="mb-3">Pie Chart: Client Distribution</h4>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
