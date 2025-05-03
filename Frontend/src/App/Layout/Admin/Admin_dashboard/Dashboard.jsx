import React, { useEffect, useState } from "react";
import {
  getDashboarddetail,
  getExpiryByMonth,
} from "../../../Services/Admin/Admin";
import { GetClient } from "../../../Services/Admin/Admin";
import { fDateTime, fDateMonth } from "../../../../Utils/Date_formate";
import Table from "../../../Extracomponents/Table";
import Dashboard from "../../../components/Dashboard/DashbaordMain";
import Loader from "../../../../Utils/Loader";

const Dashbord = () => {
  useEffect(() => {
    getdetail();
    getAdminclient();
    getExpirydata();
  }, []);

  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [monthexpiry, setMonthexpiry] = useState([]);

  //state for loading
  const [loading, setLoading] = useState(true);

  const currentMonthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getdetail = async () => {
    try {
      const response = await getDashboarddetail(token);
      if (response.status) {
        setData(response.data);
      }
    } catch (error) {
      console.log("Error fetching services:", error);
    }
    setLoading(false)
  };

  const getExpirydata = async () => {
    try {
      const response = await getExpiryByMonth(token);
      if (response.status) {
        setMonthexpiry(response.data);
      }
    } catch (error) {
      console.log("Error fetching services:", error);
    }
    setLoading(false)
  };

  const getAdminclient = async () => {
    try {
      const response = await GetClient(token);
      if (response.status) {
        const topClients = response.data?.slice(0, 5);
        setClients(topClients);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false)
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "100px",
    },
    {
      name: "Full Name",
      selector: (row) => row.FullName,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      width: "400px",
    },
    {
      name: "Plan Status",
      cell: (row) => {
        const hasActive = row?.plansStatus?.some(
          (item) => item.status === "active"
        );
        const hasExpired = row?.plansStatus?.some(
          (item) => item.status === "expired"
        );

        let statusText = "N/A";
        let color = "red";

        if (hasActive) {
          statusText = "Active";
          color = "green";
        } else if (hasExpired) {
          statusText = "Expired";
          color = "orange";
        }

        return <span style={{ color }}>{statusText}</span>;
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Client Segment",
      cell: (row) => {
        if (!Array.isArray(row?.plansStatus) || row.plansStatus.length === 0) {
          return <span>N/A</span>;
        }

        return (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {row.plansStatus.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "5px",
                  color:
                    item.status === "active"
                      ? "green"
                      : item.status === "expired"
                        ? "red"
                        : "inherit",
                }}
              >
                {item.serviceName || "N/A"}
                {index < row.plansStatus.length - 1 ? ", " : ""}
              </div>
            ))}
          </div>
        );
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Phone No",
      selector: (row) => row.PhoneNo,
      sortable: true,
      width: "200px",
    },

    {
      name: "Created By",
      selector: (row) =>
        row.addedByDetails?.FullName ?? (row.clientcome === 1 ? "WEB" : "APP"),
      sortable: true,
      width: "165px",
    },

    {
      name: "Created At",
      selector: (row) => fDateTime(row.createdAt),
      sortable: true,
    },
  ];


  return (
    <div>
      {loading ? (
        <Loader />
      ) :
        (<>

          <div className="page-content">
            {data && monthexpiry && currentMonthYear && (
              <Dashboard monthexpiry={monthexpiry} data={data} />
            )}

            <div className="card radius-10 mt-4">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="mb-0">Recent Clients</h5>
                  </div>
                </div>

                <hr />

                <div className="table-responsive d-flex justify-content-center">
                  <Table columns={columns} data={clients} />
                </div>
              </div>
            </div>
          </div>
        </>)}
    </div>
  );
};

export default Dashbord;
