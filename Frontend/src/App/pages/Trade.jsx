import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import { Button, Tooltip } from "antd";

const Trade = () => {
  // const [selectedPlan, setSelectedPlan] = useState("cash");

  // const handleSelectChange = (event) => {
  //     setSelectedPlan(event.target.value);
  // };
  const [selectedPlan, setSelectedPlan] = useState("all");

  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };
  // Define your static data
  const data = [
    {
      id: 1,
      sno: "1",
      segment: "Cash ",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 2,
      sno: "2",
      segment: "Future",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 3,
      sno: "3",
      segment: "Option",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 4,
      sno: "4",
      segment: "Cash",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 5,
      sno: "5",
      segment: "Future",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 6,
      sno: "6",
      segment: "Option",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 7,
      sno: "7",
      segment: "Cash",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 8,
      sno: "8",
      segment: "Future",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 9,
      sno: "9",
      segment: "Option",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 10,
      sno: "10",
      segment: "Cash",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 11,
      sno: "11",
      segment: "Future",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
    {
      id: 12,
      sno: "12",
      segment: "Option",
      type: "Short Term",
      symbol: "TATAMotors-EQ",
      price: "₹778",
      date: "14Nov2024",
      time: "15:19",
      target1: "₹710",
      target2: "₹720",
      target3: "₹730",
      stoploss: "₹770",
      hold: "(15-30days)",
    },
  ];

  const columns1 = [
    { name: "S.NO.", selector: (row) => row.sno, sortable: true },
    {
      name: "Segment",
      selector: (row) => row.segment,
      sortable: true,
      width: "180px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "180px",
    },
    {
      name: "Trading Symbol",
      selector: (row) => row.symbol,
      sortable: true,
      width: "180px",
    },
    {
      name: "Entry Price",
      selector: (row) => row.price,
      sortable: true,
      width: "180px",
    },
    {
      name: "Entry Date",
      selector: (row) => row.date,
      sortable: true,
      width: "180px",
    },
    {
      name: "Entry Time",
      selector: (row) => row.time,
      sortable: true,
      width: "180px",
    },
    {
      name: "Target1",
      selector: (row) => row.target1,
      sortable: true,
      width: "180px",
    },
    {
      name: "Target2",
      selector: (row) => row.target2,
      sortable: true,
      width: "180px",
    },
    {
      name: "Target3",
      selector: (row) => row.target3,
      sortable: true,
      width: "180px",
    },
    {
      name: "Stoploss",
      selector: (row) => row.stoploss,
      sortable: true,
      width: "180px",
    },
    {
      name: "Hold Duration",
      selector: (row) => row.hold,
      sortable: true,
      width: "180px",
    },
    {
      name: "Buy/Sell",
      selector: (row) => (
        <div>
          <button className="btn btn-success">Buy</button>
        </div>
      ),
      sortable: true,
      width: "180px",
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Tooltip placement="top" title="View">
            <Eye
              style={{ marginRight: "10px" }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const customStyles = {
    header: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#4A4A4A",
        borderRadius: "20px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#0092e4 !important",
        color: "#fff",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
        color: "#4A4A4A",
      },
    },
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data); // Assume `data` is your original dataset

  // Function to handle search input changes
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query
    if (query) {
      const filteredResults = data.filter((item) =>
        item.segment.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filteredResults);
    } else {
      // If the query is empty, reset to the original data
      setFilteredData(data);
    }
  };
  return (
    <div>
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Trades</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard">
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Trades
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <hr />
        <div className="card">
          <div className="card-body">
            <div>
              {/* <label htmlFor="planSelect" className="mb-1">
                                Plans For You
                            </label> */}
              <div>
                <label htmlFor="planSelect" className="mb-1">
                  Plans For You
                </label>
                <div className="col-lg-4 d-flex">
                  <select
                    id="planSelect"
                    className="form-select"
                    onChange={handleSelectChange}
                    value={selectedPlan}
                  >
                    <option value="" disabled>
                      Select Plans
                    </option>
                    <option value="all">All</option>
                    <option value="cash">Cash</option>
                    <option value="future">Future</option>
                    <option value="option">Option</option>
                  </select>
                </div>
              </div>
            </div>
            <ul
              className="nav nav-pills mb-3 justify-content-center"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  data-bs-toggle="pill"
                  href="#primary-pills-home"
                  role="tab"
                  aria-selected="true"
                >
                  <div className="d-flex align-items-center">
                    <div className="tab-icon">
                      <i className="bx bx-home font-18 me-1" />
                    </div>
                    <div className="tab-title">Live Trade </div>
                  </div>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="pill"
                  href="#primary-pills-profile"
                  role="tab"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  <div className="d-flex align-items-center">
                    <div className="tab-icon">
                      <i className="bx bx-user-pin font-18 me-1" />
                    </div>
                    <div className="tab-title">Close Trade</div>
                  </div>
                </a>
              </li>
              {/* <li className="nav-item" role="presentation">
                                     
                                            <div className="d-flex align-items-center">
                                                <div className="tab-icon">
                                                    <i className="bx bx-user-pin font-18 me-1" />
                                                </div>
                                                <div className="tab-title"></div>
                                            </div>
                                      
                                    </li> */}
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="primary-pills-home"
                role="tabpanel"
              >
                {/* <DataTable

                                    columns={columns1}
                                    // data={data}
                                    data={filteredData}
                                    pagination
                                    customStyles={customStyles}
                                    fixedHeader
                                    fixedHeaderScrollHeight="400px"
                                    className="custom-data-table"

                                /> */}
                {selectedPlan === "all" && (
                  <div className="row">
                    <div className="col-md-12">
                      {/* Card 1 */}
                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPlan === "cash" && (
                  <div className="row">
                    <div className="col-md-12">
                      {/* Card 1 */}
                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPlan === "future" && (
                  <div className="row">
                    <div className="col-md-12">
                      {/* Card 1 */}
                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPlan === "option" && (
                  <div className="row">
                    <div className="col-md-12">
                      {/* Card 1 */}
                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="trade-card shadow">
                        <div className="row">
                          <div className="col-md-2 d-flex align-items-center">
                            <div className="trade-header ">
                              <div>
                                <span className="trade-time tradetime1">
                                  <b>18 Nov 2024</b>
                                  <p>17:08:20</p>
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="trade-type">Short Term</span>
                              </div>
                              <div>
                                <span className="trade-type1">
                                  Cash,Future,Option
                                </span>
                              </div>
                            </div>
                          </div>
                          <dv className="col-md-7">
                            <div className="trade-content">
                              <div className="d-flex justify-content-between tradehead mb-3">
                                <h3>THERMAX-EQ</h3>
                                <span className="trade-type1 mb-2">open</span>
                              </div>

                              <div className="trade-details">
                                <div className="row justify-content-center">
                                  <div className="col-md-6">
                                    <div>
                                      <strong>Entry price:</strong>
                                      <p> (₹100)</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6 d-flex justify-content-end">
                                    <div>
                                      <strong>Hold duration:</strong>
                                      <p>(15-30 days)</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div>
                                      <strong>Stoploss:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>

                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3 d-flex justify-content-center">
                                    <div>
                                      <strong>Target:</strong>
                                      <p>--</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dv>
                          <div className="col-md-3 d-flex align-items-center">
                            <div className="">
                              <button
                                className="btn btn-buy mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                BUY
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Detail
                              </button>
                              <button
                                className="btn btn-view-detail mb-2 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                View Ananlysis
                              </button>
                              <button
                                className="btn btn-view-detail w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                              >
                                Broker Response
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* modal for View detail open */}

                <div
                  class="modal fade"
                  id="exampleModal1"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          Discription
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Temporibus nesciunt id aliquam, incidunt, quam
                        tenetur beatae corrupti repudiandae voluptates autem
                        animi provident eum maxime! Necessitatibus eveniet,
                        dignissimos ipsam deserunt quibusdam architecto illum
                        distinctio magnam fuga sapiente reprehenderit cum fugit
                        nemo.
                      </div>
                      {/* <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary">Save changes</button>
                                            </div> */}
                    </div>
                  </div>
                </div>
                {/* modal for view detail closed */}

                {/* modal for buy start */}
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          KYC
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body ">
                        <div className="p-2">
                          <form className="row g-3">
                            <div className="col-md-12">
                              <label htmlFor="input1" className="form-label">
                                Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="input1"
                                placeholder="Name"
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="input4" className="form-label">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="input4"
                                placeholder="Email"
                              />
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="input3" className="form-label">
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="input3"
                                placeholder="Phone"
                              />
                            </div>

                            <div className="col-md-12">
                              <label htmlFor="input5" className="form-label">
                                Aadhaar No.
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="input5"
                                placeholder="Aadhaar No."
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="input5" className="form-label">
                                PAN No.
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="input5"
                                placeholder="PAN No."
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Reset
                        </button>
                        <button type="button" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* modal for buy end */}
              </div>
              <div
                className="tab-pane fade"
                id="primary-pills-profile"
                role="tabpanel"
              >
                {/* <DataTable

                                    columns={columns1}
                                    // data={data}
                                    data={filteredData}
                                    pagination
                                    customStyles={customStyles}
                                    fixedHeader
                                    fixedHeaderScrollHeight="400px"
                                    className="custom-data-table"
                                /> */}
                <div className="row">
                  <div className="col-md-12">
                    {/* Card 1 */}
                    <div className="trade-card shadow">
                      <div className="row">
                        <div className="col-md-2 d-flex align-items-center">
                          <div className="trade-header ">
                            <div>
                              <span className="trade-time tradetime1">
                                <b>18 Nov 2024</b>
                                <p>17:08:20</p>
                              </span>
                            </div>
                            <div className="mb-3">
                              <span className="trade-type">Short Term</span>
                            </div>
                            <div>
                              <span className="trade-type1">
                                Cash,Future,Option
                              </span>
                            </div>
                          </div>
                        </div>
                        <dv className="col-md-7">
                          <div className="trade-content">
                            <div className="d-flex justify-content-between tradehead mb-3">
                              <h3>THERMAX-EQ</h3>
                              <span className="trade-type2 mb-2">Close</span>
                            </div>

                            <div className="trade-details">
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div>
                                    <strong>Entry price:</strong>
                                    <p> (₹100)</p>
                                  </div>
                                </div>

                                <div className="col-md-6 d-flex justify-content-end">
                                  <div>
                                    <strong>Hold duration:</strong>
                                    <p>(15-30 days)</p>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div>
                                    <strong>Stoploss:</strong>
                                    <p>--</p>
                                  </div>
                                </div>

                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>

                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>
                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </dv>
                        <div className="col-md-3 d-flex align-items-center">
                          <div className="">
                            <button
                              className="btn btn-buy mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              BUY
                            </button>
                            <button
                              className="btn btn-view-detail mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Detail
                            </button>
                            <button
                              className="btn btn-view-detail mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Ananlysis
                            </button>
                            <Link
                            to={'/brokerresponse'}
                              className="btn btn-view-detail w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              Broker Response
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="trade-card shadow">
                      <div className="row">
                        <div className="col-md-2 d-flex align-items-center">
                          <div className="trade-header ">
                            <div>
                              <span className="trade-time tradetime1">
                                <b>18 Nov 2024</b>
                                <p>17:08:20</p>
                              </span>
                            </div>
                            <div className="mb-3">
                              <span className="trade-type">Short Term</span>
                            </div>
                            <div>
                              <span className="trade-type1">
                                Cash,Future,Option
                              </span>
                            </div>
                          </div>
                        </div>
                        <dv className="col-md-7">
                          <div className="trade-content">
                            <div className="d-flex justify-content-between tradehead mb-3">
                              <h3>THERMAX-EQ</h3>
                              <span className="trade-type2 mb-2">Close</span>
                            </div>

                            <div className="trade-details">
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div>
                                    <strong>Entry price:</strong>
                                    <p> (₹100)</p>
                                  </div>
                                </div>

                                <div className="col-md-6 d-flex justify-content-end">
                                  <div>
                                    <strong>Hold duration:</strong>
                                    <p>(15-30 days)</p>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div>
                                    <strong>Stoploss:</strong>
                                    <p>--</p>
                                  </div>
                                </div>

                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>

                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>
                                <div className="col-md-3 d-flex justify-content-center">
                                  <div>
                                    <strong>Target:</strong>
                                    <p>--</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </dv>
                        <div className="col-md-3 d-flex align-items-center">
                          <div className="">
                            <button
                              className="btn btn-buy mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              BUY
                            </button>
                            <button
                              className="btn btn-view-detail mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Detail
                            </button>
                            <button
                              className="btn btn-view-detail mb-2 w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              View Ananlysis
                            </button>
                            <button
                              className="btn btn-view-detail w-100"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                            >
                              Broker Response
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Discription
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                sunt, maxime suscipit ratione facere ab maiores tenetur
                consequuntur corrupti quod a reprehenderit dignissimos dolorum
                incidunt natus quidem voluptatem distinctio impedit. Optio,
                illum natus. Aut et nisi harum autem dolorem animi.
              </div>
            </div>
          </div>
        </div>
        {/* Data Table */}
      </div>
    </div>
  );
};

export default Trade;
