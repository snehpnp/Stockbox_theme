/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { fDateTime, fDateMonth } from "../../../Utils/Date_formate";

import { Link } from "react-router-dom";

const Dashboard1 = ({ monthexpiry }) => {
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
    {
      link: `/${role}/CurrentMonth-freeTrial`,
      bgClass: "bg-gradient-deepblue",
      value1: monthexpiry?.data?.totalfreetrial,
      label: "Current Month Free Trial",
      icon: "bx bx-wifi-2 fs-3",
      progress: 55,
    },
  ];



  return (
    <>
      <div className="theme-2-dashboard dashboard-card">
        <div className="row">
          {cardsData?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className="col-xl-4 col-lg-3 col-xxl-3 col-sm-6">
                  <div className="sidebar-bg mb-3 rounded overflow-hidden ">
                    <div className=" card-body pb-0 pt-3">
                      <div className="row">
                        <div className="col-12">
                          <h5 className="text-white">{item.label}</h5>
                        </div>
                        <div className="d-flex p-3 align-content-center ">
                          <div className="col-6 text-end">
                            <h2 className="text-white mb-0">{item.value1}</h2>
                          </div>
                          <div className="col-6 text-end">
                            {item.visible ? (
                              <>
                                <Link to={{ pathname: item.link }} state={item.state || {}}
                                  className="mb-2 text-white"

                                >
                                  <i className="fa-regular fa-eye pe-1"></i>View
                                </Link>

                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chart-wrapper">
                      {/* <img src='../assets/images/dash_icon/bar.png' className='w-100' /> */}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard1;
