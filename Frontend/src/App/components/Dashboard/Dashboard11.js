import React from "react";
import { Link } from "react-router-dom";

const Dashboard11 = ({ data }) => {
    let arr = [
        {
          index: 1,
          name: "Total  Client",
          value: data && data.total_client,
          icon: 'la la-users',
          route: "/admin/allclients",
          visible: false
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
          visible: false
        }, 
    
      ]

  return (
    <div className="theme-10-dashboard">
      <div className="row mt-5">
        {arr
          .filter(item => item.visible) // Only render items that are visible
          .map((item, index) => {
            return (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-sm border-light rounded">
                  <div
                    className={`card-header ${item.index % 2 === 0 ? "bg-success" : "bg-primary"} text-white`}
                  >
                    <h5>{item.name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="counter-title">{item.name}</h4>
                      <div className="counter-value display-4">
                        {item.value || 0}
                      </div>
                    </div>
                    <div className="progress" style={{ height: "5px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${item.value ? (item.value > 100 ? 100 : item.value) : 0}%`, // Ensures the progress bar width is between 0 and 100
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard11;
