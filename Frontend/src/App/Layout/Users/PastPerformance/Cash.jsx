import React, { useEffect, useState } from "react";
import Table from "../../../Extracomponents/Table";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "chart.js/auto";
import { getpastperformaceCashdata, getpastperformacebymonth } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";


const Cash = () => {

  const token = localStorage.getItem("token");


  const [cashPastData, setCashPastdata] = useState(new Array(12).fill(0));
  const [monthaverg, setMonthaverg] = useState({});



  useEffect(() => {
    getCashpastdata()
  }, [])


  const getCashpastdata = async () => {
    try {
      const response = await getpastperformaceCashdata(
        { id: "66d2c3bebf7e6dc53ed07626" },
        token
      );

      if (response?.status) {
        const { months } = response.data["12_months"];

        // Net profit extract karna
        const monthlyNetProfits = [
          months["2025-1"]?.netProfit || 0,
          months["2025-2"]?.netProfit || 0,
          months["2025-3"]?.netProfit || 0,
          months["2025-4"]?.netProfit || 0,
          months["2025-5"]?.netProfit || 0,
          months["2025-6"]?.netProfit || 0,
          months["2025-7"]?.netProfit || 0,
          months["2025-8"]?.netProfit || 0,
          months["2025-9"]?.netProfit || 0,
          months["2025-10"]?.netProfit || 0,
          months["2025-11"]?.netProfit || 0,
          months["2025-12"]?.netProfit || 0,
        ];

        setCashPastdata(monthlyNetProfits);
        setMonthaverg(response?.data);
      }
    } catch (error) {
      console.error("Error fetching Cash data:", error);
    }
  };


  const chartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Cash",
        data: cashPastData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };



  const doughnutData = {
    labels: ["Profit", "Loss"],
    datasets: [
      {
        data: [
          Object.values(monthaverg?.["12_months"]?.months || {}).reduce((sum, m) => sum + (m.totalProfit || 0), 0),
          Object.values(monthaverg?.["12_months"]?.months || {}).reduce((sum, m) => sum + (m.totalLoss || 0), 0),
        ],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#45A049", "#E53935"],
        borderWidth: 1,
      },
    ],
  };


  return (
    <Content
      Page_title="Cash"
      button_status={false}
      backbutton_status={false}
    >

      <div className="page-content">

        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card">
              <ul className="list-group list-group-flush mt-0">
                <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                  1 Month Average<span></span>
                </li>
                <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                  <span className="badge btn-primary  badgespan me-1">
                    <i className="bx bx-rupee fs-5"></i>
                  </span>{" "}
                  {monthaverg?.["1_month"]?.avgMonthlyProfit?.toFixed(2) || 0}

                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <ul className="list-group list-group-flush mt-0">
                <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                  3 Month Average<span></span>
                </li>
                <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                  <span className="badge btn-primary  badgespan me-1">
                    <i className="bx bx-rupee fs-5"></i>
                  </span>{" "}
                  {monthaverg?.["3_months"]?.avgMonthlyProfit?.toFixed(2) || 0}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <ul className="list-group list-group-flush mt-0">
                <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                  6 Month Average<span></span>
                </li>
                <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                  <span className="badge btn-primary  badgespan me-1">
                    <i className="bx bx-rupee fs-5"></i>
                  </span>{" "}
                  {monthaverg?.["6_months"]?.avgMonthlyProfit?.toFixed(2) || 0}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <ul className="list-group list-group-flush mt-0">
                <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                  1 Year Average<span></span>
                </li>
                <li className="list-group-item d-flex  align-items-center fs-5 fw-bold">
                  <span className="badge btn-primary  badgespan me-1">
                    <i className="bx bx-rupee fs-5"></i>
                  </span>{" "}
                  {monthaverg?.["12_months"]?.avgMonthlyProfit?.toFixed(2) || 0}

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
                    datasets: [chartData.datasets[0]],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2 mb-2">
          <div className="col-md-12">
            <div class="alert alert-primary" role="alert">
              <div class="d-md-flex justify-content-between align-items-center">
                <div>  Momentum (Dec 2024) PERFORMANCE
                </div>
                <div className=",t-md-0 mt-3"> <button className="btn btn-primary me-2 "><i class='bx bx-left-arrow-alt'></i>Nov 2024</button>
                  <button className="btn btn-primary  ">Dec 2024<i class='bx bx-right-arrow-alt' ></i></button></div>

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
            <div className="card radius-10 overflow-hidden w-100 h-100">
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
        <div className="my-4">
          <div className="d-md-flex gap-3">
            <div className="card-body card">
              <p className="mb-1"><strong>Total Calls</strong>
              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Profitable Calls</strong>

              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Loss Calls</strong>
              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Cost Exit</strong>
              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Total Profit </strong>
              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Total Loss</strong>
              </p>
              <h6 className="card-title">16
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Net Profit</strong>
              </p>
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
    </Content>

  );
};

export default Cash;
