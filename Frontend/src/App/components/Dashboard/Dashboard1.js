import React from "react";
import { fDateTime, fDateMonth } from "../../../Utils/Date_formate";
import { Link } from "react-router-dom";

const DashboardCards = ({ monthexpiry }) => {
  const role = localStorage.getItem("Role")?.toLowerCase();

  const currentMonthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cardsData = [
    {
      link: `/${role}/planexpirymonth`,
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
    },
    {
      link: `/${role}/client`,
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.clientCountTotal,
      label: "Total Clients",
      icon: "bx-user",
      progress: 55,
    },
    {
      link: `/${role}/client`,
      state: { clientStatus: 1 },
      bgClass: "bg-gradient-ohhappiness",
      value1: monthexpiry?.data?.clientCountActive,
      label: "Total Active Clients",
      icon: "bx-user-circle",
      progress: 55,
    },
    {
      link: `/${role}/client`,
      state: { clientStatus: 0 },
      bgClass: "bg-gradient-ibiza",
      value1:
        monthexpiry?.data.clientCountTotal -
        monthexpiry?.data.clientCountActive,
      label: "Total Deactive Clients",
      icon: "bx-user-x",
      progress: 55,
    },
    {
      link: `/${role}/signal`,
      state: { clientStatus: "todayopensignal" },
      bgClass: "bg-gradient-moonlit",
      value1: monthexpiry?.data?.todayOpenSignal,
      label: "Today's Open Signal",
      icon: "bx-wifi-2",
      progress: 55,
    },
    {
      link: `/${role}/closesignal`,
      state: { clientStatus: "todayclosesignal" },
      bgClass: "bg-gradient-ibiza",
      value1: monthexpiry?.data?.todayCloseSignal,
      label: "Today's Close Signal",
      icon: "bx-wifi-off",
      progress: 55,
    },
    {
      link: `/${role}/signal`,
      bgClass: "bg-gradient-ohhappiness",
      value1: monthexpiry?.data?.OpensignalCountTotal,
      label: "Total Open Signals",
      icon: "bxl-redux",
      progress: 55,
    },
    {
      link: `/${role}/closesignal`,
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.CloseSignalCountTotal,
      label: "Total Close Signals",
      icon: "bx-wifi-2",
      progress: 55,
    },
    {
      link: `/${role}/client`,
      state: { clientStatus: "active" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.activePlanclient,
      label: "Total Plan Active Clients",
      icon: "bx-wifi-2",
      progress: 55,
    },
    {
      link: `/${role}/client`,
      state: { clientStatus: "expired" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.inActivePlanclient,
      label: "Total Plan Expired ",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
    {
      link: `/${role}/freeclient`,
      state: { clientStatus: "active" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.activeFreetrial,
      label: "Total Active Free Clients",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
    {
      link: `/${role}/freeclient`,
      state: { clientStatus: "expired" },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.inActiveFreetrial,
      label: "Total Inactive Free Clients",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
    {
      link: `/${role}/todayExpiry-data`,
      state: { clientStatus: 0 },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.counts?.["0"],
      label: "Today's Expiry Data",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
    {
      link: `/${role}/yesterdayExpiry-data`,
      state: { clientStatus: -1 },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.counts?.["-1"],
      label: "Yesterday Expiry Data",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
    {
      link: `/${role}/tomorrowExpiry-data`,
      state: { clientStatus: 1 },
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.counts?.["1"],
      label: "Tomorrow Expiry Data",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
  ];

  return (
    <div className="row newbg dashboard-card">
      {cardsData?.map((card, index) => (
        <div className="col-md-3" key={index}>
          <div className={`card radius-10 mb-4 ${card.bgClass}`}>
            <Link to={card.link} state={card.state}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0 primary-text">{card.value1}</h5>
                  <div className="ms-auto">
                    <i className={`bx ${card.icon} fs-3`} />
                  </div>
                </div>
                <div
                  className="progress my-2 bg-opacity-25"
                  style={{ height: 4 }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${card.progress}%` }}
                    aria-valuenow={25}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <p className="mb-0 content-heading">{card.label}</p>
                  <p className="mb-0 ms-auto">
                    <span>
                      <i className="bx bx-up-arrow-alt" />
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
