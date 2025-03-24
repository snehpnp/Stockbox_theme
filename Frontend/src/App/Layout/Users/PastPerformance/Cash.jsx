import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "chart.js/auto";
import { getpastperformaceCashdata, getpastperformacebymonth } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";
import Table from "../../../Extracomponents/Table";
import { fDateTime } from "../../../../Utils/Date_formate";
import { Tooltip } from 'antd';
import { SquarePen, Trash2, PanelBottomOpen, Eye, ArrowDownToLine, IndianRupee } from 'lucide-react';
import ReusableModal from "../../../components/Models/ReusableModal";


const Cash = () => {

  const token = localStorage.getItem("token");


  const [cashPastData, setCashPastdata] = useState(new Array(12).fill(0));
  const [monthaverg, setMonthaverg] = useState({});

  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2025");
  const [chartData1, setChartData1] = useState(null);
  const [doughnutData1, setDoughnutData1] = useState(null);
  const [dailydata, setDailydata] = useState([])
  const [description, setDescription] = useState([])
  const [showModal, setShowModal] = useState(false);

  const months = [
    { name: "Jan", value: "01" },
    { name: "Feb", value: "02" },
    { name: "Mar", value: "03" },
    { name: "Apr", value: "04" },
    { name: "May", value: "05" },
    { name: "Jun", value: "06" },
    { name: "Jul", value: "07" },
    { name: "Aug", value: "08" },
    { name: "Sep", value: "09" },
    { name: "Oct", value: "10" },
    { name: "Nov", value: "11" },
    { name: "Dec", value: "12" },
  ];


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





  const getPastPerformanceData = async () => {
    try {
      const data = { id: "66d2c3bebf7e6dc53ed07626", month, year };
      const response = await getpastperformacebymonth(data, token);

      if (response?.status) {
        setDailydata(response?.data)
        const dailyData = response?.data?.dailyData || {};

        const labels = Object.keys(dailyData);
        const profitData = labels.map((date) => dailyData[date].totalProfit || 0);
        const lossData = labels.map((date) => dailyData[date].totalLoss || 0);
        const netProfitData = labels.map((date) => dailyData[date].netProfit || 0);

        const formattedChartData = {
          labels,
          datasets: [
            {
              label: "Total Profit",
              data: profitData,
              backgroundColor: "rgba(75, 192, 75, 0.6)",
              borderColor: "green",
              borderWidth: 1,
            },
            {
              label: "Total Loss",
              data: lossData,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "red",
              borderWidth: 1,
            },
            {
              label: "Net Profit",
              data: netProfitData,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "blue",
              borderWidth: 1,
            },
          ],
        };

        setChartData1(formattedChartData);

        const doughnutChartData = {
          labels: ["Total Signals", "Profitable Calls", "Loss Calls", "Total Profit", "Total Loss", "Net Profit"],
          datasets: [
            {
              data: [
                response?.data?.totalSignals || 0,
                response?.data?.profitableCalls || 0,
                response?.data?.lossCalls || 0,
                response?.data?.totalProfit || 0,
                response?.data?.totalLoss || 0,
                response?.data?.netProfit || 0,
              ],
              backgroundColor: ["#36A2EB", "#4CAF50", "#FF6384", "#FFCE56", "#FF4444", "#8E44AD"],
              hoverBackgroundColor: ["#36A2EB", "#4CAF50", "#FF6384", "#FFCE56", "#FF4444", "#8E44AD"],
            },
          ],
        };

        setDoughnutData1(doughnutChartData);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  useEffect(() => {
    getPastPerformanceData();
  }, [month, year]);





  const changeMonth = (direction) => {
    let currentIndex = months.findIndex((m) => m.value === month);
    if (direction === "prev") {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : 11;
    } else {
      currentIndex = currentIndex < 11 ? currentIndex + 1 : 0;
    }
    setMonth(months[currentIndex].value);
    if (currentIndex === 11 && direction === "next") {
      setYear((prevYear) => (parseInt(prevYear) + 1).toString());
    } else if (currentIndex === 0 && direction === "prev") {
      setYear((prevYear) => (parseInt(prevYear) - 1).toString());
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




  const handleViewClick = (description) => {
    setDescription({ description });
  };



  const handleDownload = (row) => {
    const url = row.report_full_path;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  const columns = [
    {
      name: 'Stocks Name',
      selector: row => row?.stockName,
      sortable: true,
      width: '300px',
    },
    {
      name: 'Entry Date',
      selector: row => fDateTime(row.entryDate),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Entry Price',
      selector: row => <div> <IndianRupee />{row?.entryPrice}</div>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Exit Date',
      selector: row => fDateTime(row.exitDate),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Exit Price',
      selector: row => <div> <IndianRupee />{row?.exitPrice}</div>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Net Gain/Loss',
      selector: row => row?.netGainLossPercent,
      sortable: true,
      width: '200px',
      style: row => ({
        color: row.netGainLossPercent < 0 ? 'red' : 'green',
        fontWeight: 'bold',
      }),
    }
    ,
    {
      name: 'Description',
      cell: row => (
        <>
          <div>
            <Tooltip placement="top" overlay="View">

              <Eye
                onClick={() => {
                  handleViewClick([row.description]);
                  setShowModal(true);
                }} />

            </Tooltip>
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Report',
      cell: row => (
        <>


          <div className='d-flex '>
            <Link className="btn px-2" onClick={() => handleDownload(row)}>
              <Tooltip placement="top" overlay="Download">
                <ArrowDownToLine />
              </Tooltip>
            </Link>
          </div>

        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px',

    },

  ];





  return (
    <Content
      Page_title="Cash"
      button_status={false}
      backbutton_status={false}
      backForword={true}
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

        <div className="container">
          <div className="row mt-2 mb-2">
            <div className="col-md-12">
              <div className="alert alert-primary" role="alert">
                <div className="d-md-flex justify-content-between align-items-center">
                  <div>Momentum ({months.find((m) => m.value === month)?.name} {year}) PERFORMANCE</div>
                  <div className="mt-md-0 mt-3">
                    <button className="btn btn-primary me-2" onClick={() => changeMonth("prev")}>
                      <i className="bx bx-left-arrow-alt"></i> {months[(months.findIndex((m) => m.value === month) - 1 + 12) % 12]?.name} {year}
                    </button>
                    <button className="btn btn-primary">
                      {months.find((m) => m.value === month)?.name} {year} <i className="bx bx-right-arrow-alt"></i>
                    </button>
                    <button className="btn btn-primary ms-2" onClick={() => changeMonth("next")}>
                      {months[(months.findIndex((m) => m.value === month) + 1) % 12]?.name} {year} <i className="bx bx-right-arrow-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="card radius-10 overflow-hidden w-100">
                <div className="card-body">
                  <p>Momentum</p>
                  <h4 className="mb-0">{months.find((m) => m.value === month)?.name} {year}</h4>
                  <hr />
                  <p>Profit - Loss Summary</p>
                  <div className="mt-5">
                    {doughnutData1 ? <Doughnut data={doughnutData1} /> : <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card radius-10 overflow-hidden w-100 h-100">
                <div className="card-body">
                  {chartData1 ? (
                    <Bar
                      data={chartData1}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: { title: { display: true, text: "Date" } },
                          y: { title: { display: true, text: "Amount" } },
                        },
                      }}
                    />
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <div className="d-md-flex gap-3">
            <div className="card-body card">
              <p className="mb-1"><strong>Total Calls</strong>
              </p>
              <h6 className="card-title">{dailydata?.totalSignals}
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Profitable Calls</strong>

              </p>
              <h6 className="card-title">{dailydata?.profitableCalls}
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Loss Calls</strong>
              </p>
              <h6 className="card-title">{dailydata?.lossCalls}
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Total Profit </strong>
              </p>
              <h6 className="card-title">{(dailydata?.totalProfit)?.toFixed(2)}
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Total Loss</strong>
              </p>
              <h6 className="card-title">{(dailydata?.totalLoss)?.toFixed(2)}
              </h6>
            </div>
            <div className="card-body card">
              <p className="mb-1"><strong>Net Profit</strong>
              </p>
              <h6 className="card-title">  {((dailydata?.totalProfit || 0) - (dailydata?.totalLoss || 0))?.toFixed(2)}
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
                    <h5 className="m-0">Cash ({months.find((m) => m.value === month)?.name} {year}) RECOMMENDATIONS</h5>
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
                      <Table
                        columns={columns}
                        data={dailydata?.signalList}
                        pagination
                        striped
                        highlightOnHover
                        dense
                      />

                      {/* <table className="table mb-0">
                        <thead>
                          <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Stocks Name</th>
                            <th scope="col">Entry Date</th>
                            <th scope="col">Entry Price</th>
                            <th scope="col">Exit Date</th>
                            <th scope="col">Exit Price</th>
                            <th scope="col">Net Gain/Loss</th>
                            <th scope="col">Description</th>
                            <th scope="col">Report</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailydata?.signalList?.map((item, index) => (
                            <tr key={item.id || index}>
                              <td>{index + 1}</td>
                              <td>{item.stockName}</td>
                              <td>{item.entryDate}</td>
                              <td>{item.entryPrice}</td>
                              <td>{item.exitDate}</td>
                              <td>{item.exitPrice}</td>
                              <td>{item.netGainLossPercent}</td>
                              <td>
                                <Link className="btn btn-primary text-white">
                                  View
                                </Link>
                              </td>
                              <td>
                                <Link className="btn btn-primary text-white">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table> */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReusableModal
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Description"
          body={<p>{description?.description || "No description available."}</p>}
        />

      </div>
    </Content>

  );
};

export default Cash;
