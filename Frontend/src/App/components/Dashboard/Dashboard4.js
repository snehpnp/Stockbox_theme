/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fDateTime, fDateMonth } from "../../../Utils/Date_formate";

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
        monthexpiry?.data.clientCountTotal -
        monthexpiry?.data.clientCountActive,
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
    <>
      <div className="theme-4-dashboard dashboard-card">
        <div className="row">
          {cardsData?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
                  <div className="card fourth-dashboard-card">
                    <div className="card-body">
                      <div className="row justify-content-center align-items-center">
                        <div className="col-auto text-center">
                          <div>
                            <h4 className="mb-0 my-2">{item.label}</h4>
                            {item.visible ? (
                              <>
                                <Link to={{ pathname: item.link }} state={item.state || {}} className="mb-2" >
                                  <i className="fa-regular fa-eye pe-1 my-1"></i>
                                  View
                                </Link>
                              </>
                            ) : (
                              ""
                            )}
                          </div>

                          <h2 className="text-uppercase mb-0 my-1">
                            {item.value1}
                          </h2>
                        </div>
                        <div className="col-auto text-center">
                          <img
                            src="../assets/images/dash_icon/wave-sound.png"
                            className="w-25"
                          />
                        </div>
                      </div>
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
