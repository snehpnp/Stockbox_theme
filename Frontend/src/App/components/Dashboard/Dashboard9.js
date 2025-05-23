/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Dashboard1 = ({ data }) => {

  let arr = [
    {
      index: 1,
      name: "Total  Client",
      value: data && data.total_client,
      icon: 'la la-users',
      route: "/admin/allclients",
      visible: true
    },
    {
      index: 2,
      name: "Total Active Client",
      value: data && data.total_active_client,
      icon: 'la la-users',
      route: '/admin/allclients?filter=111',
      visible: true

    },
    {
      index: 3,
      name: "Total Expired Client",
      value: data && data.total_expired_client,
      icon: 'la la-users',
      route: "/admin/expiredclients?filter=000",
      visible: true
    },
    {
      index: 4,
      name: "Total Live Client",
      value: data && data.total_live_client,
      icon: 'la la-users',
      route: "/admin/allclients?filter=2",
      visible: true
    },
    {
      index: 5,
      name: "Active Live Client",
      value: data && data.total_active_live,
      icon: 'la la-users',
      route: "/admin/allclients?filter=21",
      visible: true
    },
    {
      index: 6,
      name: "Expired Live Client",
      value: data && data.total_expired_live,
      icon: 'la la-users',
      route: "/admin/allclients?filter=20",
      visible: true
    },
    {
      index: 7,
      name: "Total Demo Client",
      value: data && data.total_demo_client,
      icon: 'la la-users',
      route: "/admin/allclients?filter=1",
      visible: true
    },
    {
      index: 8,
      name: "Active Demo Client",
      value: data && data.total_active_demo,
      icon: 'la la-users',
      route: "/admin/allclients?filter=11",
      visible: true
    },
    {
      index: 9,
      name: "Expired Demo Client",
      value: data && data.total_expired_demo,
      icon: 'la la-users',
      route: "/admin/allclients??filter=10",
      visible: true

    },
    {
      index: 10,
      name: "Total 2 Days Client",
      value: data && data.total_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=0",
      visible: true

    },
    {
      index: 11,
      name: "Active 2 Days Client",
      value: data && data.total_active_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=01",
      visible: true

    },
    {
      index: 12,
      name: "Expired 2 Days Client",
      value: data && data.total_expired_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=00",
      visible: true

    },
    {
      index: 13,
      name: "Total License",
      value: data && data.all_licence,
      icon: 'la la-users',
      route: "/admin/allLicence?filter=0",
      visible: true
    }, {
      index: 14,
      name: "Remaining  License",
      value: data && data.remaining_licence,
      icon: 'la la-users',
      route: "/admin/allLicence",
      visible: true
    }, {
      index: 15,
      name: "Used  License",
      value: data && data.used_licence,
      icon: 'la la-users',
      route: "/admin/allLicence?filter=1",
      visible: true
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

  ]


  return <>

    <div className="theme-9-dashboard dashboard-card">
      <div className="row">
        {arr.map((item, index) => {
          return <React.Fragment key={index}>
            <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
              <div className="card border-0 rounded">
                <div className="card-body">
                  <div className="row justify-content-center align-items-center">
                    <div className="col-auto text-center">
                      <h3 className=" mb-0">{item.name}</h3>
                      <h2 className="text-uppercase mb-0">{item.value}</h2>
                      {item.visible ? <>

                        <Link className="" to={{ pathname: item.link }} state={item.state || {}}>
                          <i className="fa-regular fa-eye pe-1" ></i>View</Link>
                      </> : ""}

                    </div>
                  </div>
                  {/* <div className="col-auto text-center px-0">
                      <img
                        src="../assets/images/dash_icon/dash-9-icon.png"
                        className="w-50"
                      />
                  </div> */}
                </div>
              </div>
            </div>
          </React.Fragment>
        })}
      </div>
    </div>

  </>
}


export default Dashboard1




