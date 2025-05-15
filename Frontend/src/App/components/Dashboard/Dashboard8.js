/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link } from 'react-router-dom';
import { fDateMonth } from "../../../Utils/Date_formate";

const Dashboard1 = ({ monthexpiry }) => {
  const currentMonthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
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
    },
    {
      link: "/admin/client",
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.clientCountTotal,
      label: "Total Clients",
      icon: "bx-user",
      progress: 55,
      visible: true,
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
    },
    {
      link: "/admin/client",
      state: { clientStatus: 0 },
      bgClass: "bg-gradient-ibiza",
      value1:
        monthexpiry?.data?.clientCountTotal -
        monthexpiry?.data?.clientCountActive,
      label: "Total Deactive Clients",
      icon: "bx-user-x",
      progress: 55,
      visible: true,
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
    },
    {
      link: "/admin/signal",
      bgClass: "bg-gradient-ohhappiness",
      value1: monthexpiry?.data?.OpensignalCountTotal,
      label: "Total Open Signals",
      icon: "bxl-redux",
      progress: 55,
      visible: true,
    },
    {
      link: "/admin/closesignal",
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.CloseSignalCountTotal,
      label: "Total Close Signals",
      icon: "bx-wifi-2",
      progress: 55,
      visible: true,
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
    },
    {
      link: "/admin/client",
      state: { clientStatus: "expired" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.inActivePlanclient,
      label: "Total Plan Expired ",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
      visible: true,
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
    },
  ];

  return (
    <div className="theme-8-dashboard dashboard-card">
      <div className="row g-3">
        {cardsData.map((item, index) => (
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={index}>
            <div className="widget-stat card h-100">
              <div className={`card-body p-4 ${item.bgClass}`}>
                <h6 className="card-title">{item.label}</h6>
                <h2>{item.value1}</h2>
                {item.visible && (
                  <h6>
                    <Link to={{ pathname: item.link }} state={item.state || {}}>
                      <i className="fa-regular fa-eye pe-1"></i>View
                    </Link>

                  </h6>
                )}
                <div className="progress mb-2">
                  <div
                    className="progress-bar progress-animated bg-success"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard1;
