/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { Bar, Pie } from "react-chartjs-2"; // Import multiple chart types
import "chart.js/auto"; // Enable auto Chart.js integration
import { Users, CheckCircle, XCircle, FlaskConical, Hourglass } from "lucide-react"; // Import icons

const Dashboard1 = ({ data }) => {
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
          data?.total_client || 0,
          data?.total_active_client || 0,
          data?.total_expired_client || 0,
          data?.total_demo_client || 0,
          data?.total_two_days || 0,
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
          data?.total_active_client || 0,
          data?.total_expired_client || 0,
          data?.total_demo_client || 0,
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

  const arr = [
    {
      index: 1,
      name: "Total Clients",
      value: data?.total_client || 0,
      icon: Users,
      route: "/admin/allclients",
      color: "#3498db",
    },
    {
      index: 2,
      name: "Active Clients",
      value: data?.total_active_client || 0,
      icon: CheckCircle,
      route: "/admin/allclients?filter=111",
      color: "#2ecc71",
    },
    {
      index: 3,
      name: "Expired Clients",
      value: data?.total_expired_client || 0,
      icon: XCircle,
      route: "/admin/expiredclients?filter=000",
      color: "#e74c3c",
    },
    {
      index: 4,
      name: "Demo Clients",
      value: data?.total_demo_client || 0,
      icon: FlaskConical,
      route: "/admin/allclients?filter=1",
      color: "#f1c40f",
    },
    {
      index: 5,
      name: "2 Days Clients",
      value: data?.total_two_days || 0,
      icon: Hourglass,
      route: "/admin/allclients?filter=0",
      color: "#9b59b6",
    },
  ];

  return (
    <div className="theme-1-dashboard" style={{ padding: "20px" }}>
      {/* Cards Section */}
      <div className="row mb-4">
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
      </div>
      <div className="row mb-5">
        {arr.map((item) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
            key={item.index}
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
                <item.icon />
              </div>
              <h5 className="text-center ">{item.name}</h5>
              <h3 className="my-3 text-center">{item.value}</h3>
              <div className="text-center">
                <Link
                  to={item.route}
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
