import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/Tabels/Table";
import { getMySubscription } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";

const Subscription = () => {
    // States
    const [planData, setPlanData] = useState([]); // State for storing subscription data
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    console.log("ID:", id, "Token:", token);

    // Function to fetch subscription data
    const fetchMySubscription = async () => {
        // Check if id and token are available
        if (!id || !token) {
            console.error("Missing id or token in localStorage");
            return;
        }

        try {
            const res = await getMySubscription({ id, token }); // Call the API
            console.log("Response:", res);

            if (res?.status === true) {
                setPlanData(res.data); // Update state with the fetched data
            } else {
                console.error("API response status is false.");
                setPlanData([]); // Set to empty if response is false
            }
        } catch (err) {
            console.error("Error fetching subscription:", err);
            setPlanData([]); // Handle error case
        }
    };

    useEffect(() => {
        fetchMySubscription(); // Fetch data when component mounts
    }, []);

    // Define table columns
    const columns = [
        {
            name: "Title",
            selector: (row) => row.title,
        },
        {
            name: "Year",
            selector: (row) => row.year,
        },
    ];

    return (
        <div>
                <Content
      Page_title="Subscription"
      button_title="Add Basket"
      button_status={false}
       backbutton_title="Back"
      backbutton_status={false}>
      <div className="page-content">
      <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Subscription</div>
          <div className="ps-3">
              <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                          <Link to="/client/dashboard">
                              <i className="bx bx-home-alt" />
                          </Link>
                      </li>
                  </ol>
              </nav>
          </div>
      </div>
      <hr />

      {/* Cards Section */}
      <div className="row">
          <div className="col-md-4">
              <div className="card">
                  <ul className="list-group list-group-flush mt-0">
                      <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                          Cash<span></span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                          Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="col-md-4">
              <div className="card">
                  <ul className="list-group list-group-flush mt-0">
                      <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                          Future<span></span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                          Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="col-md-4">
              <div className="card">
                  <ul className="list-group list-group-flush mt-0">
                      <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                          Option<span></span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                          Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                      </li>
                  </ul>
              </div>
          </div>
      </div>

      {/* Table Section */}
      <div className="card">
          <Table columns={columns} data={planData} /> {/* Use fetched data */}
      </div>
  </div>
   
          
            </Content>
        </div>
    );
};

export default Subscription;