import React, { useEffect } from "react";
import Table from "../../../components/Table";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "chart.js/auto";
import { GetPastPerformance } from "../../../Services/User";

const Future = () => {
  const [pastPerformance, setPastPerformance] = React.useState([]);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  console.log(userId, token);

  const fetchPastPerformance = async () => {
    try {
      const res = await GetPastPerformance({ token, userId });
      console.log("Response:", res);
      setPastPerformance([res.data]); // Convert object to an array
    } catch (error) {
      console.error("Error fetching past performance:", error);
      setPastPerformance([]); // Handle errors gracefully
    }
  };

  useEffect(() => {
    fetchPastPerformance();
  }, []);

  const columns = [
    { name: "Count", selector: (row) => row.count },
    { name: "Total Profit", selector: (row) => row.totalProfit },
    { name: "Total Loss", selector: (row) => row.totalLoss },
    { name: "Profit Count", selector: (row) => row.profitCount },
    { name: "Loss Count", selector: (row) => row.lossCount },
    { name: "Accuracy", selector: (row) => row.accuracy },
    {
      name: "Average Return Per Trade",
      selector: (row) => row.avgreturnpertrade,
    },
    {
      name: "Average Return Per Month",
      selector: (row) => row.avgreturnpermonth,
    },
  ];

  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Cash",
        data: [12, 19, 3, 5, 2, 3, 5, 8, 10, 6, 4, 9], // Replace with actual data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const doughnutData = {
    labels: ["Profit", "Loss"],
    datasets: [
      {
        data: [60, 40], // Example data
        backgroundColor: ["#4CAF50", "#F44336"], // Customize colors
        hoverBackgroundColor: ["#45A049", "#E53935"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="page-content">
      <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Cash</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <a href="/admin/dashboard">
                  <i className="bx bx-home-alt" />
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <ul className="list-group list-group-flush mt-0">
              <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                1 Month Average<span></span>
              </li>
              <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                <span className="badge bg-primary  badgespan me-1">
                  <i className="bx bx-rupee fs-5"></i>
                </span>{" "}
                249,711
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <ul className="list-group list-group-flush mt-0">
              <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                3 Month Average<span></span>
              </li>
              <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                <span className="badge bg-primary  badgespan me-1">
                  <i className="bx bx-rupee fs-5"></i>
                </span>{" "}
                249,711
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <ul className="list-group list-group-flush mt-0">
              <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                6 Month Average<span></span>
              </li>
              <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                <span className="badge bg-primary  badgespan me-1">
                  <i className="bx bx-rupee fs-5"></i>
                </span>{" "}
                249,711
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <ul className="list-group list-group-flush mt-0">
              <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                1 Year Average<span></span>
              </li>
              <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                <span className="badge bg-primary  badgespan me-1">
                  <i className="bx bx-rupee fs-5"></i>
                </span>{" "}
                249,711
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <Bar
                className="h-25"
                data={{
                  ...chartData,
                  datasets: [chartData.datasets[0]], // Cash dataset
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-2 mb-2">
        <div className="col-md-12">
        <div class="alert alert-primary" role="alert">
  <div class="d-flex justify-content-between align-items-center">
    <div>  Momentum (Dec 2024) PERFORMANCE
    </div>
    <div> <button className="btn btn-primary me-2"><i class='bx bx-left-arrow-alt'></i>Nov 2024</button>
    <button className="btn btn-primary">Dec 2024<i class='bx bx-right-arrow-alt' ></i></button></div>
   
</div>
        </div>
      </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="card radius-10 overflow-hidden w-100">
            <div className="card-body">
              <p>Momentum</p>
              <h4 className="mb-0">Dec 2024</h4>
              <hr />
              <p>Profit - Loss Summary</p>
              <div className="mt-5">
                <Doughnut data={doughnutData} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card radius-10 overflow-hidden w-100">
            <div className="card-body">
            <Bar
                className=""
                data={{
                  ...chartData,
                  datasets: [chartData.datasets[0]], // Cash dataset
                }}
              />
            </div>
          </div>
        </div>
      </div>
<div className="">
  <div className="d-flex gap-3">
    <div className="card-body card">
      <h5 className="mb-1">Total Calls
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Profitable Calls

      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Loss Calls
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Cost Exit
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Total Profit 
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Total Loss 
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
    <div className="card-body card">
      <h5 className="mb-1">Net Profit 
      </h5>
      <h6 className="card-title">16
      </h6>       
    </div>
  </div>
</div>
      
      <div className="card p-4 bg-light">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="m-0">Cash (Nov 2024) RECOMMENDATIONS</h5>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="row  align-items-center">
                  <div className="col-md-12">
                    <table className="table mb-0">
                      <thead className="">
                        <tr>
                          <th scope="col">S. No.</th>
                          <th scope="col">Stocks Name</th>
                          <th scope="col">Entry Date</th>
                          <th scope="col">Entry Price</th>
                          <th scope="col">Exit Date</th>
                          <th scope="col">Exit Price</th>
                          <th scope="col">Net Gain/Loss</th>
                          <th scope="col">Booked</th>
                          <th scope="col">Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Hask</td>
                          <td>20/10/2024</td>
                          <td>20</td>
                          <td>20/10/2024</td>
                          <td>20</td>

                          <td>20</td>
                          <td>True</td>

                          <td>  <Link to="/admin/dashboard" className="btn btn-primary text-white">View</Link>
                          </td>
                        
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Hask</td>
                          <td>20/10/2024</td>
                          <td>20</td>
                          <td>20/10/2024</td>
                          <td>20</td>

                          <td>20</td>
                          <td>True</td>

                          <td>  <Link to="/admin/dashboard" className="btn btn-primary text-white">View</Link>
                          </td>
                        
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Hask</td>
                          <td>20/10/2024</td>
                          <td>20</td>
                          <td>20/10/2024</td>
                          <td>20</td>

                          <td>20</td>
                          <td>True</td>

                          <td>  <Link to="/admin/dashboard" className="btn btn-primary text-white">View</Link>
                          </td>
                        
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
               
                </div>
                
      
  );
};

export default Future;