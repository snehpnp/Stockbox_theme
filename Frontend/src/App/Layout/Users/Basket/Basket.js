import React, { useState } from 'react'
import Content from "../../../components/Contents/Content";
import { Doughnut } from "react-chartjs-2";
import ReusableModal from "../../../components/Models/ReusableModal";

function Basket() {

  const handleCloseModal = () => setShowModal(false);
  const Viewdetails = () => setShowModal(true);
  const [showModal, setShowModal] = useState(false);

  // Static data for Doughnut chart
  const chartData = {
    labels: ["Hit Ratio", "Miss Ratio"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF867F"],
      },
    ],
  };

  // Static details
  const details = {
    title: "SADSD",
    name: "sdad",
    accuracy: "0%",
    cagr: "null %",
    rebalanceFrequency: "Half Yearly",
    portfolioWeightage: "0",
    validity: "1 month",
    type: "null",
    theme: "dsd",
    noOfStocks: "0",
    nextRebalanceDate: "2024-12-10",
    minInvestment: "10",
    description: "Mid Cap",
  };


  return (
    <Content
      Page_title="Basket"
      button_title="Add Basket"
      backbutton_title="back"
      button_status={false}
      backbutton_status={false}

    >



      <div className="row">
        <div className="col-md-12 col-lg-4 mb-3">
          <div className="card radius-10 overflow-hidden">
            <div className="card-body">
              <h5>Test(test)</h5>
            </div>
            <div className="progress-wrapper">
              <div className="progress" style={{ height: 7 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush list shadow-none">
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  Minimum Investment
                  <span className="badge bg-dark rounded-pill">
                    100000
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  CAGR
                  <span className="badge bg-success rounded-pill">
                    2%
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                  Type
                  <span className="badge bg-danger rounded-pill">
                    Basket Type
                  </span>
                </li>
                <li className="list-group-item  align-items-center ">
                  <button
                    onClick={Viewdetails}
                    className="card-link btn btn-sm btn-primary w-100 text-white"
                  >
                    View Details
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-4 mb-3">
          <div className="card radius-10 overflow-hidden">
            <div className="card-body">
              <h5>Test(test)</h5>
            </div>
            <div className="progress-wrapper">
              <div className="progress" style={{ height: 7 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush list shadow-none">
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  Minimum Investment
                  <span className="badge bg-dark rounded-pill">
                    100000
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  CAGR
                  <span className="badge bg-success rounded-pill">
                    2%
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                  Type
                  <span className="badge bg-danger rounded-pill">
                    Basket Type
                  </span>
                </li>
                <li className="list-group-item  align-items-center ">
                  <button
                    onClick={Viewdetails}
                    className="card-link btn btn-sm btn-primary w-100 text-white"
                  >
                    View Details
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-4 mb-3">
          <div className="card radius-10 overflow-hidden">
            <div className="card-body">
              <h5>Test(test)</h5>
            </div>
            <div className="progress-wrapper">
              <div className="progress" style={{ height: 7 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush list shadow-none">
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  Minimum Investment
                  <span className="badge bg-dark rounded-pill">
                    100000
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  CAGR
                  <span className="badge bg-success rounded-pill">
                    2%
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                  Type
                  <span className="badge bg-danger rounded-pill">
                    Basket Type
                  </span>
                </li>
                <li className="list-group-item  align-items-center ">
                  <button
                    onClick={Viewdetails}
                    className="card-link btn btn-sm btn-primary w-100 text-white"
                  >
                    View Details
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <div
          className="accordion accordion-flush"
          id="accordionFlushExample"
        >
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <div
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="m-0">Vision2030 (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
                </div>
              </div>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="row  align-items-center">
                  <div className="col-md-12">
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="m-0"> (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="row  align-items-center">
                  <div className="col-md-12">
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item rounded-3 border-0 mb-2 shadow">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="m-0"> Vision2030 (Cash)</h5>
                  <p className="m-0 pe-2">Expires on : 28Apr2025</p>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="row  align-items-center">
                  <div className="col-md-12">
                    <div className='table-responsive'>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td> <p className="mb-1">Plan duration</p></td>
                            <td><p className="mb-1">Purchased on</p></td>
                            <td><p className="mb-1">Purchased Price</p></td>
                            <td><p className="mb-1">Expires on</p></td>
                            <td> <p className="mb-1">Plan Price</p></td>
                            <td> <p className="mb-1">Discount Price</p></td></tr>

                        </thead>
                        <tbody>
                          <tr className=""> <td><b>6 Months</b></td>
                            <td>  <b>28 oct 2024</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>28 apr 2025</b></td>
                            <td>  <b>51999</b></td>
                            <td>  <b>0</b></td></tr>

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

      <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<><h4 className="card-title">{details.name}</h4>
          <p className="fs-6 mb-0"><b>Accuracy:</b> {details.accuracy}</p></>}
        body=
        {<div>
          <div className="">


            <h5>Basic Details</h5>


            <ul className="list-group list-group-flush list shadow-none">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Minimum Investment
                <span className="badge bg-dark rounded-pill">
                  ₹{details.minInvestment}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                CAGR
                <span className="badge bg-success rounded-pill">
                  {details.cagr}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
                Type
                <span className="badge bg-danger rounded-pill">
                  {details.type}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Theme
                <span className="badge bg-warning rounded-pill">
                  {details.theme}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                No. of Stocks
                <span className="badge bg-info rounded-pill">
                  {details.noOfStocks}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Next Rebalance Date
                <span className="badge bg-primary rounded-pill">
                  {details.nextRebalanceDate}
                </span>
              </li>

            </ul>
            <hr />

            <div className="row px-4">
              <div className="col-md-6">
                <h6>Description</h6>
                <p>{details.description}</p>
              </div>
              <div className="col-md-6"> <Doughnut data={chartData} /></div>

            </div>
          </div>
        </div>
        }

      />


    </Content>
  )
}

export default Basket