import React from 'react'
import { Doughnut } from "react-chartjs-2";
import Content from '../../../components/Contents/Content';


const BasketDetail = () => {

  const chartData = {
    labels: ["Hit Ratio", "Miss Ratio"],
    datasets: [
      {
        data: [80, 20], // Static values
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF867F"],
      },
    ],
  };

  return (
    <Content 
    Page_title="Basket Detail"
    button_status={false}
    backbutton_status={true}
    backbutton_title="Back"
    >

    
    <div className="">
    <h5>Test(test)</h5>  
      <ul className="list-group list-group-flush list shadow-none">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Minimum Investment<span className="badge bg-dark rounded-pill">₹10</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        CAGR<span className="badge bg-success rounded-pill">null %</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
        Type<span className="badge bg-danger rounded-pill">null</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Theme<span className="badge bg-warning rounded-pill">dsd</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        No. of Stocks<span className="badge bg-info rounded-pill">0</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Next Rebalance Date
        <span className="badge bg-primary rounded-pill">2024-12-10</span>
      </li>
    </ul>
    <hr />
    <div className="row px-4">
      <div className="col-md-8">
        <h6>Description</h6>
        <p>Mid Cap</p>
      </div>
      <div className="col-md-4">
       <Doughnut data={chartData} />
      </div>
    </div>
  </div>
  </Content>

  )
}

export default BasketDetail