import React from 'react'
import { Doughnut } from "react-chartjs-2";

const BasketDetail = ({ details, chartData }) => {
  return (
    <div>
      <h4 className="card-title">details</h4>
      <p className="fs-6 mb-0"><b>Accuracy:</b> details</p>
      <div>
        <h5>Basic Details</h5>
        <ul className="list-group list-group-flush list shadow-none">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Minimum Investment
            <span className="badge bg-dark rounded-pill">
              ₹details.minInvestment
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            CAGR
            <span className="badge bg-success rounded-pill">
              details.cagr
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
            Type
            <span className="badge bg-danger rounded-pill">
              details.type
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Theme
            <span className="badge bg-warning rounded-pill">
             details.theme
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            No. of Stocks
            <span className="badge bg-info rounded-pill">
              details.noOfStocks
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Next Rebalance Date
            <span className="badge bg-primary rounded-pill">
              details.nextRebalanceDate
            </span>
          </li>
        </ul>
        <hr />
        <div className="row px-4">
          <div className="col-md-6">
            <h6>Description</h6>
            <p>details.description</p>
          </div>
          <div className="col-md-6">
            <Doughnut data={chartData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasketDetail